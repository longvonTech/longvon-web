// Cross-package platform-neutral Next output with locked Linux native dependencies.
// Must be followed by actual Linux execution; ELF inspection alone is not acceptance.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const source=path.resolve(process.env.RFQ_WEB_STANDALONE||'apps/web/.next/standalone');
const deps=process.env.RFQ_LINUX_NATIVE_DEPS;assert.ok(deps,'RFQ_LINUX_NATIVE_DEPS required');
const out=path.resolve(process.env.RFQ_LINUX_WEB_OUTPUT||'.rfq-linux-web');assert.ok(out!==source&&!source.startsWith(out+path.sep),'Unsafe output');
assert.ok(!fs.existsSync(out),'Output must be new');fs.cpSync(source,out,{recursive:true,dereference:true});
const sharp=JSON.parse(fs.readFileSync(path.join(out,'node_modules/sharp/package.json')));
const img=path.join(out,'node_modules/@img');
for(const name of fs.readdirSync(img))if(name.startsWith('sharp-'))fs.rmSync(path.join(img,name),{recursive:true,force:true});
for(const name of ['sharp-linux-x64','sharp-libvips-linux-x64']){
 const src=path.join(path.resolve(deps),'node_modules/@img',name);const pkg=JSON.parse(fs.readFileSync(path.join(src,'package.json')));
 assert.equal(pkg.version,sharp.optionalDependencies['@img/'+name],name+' exact version');
 fs.cpSync(src,path.join(img,name),{recursive:true,dereference:true});
}
const files={},staticFiles={},native=[];const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);assert.ok(!e.isSymbolicLink(),'No unresolved symlinks');if(e.isDirectory())walk(p);else{const rel=path.relative(out,p).split(path.sep).join('/');assert.ok(!/(^|\/)\.env(\.|$)/.test(rel));files[rel]=hash(p);if(rel.startsWith('apps/web/.next/static/'))staticFiles[rel.slice('apps/web/.next/static/'.length)]=files[rel];if(/(\.node|\.dylib|\.so(?:\.\d+)*)$/.test(rel)){const b=fs.readFileSync(p);assert.equal(b.subarray(0,4).toString('hex'),'7f454c46','Non-Linux native file '+rel);assert.equal(b.readUInt16LE(18),62,'Not x86_64 '+rel);native.push(rel);}}}}walk(out);
assert.ok(native.some(n=>n.includes('sharp-linux-x64')));assert.ok(native.some(n=>n.includes('sharp-libvips-linux-x64')));
const routes=Object.keys(JSON.parse(fs.readFileSync(path.join(out,'apps/web/.next/server/app-paths-manifest.json'))));const expectedRoutes=process.env.RFQ_INCLUDE_APPROVED_GEO==='1'?72:68;assert.equal(routes.length,expectedRoutes);
if(expectedRoutes===72)for(const route of ['smart-ring-sdk-api','osa-smart-ring-technology','en/smart-ring-sdk-api','en/osa-smart-ring-technology'])assert.ok(routes.includes('/'+route+'/page'));
const manifest={version:3,platform:'linux-x64-glibc',files,staticFiles,nativeFiles:native,routeCount:routes.length,sharpVersion:sharp.version,migrationRequired:false};fs.writeFileSync(path.join(out,'web-manifest.json'),JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify({result:'PASS',scope:'packaging only; Linux execution still required',output:out,files:Object.keys(files).length,staticFiles:Object.keys(staticFiles).length,native},null,2));
