import { resetQuota, incrWithinHour } from '../utils/quotaStore.cjs';
test('quota increments and caps', async ()=>{
    await resetQuota('jest');
    for(let i=0;i<100;i++) {
        expect(await incrWithinHour('jest',1,100)).toBe(true);
    }
    expect(await incrWithinHour('jest',1,100)).toBe(false);
    await resetQuota('jest');
    expect(await incrWithinHour('jest',1,100)).toBe(true);
});