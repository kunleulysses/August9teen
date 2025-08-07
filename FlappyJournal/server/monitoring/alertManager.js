const https = require('https');
const promClient = require('prom-client');

const authFailureCounter = new promClient.Counter({
  name: 'auth_failures_total',
  help: 'Total authentication failures',
  labelNames: ['reason', 'ip']
});

class AlertManager {
  constructor() {
    this.failureWindow = [];
    this.threshold = 10;
    this.windowSize = 60000;
    this.lastAlert = 0;
    this.cooldown = 300000;
  }

  recordAuthFailure(reason, ip) {
    const now = Date.now();
    authFailureCounter.inc({ reason, ip });
    
    this.failureWindow.push({ timestamp: now, reason, ip });
    this.failureWindow = this.failureWindow.filter(f => now - f.timestamp < this.windowSize);
    
    if (this.failureWindow.length >= this.threshold && now - this.lastAlert > this.cooldown) {
      this.triggerAlert();
      this.lastAlert = now;
    }
  }

  async triggerAlert() {
    const alertData = {
      failureCount: this.failureWindow.length,
      topIPs: this.getTopIPs()
    };
    
    await Promise.allSettled([
      this.sendSlackAlert(alertData),
      this.sendPagerDutyAlert(alertData)
    ]);
  }

  async sendSlackAlert(data) {
    if (!process.env.SLACK_WEBHOOK_URL) return;
    
    const message = {
      text: `🚨 Auth failure spike: ${data.failureCount} failures`,
      attachments: [{
        color: "danger",
        fields: [{
          title: "Top IPs",
          value: data.topIPs.map(ip => `${ip.ip}: ${ip.count}`).join('\n')
        }]
      }]
    };
    
    return this.sendWebhook(process.env.SLACK_WEBHOOK_URL, message);
  }

  async sendPagerDutyAlert(data) {
    if (!process.env.PAGERDUTY_INTEGRATION_KEY) return;
    
    const payload = {
      routing_key: process.env.PAGERDUTY_INTEGRATION_KEY,
      event_action: "trigger",
      dedup_key: "sigil-auth-failure-spike",
      payload: {
        summary: `Auth failure spike: ${data.failureCount} failures`,
        source: "sigil-dna",
        severity: "error"
      }
    };
    
    return this.sendWebhook('https://events.pagerduty.com/v2/enqueue', payload);
  }

  async sendWebhook(url, payload) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(payload);
      const urlObj = new URL(url);
      
      const req = https.request({
        hostname: urlObj.hostname,
        port: 443,
        path: urlObj.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        }
      }, (res) => {
        res.on('end', () => resolve());
      });
      
      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }

  getTopIPs() {
    const ipCounts = {};
    this.failureWindow.forEach(f => {
      ipCounts[f.ip] = (ipCounts[f.ip] || 0) + 1;
    });
    
    return Object.entries(ipCounts)
      .map(([ip, count]) => ({ ip, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }
}

const alertManager = new AlertManager();

function trackAuthFailure(reason, req) {
  const ip = req.ip || 'unknown';
  alertManager.recordAuthFailure(reason, ip);
}

module.exports = { alertManager, trackAuthFailure };