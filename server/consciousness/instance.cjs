import { HolographicConsciousnessRealityGenerator } from './holographic-consciousness-reality-generator.cjs';
import './eventHandlers/realityQueueProducer.cjs';
import './metricsServer.cjs';
import './workers/placement.js';
import './workers/sceneWorker.js';

const generator = new HolographicConsciousnessRealityGenerator();
export default generator;