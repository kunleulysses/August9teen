export default {
  apps: [{
    name: 'consciousness-web',
    script: 'secure-consciousness-server.cjs',
    cwd: '/opt/featherweight',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/opt/featherweight/logs/consciousness-web-error.log',
    out_file: '/opt/featherweight/logs/consciousness-web-out.log',
    log_file: '/opt/featherweight/logs/consciousness-web-combined.log',
    time: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
