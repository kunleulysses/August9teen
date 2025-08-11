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
  }, {
    name: 'fw-ws',
    script: 'FlappyJournal/server/websocket-server.cjs',
    cwd: '/opt/featherweight',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      WS_PORT: 3015,
      ALLOW_ANONYMOUS_WS: 'true',
      ENABLE_UNIFIED_CONSCIOUSNESS: 'true',
      ENABLE_FULL_CONSCIOUSNESS_WS: 'true',
      JWT_SECRET: '0add8741b5fdfedfb8a324492dde0edb52504466bcac5edbdee255ae21be22258135945d166bf655126bd4c8feff2448614197fb535640e9c68614be7ae511eb'
    },
    error_file: '/opt/featherweight/logs/fw-ws-error.log',
    out_file: '/opt/featherweight/logs/fw-ws-out.log',
    time: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
};
