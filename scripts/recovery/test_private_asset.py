import pathlib,runpy,tempfile,unittest
c=runpy.run_path(str(pathlib.Path(__file__).with_name("download-private-asset.py")))
class PrivateAssetTest(unittest.TestCase):
 def test_invalid_inputs_never_access_network(self):
  with tempfile.TemporaryDirectory() as d:
   p=pathlib.Path(d)/"asset"
   with self.assertRaises(ValueError):c["download"]("../1","a"*64,p)
   with self.assertRaises(ValueError):c["download"]("1","bad",p)
   self.assertFalse(p.exists())
 def test_existing_archive_is_never_overwritten(self):
  with tempfile.TemporaryDirectory() as d:
   p=pathlib.Path(d)/"asset";p.write_bytes(b"original")
   with self.assertRaises(ValueError):c["download"]("1","a"*64,p)
   self.assertEqual(p.read_bytes(),b"original")
if __name__=="__main__":unittest.main()
