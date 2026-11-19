/* Local-only integration harness. Creates its own disposable PostgreSQL cluster.
 * Never accepts DATABASE_URL, API_URL or an external browser target.
 * Redis is an in-memory test double; HTTP/controller/validation/Prisma/Postgres are real.
 */
require('reflect-metadata');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const net = require('node:net');
const { spawn } = require('node:child_process');
const { chromium } = require('playwright');
const { Test } = require('@nestjs/testing');
const { ValidationPipe } = require('@nestjs/common');
const { LeadAdminController } = require('../../apps/api/dist/partner/controllers/admin/lead-admin.controller');
const { LeadAnalyticsService } = require('../../apps/api/dist/partner/services/lead-analytics.service');
const { JwtStrategy } = require('../../apps/api/dist/identity/strategies/jwt.strategy');
const { JwtAuthGuard } = require('../../apps/api/dist/identity/guards/jwt-auth.guard');
const { RolesGuard } = require('../../apps/api/dist/identity/guards/roles.guard');
const jwt = require('jsonwebtoken');
const { LeadCaptureController } = require('../../apps/api/dist/partner/controllers/public/lead-capture.controller');
const { LeadService } = require('../../apps/api/dist/partner/services/lead.service');
const { LeadArchiveService } = require('../../apps/api/dist/partner/services/lead-archive.service');
const { LeadRepository } = require('../../apps/api/dist/partner/repositories/lead.repository');
const { PrismaService } = require('../../apps/api/dist/database/prisma.service');
const { RedisService } = require('../../apps/api/dist/redis/redis.service');
const { RateLimitGuard } = require('../../apps/api/dist/partner/guards/rate-limit.guard');
const { isValidLeadPhone, normalizeLeadPhone } = require('@mateyou/lead-contract');
// Independent business contract: do not derive expected coverage from mapper.
const ATTRIBUTION_FIELDS = ['landingPage','referrer','firstLandingPage','firstReferrer','firstUtmSource','firstUtmMedium','firstUtmCampaign','firstUtmContent','firstUtmTerm','firstVisitAt','latestLandingPage','latestReferrer','latestUtmSource','latestUtmMedium','latestUtmCampaign','latestUtmContent','latestUtmTerm','latestVisitAt','attributionChannel','attributionConfidence'];
const root = path.resolve(__dirname, '../..');
const output = path.resolve(process.env.RFQ_EVIDENCE_DIR || path.join(root, '.rfq-evidence'));
fs.mkdirSync(output, { recursive: true });
const evidence = { started: new Date().toISOString(), scope: 'local HTTP + production runtime classes + actual Prisma/PostgreSQL; in-memory Redis; no WeCom sending; no production calls', webMode:process.env.RFQ_TEST_WEB_MODE || 'dev', tests: [], browserErrors: [], browserSubmissions: [], apiPhoneWrites: [] };
const marker = '[TEST GEO-RFQ-P0-001]';
let db, app, prisma, browser, web, sql;
let sequence = 0; const archiveEvents = [];
const freePort = () => new Promise(resolve => { const server = net.createServer(); server.listen(0, '127.0.0.1', () => { const port = server.address().port; server.close(() => resolve(port)); }); });
async function check(name, fn) { await fn(); evidence.tests.push({ name, result: 'PASS' }); console.log(`PASS ${name}`); }
const basePayload = () => ({ contactName: marker, companyName: `${marker} DO NOT COUNT`, email: 'rfq-test@example.invalid', phone: '+61 (0) 412 345 678', cooperationType: 'oem', remark: `${marker} isolated database only` });
async function main() {
  // Test process cannot send notifications using an inherited production webhook.
  delete process.env.WECOM_WEBHOOK_URL;
  const EmbeddedPostgres = (await import('embedded-postgres')).default;
  const port = await freePort();
  const databaseDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rfq-p0-test-'));
  db = new EmbeddedPostgres({ databaseDir, user: 'rfq_test', password: 'local-test-only', port, persistent: false, autoRehydrateSymlinks: true, postgresFlags: ['-h', '127.0.0.1'], onLog() {}, onError() {} });
  await db.initialise(); await db.start(); await db.createDatabase('rfq_isolated');
  sql = db.getPgClient('rfq_isolated'); await sql.connect();
  // Exact scalar Lead table from the checked-in initial DDL; referenced domains are
  // not needed for public capture (all FK values null). No migrations are run.
  const migration = fs.readFileSync(path.join(root, 'packages/database/prisma/migrations/00000000000000_init/migration.sql'), 'utf8');
  let leadDDL = migration.match(/CREATE TABLE public\.leads \([\s\S]*?\n\);/)[0].replace(/ REFERENCES public\.\w+\(id\) ON DELETE RESTRICT/g, '');
  leadDDL = leadDDL.replace(/\n\);$/, `,\n referrer text, landing_page text, attribution jsonb, commercial_stage text NOT NULL DEFAULT 'NEW_INQUIRY', commercial_grade text, commercial_meta jsonb\n);`);
  for(const table of ['roles','users'])await sql.query(migration.match(new RegExp('CREATE TABLE public\\.'+table+' \\([\\s\\S]*?\\n\\);'))[0]);
  await sql.query(leadDDL);
  await sql.query(migration.match(/CREATE TABLE public\.partners \([\s\S]*?\n\);/)[0]);
  await sql.query(`CREATE TABLE public.lead_notes(id uuid PRIMARY KEY DEFAULT uuidv7(),lead_id uuid NOT NULL,author_id uuid NOT NULL,content text NOT NULL,created_at timestamptz NOT NULL DEFAULT now())`);
  process.env.JWT_ACCESS_SECRET='RFQ_ISOLATED_TEST_SECRET_NOT_PRODUCTION';
  const url = `postgresql://rfq_test:local-test-only@127.0.0.1:${port}/rfq_isolated`;
  prisma = new PrismaService({ datasources: { db: { url } } });
  const counters = new Map();
  const redis = { client: { async incr(key) { const n = (counters.get(key) || 0) + 1; counters.set(key, n); return n; }, async expire() { return 1; } } };
  const module = await Test.createTestingModule({ controllers: [LeadCaptureController,LeadAdminController], providers: [LeadService,LeadAnalyticsService,JwtStrategy,JwtAuthGuard,RolesGuard, LeadRepository, RateLimitGuard, { provide: LeadArchiveService, useValue: { scheduleRefresh(){archiveEvents.push('scheduled')}, async exportAll(){return {count:0}} } }, { provide: PrismaService, useValue: prisma }, { provide: RedisService, useValue: redis }] }).compile();
  app = module.createNestApplication({ logger: false });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
  await app.listen(Number(process.env.RFQ_ISOLATED_API_PORT||0), '127.0.0.1'); const api = await app.getUrl();
  const post = (body, ip = `test-${++sequence}`) => fetch(`${api}/partner-leads`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ip }, body: JSON.stringify(body) });
  const count = async () => (await sql.query('SELECT count(*)::int AS n FROM public.leads')).rows[0].n;
  const phones = ['+1 (415) 555-0123', '+44 20 7946 0958', '+61 (0) 412 345 678', '+86 138 0013 8000', '+123456789012345', '1234567'];
  for (const phone of phones) await check(`API international phone ${phone}`, async () => {
    assert.equal(isValidLeadPhone(phone), true); const payload = { ...basePayload(), phone };
    const before = await count(); const scheduled=archiveEvents.length; const response = await post(payload); assert.equal(response.status, 201, await response.text()); assert.equal(await count(), before + 1);assert.equal(archiveEvents.length,scheduled+1);
    const saved = (await sql.query('SELECT phone FROM public.leads ORDER BY created_at DESC LIMIT 1')).rows[0]; assert.equal(saved.phone, phone.trim()); evidence.apiPhoneWrites.push({ input: phone, stored: saved.phone, status: 201 });
  });
  await check('all extended attribution fields persist without unknown Prisma arguments', async () => {
    const payload = { ...basePayload(), sourcePage: '/en/partner/oem', sourceKeyword: 'ai:chatgpt', utmSource: 'chatgpt', utmMedium: 'ai_assistant', utmCampaign: 'P0-TEST' };
    for (const key of ATTRIBUTION_FIELDS) payload[key] = key.endsWith('At') ? '2026-11-17T00:00:00.000Z' : key === 'attributionConfidence' ? 'HIGH' : `TEST-${key}`;
    const response = await post(payload); assert.equal(response.status, 201, await response.text());
    const saved = (await sql.query('SELECT * FROM public.leads ORDER BY created_at DESC LIMIT 1')).rows[0];
    assert.equal(saved.utm_source, payload.firstUtmSource); assert.equal(saved.source_keyword, 'ai:chatgpt');
    assert.ok(saved.remark.startsWith(payload.remark)); const metadata=saved.attribution;
    for(const [key,value] of Object.entries(payload)){if(key.startsWith('first')||key.startsWith('latest')) {const touch=key.startsWith('first')?'first':'latest';const name=key.slice(touch.length);const field=name==='VisitAt'?'visitAt':name[0].toLowerCase()+name.slice(1);assert.equal(metadata[touch][field],value,key)}}
    assert.equal(metadata.channel,payload.attributionChannel);assert.equal(metadata.confidence,payload.attributionConfidence);assert.equal(saved.commercial_stage,'NEW_INQUIRY');assert.equal(saved.commercial_meta.stageHistory[0].to,'NEW_INQUIRY');
  });
  for (const phone of ['       ', '-------', '+1', '+1234567890123456', 'abc1234567', '12+3456789', '1234567 ext 1', 12345678]) await check(`invalid phone rejected ${JSON.stringify(phone)}`, async () => {
    const before = await count(); const response = await post({ ...basePayload(), phone }); assert.equal(response.status, 400); assert.equal(await count(), before);
  });
  for (const extra of [{ admin: true }, { firstLandingPage: 'x'.repeat(501) }, { firstVisitAt: 'not-a-date' }, { contactName: '   ' }, { remark: 'x'.repeat(2001) }]) await check(`invalid payload rejected ${Object.keys(extra)[0]}`, async () => {
    const before = await count(); assert.equal((await post({ ...basePayload(), ...extra })).status, 400); assert.equal(await count(), before);
  });
  await check('repository runtime allowlist ignores unsupported column keys', async () => {
    const repo = module.get(LeadRepository); await repo.create({ ...basePayload(), admin: 'must-not-reach-prisma' });
    const saved = (await sql.query('SELECT remark FROM public.leads ORDER BY created_at DESC LIMIT 1')).rows[0]; assert.equal(saved.remark, basePayload().remark);
  });
  await check('honeypot returns compatibility response without writing', async () => {
    const before = await count(); const response = await post({ ...basePayload(), website: 'https://bot.invalid' }); assert.equal(response.status, 201); assert.equal(await count(), before);
  });
  await check('actual rate guard returns 429 on sixth request', async () => {
    for (let i = 0; i < 5; i++) assert.equal((await post(basePayload(), 'limit-test')).status, 201);
    const before = await count(); assert.equal((await post(basePayload(), 'limit-test')).status, 429); assert.equal(await count(), before);
  });
  await check('production commercial stage update, history and metrics persist', async () => {
    const service=module.get(LeadService), repo=module.get(LeadRepository);
    const row=await prisma.lead.findFirst({orderBy:{createdAt:'desc'}});
    {const before=archiveEvents.length;const updated=await service.updateCommercial(row.id,{commercialStage:'QUALIFIED',commercialGrade:'B',productInterest:'Smart ring',targetMarket:'UK',stageNote:'TEST qualification'},'TEST-operator');
      assert.equal(updated.commercialStage,'QUALIFIED');assert.equal(updated.commercialGrade,'B');assert.equal(updated.commercialMeta.stageHistory.at(-1).by,'TEST-operator');assert.equal(updated.commercialMeta.stageHistory.at(-1).from,'NEW_INQUIRY');assert.equal(archiveEvents.length,before+1);
      const saved=(await sql.query('SELECT commercial_stage,commercial_meta FROM public.leads WHERE id=$1',[row.id])).rows[0];assert.equal(saved.commercial_stage,'QUALIFIED');assert.equal(saved.commercial_meta.productInterest,'Smart ring');
      assert.ok((await repo.findForCommercialMetrics(new Date(0))).some(x=>x.commercialStage==='QUALIFIED'));
      assert.ok((await repo.findSourceFields()).some(x=>x.attribution));
    }
  });
  await check('existing attribution, contact and commercial history survive commercial update', async () => {
    const attr={first:{utmSource:'legacy-linkedin',utmContent:'legacy-creative'},latest:{utmSource:'legacy-chatgpt'},channel:'Social',confidence:'HIGH'};
    const meta={customerCompany:'[TEST] historical company',engineering:{engagementType:'STANDARD_SUPPORT',preserve:'TEST legacy field'},stageHistory:[{from:'',to:'QUALIFIED',at:'2026-10-01T00:00:00.000Z',by:'TEST legacy operator'}]};
    const row=(await sql.query(`INSERT INTO public.leads(contact_name,company_name,phone,email,cooperation_type,remark,attribution,commercial_stage,commercial_grade,commercial_meta) VALUES($1,$2,$3,$4,'oem',$5,$6,'QUALIFIED','C',$7) RETURNING id`,[marker+' historical',marker+' DO NOT COUNT','+61 (0) 412 345 678','rfq-test@example.invalid','[TEST] historical original requirements',JSON.stringify(attr),JSON.stringify(meta)])).rows[0];
    const service=module.get(LeadService);
    {await service.updateCommercial(row.id,{commercialStage:'QUOTED',stageNote:'TEST followup'},'TEST new operator');const saved=(await sql.query('SELECT * FROM public.leads WHERE id=$1',[row.id])).rows[0];
      assert.deepEqual(saved.attribution,attr);assert.equal(saved.phone,'+61 (0) 412 345 678');assert.equal(saved.remark,'[TEST] historical original requirements');assert.equal(saved.commercial_grade,'C');assert.equal(saved.commercial_meta.customerCompany,meta.customerCompany);assert.deepEqual(saved.commercial_meta.engineering,meta.engineering);assert.deepEqual(saved.commercial_meta.stageHistory[0],meta.stageHistory[0]);assert.equal(saved.commercial_meta.stageHistory.length,2);assert.equal(saved.commercial_meta.stageHistory[1].from,'QUALIFIED');assert.equal(saved.commercial_meta.stageHistory[1].to,'QUOTED');
    }
  });
  await check('real admin JWT/role/query/relations/commercial HTTP chain without method replacement', async()=>{
    const adminRole=await prisma.role.create({data:{name:'crm_operator',permissions:{}}});
    const editorRole=await prisma.role.create({data:{name:'content_editor',permissions:{}}});
    const admin=await prisma.user.create({data:{username:'RFQ_TEST_OPERATOR',email:'rfq-admin@example.invalid',passwordHash:'TEST_NOT_USED',roleId:adminRole.id}});
    const editor=await prisma.user.create({data:{username:'RFQ_TEST_EDITOR',email:'rfq-editor@example.invalid',passwordHash:'TEST_NOT_USED',roleId:editorRole.id}});
    const token=u=>jwt.sign({sub:u.id,kind:'admin',roleId:u.roleId},process.env.JWT_ACCESS_SECRET,{expiresIn:'10m'});
    const request=(method,url,body,user=admin)=>fetch(api+url,{method,headers:{'Content-Type':'application/json',...(user?{Authorization:'Bearer '+token(user)}:{})},...(body?{body:JSON.stringify(body)}:{})});
    const row=await prisma.lead.findFirst({orderBy:{createdAt:'desc'}});
    await prisma.lead.update({where:{id:row.id},data:{assignedTo:admin.id}});
    await prisma.leadNote.create({data:{leadId:row.id,authorId:admin.id,content:'[TEST] relational author note'}});
    await prisma.partner.create({data:{companyName:'[TEST] linked partner',type:'oem',contactInfo:{test:true},convertedFromLeadId:row.id}});
    assert.equal((await request('GET','/admin/leads/'+row.id,null,null)).status,401);
    assert.equal((await request('GET','/admin/leads/'+row.id,null,editor)).status,403);
    let response=await request('GET','/admin/leads/'+row.id);assert.equal(response.status,200);let detail=await response.json();assert.equal(detail.assignedUser.username,admin.username);assert.equal(detail.notes[0].author.username,admin.username);assert.equal(detail.partner.companyName,'[TEST] linked partner');
    response=await request('PATCH','/admin/leads/'+row.id+'/commercial',{commercialStage:'SAMPLE_PENDING',commercialGrade:'B',stageNote:'[TEST] HTTP stage'});assert.equal(response.status,200,await response.clone().text());
    response=await request('GET','/admin/leads/'+row.id);detail=await response.json();assert.equal(detail.commercialStage,'SAMPLE_PENDING');assert.equal(detail.commercialMeta.stageHistory.at(-1).by,admin.id);assert.equal(detail.notes.length,1);assert.ok(detail.partner);
    const prior=JSON.stringify(detail.commercialMeta);assert.equal((await request('PATCH','/admin/leads/'+row.id+'/commercial',{commercialStage:'INVALID'})).status,400);
    assert.equal((await request('PATCH','/admin/leads/'+row.id+'/commercial',{admin:true})).status,400);
    assert.equal(JSON.stringify((await (await request('GET','/admin/leads/'+row.id)).json()).commercialMeta),prior);
    assert.equal((await request('GET','/admin/leads/00000000-0000-4000-8000-000000000000')).status,404);
    evidence.adminManagement={productionController:true,productionDto:true,realJwt:true,realRoleLookup:true,queryMethodReplaced:false,relations:['assignedUser','notes.author','partner'],unauthorized:401,forbidden:403,invalidDto:400,notFound:404};
  });
  await check('production archive export and actual scheduler write only temporary test files', async () => {
    const dir=fs.mkdtempSync(path.join(os.tmpdir(),'rfq-archive-'));
    const previous=process.env.LEAD_ARCHIVE_DIR;process.env.LEAD_ARCHIVE_DIR=dir;
    const archive=new LeadArchiveService(module.get(LeadRepository));
    try {const result=await archive.exportAll();assert.equal(result.count,await count());assert.ok(fs.readFileSync(path.join(dir,'LEAD-CUSTOMER-ARCHIVE.csv'),'utf8').includes(marker));
      fs.unlinkSync(path.join(dir,'LEAD-CUSTOMER-ARCHIVE.csv'));archive.scheduleRefresh();
      for(let i=0;i<100&&!fs.existsSync(path.join(dir,'LEAD-CUSTOMER-ARCHIVE.csv'));i++)await new Promise(r=>setTimeout(r,20));
      assert.ok(fs.existsSync(path.join(dir,'LEAD-CUSTOMER-ARCHIVE.csv')));evidence.archive={realScheduler:true,realExport:true,count:result.count,testDirectoryOnly:true};
    } finally {if(previous===undefined)delete process.env.LEAD_ARCHIVE_DIR;else process.env.LEAD_ARCHIVE_DIR=previous;fs.rmSync(dir,{recursive:true,force:true});}
  });
  if(process.env.RFQ_SKIP_BROWSER==='1') {
    if(process.env.RFQ_KEEP_ISOLATED_API_DIR){
      const keep=path.resolve(process.env.RFQ_KEEP_ISOLATED_API_DIR);fs.mkdirSync(keep,{recursive:true});
      // These credentials are only the disposable local cluster, never production.
      fs.writeFileSync(path.join(keep,'api-ready.json'),JSON.stringify({api,platform:process.platform,arch:process.arch,node:process.version}));
      fs.writeFileSync(path.join(keep,'local-db-url'),url,{mode:0o600});
      const operator=await prisma.user.findUnique({where:{username:'RFQ_TEST_OPERATOR'}});
      fs.writeFileSync(path.join(keep,'admin-token'),jwt.sign({sub:operator.id,kind:'admin',roleId:operator.roleId},process.env.JWT_ACCESS_SECRET,{expiresIn:'2h'}),{mode:0o600});
      while(!fs.existsSync(path.join(keep,'stop')))await new Promise(r=>setTimeout(r,250));
    }
    const summary=(await sql.query('SELECT count(*)::int AS total,count(*) FILTER (WHERE (contact_name LIKE $1 AND email=$2) OR (contact_name LIKE $3 AND email=$4))::int AS marked FROM public.leads',[marker+'%','rfq-test@example.invalid','[TEST LONGVON-P0-RECOVERY-001]%','longvon-p0-recovery-001@example.invalid'])).rows[0];assert.equal(summary.total,summary.marked);evidence.database={engine:'real disposable PostgreSQL',...summary};evidence.platform={os:process.platform,arch:process.arch,node:process.version};return;
  }
  const webPort = await freePort(); const webURL = `http://127.0.0.1:${webPort}`;
  const log = fs.openSync(path.join(output, 'next-test.log'), 'w');
  const productionWeb = process.env.RFQ_TEST_WEB_MODE === 'production';
  const webArgs=productionWeb?['--require',path.join(root,'scripts/rfq/local-network-only.cjs'),path.join(root,'apps/web/.next/standalone/apps/web/server.js')]:[path.join(root,'node_modules/next/dist/bin/next'),'dev','--hostname','127.0.0.1','--port',String(webPort)];
  web = spawn(process.execPath,webArgs,{cwd:path.join(root,'apps/web'),env:{...process.env,DATABASE_URL:url,WECOM_WEBHOOK_URL:'',NEXT_PUBLIC_API_BASE_URL:'',NEXT_TELEMETRY_DISABLED:'1',PORT:String(webPort),HOSTNAME:'127.0.0.1'},stdio:['ignore',log,log]});
  fs.closeSync(log);
  let ready = false;
  for (let i = 0; i < 120; i++) { try { if ((await fetch(`${webURL}/en/partner/oem`)).status === 200) { ready = true; break; } } catch {} await new Promise(r => setTimeout(r, 500)); }
  assert.ok(ready, 'local Next.js did not start');
  browser = await chromium.launch({ channel: process.env.RFQ_BROWSER_CHANNEL === 'bundled' ? undefined : process.env.RFQ_BROWSER_CHANNEL || 'chrome', headless: true });
  async function formCase(locale, query, run, preVisits = []) {
    const context = await browser.newContext({ locale: locale === 'en' ? 'en-US' : 'zh-CN', serviceWorkers: 'block' });
    const page = await context.newPage(); const clientId = `browser-${++sequence}`;
    page.on('pageerror', e => evidence.browserErrors.push(e.message));
    // No request may leave this isolated loopback target. Same-origin /api is
    // proxied by the test harness to the real local Nest API, like Nginx in production.
    await context.route('**/*', async route => {
      const request = route.request(); const target = new URL(request.url());
      if (target.pathname === '/api/partner-leads' && (target.origin === webURL || (productionWeb && target.origin === 'https://www.longvon.com'))) {
        const response = await fetch(`${api}/partner-leads`, { method: request.method(), headers: { 'Content-Type': 'application/json', 'x-forwarded-for': clientId }, body: request.postData() });
        return route.fulfill({ status: response.status, contentType: 'application/json', body: await response.text() });
      }
      if (target.origin !== webURL) return route.abort('blockedbyclient');
      return route.continue();
    });
    try {
      for (const touch of preVisits) {
        await page.goto(`${webURL}/${locale === 'en' ? 'en/' : ''}partner/oem${touch}`, { waitUntil: 'domcontentloaded' });
        // Wait for the real capture effect, not network-idle or synthetic storage writes.
        await page.waitForFunction(() => { const raw=localStorage.getItem('lv_attr_v2');return raw&&JSON.parse(raw).latest?.landingPage === (location.pathname+location.search).slice(0,500); });
      }
      await page.goto(`${webURL}/${locale === 'en' ? 'en/' : ''}partner/oem${query}`, { waitUntil: 'domcontentloaded' });
      const form = page.locator('form').filter({ has: page.locator('input[type="tel"]') }).first();
      await form.locator('[name="contactName"]').waitFor();
      await form.locator('[name="contactName"]').fill(marker); await form.locator('[name="companyName"]').fill(`${marker} DO NOT COUNT`);
      await form.locator('[name="email"]').fill('rfq-test@example.invalid'); await form.locator('[name="phone"]').fill('+44 (20) 7946-0958');
      for (let i = 0; i < 3; i++) await form.locator('select').nth(i).selectOption({ index: 1 });
      await form.locator('textarea').fill(`${marker} browser isolated regression`);
      assert.equal(await form.locator('input[tabindex="-1"]').inputValue(), '');
      for (const [name, value] of [['contactName', 'name'], ['companyName', 'organization'], ['email', 'email'], ['phone', 'tel']]) assert.equal(await form.locator(`[name="${name}"]`).getAttribute('autocomplete'), value);
      await run(page, form);
    } finally { await context.close(); }
  }
  for (const locale of ['en', 'zh']) {
    for (const [source, query] of [['plain', ''], ['utm', '?utm_source=linkedin&utm_medium=social&utm_campaign=P0-TEST'], ['ai', '?utm_source=chatgpt&utm_medium=ai_assistant&utm_campaign=P0-TEST'], ['ai-long', '?keyword='+ 'k'.repeat(1000)+'&utm_source=chatgpt&utm_medium=ai_assistant&utm_campaign=P0-TEST'], ['multitouch','']]) await check(`browser ${locale} ${source} submits and writes PostgreSQL`, async () => {
      await formCase(locale, query, async (page, form) => {
        const before = await count(); const responsePromise = page.waitForResponse(r => r.url().endsWith('/api/partner-leads') && r.request().method() === 'POST');
        await form.locator('button[type="submit"]').click(); const response = await responsePromise; assert.equal(response.status(), 201);
        await page.getByText(locale === 'en' ? 'Your inquiry has been submitted successfully.' : '您的询盘已成功提交。', { exact: true }).waitFor();
        assert.equal(await count(), before + 1); const saved = (await sql.query('SELECT * FROM public.leads ORDER BY created_at DESC LIMIT 1')).rows[0];
        assert.equal(saved.phone, '+44 (20) 7946-0958'); assert.equal(saved.source_page, locale === 'en' ? '/en/partner/oem' : '/partner/oem');
        if (source !== 'plain') assert.equal(saved.utm_source, source.startsWith('ai') ? 'chatgpt' : 'linkedin');
        if (source.startsWith('ai')) { assert.ok(saved.source_keyword.endsWith('ai:chatgpt')); assert.ok(saved.source_keyword.length<=200); assert.equal(saved.attribution.channel,'AI Assistant'); }
        if (source === 'multitouch') { const attr=saved.attribution; for(const [key,value] of Object.entries({utmSource:'linkedin',utmContent:'creative-A',utmTerm:'ring-A'}))assert.equal(attr.first[key],value,key);for(const [key,value] of Object.entries({utmSource:'chatgpt',utmContent:'creative-B',utmTerm:'ring-B'}))assert.equal(attr.latest[key],value,key); }
        assert.ok(saved.attribution);assert.equal(saved.commercial_stage,'NEW_INQUIRY');
        evidence.browserSubmissions.push({ locale, source, status: response.status(), request: response.request().postDataJSON(), saved: { id: saved.id, phone: saved.phone, sourcePage: saved.source_page, utmSource: saved.utm_source, utmMedium: saved.utm_medium, utmCampaign: saved.utm_campaign, sourceKeyword: saved.source_keyword, remark: saved.remark, attribution:saved.attribution, commercialStage:saved.commercial_stage, commercialMeta:saved.commercial_meta } });
        if (source === 'ai') await page.screenshot({ path: path.join(output, `success-${locale}.png`), fullPage: true });
      }, source === 'multitouch' ? ['?utm_source=linkedin&utm_medium=social&utm_campaign=A&utm_content=creative-A&utm_term=ring-A','?utm_source=chatgpt&utm_medium=ai_assistant&utm_campaign=B&utm_content=creative-B&utm_term=ring-B'] : []);
    });
    for (const status of [400, 429, 500, 502, 'network']) await check(`browser ${locale} safe actionable error ${status}`, async () => {
      await formCase(locale, '', async (page, form) => {
        const before = await count();
        await page.route('**/api/partner-leads', route => status === 'network' ? route.abort('connectionfailed') : route.fulfill({ status, contentType: status === 502 ? 'text/html' : 'application/json', body: status === 502 ? '<h1>INTERNAL_SECRET proxy failure</h1>' : JSON.stringify({ message: status === 400 ? ['phone invalid INTERNAL_SECRET'] : 'INTERNAL_SECRET' }) }));
        await form.locator('button[type="submit"]').click(); const alert = form.getByRole('alert'); await alert.waitFor();
        const text = await alert.innerText(); assert.ok(!text.includes('INTERNAL_SECRET')); assert.ok(text.includes('general@longvon.com'));
        const expected = status === 400 ? (locale === 'en' ? 'phone number' : '电话号码') : status === 429 ? (locale === 'en' ? 'Too many attempts' : '过于频繁') : status === 'network' ? (locale === 'en' ? 'Connection interrupted' : '连接中断') : (locale === 'en' ? 'could not confirm' : '无法确认');
        assert.ok(text.includes(expected), text); assert.equal(await alert.locator('a').getAttribute('href'), 'mailto:general@longvon.com'); assert.equal(await count(), before);
        assert.equal(await form.locator('button[type="submit"]').isEnabled(), true);
        if (status === 502) await page.screenshot({ path: path.join(output, `error-${locale}.png`), fullPage: true });
      });
    });
    await check(`browser ${locale} invalid phone prevented before POST`, async () => {
      await formCase(locale, '', async (page, form) => {
        let posts = 0; page.on('request', r => { if (r.method() === 'POST' && r.url().endsWith('/api/partner-leads')) posts++; });
        await form.locator('[name="phone"]').fill('-------'); await form.locator('button[type="submit"]').click(); await form.getByRole('alert').waitFor(); assert.equal(posts, 0);
      });
    });
  }
  assert.deepEqual(evidence.browserErrors, []);
  const summary = await sql.query('SELECT count(*)::int AS total, count(*) FILTER (WHERE contact_name LIKE $1 AND email = $2)::int AS marked FROM public.leads', [`${marker}%`, 'rfq-test@example.invalid']);
  assert.equal(summary.rows[0].total, summary.rows[0].marked); evidence.database = { engine: 'real ephemeral PostgreSQL', ...summary.rows[0], fixture: 'existing Lead scalar DDL/check constraints; unrelated FKs omitted; no RLS or production migration validation' };
}
(async () => { try { await main(); evidence.result = 'PASS'; } catch (error) { evidence.result = 'FAIL'; evidence.failure = error.stack; console.error(error); process.exitCode = 1; } finally {
  if (browser) await browser.close(); if (web) { web.kill('SIGTERM'); await new Promise(resolve => { if (web.exitCode !== null) return resolve(); web.once('exit', resolve); setTimeout(() => { web.kill('SIGKILL'); resolve(); }, 5000).unref(); }); }
  if (app) await app.close(); else if (prisma) await prisma.$disconnect(); if (sql) await sql.end(); if (db) await db.stop();
  evidence.finished = new Date().toISOString(); fs.writeFileSync(path.join(output, 'regression.json'), JSON.stringify(evidence, null, 2)); console.log(`${evidence.result}: ${evidence.tests.length} checks; ${path.join(output, 'regression.json')}`);
} })();
