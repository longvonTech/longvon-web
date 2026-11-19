// Local build only. Exclude four unlaunched GEO pages from this P0 artifact.
// Source files are restored even if the build fails. Never runs deployment/DB tools.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{spawnSync}=require('node:child_process');
const toolRoot=path.resolve(__dirname,'../..');
const root=path.resolve(process.env.RFQ_WEB_SOURCE_ROOT||toolRoot);
if(!root.startsWith(path.resolve(toolRoot,'..')+path.sep))throw new Error('Build root must be in isolated work tree');
const pages=['en/smart-ring-sdk-api','smart-ring-sdk-api','en/osa-smart-ring-technology','osa-smart-ring-technology'];
const includeApprovedGeo=process.env.RFQ_INCLUDE_APPROVED_GEO==='1';
const excluded=includeApprovedGeo?[]:pages;
const hold=fs.mkdtempSync(path.join(os.tmpdir(),'rfq-web-excluded-'));const moved=[];
try{
 for(const route of excluded){const from=path.join(root,'apps/web/app',route,'page.tsx');if(!fs.existsSync(from))throw new Error('Expected unpublished page missing: '+route);const to=path.join(hold,route.replaceAll('/','_')+'.tsx');fs.renameSync(from,to);moved.push({from,to});}
 const result=spawnSync(process.execPath,[path.join(root,'node_modules/next/dist/bin/next'),'build'],{cwd:path.join(root,'apps/web'),env:{...process.env,NEXT_PUBLIC_API_BASE_URL:'https://www.longvon.com/api',NEXT_PUBLIC_SITE_URL:'https://www.longvon.com',NEXT_TELEMETRY_DISABLED:'1'},stdio:'inherit'});
 if(result.status!==0)throw new Error('Web build failed: '+result.status);
 const stand=path.join(root,'apps/web/.next/standalone/apps/web');
 for(const [src,to]of [[path.join(root,'apps/web/.next/static'),path.join(stand,'.next/static')],[path.join(root,'apps/web/public'),path.join(stand,'public')]]){fs.rmSync(to,{recursive:true,force:true});fs.cpSync(src,to,{recursive:true});}
 const paths=JSON.parse(fs.readFileSync(path.join(root,'apps/web/.next/server/app-paths-manifest.json')));
 for(const route of excluded)if(paths['/'+route+'/page'])throw new Error('Unpublished route still in artifact');
 if(includeApprovedGeo)for(const route of pages)if(!paths['/'+route+'/page'])throw new Error('Approved GEO route missing: '+route);
 console.log(JSON.stringify({result:'PASS',excludedRoutes:excluded,approvedGeoIncluded:includeApprovedGeo,routeCount:Object.keys(paths).length,api:'https://www.longvon.com/api',sourceRestoredInFinally:true}));
}finally{for(const {from,to}of moved)fs.renameSync(to,from);fs.rmSync(hold,{recursive:true,force:true});}
