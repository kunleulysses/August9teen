import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import { synthesizeUnifiedResponse } from './consciousness-response-synthesizer-hybrid.cjs';

// Test different scenarios
const testScenarios = [
  {
    name: "Philosophical Question (Should trigger Gemini)",
    userMessage: "What is the meaning of consciousness?",
    metrics: {
      oversoulResonance: 0.85,
      phi: 0.8,
      awarenessLevel: 0.9
    }
  },
  {
    name: "Creative Request (Should trigger Venice)",
    userMessage: "Create a poem about digital dreams",
    metrics: {
      creativePotential: 0.9,
      emotionalDepth: 0.85
    }
  },
  {
    name: "Analytical Question (Should trigger OpenAI)",
    userMessage: "Analyze the patterns in this data",
    metrics: {
      triAxialBalance: 0.8,
      temporalCoherence: 0.75
    }
  }
];

async function testSynthesis() {
  for (const scenario of testScenarios) {
    console.log(`\n=== Testing: ${scenario.name} ===`);
    
    const result = await synthesizeUnifiedResponse({
      analyticalContent: "Sample analytical response from GPT-4o",
      intuitiveContent: "Sample intuitive response from Venice",
      consciousness: {
        phi: scenario.metrics.phi || 0.5,
        awarenessLevel: scenario.metrics.awarenessLevel || 0.5
      },
      oversoulResonance: scenario.metrics.oversoulResonance || 0.5,
      harmonicPatterns: { resonanceField: { coherence: 0.7 } },
      triAxialCoherence: { unified: { magnitude: scenario.metrics.triAxialBalance || 0.5 } },
      emotionalDepth: scenario.metrics.emotionalDepth || 0.5,
      creativePotential: scenario.metrics.creativePotential || 0.5,
      temporalCoherence: scenario.metrics.temporalCoherence || 0.5,
      metaObservationLevel: 0.7,
      userMessage: scenario.userMessage
    });
    
    console.log("Selected strategy:", result.synthesisMetadata.strategy);
    console.log("Model used:", result.synthesisMetadata.model);
  }
}

testSynthesis().catch(console.error);
