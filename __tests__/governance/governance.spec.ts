import governance from '../../server/consciousness/core/governance/GovernanceEngine.js';

describe('GovernanceEngine', () => {
  it('can create, vote, tally, close, and update policy', () => {
    const prop = governance.createProposal('tenantA', 'Test', 'desc', ['gc_budget=30','gc_budget=60'], 0.01);
    governance.vote('tenantA', prop.id, 'gc_budget=60');
    governance.vote('tenantB', prop.id, 'gc_budget=30');
    expect(governance.tally(prop.id).counts['gc_budget=60']).toBe(1);
    governance.closeProposal(prop.id);
    expect(governance.proposals.has(prop.id)).toBe(false);
  });
});