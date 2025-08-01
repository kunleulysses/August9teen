import EventEmitter from 'events';
import eventBus from '../ConsciousnessEventBus.js';

export interface Proposal {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  closesAt: string;
  options: string[];
  votes: Map<string, string>;
}

class GovernanceEngine extends EventEmitter {
  proposals: Map<number, Proposal>;
  nextId: number;
  interval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.proposals = new Map();
    this.nextId = 1;
    this.startScheduler();
  }

  createProposal(tenantId: string, title: string, description: string, options: string[], durationMinutes: number): Proposal {
    const id = this.nextId++;
    const prop: Proposal = {
      id,
      title,
      description,
      createdAt: new Date().toISOString(),
      closesAt: new Date(Date.now() + durationMinutes * 60000).toISOString(),
      options,
      votes: new Map()
    };
    this.proposals.set(id, prop);
    eventBus.emit('governance:proposal_created', { id, tenantId, title, options });
    return prop;
  }

  vote(tenantId: string, proposalId: number, option: string) {
    const prop = this.proposals.get(proposalId);
    if (!prop) throw new Error('Proposal not found');
    if (!prop.options.includes(option)) throw new Error('Invalid option');
    prop.votes.set(tenantId, option);
    eventBus.emit('governance:vote_cast', { proposalId, tenantId, option });
  }

  tally(proposalId: number) {
    const prop = this.proposals.get(proposalId);
    if (!prop) throw new Error('Proposal not found');
    const counts: Record<string, number> = {};
    for (const o of prop.options) counts[o] = 0;
    for (const v of prop.votes.values()) counts[v]++;
    const winningOption = prop.options.reduce((max, o) => counts[o] > (counts[max] || 0) ? o : max, prop.options[0]);
    return { winningOption, counts };
  }

  expiredProposals(): Proposal[] {
    const now = Date.now();
    return Array.from(this.proposals.values()).filter(p => new Date(p.closesAt).getTime() < now);
  }

  closeProposal(id: number) {
    const prop = this.proposals.get(id);
    if (!prop) return;
    const { winningOption, counts } = this.tally(id);
    eventBus.emit('governance:proposal_closed', { id, winningOption, counts });
    this.proposals.delete(id);
  }

  startScheduler() {
    this.interval = setInterval(() => {
      for (const p of this.expiredProposals()) {
        this.closeProposal(p.id);
      }
    }, 60 * 1000);
  }
}

const governance = new GovernanceEngine();
export default governance;