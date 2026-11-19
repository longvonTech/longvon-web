// Build a dependency overlay in a NEW local staging directory only.
// Does not connect to a server, run npm, execute migrations or touch live paths.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {createRequire}=require('node:module');
const root=path.resolve(__dirname,'../..');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'rfq-helper-stage-'));
const pkg=path.join(dir,'apps/api/dist/node_modules/@mateyou/lead-contract');fs.mkdirSync(pkg,{recursive:true});
for(const name of ['index.js','package.json'])fs.copyFileSync(path.join(root,'packages/lead-contract',name),path.join(pkg,name));
const requireFromDist=createRequire(path.join(dir,'apps/api/dist/partner/dto/create-lead.dto.js'));
assert.equal(requireFromDist.resolve('@mateyou/lead-contract'),fs.realpathSync(path.join(pkg,'index.js')));
assert.equal(requireFromDist('@mateyou/lead-contract').normalizeLeadPhone('+61 (0) 412 345 678'),'+61 (0) 412 345 678');
const files=Object.fromEntries(['index.js','package.json'].map(name=>[name,crypto.createHash('sha256').update(fs.readFileSync(path.join(pkg,name))).digest('hex')]));
console.log(JSON.stringify({result:'PASS',purpose:'local dependency resolution rehearsal only; not a deployable release',rootNodeModulesRequired:false,files},null,2));
fs.rmSync(dir,{recursive:true,force:true});
