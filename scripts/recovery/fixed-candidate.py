"""Verify and unpack only the Web payload of the approved Actions artifact."""
import hashlib
import json
import pathlib
import re
import sys
import tarfile
import zipfile

REPO = "longvonTech/longvon-web"
RUN = 45741771535
ARTIFACT = 15081915933
COMMIT = "139ff275ac29920b1bb8d119ed2ad1d1262b3627"
ZIP_SHA = "168f9638bf1f8da7b2c1c51ad7c6916b1b23e3893bbf9ec9d9534a7200ffdef8"


def require(condition, message):
    if not condition:
        raise ValueError(message)


def verify_source(artifact, run, artifact_id, commit, expected):
    require((artifact_id, commit, expected) == (ARTIFACT, COMMIT, ZIP_SHA),
            "Candidate is not the pinned release")
    require(artifact["id"] == artifact_id and artifact["name"] == "longvon-recovery"
            and artifact["digest"] == "sha256:" + expected
            and artifact["workflow_run"]["id"] == RUN
            and artifact["workflow_run"]["head_sha"] == commit, "Wrong artifact provenance")
    require(run["id"] == RUN and run["head_sha"] == commit and run["head_branch"] == "main"
            and run["repository"]["full_name"] == REPO and run["head_repository"]["full_name"] == REPO
            and run["path"] == ".github/workflows/deploy.yml" and run["event"] == "workflow_run"
            and run["conclusion"] == "success", "Wrong source run")


def verify_archive(archive, expected, output):
    with archive.open("rb") as handle:
        require(hashlib.file_digest(handle, "sha256").hexdigest() == expected, "Wrong ZIP SHA256")
    with zipfile.ZipFile(archive) as source:
        require(sorted(source.namelist()) == ["longvon-recovery.sha256", "longvon-recovery.tar.gz"],
                "Unexpected ZIP layout")
        line = source.read("longvon-recovery.sha256").decode().strip()
        require(re.fullmatch(r"[a-f0-9]{64}  longvon-recovery\.tar\.gz", line), "Invalid SHA256 manifest")
        with source.open("longvon-recovery.tar.gz") as handle:
            require(hashlib.file_digest(handle, "sha256").hexdigest() == line[:64], "Wrong payload SHA256")
        with source.open("longvon-recovery.tar.gz") as handle, tarfile.open(fileobj=handle) as payload:
            manifest = json.load(payload.extractfile("release-manifest.json"))
            require(manifest["commit"] == COMMIT and manifest["phase"] == "geo"
                    and manifest["routeCount"] == 72 and manifest["migrationExecutionAllowed"] is False
                    and manifest["platform"] == "linux-x64-glibc", "Invalid release manifest")
            members = [member for member in payload.getmembers() if member.name.startswith("web/")]
            require(members and all(member.isfile() or member.isdir() for member in members),
                    "Unexpected Web archive entries")
            payload.extractall(output, members=members, filter="data")
    print(json.dumps({"artifact": ARTIFACT, "sourceRun": RUN, "commit": COMMIT,
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
