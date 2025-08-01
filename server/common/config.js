const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  LOG_LEVEL: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  PORT: process.env.PORT || 3000,
  STORE_BACKEND: process.env.STORE_BACKEND || 'memory',
  DATABASE_URL: process.env.DATABASE_URL,
  // Add more config values as needed
};

export default config;