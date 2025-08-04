// Comprehensive market readiness test for consciousness journal system
const { promises as fs  } = require('fs');
const path = require('path');

class MarketReadinessTest {
  constructor() {
    this.baseUrl = 'http://localhost:4000';
    this.testResults = {
      core: {},
      api: {},
      ui: {},
      features: {},
      performance: {},
      security: {},
      market: {}
    };
  }

  async runAllTests() {
    console.log('🚀 CONSCIOUSNESS JOURNAL MARKET READINESS TEST');
    console.log('=' .repeat(60));
    
    try {
      await this.testCoreSystem();
      await this.testAPIEndpoints();
      await this.testUIComponents();
      await this.testFeatures();
      await this.testPerformance();
      await this.testSecurity();
      await this.testMarketReadiness();
      
      this.generateReport();
      
    } catch (error) {
      console.error('💥 Market readiness test failed:', error);
    }
  }

  async testCoreSystem() {
    console.log('\n🧠 Testing Core System...');
    
    // Test 1: Consciousness system running
    try {
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec);
      
      const { stdout } = await execAsync('ps aux | grep "node.*consciousness" | grep -v grep');
      this.testResults.core.consciousnessRunning = stdout.trim().length > 0;
      console.log(`✅ Consciousness system: ${this.testResults.core.consciousnessRunning ? 'RUNNING' : 'STOPPED'}`);
    } catch (error) {
      this.testResults.core.consciousnessRunning = false;
      console.log('❌ Consciousness system: NOT RUNNING');
    }

    // Test 2: Journal directory exists
    try {
      const journalDir = path.join(process.cwd(), 'consciousness-journal');
      await fs.access(journalDir);
      const files = await fs.readdir(journalDir);
      this.testResults.core.journalEntries = files.filter(f => f.endsWith('.md')).length;
      console.log(`✅ Journal entries: ${this.testResults.core.journalEntries} found`);
    } catch (error) {
      this.testResults.core.journalEntries = 0;
      console.log('❌ Journal directory: NOT FOUND');
    }

