"""Verify and unpack only the Web payload of the approved Actions artifact."""
import hashlib
import json
import pathlib
import re
import sys
import tarfile
import zipfile
import os
import shutil

# Policy is data, separately reviewed and pinned by the operation approval.
def policy(path=None, key=None):
    file = path or os.environ.get("APPROVED_RELEASE_MANIFEST")
    if not file:
        raise ValueError("Approved release manifest required")
    document = json.loads(pathlib.Path(file).read_text())
    key = key or os.environ.get("RELEASE_KEY")
    entry = document["releases"][key]
    require(document["version"] == 1 and entry["status"] == "APPROVED" and entry.get("approvalScope") == "ARTIFACT_VERIFICATION_ONLY", "Release not approved")
    require(re.fullmatch(r"[a-f0-9]{40}", entry["commit"]), "Invalid commit")
    for name in ("zipSha256", "payloadSha256"):
        require(re.fullmatch(r"[a-f0-9]{64}", entry[name]), "Invalid policy digest")
    require(entry["repository"] == "longvonTech/longvon-web", "Unexpected source repository")
    require(entry["phase"] == "geo" and entry["routeCount"] in (68, 72), "Invalid approved phase/routes")
    return entry


def digest(handle):
    result = hashlib.sha256()
    for block in iter(lambda: handle.read(1024 * 1024), b""):
        result.update(block)
    return result.hexdigest()


def require(condition, message):
    if not condition:
        raise ValueError(message)


def verify_source(artifact, run, artifact_id, commit, expected, approved=None):
    p = approved or policy()
    require((artifact_id, commit, expected) == (p["artifactId"], p["commit"], p["zipSha256"]),
            "Candidate is not the approved release")
    require(artifact["id"] == artifact_id and artifact["name"] == p["artifactName"]
            and artifact["digest"] == "sha256:" + expected
            and artifact["workflow_run"]["id"] == p["sourceRun"]
            and artifact["workflow_run"]["head_sha"] == commit, "Wrong artifact provenance")
    require(run["id"] == p["sourceRun"] and run["head_sha"] == commit and run["head_branch"] == "main"
            and run["repository"]["full_name"] == p["repository"]
            and run["head_repository"]["full_name"] == p["repository"]
            and run["path"] == p["workflowPath"] and run["event"] == p["sourceEvent"]
            and run["conclusion"] == "success", "Wrong source run")


def verify_archive(archive, expected, output, approved=None):
    p = approved or policy()
    require(expected == p["zipSha256"], "ZIP digest differs from approved policy")
    require(not output.exists(), "Output must be fresh")
    with archive.open("rb") as handle:
        require(digest(handle) == expected, "Wrong ZIP SHA256")
    with zipfile.ZipFile(archive) as source:
        require(sorted(source.namelist()) == ["longvon-recovery.sha256", "longvon-recovery.tar.gz"],
                "Unexpected ZIP layout")
        line = source.read("longvon-recovery.sha256").decode().strip()
        require(re.fullmatch(r"[a-f0-9]{64}  longvon-recovery\.tar\.gz", line), "Invalid SHA256 manifest")
        with source.open("longvon-recovery.tar.gz") as handle:
            require(digest(handle) == p["payloadSha256"] == line[:64], "Wrong payload SHA256")
        with source.open("longvon-recovery.tar.gz") as handle, tarfile.open(fileobj=handle) as payload:
            manifest = json.load(payload.extractfile("release-manifest.json"))
            require(manifest["commit"] == p["commit"] and manifest["phase"] == p["phase"]
                    and manifest["routeCount"] == p["routeCount"] and manifest["migrationExecutionAllowed"] is False
                    and manifest["platform"] == "linux-x64-glibc", "Invalid release manifest")
            members = [member for member in payload.getmembers() if member.name.startswith("web/")]
            require(members and all(member.isfile() or member.isdir() for member in members),
                    "Unexpected Web archive entries")
            # Strict, portable Python 3.9 extraction; no symlinks/devices/traversal/duplicates.
            names = set()
            for member in members:
                rel = pathlib.PurePosixPath(member.name)
                require(not rel.is_absolute() and ".." not in rel.parts and "\\" not in member.name,
                        "Unsafe archive path")
                require(member.name not in names, "Duplicate archive member")
                names.add(member.name)
                if member.isfile():
                    require(member.name in manifest["files"], "Unmanifested Web file")
                    with payload.extractfile(member) as handle:
                        require(digest(handle) == manifest["files"][member.name], "Web manifest mismatch")
            expected_web = {name for name in manifest["files"] if name.startswith("web/")}
            require(expected_web == {m.name for m in members if m.isfile()}, "Missing Web file")
            try:
                output.mkdir(parents=True)
                for member in members:
                    dest = output.joinpath(*pathlib.PurePosixPath(member.name).parts)
                    if member.isdir():
                        dest.mkdir(parents=True, exist_ok=True)
                    else:
                        dest.parent.mkdir(parents=True, exist_ok=True)
                        with payload.extractfile(member) as src, dest.open("xb") as dst:
                            shutil.copyfileobj(src, dst)
                        dest.chmod(member.mode & 0o755)
                wm = json.loads((output / "web/web-manifest.json").read_text())
                for rel, sha in wm["files"].items():
                    parts = pathlib.PurePosixPath(rel)
                    require(not parts.is_absolute() and ".." not in parts.parts, "Unsafe manifest path")
                    with output.joinpath("web", *parts.parts).open("rb") as handle:
                        require(digest(handle) == sha, "Inner Web manifest mismatch")
                require((output / "web/apps/web/.next/BUILD_ID").read_text().strip() == p["buildId"],
                        "Wrong approved BUILD_ID")
            except BaseException:
                shutil.rmtree(output)
                raise
    print(json.dumps({"artifact": p["artifactId"], "sourceRun": p["sourceRun"], "commit": p["commit"],
                      "zipSha256": expected, "payloadSha256": line[:64]}))


if __name__ == "__main__":
    action, *args = sys.argv[1:]
    if action == "source":
        artifact_path, run_path, artifact_id, commit, expected = args
        verify_source(json.loads(pathlib.Path(artifact_path).read_text()),
                      json.loads(pathlib.Path(run_path).read_text()), int(artifact_id), commit, expected)
    elif action == "archive":
        archive, expected, output = args
        verify_archive(pathlib.Path(archive), expected, pathlib.Path(output))
    else:
        raise ValueError("Unknown verification action")
