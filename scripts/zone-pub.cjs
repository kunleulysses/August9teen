#!/usr/bin/env node
// Usage:
//   node scripts/zone-pub.cjs <channel> '{"type":"zone:join","zoneId":"forest-01","playerId":"p1"}'
//   echo '{"type":"npc:state","zoneId":"forest-01","npc":{"id":"n1","name":"Fox","archetype":"beast","level":3}}' | node scripts/zone-pub.cjs zone:forest-01 -

const Redis = require('ioredis');

async function main() {
  const [,, channel, payloadArg] = process.argv;
  if (!channel || !payloadArg) {
    console.error('Usage: zone-pub <channel> <json | ->');
    process.exit(1);
  }
  let payloadRaw = payloadArg;
  if (payloadArg === '-') {
    payloadRaw = await new Promise((resolve, reject) => {
      let data = '';
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', chunk => data += chunk);
      process.stdin.on('end', () => resolve(data));
      process.stdin.on('error', reject);
    });
  }
  let payload;
  try {
    payload = JSON.parse(payloadRaw);
  } catch (e) {
    console.error('Invalid JSON payload');
    process.exit(2);
  }
  const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
  const r = new Redis(redisUrl);
  const msg = JSON.stringify(payload);
  await r.publish(channel, msg);
  await r.quit();
  console.log(`Published to ${channel}`);
}

main().catch(err => { console.error(err); process.exit(3); });

