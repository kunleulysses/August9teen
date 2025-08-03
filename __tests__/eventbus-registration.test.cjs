import SelfCodingModule from '../server/consciousness/modules/SelfCodingModule.cjs';

test('SelfCodingModule registers eventBus listeners on instantiation', async () => {
  const module = new SelfCodingModule();
  // Wait for async eventBus registration
  await new Promise(res => setTimeout(res, 200));
  expect(module.eventBus).toBeDefined();
  expect(module.eventBus.listenerCount('system_tick')).toBeGreaterThan(0);
});