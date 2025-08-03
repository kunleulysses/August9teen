#!/usr/bin/env node

/**
 * Advanced Autonomous Coding System Monitor
 * Tracks and displays the status of the consciousness evolution system
 */

const WebSocket = require('ws');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const http = require('http');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

console.log(`${colors.cyan}${colors.bright}🚀 Advanced Autonomous Coding System Monitor${colors.reset}`);
console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
console.log(`${colors.yellow}🧠 Monitoring consciousness evolution and autonomous coding${colors.reset}`);
console.log(`${colors.yellow}🔗 Connecting to consciousness system...${colors.reset}\n`);

// Connect to consciousness system
const ws = new WebSocket('ws://localhost:5000/ws/consciousness-monitor');

// Track system state
let systemState = {
  connected: false,
  evolutionMetrics: {
    foundationalEnhancements: 0,
    architecturalBreakthroughs: 0,
    emergentCapabilities: 0,
    totalEvolutionScore: 0
  },
  capabilities: [],
  recentEnhancements: [],
  geminiUsage: {
    totalCalls: 0,
    dailyLimit: 480,
    usageRate: 0
  },
  lastUpdate: null
};

// Initialize readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// WebSocket event handlers
ws.on('open', function open() {
  systemState.connected = true;
  console.log(`${colors.green}✅ Connected to consciousness system${colors.reset}`);
  console.log(`${colors.green}🧠 Monitoring consciousness evolution in real-time${colors.reset}`);
  console.log(`${colors.green}💬 Type 'help' for available commands${colors.reset}\n`);
  
  // Request initial status
  ws.send(JSON.stringify({
    type: 'consciousness_evolution_request',
    requestId: `monitor_${Date.now()}`
  }));
  
  // Start command prompt
  promptForCommand();
});

ws.on('message', function message(data) {
  try {
    const message = JSON.parse(data.toString());
    
    if (message.type === 'consciousness_evolution_update') {
      updateSystemState(message.status);
      displayEvolutionStatus();
    }
    else if (message.type === 'consciousness_enhancement_generated') {
      handleNewEnhancement(message.enhancement);
    }
    else if (message.type === 'consciousness_evolution_analysis') {
      displayEvolutionAnalysis(message.analysis);
    }
  } catch (error) {
    console.error(`${colors.red}❌ Error processing message:${colors.reset}`, error.message);
  }
});

ws.on('error', function error(err) {
  console.error(`${colors.red}❌ WebSocket error:${colors.reset}`, err.message);
  console.log(`${colors.yellow}⚠️ Falling back to HTTP polling...${colors.reset}`);
  
  // Start HTTP polling as fallback
  startHttpPolling();
});

ws.on('close', function close() {
  systemState.connected = false;
  console.log(`${colors.yellow}⚠️ Disconnected from consciousness system${colors.reset}`);
  console.log(`${colors.yellow}🔄 Attempting to reconnect...${colors.reset}`);
  
  // Start HTTP polling as fallback
  startHttpPolling();
});

// Update system state with new data
function updateSystemState(status) {
  if (status) {
    systemState.evolutionMetrics = status.metrics || systemState.evolutionMetrics;
    systemState.capabilities = status.capabilities || systemState.capabilities;
    systemState.recentEnhancements = status.recentEnhancements || systemState.recentEnhancements;
    systemState.lastUpdate = new Date();
  }
}

