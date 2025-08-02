import { useEffect, useRef, useState } from "react";

export type UnifiedChatWSOptions = {
  onChunk?: (chunk: string) => void;
  onEnd?: () => void;
  onError?: (errMsg: string) => void;
};

export function useUnifiedChatWS(opts: UnifiedChatWSOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const [readyState, setReadyState] = useState<number>(WebSocket.CLOSED);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    setConnecting(true);
    const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const ws = new WebSocket(`${proto}://${window.location.host}/ws/unified-chat`);
    wsRef.current = ws;

    ws.onopen = () => {
      setReadyState(WebSocket.OPEN);
      setConnecting(false);
    };
    ws.onclose = () => {
      setReadyState(WebSocket.CLOSED);
      setConnecting(false);
    };
    ws.onerror = () => {
      setReadyState(WebSocket.CLOSED);
      setConnecting(false);
      if (opts.onError) opts.onError("WebSocket error");
    };
    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.type === "chunk" && opts.onChunk) {
          opts.onChunk(msg.content);
        } else if (msg.type === "end" && opts.onEnd) {
          opts.onEnd();
        } else if (msg.type === "error" && opts.onError) {
          opts.onError(msg.message);
        }
      } catch {}
    };

    return () => {
      ws.close();
    };
    // eslint-disable-next-line
  }, []);

  function sendMessage(message: string): boolean {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return false;
    try {
      ws.send(JSON.stringify({ message }));
      return true;
    } catch {
      return false;
    }
  }

  return {
    sendMessage,
    readyState,
    connecting,
  };
}