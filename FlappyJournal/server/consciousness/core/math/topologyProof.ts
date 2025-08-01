import { generateSpiral, foldTraversal, reverseFoldTraversal } from '../HyperdimensionalSpiralTopology';
import fc from 'fast-check';

export function propertyTestReversibility(dim = 7, nodes = 50) {
  const spiral = generateSpiral(dim, { nodes });
  return fc.assert(
    fc.property(
      fc.integer({ min: 0, max: nodes - 1 }),
      fc.integer({ min: 0, max: nodes - 1 }),
      (i, j) => {
        const nodeA = spiral.nodes[i];
        const nodeB = spiral.nodes[j];
        const path = foldTraversal(nodeA, nodeB, spiral.nodes);
        const [ra, rb] = reverseFoldTraversal(path, spiral.nodes);
        return (ra && rb && ra.id === nodeA.id && rb.id === nodeB.id) || (ra && rb && ra.id === nodeB.id && rb.id === nodeA.id);
      }
    ),
    { numRuns: 500 }
  );
}