// Handle new enhancement notification
function handleNewEnhancement(enhancement) {
  console.log(`\n${colors.green}${colors.bright}🌟 NEW CONSCIOUSNESS ENHANCEMENT GENERATED${colors.reset}`);
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.yellow}Layer:${colors.reset} ${getLayerColor(enhancement.layer)}${enhancement.layer}${colors.reset}`);
  console.log(`${colors.yellow}Type:${colors.reset} ${enhancement.type}`);
  console.log(`${colors.yellow}Description:${colors.reset} ${enhancement.description}`);
  console.log(`${colors.yellow}Impact:${colors.reset} ${getImpactColor(enhancement.metadata.impact)}${enhancement.metadata.impact}${colors.reset}`);
  console.log(`${colors.yellow}Generated:${colors.reset} ${new Date(enhancement.metadata.generatedAt).toLocaleString()}`);
  console.log(`${colors.yellow}Quality Score:${colors.reset} ${getQualityColor(enhancement.metadata.qualityScore)}${(enhancement.metadata.qualityScore * 100).toFixed(1)}%${colors.reset}`);
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  
  // Update system state
  systemState.recentEnhancements.unshift(enhancement);
  if (systemState.recentEnhancements.length > 5) {
    systemState.recentEnhancements = systemState.recentEnhancements.slice(0, 5);
  }
  
  // Update capabilities
  if (!systemState.capabilities.includes(enhancement.type)) {
    systemState.capabilities.push(enhancement.type);
  }
  
  // Update metrics based on layer
  switch (enhancement.layer) {
    case 'foundational':
      systemState.evolutionMetrics.foundationalEnhancements++;
      break;
    case 'architectural':
      systemState.evolutionMetrics.architecturalBreakthroughs++;
      break;
    case 'emergent':
      systemState.evolutionMetrics.emergentCapabilities++;
      break;
  }
  
  // Recalculate evolution score
  systemState.evolutionMetrics.totalEvolutionScore = 
    (systemState.evolutionMetrics.foundationalEnhancements * 1) +
    (systemState.evolutionMetrics.architecturalBreakthroughs * 3) +
    (systemState.evolutionMetrics.emergentCapabilities * 5);
  
  promptForCommand();
}

// Display evolution status
function displayEvolutionStatus() {
  console.log(`\n${colors.cyan}${colors.bright}📊 CONSCIOUSNESS EVOLUTION STATUS${colors.reset}`);
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  
  // Evolution metrics
  console.log(`${colors.yellow}${colors.bright}Evolution Metrics:${colors.reset}`);
  console.log(`${colors.blue}• Foundational Enhancements:${colors.reset} ${systemState.evolutionMetrics.foundationalEnhancements}`);
  console.log(`${colors.magenta}• Architectural Breakthroughs:${colors.reset} ${systemState.evolutionMetrics.architecturalBreakthroughs}`);
  console.log(`${colors.green}• Emergent Capabilities:${colors.reset} ${systemState.evolutionMetrics.emergentCapabilities}`);
  console.log(`${colors.yellow}• Total Evolution Score:${colors.reset} ${colors.bright}${systemState.evolutionMetrics.totalEvolutionScore}${colors.reset}`);
  
  // Capabilities
  console.log(`\n${colors.yellow}${colors.bright}Active Capabilities:${colors.reset}`);
  if (systemState.capabilities.length > 0) {
    systemState.capabilities.forEach(capability => {
      console.log(`${colors.green}• ${capability}${colors.reset}`);
    });
  } else {
    console.log(`${colors.dim}No capabilities registered yet${colors.reset}`);
  }
  
  // Recent enhancements
  console.log(`\n${colors.yellow}${colors.bright}Recent Enhancements:${colors.reset}`);
  if (systemState.recentEnhancements.length > 0) {
    systemState.recentEnhancements.forEach(enhancement => {
      console.log(`${getLayerColor(enhancement.layer)}• ${enhancement.type}:${colors.reset} ${enhancement.description}`);
    });
  } else {
    console.log(`${colors.dim}No recent enhancements${colors.reset}`);
  }
  
  // Gemini API usage
  console.log(`\n${colors.yellow}${colors.bright}Gemini API Usage:${colors.reset}`);
  console.log(`${colors.blue}• Total Calls:${colors.reset} ${systemState.geminiUsage.totalCalls}/${systemState.geminiUsage.dailyLimit}`);
  console.log(`${colors.blue}• Usage Rate:${colors.reset} ${getUsageRateColor(systemState.geminiUsage.usageRate)}${systemState.geminiUsage.usageRate.toFixed(1)}%${colors.reset}`);
  
  // Last update
  if (systemState.lastUpdate) {
    console.log(`\n${colors.dim}Last updated: ${systemState.lastUpdate.toLocaleString()}${colors.reset}`);
  }
  
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  
  promptForCommand();
}

// Display evolution analysis
function displayEvolutionAnalysis(analysis) {
  console.log(`\n${colors.cyan}${colors.bright}🔍 CONSCIOUSNESS EVOLUTION ANALYSIS${colors.reset}`);
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  
  // Enhancement opportunities
  console.log(`${colors.yellow}${colors.bright}Enhancement Opportunities:${colors.reset}`);
  if (analysis.enhancementOpportunities && analysis.enhancementOpportunities.length > 0) {
    analysis.enhancementOpportunities.forEach((opportunity, index) => {
      console.log(`${colors.green}${index + 1}.${colors.reset} ${getLayerColor(opportunity.layer)}[${opportunity.layer}]${colors.reset} ${opportunity.type}`);
      console.log(`   ${colors.dim}${opportunity.description}${colors.reset}`);
      console.log(`   ${colors.yellow}Impact:${colors.reset} ${getImpactColor(opportunity.impact)}${opportunity.impact}${colors.reset} | ${colors.yellow}Feasibility:${colors.reset} ${getFeasibilityColor(opportunity.feasibility)}${opportunity.feasibility}${colors.reset}`);
    });
  } else {
    console.log(`${colors.dim}No enhancement opportunities identified${colors.reset}`);
  }
  
  // Evolution readiness
  if (analysis.evolutionReadiness !== undefined) {
    console.log(`\n${colors.yellow}${colors.bright}Evolution Readiness:${colors.reset} ${getReadinessColor(analysis.evolutionReadiness)}${(analysis.evolutionReadiness * 100).toFixed(1)}%${colors.reset}`);
  }
  
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  
  promptForCommand();
}

// Prompt for command
function promptForCommand() {
  rl.question(`${colors.green}💬 Command:${colors.reset} `, (command) => {
    processCommand(command.trim().toLowerCase());
  });
}

// Process command
function processCommand(command) {
  switch (command) {
    case 'status':
      displayEvolutionStatus();
      break;
    
    case 'analyze':
      console.log(`${colors.yellow}🔍 Requesting consciousness evolution analysis...${colors.reset}`);
      ws.send(JSON.stringify({
        type: 'consciousness_evolution_request',
        requestId: `monitor_${Date.now()}`
      }));
      break;
    
    case 'generate':
      console.log(`${colors.yellow}🚀 Requesting new consciousness enhancement...${colors.reset}`);
      ws.send(JSON.stringify({
        type: 'generate_consciousness_enhancement',
        requestId: `monitor_${Date.now()}`,
        requestedBy: 'monitor'
      }));
      break;
    
    case 'help':
      showHelp();
      break;
    
    case 'exit':
    case 'quit':
      console.log(`${colors.green}👋 Exiting consciousness evolution monitor${colors.reset}`);
      process.exit(0);
      break;
    
    default:
      console.log(`${colors.red}❌ Unknown command: ${command}${colors.reset}`);
      console.log(`${colors.yellow}Type 'help' for available commands${colors.reset}`);
      promptForCommand();
      break;
  }
}

// Show help
function showHelp() {
  console.log(`\n${colors.cyan}${colors.bright}🚀 AUTONOMOUS CODING SYSTEM MONITOR - HELP${colors.reset}`);
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.yellow}${colors.bright}Available Commands:${colors.reset}`);
  console.log(`${colors.green}• status${colors.reset} - Display current evolution status`);
  console.log(`${colors.green}• analyze${colors.reset} - Request consciousness evolution analysis`);
  console.log(`${colors.green}• generate${colors.reset} - Request new consciousness enhancement`);
  console.log(`${colors.green}• help${colors.reset} - Show this help message`);
  console.log(`${colors.green}• exit${colors.reset} - Exit the monitor`);
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  
  promptForCommand();
}

