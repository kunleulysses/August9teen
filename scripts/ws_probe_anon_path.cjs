const WebSocket=require('ws');
const path=(process.argv[2]||'/consciousness-stream').trim();
const ws=new WebSocket('wss://api.featherweight.world'+path,{rejectUnauthorized:true});
let opened=false; ws.on('open',()=>{opened=true;console.log('OPEN', path); ws.close();});
ws.on('error',e=>{console.log('ERR', path, e.message); process.exit(2);});
ws.on('close',()=>{console.log('CLOSE', path); process.exit(0);});
setTimeout(()=>{ if (opened !== true) { console.log('TIMEOUT', path); process.exit(3);} }, 7000);
