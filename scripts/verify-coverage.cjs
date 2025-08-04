#!/usr/bin/env node

/**
 * Fail-Safe Coverage Verification Script
 * Independent CI guard against Jest config mis-merges
 * Parses coverage/coverage-summary.json and exits 1 if below threshold
 */

const fs = require('fs');
const path = require('path');

// Configuration
const COVERAGE_THRESHOLD = 80;
const COVERAGE_FILE = path.join(__dirname, '..', 'coverage', 'coverage-summary.json');

/**
 * Colors for console output
 */
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

/**
 * Log with color
 */
function log(message, color = colors.white) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    threshold: COVERAGE_THRESHOLD,
    file: COVERAGE_FILE,
    verbose: false,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '-t':
      case '--threshold':
        options.threshold = parseFloat(args[++i]);
        break;
      case '-f':
      case '--file':
        options.file = args[++i];
        break;
      case '-v':
      case '--verbose':
        options.verbose = true;
        break;
      case '-h':
      case '--help':
        options.help = true;
        break;
      default:
        log(`Unknown option: ${arg}`, colors.yellow);
    }
  }

  return options;
}

/**
 * Show help message
 */
function showHelp() {
  log(`
${colors.bold}Coverage Verification Script${colors.reset}

USAGE:
    node scripts/verify-coverage.js [options]

OPTIONS:
    -t, --threshold <number>    Coverage threshold percentage (default: 80)
    -f, --file <path>          Path to coverage-summary.json (default: coverage/coverage-summary.json)
    -v, --verbose              Enable verbose output
    -h, --help                 Show this help message

DESCRIPTION:
    Verifies that code coverage meets the specified threshold.
    Exits with code 0 if coverage is sufficient, 1 if insufficient.
    
    This script serves as a fail-safe guard against Jest configuration
    issues that might disable coverage collection or thresholds.

EXAMPLES:
    node scripts/verify-coverage.js
    node scripts/verify-coverage.js --threshold 85
    node scripts/verify-coverage.js --file ./custom-coverage/coverage-summary.json --verbose

EXIT CODES:
    0   Coverage meets threshold
    1   Coverage below threshold or file not found
    2   Invalid arguments or configuration error
`, colors.cyan);
}

/**
 * Read and parse coverage summary file
 */
function readCoverageSummary(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Coverage file not found: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const summary = JSON.parse(content);

    if (!summary.total) {
      throw new Error('Invalid coverage summary format: missing "total" property');
    }

    return summary;
  } catch (error) {
    throw new Error(`Failed to read coverage summary: ${error.message}`);
  }
}

/**
 * Verify coverage against threshold
 */
function verifyCoverage(summary, threshold, verbose = false) {
  const total = summary.total;
  const metrics = {
    lines: total.lines?.pct || 0,
    statements: total.statements?.pct || 0,
    functions: total.functions?.pct || 0,
    branches: total.branches?.pct || 0
  };

  if (verbose) {
    log('\n📊 Coverage Summary:', colors.blue);
    log('━'.repeat(50), colors.blue);
    Object.entries(metrics).forEach(([metric, value]) => {
      const color = value >= threshold ? colors.green : colors.red;
      const status = value >= threshold ? '✅' : '❌';
      log(`${status} ${metric.padEnd(12)}: ${value.toFixed(2)}%`, color);
    });
    log('━'.repeat(50), colors.blue);
  }

  // Check if all metrics meet threshold
  const failedMetrics = Object.entries(metrics).filter(([_, value]) => value < threshold);
  
  if (failedMetrics.length === 0) {
    log(`✅ All coverage metrics meet threshold of ${threshold}%`, colors.green);
    return { passed: true, metrics, failedMetrics: [] };
  } else {
    log(`❌ Coverage threshold not met! Required: ${threshold}%`, colors.red);
    failedMetrics.forEach(([metric, value]) => {
      const deficit = threshold - value;
      log(`   ${metric}: ${value.toFixed(2)}% (${deficit.toFixed(2)}% below threshold)`, colors.red);
    });
    return { passed: false, metrics, failedMetrics };
  }
}

/**
 * Generate detailed report
 */
function generateReport(summary, threshold, result, verbose = false) {
  if (!verbose) return;

  log('\n📈 Detailed Coverage Report:', colors.magenta);
  log('━'.repeat(60), colors.magenta);

  // File-level coverage (if available)
  if (summary && typeof summary === 'object') {
    const files = Object.keys(summary).filter(key => key !== 'total');
    
    if (files.length > 0) {
      log(`\n📁 File Coverage (${files.length} files):`, colors.cyan);
      
      files.slice(0, 10).forEach(file => { // Show top 10 files
        const fileCoverage = summary[file];
        if (fileCoverage && fileCoverage.lines) {
          const linesPct = fileCoverage.lines.pct || 0;
          const color = linesPct >= threshold ? colors.green : colors.red;
          const status = linesPct >= threshold ? '✅' : '❌';
          log(`${status} ${file.substring(file.lastIndexOf('/') + 1).padEnd(30)}: ${linesPct.toFixed(1)}%`, color);
        }
      });
      
      if (files.length > 10) {
        log(`   ... and ${files.length - 10} more files`, colors.yellow);
      }
    }
  }

  // Recommendations
  if (!result.passed) {
    log('\n💡 Recommendations:', colors.yellow);
    log('━'.repeat(30), colors.yellow);
    
    result.failedMetrics.forEach(([metric, value]) => {
      const deficit = threshold - value;
      switch (metric) {
        case 'lines':
          log(`   • Add tests to cover ${deficit.toFixed(1)}% more lines of code`, colors.yellow);
          break;
        case 'statements':
          log(`   • Ensure ${deficit.toFixed(1)}% more statements are executed in tests`, colors.yellow);
          break;
        case 'functions':
          log(`   • Test ${deficit.toFixed(1)}% more functions`, colors.yellow);
          break;
        case 'branches':
          log(`   • Add tests for ${deficit.toFixed(1)}% more conditional branches`, colors.yellow);
          break;
      }
    });
    
    log('\n   • Run: npm test -- --coverage --verbose', colors.yellow);
    log('   • Check: coverage/lcov-report/index.html for detailed analysis', colors.yellow);
  }
}

/**
 * Main execution function
 */
function main() {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    process.exit(0);
  }

  // Validate threshold
  if (isNaN(options.threshold) || options.threshold < 0 || options.threshold > 100) {
    log('❌ Invalid threshold: must be a number between 0 and 100', colors.red);
    process.exit(2);
  }

  try {
    log(`🔍 Verifying coverage against ${options.threshold}% threshold...`, colors.blue);
    
    // Read coverage summary
    const summary = readCoverageSummary(options.file);
    
    // Verify coverage
    const result = verifyCoverage(summary, options.threshold, options.verbose);
    
    // Generate detailed report
    generateReport(summary, options.threshold, result, options.verbose);
    
    // Exit with appropriate code
    if (result.passed) {
      log(`\n🎉 Coverage verification passed!`, colors.green);
      process.exit(0);
    } else {
      log(`\n💥 Coverage verification failed!`, colors.red);
      process.exit(1);
    }
    
  } catch (error) {
    log(`❌ Error: ${error.message}`, colors.red);
    
    if (options.verbose) {
      log('\nStack trace:', colors.yellow);
      log(error.stack, colors.yellow);
    }
    
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  log(`💥 Uncaught exception: ${error.message}`, colors.red);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log(`💥 Unhandled rejection: ${reason}`, colors.red);
  process.exit(1);
});

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  verifyCoverage,
  readCoverageSummary,
  parseArgs,
  main
};
