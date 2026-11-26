"""Download a pinned private GitHub Release asset without persisting credentials/URLs."""
import concurrent.futures, hashlib, json, os, pathlib, sys, urllib.error, urllib.parse, urllib.request

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None

def download(asset_id, expected, target):
    if not asset_id.isdigit() or int(asset_id) <= 0:
        raise ValueError('Invalid private asset identifier')
    if len(expected) != 64 or any(c not in '0123456789abcdef' for c in expected):
        raise ValueError('Invalid expected asset digest')
    if target.exists():
        raise ValueError('Asset destination must be fresh')
    token = os.environ['OPS_READ_TOKEN']
    api = 'https://api.github.com/repos/longvonTech/longvon-ops/releases/assets/' + asset_id
    headers = {'Authorization': 'Bearer ' + token, 'Accept': 'application/vnd.github+json'}
    with urllib.request.urlopen(urllib.request.Request(api, headers=headers), timeout=30) as response:
        meta = json.load(response)
    size = meta['size']
    if not (0 < size < 2 * 1024**3) or meta['id'] != int(asset_id) or meta['state'] != 'uploaded':
        raise ValueError('Unexpected private asset metadata')
    if meta.get('digest') != 'sha256:' + expected:
        raise ValueError('Private asset metadata digest mismatch')
    try:
        urllib.request.build_opener(NoRedirect).open(urllib.request.Request(api, headers={**headers, 'Accept':'application/octet-stream'}), timeout=30)
        raise ValueError('Expected a signed GitHub download redirect')
    except urllib.error.HTTPError as error:
        if error.code != 302:
            raise ValueError('Private download redirect failed') from None
        url = error.headers['Location']
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme != 'https' or parsed.hostname not in ('release-assets.githubusercontent.com', 'objects.githubusercontent.com') or parsed.username or parsed.password:
        raise ValueError('Unexpected private asset download host')
    def part(bounds):
        start, end = bounds
        for attempt in range(2):
            try:
                req = urllib.request.Request(url, headers={'Range': 'bytes=%d-%d' % bounds})
                with urllib.request.urlopen(req, timeout=60) as response:
                    raw = response.read()
                    if response.status != 206 or len(raw) != end-start+1 or response.headers.get('Content-Range') != 'bytes %d-%d/%d' % (start,end,size):
                        raise ValueError('Invalid partial asset response')
                    return raw
            except (OSError, urllib.error.URLError):
                if attempt: raise ValueError('Private download transport failed') from None
        raise ValueError('Private download failed')
    step = 4*1024**2
    chunks = [(start,min(start+step-1,size-1)) for start in range(0,size,step)]
    # Bounded parallel reads avoid long-lived sequential transport stalls observed on Mac.
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        raw = b''.join(pool.map(part,chunks))
    if len(raw) != size or hashlib.sha256(raw).hexdigest() != expected:
        raise ValueError('Private asset content digest mismatch')
    with target.open('xb') as handle:
        handle.write(raw)
    print(json.dumps({'assetId':int(asset_id),'bytes':size,'sha256':expected,'result':'PASS'}))

if __name__ == '__main__':
    try:
        download(sys.argv[1],sys.argv[2],pathlib.Path(sys.argv[3]))
    except Exception as error:
        # Never include signed URLs, headers or authentication environment in diagnostics.
        print('Private asset retrieval failed: '+type(error).__name__,file=sys.stderr)
        sys.exit(1)
