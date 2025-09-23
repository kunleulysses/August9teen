import Constants from 'expo-constants';

const extra: any = (Constants as any).expoConfig?.extra || {};

export const CONFIG = {
  apiUrl: extra.apiUrl || 'https://YOUR_API_HOST',
  wssUrl: extra.wssUrl || 'wss://YOUR_API_HOST/ws/unified-chat',
  auth: {
    issuer: extra.auth?.issuer,
    clientId: extra.auth?.clientId,
    scopes: extra.auth?.scopes || ['openid', 'profile', 'email'],
    redirectScheme: extra.auth?.redirectScheme || 'sanctuary'
  }
};

