// Synthetic read-only local build fixture. No production connections or customer data.
const http=require('node:http');
const server=http.createServer((req,res)=>{res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Content-Type','application/json');if(req.method!=='GET'){res.statusCode=405;res.end(JSON.stringify({message:'Writes disabled in local build fixture'}));return}res.end(JSON.stringify(/\/topics|\/categories/.test(req.url)?[]:{items:[],total:0}))});
server.listen(Number(process.env.GEO_STUB_PORT||34672),'127.0.0.1',()=>console.log('LOCAL_API_STUB_READY'));
