import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import { getSettings } from './settings';
import { useStore } from '../store';

export async function startAuth() {
  const redirectUri = `${CONFIG.auth.redirectScheme}://auth`;
  const { auth } = getSettings();
  const redirect = `${auth.redirectScheme}://auth`;
  const discovery = await AuthSession.fetchDiscoveryAsync(auth.issuer);
  const req = new AuthSession.AuthRequest({
    clientId: auth.clientId,
    redirectUri: redirect,
    scopes: auth.scopes,
    responseType: AuthSession.ResponseType.Token,
    usePKCE: true
  });
  const result = await req.promptAsync(discovery, { useProxy: false });
  if (result.type === 'success' && result.authentication?.accessToken) {
    const jwt = result.authentication.accessToken;
    await SecureStore.setItemAsync('jwt', jwt);
    useStore.getState().setJwt(jwt);
  }
}

export async function loadAuth() {
  const jwt = await SecureStore.getItemAsync('jwt');
  if (jwt) useStore.getState().setJwt(jwt);
}

// Dev helper: request a token from /login (API must accept it)
export async function devLogin() {
  try {
    const res = await fetch(`${getSettings().apiUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: 'mobile-dev' })
    });
    const data = await res.json();
    if (data && data.token) {
      await SecureStore.setItemAsync('jwt', data.token);
      useStore.getState().setJwt(data.token);
      return true;
    }
  } catch (e) {
    // ignore
  }
  return false;
}
