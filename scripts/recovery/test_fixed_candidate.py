import pathlib
import runpy
import tempfile
import unittest

candidate = runpy.run_path(str(pathlib.Path(__file__).with_name("fixed-candidate.py")))


class FixedCandidateTest(unittest.TestCase):
    def test_source(self):
        c = candidate
        run = {"id": c["RUN"], "head_sha": c["COMMIT"], "head_branch": "main",
               "repository": {"full_name": c["REPO"]}, "head_repository": {"full_name": c["REPO"]},
               "path": ".github/workflows/deploy.yml", "event": "workflow_run", "conclusion": "success"}
        artifact = {"id": c["ARTIFACT"], "name": "longvon-recovery", "digest": "sha256:" + c["ZIP_SHA"],
                    "workflow_run": {"id": c["RUN"], "head_sha": c["COMMIT"]}}
        inputs = c["ARTIFACT"], c["COMMIT"], c["ZIP_SHA"]
        c["verify_source"](artifact, run, *inputs)
        with self.assertRaisesRegex(ValueError, "Wrong source run"):
            c["verify_source"](artifact, {**run, "head_repository": {"full_name": "other/repo"}}, *inputs)
        with self.assertRaisesRegex(ValueError, "Wrong artifact provenance"):
            c["verify_source"]({**artifact, "workflow_run": {"id": 1}}, run, *inputs)

    def test_wrong_archive_hash(self):
        with tempfile.TemporaryDirectory() as directory:
            archive = pathlib.Path(directory, "candidate.zip")
            archive.write_bytes(b"non-matching archive")
            with self.assertRaisesRegex(ValueError, "Wrong ZIP SHA256"):
                candidate["verify_archive"](archive, candidate["ZIP_SHA"], archive.parent / "out")
            self.assertFalse((archive.parent / "out").exists())


if __name__ == "__main__":
    unittest.main()
