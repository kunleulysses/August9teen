const WebSocket=require('ws');
const url='ws://127.0.0.1:3015/consciousness-stream';
const ws=new WebSocket(url);
let opened=false;
ws.on('open', ()=>{ opened=true; console.log('OPEN'); });
ws.on('message', m=>{ console.log('MSG', m.toString().slice(0,180)); ws.close(); });
ws.on('error', e=>{ console.log('ERR', e.message); process.exit(2); });
ws.on('close', ()=>{ console.log('CLOSE'); process.exit(0); });
setTimeout(()=>{ if (opened !== true){ console.log('TIMEOUT'); process.exit(3);} }, 7000);
