#!/usr/bin/env node
const fs = require('fs');
const fsp = require('fs/promises');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

function parseArgs(argv){const out={};const a=argv.slice(2);for(let i=0;i<a.length;i++){const t=a[i];if(t.startsWith('--')){const[k,v]=t.split('=');const key=k.replace(/^--/,'');if(v!==undefined)out[key]=v;else if(i+1<a.length&&!a[i+1].startsWith('--'))out[key]=a[++i];else out[key]=true;}}return out;}
function genSecret(){return crypto.randomBytes(24).toString('hex');}

(async function main(){
  try{
    const args=parseArgs(process.argv);
    const company=args.company||args.org||args.tenant;
    if(!company||!/^[A-Za-z0-9._-]+$/.test(company)){console.error('[pilot:up] --company is required (alphanumeric, dot, underscore, dash).');process.exit(1);}    
    const proj=`pilot_${company}`;
    const envFile=`.env.pilot.${company}`;
    const dockerEnv='.env.docker';
    const backupFile='.env.docker.bak';

    const POSTGRES_DB=args['db-name']||'appdb';
    const POSTGRES_USER=args['db-user']||'postgres';
    const POSTGRES_PASSWORD=args['db-password']||genSecret();
    const NODE_ENV=args['node-env']||'development';
    const GRAFANA_ADMIN_PASSWORD=args['grafana-pass']||'admin';
    const API_JWT_SECRET=args['api-secret']||process.env.API_JWT_SECRET||genSecret();

    const RATE_WINDOW=args['rate-window']||process.env.PILOT_RATE_WINDOW_SEC||'900';
    const RATE_MAX=args['rate-max']||process.env.PILOT_RATE_MAX||'100';
    const LOGIN_MAX=args['login-max']||process.env.PILOT_LOGIN_MAX||'10';
    const CREATE_MAX=args['create-max']||process.env.PILOT_CREATE_MAX||'30';
    const RATE_MSG=process.env.PILOT_RATE_MESSAGE||'Too many requests, rate limit exceeded';

    const lines=[
      `POSTGRES_DB=${POSTGRES_DB}`,
      `POSTGRES_USER=${POSTGRES_USER}`,
      `POSTGRES_PASSWORD=${POSTGRES_PASSWORD}`,
      `NODE_ENV=${NODE_ENV}`,
      `GRAFANA_ADMIN_PASSWORD=${GRAFANA_ADMIN_PASSWORD}`,
      `API_JWT_SECRET=${API_JWT_SECRET}`,
      `PILOT_RATE_WINDOW_SEC=${RATE_WINDOW}`,
      `PILOT_RATE_MAX=${RATE_MAX}`,
      `PILOT_LOGIN_MAX=${LOGIN_MAX}`,
      `PILOT_CREATE_MAX=${CREATE_MAX}`,
      `PILOT_RATE_MESSAGE=${RATE_MSG}`
    ];

    await fsp.writeFile(envFile, lines.join('\n')+'\n', 'utf8');
    if(fs.existsSync(dockerEnv)){
      await fsp.copyFile(dockerEnv, backupFile);
    }
    await fsp.copyFile(envFile, dockerEnv);

    console.log(`[pilot:up] Using project ${proj}`);
    const res=spawnSync('docker', ['compose','-p',proj,'--env-file',envFile,'up','-d','--build'], { stdio:'inherit' });
    if(res.status!==0){
      console.error('[pilot:up] docker compose up failed');
      try{ if(fs.existsSync(backupFile)) await fsp.copyFile(backupFile, dockerEnv);}catch(_){}
      process.exit(res.status||1);
    }

    console.log('\n[pilot:up] ✅ Stack is starting. Default ports in use (80/443, etc). Only one pilot per host at a time unless you customize ports.');
    console.log(`[pilot:up] Env file: ${envFile}`);
    if(fs.existsSync(backupFile)) console.log(`[pilot:up] Previous ${dockerEnv} backed up to ${backupFile}`);
    console.log('[pilot:up] Access via http://localhost (proxy) once healthy.');
  }catch(e){
    console.error('[pilot:up] Failed:', e.message);
    process.exit(1);
  }
})();