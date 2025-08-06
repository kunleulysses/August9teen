import { EventEmitter } from 'events';
import { PostgresStore } from './persistence/PostgresStore.cjs';
import { RecursiveHolographicRealityEmbedding } from './recursive-holographic-reality-embedding.cjs';

/**
 * Minimal holographic consciousness reality generator.
 * Maintains a Postgres-backed store for generated scenes and related metadata.
 */
export class HolographicConsciousnessRealityGenerator extends EventEmitter {
  constructor(recursiveSystem = new RecursiveHolographicRealityEmbedding()) {
    super();
    this.recursiveSystem = recursiveSystem;
    // Link the recursive system back to this generator if supported
    if (typeof this.recursiveSystem.setHolographicRealityGenerator === 'function') {
      this.recursiveSystem.setHolographicRealityGenerator(this);
    }

    // Persistent store for scenes, paths and fields
    this.store = new PostgresStore();
  }

  /**
   * Generates an embedded reality scene using the recursive system and
   * persists the scene along with its recursion path and field.
   */
  async generateScene(baseReality, recursionDepth = 1, params = {}) {
    // Track existing paths to identify the newly created one
    const existingPaths = new Set(this.recursiveSystem.recursionPaths.keys());

    const result = await this.recursiveSystem.createRecursiveReality(
      baseReality,
      recursionDepth,
      params
    );

    const { embeddedReality, recursiveField } = result;

    // Persist the generated scene
    await this.store.set(`scene:${embeddedReality.id}`, embeddedReality);

    // Persist the newly created recursion path using the same pattern
    const newPathId = [...this.recursiveSystem.recursionPaths.keys()].find(
      id => !existingPaths.has(id)
    );
    if (newPathId) {
      const recursionPath = this.recursiveSystem.recursionPaths.get(newPathId);
      await this.store.set(`path:${recursionPath.id}`, recursionPath);
    }

    // Persist recursive field using the same pattern
    if (recursiveField) {
      await this.store.set(`field:${recursiveField.id}`, recursiveField);
    }

    return result;
  }
}

export default HolographicConsciousnessRealityGenerator;