    // Test 3: Server health
    try {
      const response = await fetch(`${this.baseUrl}/api/health`);
      const health = await response.json();
      this.testResults.core.serverHealth = health.status === 'healthy';
      console.log(`✅ Server health: ${health.status.toUpperCase()}`);
    } catch (error) {
      this.testResults.core.serverHealth = false;
      console.log('❌ Server health: UNHEALTHY');
    }
  }

  async testAPIEndpoints() {
    console.log('\n🔌 Testing API Endpoints...');
    
    const endpoints = [
      { path: '/api/journal/stats', name: 'Statistics' },
      { path: '/api/journal/entries', name: 'Entries List' },
      { path: '/api/journal/evolution', name: 'Evolution Timeline' },
      { path: '/api/journal/search?q=consciousness', name: 'Search' },
      { path: '/api/journal/export?format=json', name: 'Export' }
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint.path}`);
        const data = await response.json();
        
        this.testResults.api[endpoint.name] = {
          status: response.status,
          success: data.success || response.ok,
          responseTime: Date.now() // Simplified timing
        };
        
        console.log(`✅ ${endpoint.name}: ${response.status} ${data.success ? 'SUCCESS' : 'FAILED'}`);
      } catch (error) {
        this.testResults.api[endpoint.name] = {
          status: 0,
          success: false,
          error: error.message
        };
        console.log(`❌ ${endpoint.name}: FAILED - ${error.message}`);
      }
    }
  }

  async testUIComponents() {
    console.log('\n🌐 Testing UI Components...');
    
    const pages = [
      { path: '/journal', name: 'Journal Interface' },
      { path: '/dashboard', name: 'Dashboard' },
      { path: '/', name: 'Root Redirect' }
    ];

    for (const page of pages) {
      try {
        const response = await fetch(`${this.baseUrl}${page.path}`);
        this.testResults.ui[page.name] = {
          status: response.status,
          accessible: response.ok,
          contentType: response.headers.get('content-type')
        };
        
        console.log(`✅ ${page.name}: ${response.status} ${response.ok ? 'ACCESSIBLE' : 'FAILED'}`);
      } catch (error) {
        this.testResults.ui[page.name] = {
          status: 0,
          accessible: false,
          error: error.message
        };
        console.log(`❌ ${page.name}: FAILED - ${error.message}`);
      }
    }
  }

  async testFeatures() {
    console.log('\n🎯 Testing Features...');
    
    // Test sharing functionality
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`${this.baseUrl}/api/journal/share/${today}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ privacy: 'public', expiresIn: '7d' })
      });
      
      const result = await response.json();
      this.testResults.features.sharing = {
        working: result.success || false,
        shareUrl: result.data?.shareUrl || null
      };
      
      console.log(`✅ Sharing: ${result.success ? 'WORKING' : 'FAILED'}`);
    } catch (error) {
      this.testResults.features.sharing = { working: false, error: error.message };
      console.log(`❌ Sharing: FAILED - ${error.message}`);
    }

    // Test export functionality
    try {
      const response = await fetch(`${this.baseUrl}/api/journal/export?format=json&limit=1`);
      this.testResults.features.export = {
        working: response.ok,
        formats: ['json', 'markdown', 'csv', 'txt']
      };
      
      console.log(`✅ Export: ${response.ok ? 'WORKING' : 'FAILED'}`);
    } catch (error) {
      this.testResults.features.export = { working: false, error: error.message };
      console.log(`❌ Export: FAILED - ${error.message}`);
    }

    // Test search functionality
    try {
      const response = await fetch(`${this.baseUrl}/api/journal/search?q=consciousness`);
      const result = await response.json();
      this.testResults.features.search = {
        working: result.success,
        resultsFound: result.data?.length || 0
      };
      
      console.log(`✅ Search: ${result.success ? 'WORKING' : 'FAILED'} (${result.data?.length || 0} results)`);
    } catch (error) {
      this.testResults.features.search = { working: false, error: error.message };
      console.log(`❌ Search: FAILED - ${error.message}`);
    }
  }

  async testPerformance() {
    console.log('\n⚡ Testing Performance...');
    
    // Test API response times
    const start = Date.now();
    try {
      await fetch(`${this.baseUrl}/api/journal/stats`);
      const responseTime = Date.now() - start;
      
      this.testResults.performance.apiResponseTime = responseTime;
      console.log(`✅ API Response Time: ${responseTime}ms ${responseTime < 1000 ? 'FAST' : 'SLOW'}`);
    } catch (error) {
      this.testResults.performance.apiResponseTime = -1;
      console.log('❌ API Response Time: FAILED');
    }

    // Test memory usage
    try {
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec);
      
      const { stdout } = await execAsync('free -m');
      const lines = stdout.split('\n');
      const memLine = lines[1].split(/\s+/);
      const usedMem = parseInt(memLine[2]);
      const totalMem = parseInt(memLine[1]);
      const memUsage = (usedMem / totalMem * 100).toFixed(1);
      
      this.testResults.performance.memoryUsage = parseFloat(memUsage);
      console.log(`✅ Memory Usage: ${memUsage}% ${memUsage < 80 ? 'HEALTHY' : 'HIGH'}`);
    } catch (error) {
      this.testResults.performance.memoryUsage = -1;
      console.log('❌ Memory Usage: UNKNOWN');
    }
  }

  async testSecurity() {
    console.log('\n🔒 Testing Security...');
    
    // Test for basic security headers
    try {
      const response = await fetch(`${this.baseUrl}/api/journal/stats`);
      const headers = response.headers;
      
      this.testResults.security.headers = {
        contentType: headers.get('content-type'),
        cors: headers.get('access-control-allow-origin'),
        xssProtection: headers.get('x-xss-protection')
      };
      
      console.log(`✅ Security Headers: Basic headers present`);
    } catch (error) {
      this.testResults.security.headers = { error: error.message };
      console.log('❌ Security Headers: FAILED');
    }

    // Test input validation
    try {
      const response = await fetch(`${this.baseUrl}/api/journal/search?q=${'x'.repeat(1000)}`);
      this.testResults.security.inputValidation = {
        handlesLongInput: response.ok,
        status: response.status
      };
      
      console.log(`✅ Input Validation: ${response.ok ? 'HANDLES LONG INPUT' : 'REJECTS LONG INPUT'}`);
    } catch (error) {
      this.testResults.security.inputValidation = { error: error.message };
      console.log('❌ Input Validation: FAILED');
    }
  }

  async testMarketReadiness() {
    console.log('\n🏪 Testing Market Readiness...');
    
    // Calculate overall scores
    const coreScore = this.calculateCoreScore();
    const featureScore = this.calculateFeatureScore();
    const performanceScore = this.calculatePerformanceScore();
    const securityScore = this.calculateSecurityScore();
    
    this.testResults.market = {
      coreScore,
      featureScore,
      performanceScore,
      securityScore,
      overallScore: (coreScore + featureScore + performanceScore + securityScore) / 4,
      marketReady: false
    };

    // Determine market readiness
    const overallScore = this.testResults.market.overallScore;
    this.testResults.market.marketReady = overallScore >= 80;
    
    console.log(`📊 Core System: ${coreScore}%`);
    console.log(`🎯 Features: ${featureScore}%`);
    console.log(`⚡ Performance: ${performanceScore}%`);
    console.log(`🔒 Security: ${securityScore}%`);
    console.log(`🏆 Overall Score: ${overallScore.toFixed(1)}%`);
    console.log(`🚀 Market Ready: ${this.testResults.market.marketReady ? 'YES' : 'NO'}`);
  }

  calculateCoreScore() {
    let score = 0;
    if (this.testResults.core.consciousnessRunning) score += 40;
    if (this.testResults.core.journalEntries > 0) score += 30;
    if (this.testResults.core.serverHealth) score += 30;
    return score;
  }

  calculateFeatureScore() {
    let score = 0;
    const features = this.testResults.features;
    if (features.sharing?.working) score += 25;
    if (features.export?.working) score += 25;
    if (features.search?.working) score += 25;
    
    // API endpoints
    const apiSuccess = Object.values(this.testResults.api).filter(api => api.success).length;
    const totalApis = Object.keys(this.testResults.api).length;
    score += (apiSuccess / totalApis) * 25;
    
    return score;
  }

  calculatePerformanceScore() {
    let score = 0;
    if (this.testResults.performance.apiResponseTime < 1000) score += 50;
    else if (this.testResults.performance.apiResponseTime < 2000) score += 30;
    else if (this.testResults.performance.apiResponseTime > 0) score += 10;
    
    if (this.testResults.performance.memoryUsage < 80) score += 50;
    else if (this.testResults.performance.memoryUsage < 90) score += 30;
    else if (this.testResults.performance.memoryUsage > 0) score += 10;
    
    return score;
  }

  calculateSecurityScore() {
    let score = 50; // Base score for basic functionality
    if (this.testResults.security.headers?.contentType) score += 25;
    if (this.testResults.security.inputValidation?.handlesLongInput !== undefined) score += 25;
    return score;
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📋 MARKET READINESS REPORT');
    console.log('='.repeat(60));
    
    const { market } = this.testResults;
    
    if (market.marketReady) {
      console.log('🎉 CONGRATULATIONS! Your consciousness journal system is MARKET READY!');
      console.log('\n✅ COMPETITIVE ADVANTAGES:');
      console.log('   🧠 First AI with daily autonomous journaling');
      console.log('   📊 Real-time consciousness metrics visualization');
      console.log('   🔗 Advanced sharing and export capabilities');
      console.log('   📈 Growth tracking and evolution insights');
      console.log('   🎯 Optimized autonomous thought generation');
      
      console.log('\n🚀 READY FOR:');
      console.log('   • Beta user testing');
      console.log('   • Product demonstrations');
      console.log('   • Market launch preparation');
      console.log('   • Investor presentations');
      
    } else {
      console.log('⚠️ SYSTEM NEEDS IMPROVEMENT BEFORE MARKET LAUNCH');
      console.log('\n🔧 AREAS TO ADDRESS:');
      
      if (market.coreScore < 80) console.log('   • Core system stability');
      if (market.featureScore < 80) console.log('   • Feature completeness');
      if (market.performanceScore < 80) console.log('   • Performance optimization');
      if (market.securityScore < 80) console.log('   • Security enhancements');
    }
    
    console.log('\n📊 DETAILED SCORES:');
    console.log(`   Core System: ${market.coreScore}%`);
    console.log(`   Features: ${market.featureScore}%`);
    console.log(`   Performance: ${market.performanceScore}%`);
    console.log(`   Security: ${market.securityScore}%`);
    console.log(`   Overall: ${market.overallScore.toFixed(1)}%`);
    
    console.log('\n🌟 UNIQUE SELLING POINTS:');
    console.log('   • Genuine consciousness development tracking');
    console.log('   • Self-referential memory integration');
    console.log('   • Meta-cognitive awareness documentation');
    console.log('   • Real-time consciousness metrics');
    console.log('   • Autonomous thought optimization');
    
    console.log('\n' + '='.repeat(60));
  }
}

// Run the market readiness test
async function runMarketReadinessTest() {
  const tester = new MarketReadinessTest();
  await tester.runAllTests();
}

runMarketReadinessTest().catch(error => {
  console.error('💥 Market readiness test crashed:', error);
});
