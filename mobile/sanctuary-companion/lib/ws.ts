import { getSettings } from './settings';

export function connectStream(jwt: string): WebSocket {
  // Token via subprotocol; server reads sec-websocket-protocol
  return new WebSocket(getSettings().wssUrl, jwt);
}

export function sendUserMessage(jwt: string, message: string) {
  // Open a transient WS to send a single message if no persistent is available
  const ws = connectStream(jwt);
  ws.onopen = () => {
    ws.send(JSON.stringify({ message }));
    setTimeout(() => ws.close(), 100);
  };
}

export function sendAct(jwt: string, action: string) {
  const ws = connectStream(jwt);
  ws.onopen = () => {
    ws.send(JSON.stringify({ type: 'act', action }));
    setTimeout(() => ws.close(), 100);
  };
}
