// Read-only verification on an isolated copy, or on production only if approved.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const args=process.argv.slice(2);const get=k=>args[args.indexOf(k)+1];
assert.ok(args.includes('--manifest')&&args.includes('--root'),'--manifest FILE --root DIR [--after] required');
const manifest=JSON.parse(fs.readFileSync(path.resolve(get('--manifest'))));const root=path.resolve(get('--root'));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
if(args.includes('--after')){for(const [rel,sha]of Object.entries(manifest.files))assert.equal(hash(path.join(root,rel)),sha,rel);for(const [rel,item]of Object.entries(manifest.productionBase))if(item.unchanged)assert.equal(hash(path.join(root,'apps/api/dist/partner',rel)),item.before,rel);}
else for(const [rel,item]of Object.entries(manifest.productionBase))assert.equal(hash(path.join(root,'apps/api/dist/partner',rel)),item.before,rel);
console.log(JSON.stringify({result:'PASS',mode:args.includes('--after')?'after':'before',readOnly:true,files:Object.keys(manifest.files).length},null,2));
