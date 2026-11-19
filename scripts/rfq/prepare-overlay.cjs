// Build a local review artifact; does not deploy, connect to DB, or run migrations.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');const out=path.resolve(process.env.RFQ_OVERLAY_DIR||path.join(root,'.rfq-overlay'));
assert.ok(out!==root&&!root.startsWith(out+path.sep),'Output cannot contain the checkout');
fs.mkdirSync(out,{recursive:true});assert.equal(fs.readdirSync(out).length,0,'Output must be empty');
const source=path.join(root,'apps/api/dist/partner'),meta=JSON.parse(fs.readFileSync(path.join(source,'rfq-hotfix-manifest.json')));
for(const [rel,data]of Object.entries(meta.files))if(!data.unchanged){const to=path.join(out,'apps/api/dist/partner',rel);fs.mkdirSync(path.dirname(to),{recursive:true});fs.copyFileSync(path.join(source,rel),to);}
for(const pkg of ['database','lead-contract'])fs.cpSync(path.join(root,'apps/api/dist/node_modules/@mateyou',pkg),path.join(out,'apps/api/dist/node_modules/@mateyou',pkg),{recursive:true});
for(const file of fs.readdirSync(path.join(out,'apps/api/dist/node_modules/@mateyou/database')))if(file.includes('darwin'))fs.rmSync(path.join(out,'apps/api/dist/node_modules/@mateyou/database',file),{force:true});
const files={};function scan(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())scan(p);else{assert.ok(e.isFile(),'No symlinks in overlay');files[path.relative(out,p)]=crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');}}}scan(out);
const manifest={version:3,productionBase:meta.files,files,productionPlatform:'x86_64 / debian-openssl-3.0.x',migrationRequired:false,sourceFullApiBuildForbidden:true};
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
const engine=fs.readFileSync(path.join(out,'apps/api/dist/node_modules/@mateyou/database/libquery_engine-debian-openssl-3.0.x.so.node'));assert.equal(engine.subarray(0,4).toString('hex'),'7f454c46');assert.equal(engine.readUInt16LE(18),62);
console.log(JSON.stringify({result:'PASS',fileCount:Object.keys(files).length,linuxEngine:'ELF x86_64',output:out},null,2));
