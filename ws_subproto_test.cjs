const WebSocket=require("ws"),fs=require("fs");
const t=fs.readFileSync("/tmp/jwt_hs256.txt","utf8").trim();
const ws=new WebSocket("ws://127.0.0.1:3012/consciousness-stream", t);
let first=true;
ws.on("open",()=>console.log("WSP_OPEN"));
ws.on("message",m=>{ if(first){ console.log("WSP_MSG", m.toString().slice(0,200)); first=false; ws.close(); } });
ws.on("close",()=>{ console.log("WSP_CLOSE"); process.exit(0); });
ws.on("error",e=>{ console.log("WSP_ERR", e.message); process.exit(2); });
setTimeout(()=>{ console.log("WSP_TIMEOUT"); process.exit(3); }, 9000);
