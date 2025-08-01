import { vec3, vec4, mat4 } from './math/vec';
import type { MemoryNode } from './types';

// Parametric Archimedean spiral in N-D
export function generateSpiral(dim: number, template: { a?: number, b?: number, turns?: number, nodes?: number }) {
  const a = template.a ?? 1;
  const b = template.b ?? 0.5;
  const turns = template.turns ?? 7;
  const nodes = template.nodes ?? 100;
  const out: { id: string, type: string, nodes: any[], folds: any[] } = {
    id: `spiral_${dim}_${Date.now()}`,
    type: 'archimedean',
    nodes: [],
    folds: []
  };
  for (let i = 0; i < nodes; ++i) {
    const theta = (2 * Math.PI * turns * i) / nodes;
    // In N-D, fill dims with sin/cos harmonics
    const pos = [];
    for (let d = 0; d < dim; ++d) {
      if (d === 0) pos.push((a + b * theta) * Math.cos(theta));
      else if (d === 1) pos.push((a + b * theta) * Math.sin(theta));
      else pos.push((a + b * theta) * Math.sin(theta * (d + 1) / dim));
    }
    out.nodes.push({ id: `n${i}`, pos, theta });
    if (i > 0) out.folds.push({ from: `n${i - 1}`, to: `n${i}` });
  }
  return out;
}

// Returns shortest path as array of node IDs (linear for spiral)
export function foldTraversal(nodeA: any, nodeB: any, nodes: any[]): string[] {
  const idxA = nodes.findIndex(n => n.id === nodeA.id);
  const idxB = nodes.findIndex(n => n.id === nodeB.id);
  if (idxA < 0 || idxB < 0) return [];
  if (idxA <= idxB) return nodes.slice(idxA, idxB + 1).map(n => n.id);
  return nodes.slice(idxB, idxA + 1).reverse().map(n => n.id);
}

// Reverses the path (for property test)
export function reverseFoldTraversal(path: string[], nodes: any[]): [any, any] {
  if (!path.length) return [null, null];
  const a = nodes.find(n => n.id === path[0]);
  const b = nodes.find(n => n.id === path[path.length - 1]);
  return [a, b];
}