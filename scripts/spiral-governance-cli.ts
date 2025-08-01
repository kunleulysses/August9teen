import governance from '../FlappyJournal/server/consciousness/core/governance/GovernanceEngine';

const [,, cmd, ...args] = process.argv;

async function main() {
  if (cmd === 'create') {
    const [tenantId, title, desc, options, duration] = args;
    const prop = governance.createProposal(tenantId, title, desc, options.split(','), Number(duration));
    console.log('Created proposal:', prop);
  } else if (cmd === 'vote') {
    const [tenantId, id, option] = args;
    governance.vote(tenantId, Number(id), option);
    console.log('Vote cast.');
  } else if (cmd === 'list') {
    console.log(Array.from(governance.proposals.values()));
  } else if (cmd === 'tally') {
    const [id] = args;
    console.log(governance.tally(Number(id)));
  } else {
    console.log('Usage: node scripts/spiral-governance-cli.js create tenantA "Increase GC budget" "gc_budget=30,gc_budget=60" 120');
    console.log('       node scripts/spiral-governance-cli.js vote tenantB 1 gc_budget=60');
    console.log('       node scripts/spiral-governance-cli.js list');
    console.log('       node scripts/spiral-governance-cli.js tally 1');
  }
}
main();