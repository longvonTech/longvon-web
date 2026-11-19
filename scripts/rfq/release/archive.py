"""Portable normalized artifact archive: regular files only, no host xattrs."""
import argparse, pathlib, tarfile
p=argparse.ArgumentParser();p.add_argument('--source',required=True);p.add_argument('--output',required=True);a=p.parse_args();src=pathlib.Path(a.source).resolve();out=pathlib.Path(a.output).resolve()
if out==src or src in out.parents:raise SystemExit('Archive must be outside source')
def clean(info):
 info.uid=info.gid=0;info.uname=info.gname='';info.mtime=0;info.pax_headers={};return info
with tarfile.open(out,'w:gz',format=tarfile.GNU_FORMAT) as t:
 for f in sorted(src.rglob('*')):
  if f.is_symlink():raise SystemExit('Unresolved artifact symlink: '+str(f))
  if f.is_file():t.add(f,arcname=f.relative_to(src).as_posix(),recursive=False,filter=clean)
print(out,out.stat().st_size)
