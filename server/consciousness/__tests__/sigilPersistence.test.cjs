import SigilAuth from '../sigil-based-code-authenticator.cjs';
import { resetQuota } from '../utils/quotaStore.cjs';
// simple code body to sign
const CODE = 'export default function demo(){return 1}';
test('sigil persists across instances', async ()=>{
   const sa = new SigilAuth();
   const res = await sa.embedConsciousnessSigil(CODE,{phi:0.9, awareness:0.9, coherence:0.9});
   const codeStamped = res.authenticatedCode;
   const sa2 = new SigilAuth();
   const verify = await sa2.verifyCodeAuthenticity(codeStamped);
   expect(verify.authentic).toBe(true);
});