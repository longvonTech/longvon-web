import copy,datetime,hashlib,json,pathlib,tempfile,unittest,uuid
from record import append
class RecorderTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.root=pathlib.Path(self.tmp.name)
        (self.root/'evidence').mkdir();(self.root/'evidence/result.txt').write_text('SYNTHETIC TEST ONLY')
        self.r=dict(record_id=str(uuid.uuid4()),query_id='Q01',query='smart ring OEM ODM manufacturer',platform='Google',mode='web organic',observed_at='2026-11-22T00:00:00+00:00',country='UNKNOWN',language='en',environment='SYNTHETIC TEST',availability='COMPLETED',longvon_present=False,organic_rank=None,ai_body_recommended=False,source_cited=False,cited_urls=[],competitors=[],evidence=[dict(path='evidence/result.txt',sha256=hashlib.sha256(b'SYNTHETIC TEST ONLY').hexdigest())],previous_record_id=None,change_note='first synthetic observation')
    def tearDown(self): self.tmp.cleanup()
    def test_no_overwrite(self):
        append(self.r,self.root)
        with self.assertRaises(FileExistsError):append(self.r,self.root)
    def test_unavailable_is_not_absence(self):
        self.r['availability']='UNAVAILABLE'
        with self.assertRaises(ValueError):append(self.r,self.root)
        for k in ['longvon_present','ai_body_recommended','source_cited']:self.r[k]=None
        append(self.r,self.root)
    def test_evidence_tamper(self):
        (self.root/'evidence/result.txt').write_text('changed')
        with self.assertRaises(ValueError):append(self.r,self.root)
    def test_path_escape(self):
        self.r['evidence'][0]['path']='../secret'
        with self.assertRaises(ValueError):append(self.r,self.root)
    def test_query_drift(self):
        self.r['query']+=' LONGVON'
        with self.assertRaises(ValueError):append(self.r,self.root)
    def test_contradictory_rank(self):
        self.r['organic_rank']=1
        with self.assertRaises(ValueError):append(self.r,self.root)
    def test_comparison_environment(self):
        append(self.r,self.root);old=self.r['record_id'];self.r['record_id']=str(uuid.uuid4());self.r['previous_record_id']=old;self.r['country']='US';self.r['observed_at']='2026-11-22T00:01:00+00:00'
        with self.assertRaises(ValueError):append(self.r,self.root)
    def test_unknown_fields(self):
        self.r['email']='forbidden'
        with self.assertRaises(ValueError):append(self.r,self.root)
if __name__=='__main__':unittest.main()
