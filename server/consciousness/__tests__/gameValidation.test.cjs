const path = require('path');
// Ensure schemas are loaded
require('../../consciousness/utils/validation.cjs');
const { autoValidate, validateByType } = require('../../consciousness/utils/gameValidation.cjs');

describe('gameValidation', () => {
  test('valid npc:state event passes', () => {
    const payload = {
      type: 'npc:state',
      zoneId: 'forest-01',
      npc: { id: 'n1', name: 'Fox', archetype: 'beast', level: 3 }
    };
    expect(() => validateByType('npc:state', payload)).not.toThrow();
    expect(() => autoValidate('zone:forest-01', payload)).not.toThrow();
  });

  test('invalid quest:update missing objectives fails', () => {
    const payload = {
      type: 'quest:update',
      zoneId: 'forest-01',
      quest: { id: 'q1', title: 'Missing objectives' }
    };
    expect(() => validateByType('quest:update', payload)).toThrow();
  });

  test('loot:minted accepts item or moment', () => {
    const pItem = {
      type: 'loot:minted',
      zoneId: 'forest-01',
      item: { id: 'i1', name: 'Blade', type: 'weapon', rarity: 'rare' }
    };
    const pMoment = {
      type: 'loot:minted',
      zoneId: 'forest-01',
      moment: { id: 'm1', kind: 'drop', timestamp: new Date().toISOString() }
    };
    expect(() => validateByType('loot:minted', pItem)).not.toThrow();
    expect(() => validateByType('loot:minted', pMoment)).not.toThrow();
  });
});

