const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  LOG_LEVEL: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  PORT: process.env.PORT || 3000,
  // Add more config values as needed
};

export default config;