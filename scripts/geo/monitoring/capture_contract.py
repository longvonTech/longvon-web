"""Fail-closed evidence decisions, independent of browser transport."""
from urllib.parse import urlsplit


def chatgpt_mode(search_requested=False, search_receipt=False):
    return 'REALTIME_SEARCH' if search_requested and search_receipt else ('SEARCH_UNVERIFIED' if search_requested else 'DEFAULT_ANSWER')


def google_ai_state(panel_present, generating, completed_receipt, timed_out):
    if generating or not completed_receipt:
        return {'status': 'UNKNOWN', 'reason': 'TIMEOUT' if timed_out else 'INCOMPLETE'}
    return {'status': 'COMPLETE' if panel_present else 'NOT_SHOWN', 'reason': 'OBSERVED'}


def citation_targets(visible_links):
    verified = []
    for link in visible_links:
        url = link.get('url')
        if not isinstance(url, str):
            continue
        p = urlsplit(url)
        if p.scheme != 'https' or not p.hostname or p.username or p.password:
            continue
        if p.hostname in ('localhost', '127.0.0.1', '::1'):
            continue
        if url not in verified:
            verified.append(url)
    return {'urls': verified, 'missing_targets': sum(not x.get('url') for x in visible_links), 'reachability': 'UNKNOWN'}


def screenshot_acceptance(viewport_width, content_left, content_right, transcript_complete, image_paths):
    readable = 0 <= content_left < content_right <= viewport_width
    return {'status': 'PASS' if readable and transcript_complete and image_paths else 'BLOCKED_LOCAL_ENV', 'full_dom_required': True, 'readable': readable}
