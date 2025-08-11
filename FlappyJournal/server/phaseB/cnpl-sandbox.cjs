const { NodeVM } = (() => { try { return require('vm2'); } catch (_) { return {}; } })();

function createSandbox(timeoutMs = 500, memoryLimitMb = 64) {
  if (!NodeVM) {
    return {
      async execute() { throw new Error('Sandbox unavailable'); }
    };
  }
  const vm = new NodeVM({
    console: 'redirect',
    sandbox: {},
    require: { external: false, builtin: [], root: './' },
    timeout: timeoutMs
  });
  return {
    async execute(code, context = {}, entry = 'main', args = []) {
      const wrapper = `module.exports = async (ctx, entry, args) => { ${code}\nconst fn = (typeof global[entry]==='function'? global[entry] : (typeof module[entry]==='function'? module[entry] : (typeof main==='function'? main : null))); if(!fn){ throw new Error('Entry function not found'); } return await fn.apply(null, args && Array.isArray(args) ? args : [ctx]); }`;
      const fn = vm.run(wrapper, 'cnpl-runtime.js');
      return await fn(context, entry, args);
    }
  };
}

module.exports = { createSandbox };

