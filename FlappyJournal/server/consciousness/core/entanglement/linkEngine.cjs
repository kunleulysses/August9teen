const { harmonicDistance } = require('../HyperdimensionalSpiralTopology.cjs');

async function attemptLink(sourceSpiral, candidateSpiral, score, arch) {
  if (process.env.ENABLE_QUANTUM_LINKS !== 'true') {
    return;
  }

  const distance = harmonicDistance(arch.routing[sourceSpiral.id], arch.routing[candidateSpiral.id]);
  if (distance > 0.15) {
    return;
  }

  const thematicOverlap = await calculateThematicOverlap(sourceSpiral, candidateSpiral, arch);
  if (thematicOverlap < 0.7) {
    return;
  }

  const link = {
    from: sourceSpiral.id,
    to: candidateSpiral.id,
    strength: score,
    createdAt: Date.now(),
  };

  await arch.storage.setEntLink(sourceSpiral.id, candidateSpiral.id, link);
  await arch.storage.setEntLink(candidateSpiral.id, sourceSpiral.id, link);
}

async function calculateThematicOverlap(spiralA, spiralB, arch) {
  const aThemes = await getSpiralThemes(spiralA, arch);
  const bThemes = await getSpiralThemes(spiralB, arch);
  const intersection = aThemes.filter(theme => bThemes.includes(theme));
  return intersection.length / Math.min(aThemes.length, bThemes.length);
}

async function getSpiralThemes(spiral, arch) {
  const themes = new Set();
  for (const nodeId of spiral.nodes.keys()) {
    const node = await arch.retrieveMemory(nodeId);
    themes.add(node.type);
  }
  return Array.from(themes);
}

module.exports = { attemptLink };