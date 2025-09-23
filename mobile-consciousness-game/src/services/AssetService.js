import manifestLocal from '../assets/manifest.json';

function toHttp(url) {
  if (!url) return '';
  if (url.startsWith('wss://')) return url.replace(/^wss:\/\//,'https://');
  if (url.startsWith('ws://')) return url.replace(/^ws:\/\//,'http://');
  return url;
}

export async function loadAssetManifest(baseWsUrl) {
  const http = toHttp(baseWsUrl || '');
  if (http) {
    try {
      const res = await fetch(`${http}/api/game/assets`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.manifest) return data.manifest;
      }
    } catch {}
  }
  return manifestLocal;
}

