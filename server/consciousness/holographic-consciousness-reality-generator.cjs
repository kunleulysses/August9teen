import workerpool from 'workerpool';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pool = workerpool.pool(join(__dirname, 'workers', 'calcWorker.js'));

class HolographicConsciousnessRealityGenerator {
  async runCalculations(iterations = 1000) {
    const [projection, environment] = await Promise.all([
      pool.exec('projectionLoop', [iterations]),
      pool.exec('environmentLoop', [iterations]),
    ]);
    return { projection, environment };
  }

  async terminate() {
    await pool.terminate();
  }
}

export { HolographicConsciousnessRealityGenerator };
