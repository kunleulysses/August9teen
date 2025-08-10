const WebSocket=require("ws");
const ws=new WebSocket("ws://127.0.0.1:3012/consciousness-stream");
let first=true;
ws.on("open",()=>console.log("WSA_OPEN"));
ws.on("message",m=>{ if(first){ console.log("WSA_MSG", m.toString().slice(0,200)); first=false; ws.close(); } });
ws.on("close",()=>{ console.log("WSA_CLOSE"); process.exit(0); });
ws.on("error",e=>{ console.log("WSA_ERR", e.message); process.exit(2); });
setTimeout(()=>{ console.log("WSA_TIMEOUT"); process.exit(3); }, 9000);
