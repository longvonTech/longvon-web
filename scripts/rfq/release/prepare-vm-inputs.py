from pathlib import Path
import shutil
import argparse
parser=argparse.ArgumentParser(description='Prepare private local VM input scaffold; no network or DB operations')
parser.add_argument('--repo',required=True);parser.add_argument('--baseline',required=True);parser.add_argument('--old-client',required=True);parser.add_argument('--output',required=True);a=parser.parse_args()
root=Path(a.repo).resolve();snapshot=Path(a.baseline).resolve();old_client=Path(a.old_client).resolve();payload=Path(a.output).resolve()
if payload==root or payload in root.parents:raise SystemExit('Output must not contain repo')
if payload.exists() and any(payload.iterdir()):raise SystemExit('Output must be empty')
project=payload/'project';project.mkdir(parents=True,exist_ok=True)
for rel in ['apps/api/dist','scripts/rfq','packages/lead-contract']:
 shutil.copytree(root/rel,project/rel,dirs_exist_ok=True)
for rel in ['package.json','packages/database/prisma/schema.prisma','packages/database/prisma/migrations/00000000000000_init/migration.sql']:
 dest=project/rel;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(root/rel,dest)
base=payload/'baseline-api/dist';shutil.copytree(root/'apps/api/dist',base,dirs_exist_ok=True)
for p in (snapshot).rglob('*.js'):
 dest=base/'partner'/p.relative_to(snapshot);dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,dest)
shutil.rmtree(base/'node_modules/@mateyou/database');shutil.copytree(old_client,base/'node_modules/@mateyou/database')
print('Payload scaffold prepared; dependency archive built separately')
