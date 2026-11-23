import unittest
from capture_contract import chatgpt_mode,google_ai_state,citation_targets,screenshot_acceptance
from record import parse_timestamp

class CaptureTests(unittest.TestCase):
    def test_z_compatible(self):
        self.assertEqual(parse_timestamp('2026-11-22T00:00:00Z'),parse_timestamp('2026-11-22T00:00:00+00:00'))
    def test_search_needs_receipt(self):
        self.assertEqual(chatgpt_mode(True,False),'SEARCH_UNVERIFIED')
        self.assertEqual(chatgpt_mode(False,True),'DEFAULT_ANSWER')
        self.assertEqual(chatgpt_mode(True,True),'REALTIME_SEARCH')
    def test_pending_ai_is_unknown(self):
        self.assertEqual(google_ai_state(True,True,False,True)['status'],'UNKNOWN')
    def test_no_guessed_citation(self):
        r=citation_targets([{'label':'longvon'},{'url':'https://www.longvon.com/en'},{'url':'javascript:alert(1)'},{'url':'https://user:secret@example.com'}])
        self.assertEqual(r['urls'],['https://www.longvon.com/en'])
        self.assertEqual(r['reachability'],'UNKNOWN')
    def test_clipping_rejected(self):
        self.assertEqual(screenshot_acceptance(629,346,1100,True,['one.jpg'])['status'],'BLOCKED_LOCAL_ENV')
        self.assertEqual(screenshot_acceptance(1440,346,1100,True,['one.jpg'])['status'],'PASS')
if __name__=='__main__':unittest.main()