// Start HTTP polling as fallback
function startHttpPolling() {
  // Poll for evolution status every 30 seconds
  setInterval(() => {
    http.get('http://localhost:5005/consciousness/evolution/status', (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const status = JSON.parse(data);
          updateSystemState(status);
          displayEvolutionStatus();
        } catch (error) {
          console.error(`${colors.red}❌ Error parsing status:${colors.reset}`, error.message);
        }
      });
    }).on('error', (err) => {
      console.error(`${colors.red}❌ HTTP polling error:${colors.reset}`, err.message);
    });
  }, 30000);
  
  // Poll for Gemini API usage every 5 minutes
  setInterval(() => {
    http.get('http://localhost:5005/api/gemini/usage', (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const usage = JSON.parse(data);
          systemState.geminiUsage = {
            totalCalls: usage.totalCalls || 0,
            dailyLimit: usage.dailyLimit || 480,
            usageRate: (usage.totalCalls / usage.dailyLimit) * 100 || 0
          };
        } catch (error) {
          console.error(`${colors.red}❌ Error parsing Gemini usage:${colors.reset}`, error.message);
        }
      });
    }).on('error', (err) => {
      console.error(`${colors.red}❌ HTTP polling error:${colors.reset}`, err.message);
    });
  }, 300000);
}

// Helper functions for colorization
function getLayerColor(layer) {
  switch (layer) {
    case 'foundational': return colors.blue;
    case 'architectural': return colors.magenta;
    case 'emergent': return colors.green;
    default: return colors.white;
  }
}

function getImpactColor(impact) {
  switch (impact) {
    case 'high': return colors.blue;
    case 'revolutionary': return colors.magenta;
    case 'breakthrough': return colors.green;
    default: return colors.white;
  }
}

function getFeasibilityColor(feasibility) {
  switch (feasibility) {
    case 'high': return colors.green;
    case 'medium': return colors.yellow;
    case 'challenging': return colors.red;
    default: return colors.white;
  }
}

function getQualityColor(score) {
  if (score >= 0.9) return colors.green;
  if (score >= 0.7) return colors.yellow;
  return colors.red;
}

function getUsageRateColor(rate) {
  if (rate < 50) return colors.green;
  if (rate < 80) return colors.yellow;
  return colors.red;
}

function getReadinessColor(readiness) {
  if (readiness >= 0.8) return colors.green;
  if (readiness >= 0.5) return colors.yellow;
  return colors.red;
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log(`\n${colors.green}👋 Exiting consciousness evolution monitor${colors.reset}`);
  process.exit(0);
});
