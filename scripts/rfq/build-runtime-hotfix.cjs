// Local artifact preparation only. Never reads a server or a database.
// Input is the six explicitly approved, hash-pinned production Partner files.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
const baseline=process.env.RFQ_RUNTIME_BASELINE;
if(!baseline)throw new Error('RFQ_RUNTIME_BASELINE must point to the approved six-file Partner snapshot');
const target=path.resolve(process.env.RFQ_RUNTIME_TARGET||path.join(root,'apps/api/dist/partner'));
if(!target.startsWith(root+path.sep)&&!target.startsWith(path.resolve(root,'..')+path.sep))throw new Error('Target must be in the isolated work tree');
assert.ok(!target.startsWith(path.resolve(baseline)+path.sep)&&target!==path.resolve(baseline),'Do not modify the approved original snapshot');
const expected={...require('./runtime/production-baseline.json'),...require('./runtime/production-admin-baseline.json')};
const hashes={};const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
for(const [rel,sha]of Object.entries(expected)){
 const original=fs.readFileSync(path.join(baseline,rel),'utf8');assert.equal(hash(original),sha,`production baseline changed: ${rel}`);
 let text=original;
 if(rel==='dto/create-lead.dto.js'){
  text=text.replace('const class_validator_1 = require("class-validator");','const class_validator_1 = require("class-validator");\nconst lead_phone = require("@mateyou/lead-contract");\nconst class_transformer_1 = require("class-transformer");');
  const start=text.indexOf('__decorate([',text.indexOf('], CreateLeadDto.prototype, "contactName"'));
  const end=text.indexOf('], CreateLeadDto.prototype, "phone", void 0);',start)+'], CreateLeadDto.prototype, "phone", void 0);'.length;
  assert.ok(start>=0&&end>start);
  text=text.slice(0,start)+`__decorate([
    (0, class_transformer_1.Transform)(({value}) => typeof value === 'string' ? value.trim() : value),
    (0, class_validator_1.ValidateBy)({name:'leadPhone',validator:{validate:lead_phone.isValidLeadPhone,defaultMessage:()=> 'phone must contain 7–15 digits with optional + and dialing separators'}}),
    __metadata("design:type", String)
], CreateLeadDto.prototype, "phone", void 0);`+text.slice(end);
  text += '\n__decorate([(0,class_validator_1.IsNotEmpty)(),(0,class_transformer_1.Transform)(({value})=>typeof value === "string" ? value.trim() : value)],CreateLeadDto.prototype,"contactName",void 0);';
  text += '\n'+['firstVisitAt','latestVisitAt'].map(key=>`__decorate([(0,class_validator_1.IsOptional)(),(0,class_validator_1.IsISO8601)(),(0,class_validator_1.MaxLength)(40)],CreateLeadDto.prototype,"${key}",void 0);`).join('\n');
  text += '\n'+['latestUtmContent','latestUtmTerm'].map(key=>`__decorate([(0,class_validator_1.IsOptional)(),(0,class_validator_1.IsString)(),(0,class_validator_1.MaxLength)(100),__metadata("design:type",String)],CreateLeadDto.prototype,"${key}",void 0);`).join('\n');
 }
 if(rel==='services/lead.service.js'){
  const notifyCall="await axios_1.default.post(webhook, { msgtype: 'markdown', markdown: { content: lines.join('\\n') } }, { timeout: 8000 });";
  assert.equal(text.split(notifyCall).length,2,'Expected one original RFQ notification call');
  text=text.replace(notifyCall,`const response = await axios_1.default.post(webhook, { msgtype: 'markdown', markdown: { content: lines.join('\\n') } }, { timeout: 8000 });
            if (response.status !== 200 || response.data?.errcode !== 0) throw new Error('WeCom delivery rejected: ' + String(response.data?.errcode ?? 'invalid response'));
            console.info('RFQ_WECOM_ACK ' + JSON.stringify({ at: new Date().toISOString(), httpStatus: response.status, errcode: response.data.errcode, test: String(dto.contactName || '').includes('[TEST '), task: String(dto.contactName || '').includes('LONGVON-P0-RECOVERY-001') ? 'LONGVON-P0-RECOVERY-001' : undefined, payloadSha256: require('node:crypto').createHash('sha256').update(lines.join('\\n')).digest('hex') }));`);
  text=text.replace('latestUtmCampaign, latestVisitAt','latestUtmCampaign, latestUtmContent, latestUtmTerm, latestVisitAt');
  text=text.replace('            latestUtmCampaign,\n            latestVisitAt,','            latestUtmCampaign,\n            latestUtmContent,\n            latestUtmTerm,\n            latestVisitAt,');
 }
 if(rel==='utils/lead-attribution.util.js'){
  text=text.replace('            utmCampaign: dto.latestUtmCampaign,','            utmCampaign: dto.latestUtmCampaign,\n            utmContent: dto.latestUtmContent,\n            utmTerm: dto.latestUtmTerm,');
 }
 const dest=path.join(target,rel);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,text);
 hashes[rel]={before:sha,after:hash(text),unchanged:sha===hash(text)};
}
const helper=path.join(target,'../node_modules/@mateyou/lead-contract');fs.mkdirSync(helper,{recursive:true});
for(const name of ['index.js','package.json'])fs.copyFileSync(path.join(root,'packages/lead-contract',name),path.join(helper,name));
// Bundle the regenerated client locally to the API dist, so the production
// root workspace symlink cannot silently resolve to the old generated client.
const generated=path.join(root,'packages/database/generated/client');
const dbTarget=path.join(target,'../node_modules/@mateyou/database');
fs.rmSync(dbTarget,{recursive:true,force:true});fs.cpSync(generated,dbTarget,{recursive:true});
const {createRequire}=require('node:module');const fromApi=createRequire(path.join(target,'../database/prisma.service.js'));
assert.equal(fs.realpathSync(fromApi.resolve('@mateyou/database')),fs.realpathSync(path.join(dbTarget,'index.js')));
const fields=fromApi('@mateyou/database').Prisma.dmmf.datamodel.models.find(m=>m.name==='Lead').fields.map(f=>f.name);
for(const field of ['referrer','landingPage','attribution','commercialStage','commercialGrade','commercialMeta'])assert.ok(fields.includes(field),field);
fs.writeFileSync(path.join(target,'rfq-hotfix-manifest.json'),JSON.stringify({mode:'local artifact only',files:hashes},null,2)+'\n');
console.log(JSON.stringify({result:'PASS',files:hashes},null,2));
