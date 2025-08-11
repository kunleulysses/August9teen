const fs=require('fs');
const jwt=require('jsonwebtoken');
const s=process.argv[2];
if(setTimeout(()=>{ console.log('TIMEOUT'); process.exit(3); }, 7000);){ console.error('no secret'); process.exit(1); }
const t=jwt.sign({ sub:'ws-soak', scope:'metacog.stream' }, s, { algorithm:'HS256', expiresIn:'5m' });
fs.writeFileSync('/opt/featherweight/ws_tok.txt', t);
console.log('token ok');
