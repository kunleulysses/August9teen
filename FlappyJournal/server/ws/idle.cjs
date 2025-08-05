function attachIdle(ws, limit = 300000) {   // 5 min
  let last = Date.now();
  const iv = setInterval(()=>{ if(Date.now()-last>limit){ ws.close(4000,'idle_timeout'); }}, 60000);
  ws.on('message', ()=> (last = Date.now()));
  ws.on('close', ()=> clearInterval(iv));
}

module.exports = { attachIdle };