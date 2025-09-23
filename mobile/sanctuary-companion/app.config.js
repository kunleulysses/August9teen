// Dynamic Expo config to inject env-driven API/WS/auth settings
// Use env vars: API_URL, WSS_URL, AUTH_ISSUER, AUTH_CLIENT_ID, REDIRECT_SCHEME, BUNDLE_ID, ANDROID_PACKAGE, DEV_LOGIN_ENABLED

const name = 'Sanctuary Companion';
const slug = 'sanctuary-companion';

module.exports = () => ({
  expo: {
    name,
    slug,
    scheme: process.env.REDIRECT_SCHEME || 'sanctuary',
    platforms: ['ios', 'android'],
    ios: {
      bundleIdentifier: process.env.BUNDLE_ID || 'com.featherweight.sanctuary'
    },
    android: {
      package: process.env.ANDROID_PACKAGE || 'com.featherweight.sanctuary'
    },
    extra: {
      apiUrl: process.env.API_URL || 'https://featherweight.world',
      wssUrl: process.env.WSS_URL || 'wss://ws.featherweight.world/ws/unified-chat',
      devLoginEnabled: process.env.DEV_LOGIN_ENABLED ? process.env.DEV_LOGIN_ENABLED === 'true' : true,
      auth: {
        issuer: process.env.AUTH_ISSUER || 'https://auth.featherweight.world/realms/featherweight',
        clientId: process.env.AUTH_CLIENT_ID || 'sanctuary-mobile',
        scopes: ['openid', 'profile', 'email'],
        redirectScheme: process.env.REDIRECT_SCHEME || 'sanctuary'
      }
    }
  }
});
