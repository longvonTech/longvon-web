import pathlib, runpy, tempfile, unittest, json, hashlib, io, tarfile, zipfile
c = runpy.run_path(str(pathlib.Path(__file__).with_name("fixed-candidate.py")))


def fixture(root, malicious=False):
    files = {"apps/web/.next/BUILD_ID": b"test-build"}
    wm = {"files": {k: hashlib.sha256(v).hexdigest() for k,v in files.items()}}
    files["web-manifest.json"] = json.dumps(wm).encode()
    content = {"web/"+k:v for k,v in files.items()}
    if malicious: content["web/../../escaped"] = b"bad"
    manifest = {"commit":"a"*40,"phase":"geo","routeCount":72,"platform":"linux-x64-glibc",
                "migrationExecutionAllowed":False,"files":{k:hashlib.sha256(v).hexdigest() for k,v in content.items()}}
    data = io.BytesIO()
    with tarfile.open(fileobj=data, mode="w:gz") as tar:
        for name, body in {"release-manifest.json":json.dumps(manifest).encode(),**content}.items():
            info=tarfile.TarInfo(name);info.size=len(body);tar.addfile(info,io.BytesIO(body))
    raw=data.getvalue(); sha=hashlib.sha256(raw).hexdigest(); archive=root/"candidate.zip"
    with zipfile.ZipFile(archive,"w") as z:
        z.writestr("longvon-recovery.tar.gz",raw)
        z.writestr("longvon-recovery.sha256",sha+"  longvon-recovery.tar.gz")
    p={"status":"APPROVED","approvalScope":"ARTIFACT_VERIFICATION_ONLY","repository":"longvonTech/longvon-web",
       "sourceRun":42,"artifactId":84,"artifactName":"longvon-recovery","commit":"a"*40,
       "zipSha256":hashlib.sha256(archive.read_bytes()).hexdigest(),"payloadSha256":sha,
       "buildId":"test-build","phase":"geo","routeCount":72,"workflowPath":".github/workflows/deploy.yml","sourceEvent":"workflow_run"}
    return archive,p

class FixedCandidateTest(unittest.TestCase):
    def test_source_is_data_driven_and_rejects_wrong_repo(self):
        with tempfile.TemporaryDirectory() as d:
            archive,p=fixture(pathlib.Path(d))
            run={"id":42,"head_sha":p["commit"],"head_branch":"main","repository":{"full_name":p["repository"]},"head_repository":{"full_name":p["repository"]},"path":p["workflowPath"],"event":"workflow_run","conclusion":"success"}
            artifact={"id":84,"name":p["artifactName"],"digest":"sha256:"+p["zipSha256"],"workflow_run":{"id":42,"head_sha":p["commit"]}}
            args=(artifact,run,84,p["commit"],p["zipSha256"],p)
            c["verify_source"](*args)
            with self.assertRaises(ValueError):c["verify_source"](artifact,{**run,"head_branch":"other"},*args[2:])
            with self.assertRaises(ValueError):c["verify_source"](artifact,{**run,"repository":{"full_name":"other/repo"}},*args[2:])

    def test_fresh_archive_and_both_manifests(self):
        with tempfile.TemporaryDirectory() as d:
            root=pathlib.Path(d);a,p=fixture(root);c["verify_archive"](a,p["zipSha256"],root/"out",p)
            self.assertEqual((root/"out/web/apps/web/.next/BUILD_ID").read_text(),"test-build")
            with self.assertRaises(ValueError):c["verify_archive"](a,p["zipSha256"],root/"out",p)

    def test_wrong_hash_and_policy_build_fail_closed(self):
        with tempfile.TemporaryDirectory() as d:
            root=pathlib.Path(d);a,p=fixture(root)
            with self.assertRaises(ValueError):c["verify_archive"](a,"0"*64,root/"out",p)
            with self.assertRaises(ValueError):c["verify_archive"](a,p["zipSha256"],root/"out",{**p,"buildId":"wrong"})
            self.assertFalse((root/"out").exists())

    def test_manifested_traversal_still_rejected(self):
        with tempfile.TemporaryDirectory() as d:
            root=pathlib.Path(d);a,p=fixture(root,True)
            with self.assertRaisesRegex(ValueError,"Unsafe archive path"):c["verify_archive"](a,p["zipSha256"],root/"out",p)
            self.assertFalse((root/"escaped").exists())

    def test_policy_requires_explicit_reviewed_selection(self):
        with tempfile.TemporaryDirectory() as d:
            root=pathlib.Path(d);a,p=fixture(root);file=root/"policy.json"
            file.write_text(json.dumps({"version":1,"releases":{"NEXT-RELEASE":p}}))
            self.assertEqual(c["policy"](file,"NEXT-RELEASE"),p)
            p["status"]="DRAFT";file.write_text(json.dumps({"version":1,"releases":{"NEXT-RELEASE":p}}))
            with self.assertRaises(ValueError):c["policy"](file,"NEXT-RELEASE")

if __name__ == "__main__":unittest.main()
