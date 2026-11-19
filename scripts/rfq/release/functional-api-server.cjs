// Isolated independent fixed-API process for functional rollback rehearsal only.
require('reflect-metadata');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{Test}=require('@nestjs/testing'),{ValidationPipe}=require('@nestjs/common');
const dist=path.resolve(process.env.RFQ_FIXED_DIST),keep=path.resolve(process.env.RFQ_API_KEEP_DIR),url=fs.readFileSync(path.join(keep,'local-db-url'),'utf8').trim();
assert.equal(new URL(url).hostname,'127.0.0.1');assert.equal(new URL(url).pathname,'/rfq_isolated');
assert.equal(process.platform,'linux');assert.equal(process.arch,'x64');
if(process.env.RFQ_ALLOW_LOCAL_WECOM==='1'){assert.equal(new URL(process.env.WECOM_WEBHOOK_URL).hostname,'127.0.0.1')}else delete process.env.WECOM_WEBHOOK_URL;process.env.JWT_ACCESS_SECRET='RFQ_ISOLATED_TEST_SECRET_NOT_PRODUCTION';
const archive=path.resolve(process.env.LEAD_ARCHIVE_DIR);assert.ok(archive.startsWith('/home/rfq/'));fs.mkdirSync(archive,{recursive:true});
const load=rel=>require(path.join(dist,rel));
const {LeadCaptureController}=load('partner/controllers/public/lead-capture.controller.js'),{LeadAdminController}=load('partner/controllers/admin/lead-admin.controller.js'),{LeadService}=load('partner/services/lead.service.js'),{LeadAnalyticsService}=load('partner/services/lead-analytics.service.js'),{LeadRepository}=load('partner/repositories/lead.repository.js'),{LeadArchiveService}=load('partner/services/lead-archive.service.js'),{PrismaService}=load('database/prisma.service.js'),{RedisService}=load('redis/redis.service.js'),{RateLimitGuard}=load('partner/guards/rate-limit.guard.js'),{JwtStrategy}=load('identity/strategies/jwt.strategy.js'),{JwtAuthGuard}=load('identity/guards/jwt-auth.guard.js'),{RolesGuard}=load('identity/guards/roles.guard.js');
const req=require('node:module').createRequire(path.join(dist,'database/prisma.service.js')),fields=req('@mateyou/database').Prisma.dmmf.datamodel.models.find(m=>m.name==='Lead').fields.map(f=>f.name);assert.ok(fields.includes('commercialMeta'));
(async()=>{const prisma=new PrismaService({datasources:{db:{url}}}),counters=new Map();
 const mod=await Test.createTestingModule({controllers:[LeadCaptureController,LeadAdminController],providers:[LeadService,LeadAnalyticsService,LeadRepository,LeadArchiveService,RateLimitGuard,JwtStrategy,JwtAuthGuard,RolesGuard,{provide:PrismaService,useValue:prisma},{provide:RedisService,useValue:{client:{async incr(k){const n=(counters.get(k)||0)+1;counters.set(k,n);return n},async expire(){return 1}}}}]}).compile();
 const app=mod.createNestApplication({logger:false});app.useGlobalPipes(new ValidationPipe({whitelist:true,transform:true,forbidNonWhitelisted:true}));await app.listen(Number(process.env.RFQ_FIXED_PORT),'127.0.0.1');
 fs.writeFileSync(process.env.RFQ_FIXED_READY,JSON.stringify({platform:process.platform,arch:process.arch,pid:process.pid,port:Number(process.env.RFQ_FIXED_PORT),prismaEntry:req.resolve('@mateyou/database'),hasCommercialMeta:true,realArchiveProvider:true}));
 process.on('SIGTERM',async()=>{await app.close();process.exit(0)});
})().catch(e=>{console.error(e);process.exitCode=1});
