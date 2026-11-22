"""Append one reviewed platform observation; never performs a model/search request."""
import argparse, csv, datetime, hashlib, json, pathlib, re, uuid
ROOT = pathlib.Path(__file__).resolve().parents[3]
DATA = ROOT / 'docs/geo/geo-43-003'

def parse_timestamp(value):
    if not isinstance(value, str):
        raise ValueError('timestamp must be a string')
    return datetime.datetime.fromisoformat(value[:-1] + '+00:00' if value.endswith('Z') else value)


def validate(r, root=DATA):
    required = {'record_id','query_id','query','platform','mode','observed_at','country','language','environment','availability','longvon_present','organic_rank','ai_body_recommended','source_cited','cited_urls','competitors','evidence','previous_record_id','change_note'}
    if set(r) != required: raise ValueError('fields must match observation schema')
    uuid.UUID(r['record_id'])
    with (DATA/'query-set.csv').open() as f:
        queries = {q['query_id']: q['query'] for q in csv.DictReader(f)}
    if queries.get(r['query_id']) != r['query']: raise ValueError('query must match fixed set')
    if r['platform'] not in ['Google','ChatGPT','Perplexity']: raise ValueError('platform')
    t=parse_timestamp(r['observed_at'])
    if t.tzinfo is None or t > datetime.datetime.now(datetime.timezone.utc): raise ValueError('timestamp must be actual timezone-aware past observation')
    for k in ['mode','country','environment','change_note']:
        if not isinstance(r[k],str) or not r[k].strip(): raise ValueError(k)
    if r['language'] != 'en': raise ValueError('fixed English query environment required')
    if r['availability'] not in ['COMPLETED','UNAVAILABLE']: raise ValueError('NOT_RUN is not an observation')
    for k in ['longvon_present','ai_body_recommended','source_cited']:
        if r[k] is not None and type(r[k]) is not bool: raise ValueError(k)
    rank=r['organic_rank']
    if rank is not None and (type(rank) is not int or rank<1 or r['platform']!='Google'): raise ValueError('organic rank')
    if r['availability']=='UNAVAILABLE' and (rank is not None or any(r[k] is not None for k in ['longvon_present','ai_body_recommended','source_cited'])): raise ValueError('unavailable must remain UNKNOWN/null')
    if r['availability']=='COMPLETED' and r['longvon_present'] is None: raise ValueError('completed requires reviewed presence')
    if r['longvon_present'] is False and (rank is not None or r['ai_body_recommended'] is True or r['source_cited'] is True): raise ValueError('contradictory absence')
    if not isinstance(r['cited_urls'],list) or any(not isinstance(u,str) or not u.startswith('https://') for u in r['cited_urls']): raise ValueError('cited URLs')
    if r['source_cited'] is True and not r['cited_urls']: raise ValueError('citation evidence missing')
    if not isinstance(r['competitors'],list) or len(r['competitors'])>5: raise ValueError('at most five relevant competitors')
    for c in r['competitors']:
        if set(c)!={'name','url','position','evidence_quote'} or not all(isinstance(v,str) and v for v in c.values()) or not c['url'].startswith('https://'): raise ValueError('competitor requires source and position')
    if not isinstance(r['evidence'],list) or not r['evidence']: raise ValueError('raw evidence required even for unavailable')
    for e in r['evidence']:
        if set(e)!={'path','sha256'}: raise ValueError('evidence fields')
        f=(root/e['path']).resolve()
        if not f.is_relative_to((root/'evidence').resolve()) or not f.is_file(): raise ValueError('evidence must be under evidence directory')
        if hashlib.sha256(f.read_bytes()).hexdigest()!=e['sha256']: raise ValueError('evidence hash mismatch')
    prev=r['previous_record_id']
    if prev is not None:
        uuid.UUID(prev)
        old=json.loads((root/'observations'/f'{prev}.json').read_text())
        for k in ['query_id','platform','mode','country','language','environment']:
            if old[k]!=r[k]: raise ValueError('incomparable previous observation')
        if parse_timestamp(old['observed_at'])>=t: raise ValueError('previous must be earlier')
    return r

def append(r, root=DATA):
    validate(r,root)
    directory=root/'observations'; directory.mkdir(parents=True,exist_ok=True)
    with (directory/f"{r['record_id']}.json").open('x') as f:
        json.dump(r,f,ensure_ascii=False,indent=2);f.write('\n')

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('input',type=pathlib.Path)
    append(json.loads(parser.parse_args().input.read_text()))
