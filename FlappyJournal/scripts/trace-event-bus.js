#!/usr/bin/env node
/**
 * trace-event-bus.js
 *
 * Lightweight runtime mapper for the Featherweight event-bus.
 * It passively subscribes to **all** channels on the shared Redis / NATS broker
 * (defaulting to Redis) and records every event observed within the sampling
 * window (default: 5 seconds).  After the window expires it prints a GraphViz
 * DOT representation listing the event channels that were active and the total
 * messages seen on each.
 *
 * Limitations: Without explicit publisher / subscriber metadata, we cannot
 * infer edges between containers – only which event names were emitted.  This
 * still gives a quick glance at overall system activity and helps spot isolated
 * namespaces.  For a full publisher→subscriber map you can instrument each
 * container to emit `trace:<container>:<event>` markers.
 *
 * Usage:
 *   node scripts/trace-event-bus.js            # 5s capture, default Redis URL
 *   node scripts/trace-event-bus.js --seconds 10 --url redis://cache:6379
 */

import { createClient } from 'redis';
import { argv } from 'node:process';
import { setTimeout as sleep } from 'node:timers/promises';

function parseArgs() {
  const args = {};
  for (let i = 2; i < argv.length; i += 2) {
    const key = argv[i].replace(/^--/, '');
    const val = argv[i + 1];
    args[key] = val;
  }
  return {
    seconds: Number(args.seconds) || 5,
    url: args.url || process.env.EVENT_BUS_URL || 'redis://localhost:6379',
  };
}

async function main() {
  const { seconds, url } = parseArgs();
  console.log(`\u001b[36m[trace] Connecting to Redis at ${url}…\u001b[0m`);
  const sub = createClient({ url });
  sub.on('error', (err) => console.error('[trace] Redis error', err));
  await sub.connect();

  const counts = new Map();
  await sub.pSubscribe('*', (message, channel) => {
    counts.set(channel, (counts.get(channel) || 0) + 1);
  });

  console.log(`[trace] Capturing events for ${seconds}s…`);
  await sleep(seconds * 1000);

  await sub.quit();

  // Output DOT graph
  console.log('digraph EventBus {');
  console.log('  rankdir=LR;');
  for (const [event, count] of counts) {
    const safe = event.replace(/[^a-zA-Z0-9_]/g, '_');
    console.log(`  "${safe}" [label="${event} (${count})", shape=box];`);
  }
  console.log('}');
}

main().catch((err) => {
  console.error('[trace] Fatal error', err);
  process.exit(1);
});
