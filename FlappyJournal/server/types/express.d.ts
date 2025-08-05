// /opt/featherweight/FlappyJournal/server/types/express.d.ts
import { JwtPayload } from 'jsonwebtoken';
import WebSocket from 'ws';

declare module 'http' {
  interface IncomingMessage {
    auth?: JwtPayload | { sub: string; roles: string[] };
    trackConnection?: (ws: WebSocket) => void;
    user?: any;
  }
}

declare module 'ws' {
  interface WebSocket {
    user?: any;
  }
}