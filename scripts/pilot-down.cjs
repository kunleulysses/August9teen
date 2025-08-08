#!/usr/bin/env node
const fs=require('fs');
const fsp=require('fs/promises');
const { spawnSync }=require('child_process');

function parseArgs(argv){const out={};const a=argv.slice(2);for(let i=0;i<a.length;i++){const t=a[i];if(t.startsWith('--')){const[k,v]=t.split('=');const key=k.replace(/^--/,'');if(v!==undefined)out[key]=v;else if(i+1<a.length&&!a[i+1].startsWith('--'))out[key]=a[++i];else out[key]=true;}}return out;}

(async function main(){
  try{
    const args=parseArgs(process.argv);
    const company=args.company||args.org||args.tenant;
    if(!company||!/^[A-Za-z0-9._-]+$/.test(company)){console.error('[pilot:down] --company is required');process.exit(1);}    
    const proj=`pilot_${company}`;
    const envFile=`.env.pilot.${company}`;
    const dockerEnv='.env.docker';
    const backupFile='.env.docker.bak';

    const downArgs=['compose','-p',proj,'--env-file',envFile,'down'];
    if(args.purge||args['purge-volumes']||args.v) downArgs.push('-v');
    const res=spawnSync('docker', downArgs, { stdio:'inherit' });
    if(res.status!==0){ console.error('[pilot:down] docker compose down failed'); process.exit(res.status||1); }

    try{
      if(fs.existsSync(backupFile)){
        await fsp.copyFile(backupFile, dockerEnv);
        await fsp.unlink(backupFile).catch(()=>{});
        console.log('[pilot:down] Restored .env.docker from backup');
      }
    }catch(_){ }

    console.log('[pilot:down] ✅ Stack stopped.');
  }catch(e){
    console.error('[pilot:down] Failed:', e.message);
    process.exit(1);
  }
})();