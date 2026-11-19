// Safe reusable filesystem operations. Caller owns process activation; this module
// never runs SSH/PM2/nginx/migrations and never deletes published asset files.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
function inside(root,rel){assert.ok(typeof rel==='string'&&!path.isAbsolute(rel)&&!rel.split('/').includes('..'),'Unsafe relative path');const target=path.resolve(root,rel);assert.ok(target.startsWith(path.resolve(root)+path.sep));let p=path.resolve(root);assert.ok(!fs.lstatSync(p).isSymbolicLink(),'Root must not be a symlink');for(const part of rel.split('/').slice(0,-1)){p=path.join(p,part);if(fs.existsSync(p))assert.ok(!fs.lstatSync(p).isSymbolicLink(),'No symlinked parents');}if(fs.existsSync(target))assert.ok(!fs.lstatSync(target).isSymbolicLink(),'No symlinked files');return target;}
function verifyTree(root,files){for(const [rel,sha]of Object.entries(files))assert.equal(hash(inside(root,rel)),sha,rel);}
function plan(staticRoot,manifest){const reuse=[],add=[];for(const [rel,sha]of Object.entries(manifest.staticFiles)){const dst=inside(staticRoot,rel);if(fs.existsSync(dst)){assert.equal(hash(dst),sha,'Existing asset conflict: '+rel);reuse.push(rel)}else add.push(rel)}return {reuse,add};}
function publicParents(root,rel){let p=path.resolve(root);fs.chmodSync(p,0o755);for(const part of rel.split('/').slice(0,-1)){p=path.join(p,part);if(!fs.existsSync(p))fs.mkdirSync(p,{mode:0o755});fs.chmodSync(p,0o755);}}
function publicReadable(root,rel){let p=path.resolve(root);assert.equal(fs.statSync(p).mode&0o111,0o111,'Public static root not traversable');for(const part of rel.split('/').slice(0,-1)){p=path.join(p,part);assert.equal(fs.statSync(p).mode&0o111,0o111,'Public static parent not traversable')}assert.equal(fs.statSync(inside(root,rel)).mode&0o444,0o444,'Public static file not readable');}
function publish({artifact,staticRoot,failAfter=Infinity}){
 const manifest=JSON.parse(fs.readFileSync(path.join(artifact,'web-manifest.json')));verifyTree(artifact,manifest.files);
 const p=plan(staticRoot,manifest),added=[];let n=0;
 // Caller may use umask077 for private release/config files; only public alias paths get public modes.
 for(const rel of Object.keys(manifest.staticFiles)){publicParents(staticRoot,rel);const file=inside(staticRoot,rel);if(fs.existsSync(file))fs.chmodSync(file,0o644);}
 for(const rel of p.add){if(n===failAfter)throw Object.assign(new Error('INJECTED_COPY_FAILURE'),{added});
  const source=inside(artifact,'apps/web/.next/static/'+rel),dest=inside(staticRoot,rel);fs.mkdirSync(path.dirname(dest),{recursive:true});
  const tmp=dest+'.rfq-'+crypto.randomUUID()+'.tmp';
  try{fs.copyFileSync(source,tmp,fs.constants.COPYFILE_EXCL);fs.chmodSync(tmp,0o644);assert.equal(hash(tmp),manifest.staticFiles[rel]);
   try{fs.linkSync(tmp,dest);added.push(rel)}catch(e){if(e.code!=='EEXIST')throw e;assert.equal(hash(dest),manifest.staticFiles[rel],'Concurrent asset conflict');}
  }finally{fs.rmSync(tmp,{force:true})}n++;
 }
 verifyTree(staticRoot,manifest.staticFiles);for(const rel of Object.keys(manifest.staticFiles))publicReadable(staticRoot,rel);return {added,reused:p.reuse};
}
function assertReady({artifact,staticRoot}){const manifest=JSON.parse(fs.readFileSync(path.join(artifact,'web-manifest.json')));verifyTree(artifact,manifest.files);verifyTree(staticRoot,manifest.staticFiles);for(const rel of Object.keys(manifest.staticFiles))publicReadable(staticRoot,rel);return true;}
module.exports={hash,inside,verifyTree,plan,publish,assertReady};
