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
    async execute(code, context = {}) {
      const wrapper = `module.exports = async (ctx) => { ${code}\nreturn typeof main==='function'?await main(ctx):null; }`;
      const fn = vm.run(wrapper, 'cnpl-runtime.js');
      return await fn(context);
    }
  };
}

module.exports = { createSandbox };

