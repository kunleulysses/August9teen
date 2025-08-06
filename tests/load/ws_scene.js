import ws from 'k6/ws';
import { check } from 'k6';
import { Trend } from 'k6/metrics';

export const options = {
  vus: 1000,
  duration: '10s',
  thresholds: {
    frame_drop_pct: ['avg<0.1'],
  },
};

const frameDropPct = new Trend('frame_drop_pct');

export default function () {
  const url = __ENV.WS_URL || 'ws://localhost:8080/ws';

  const res = ws.connect(url, (socket) => {
    let sent = 0;
    let received = 0;

    socket.on('open', () => {
      socket.setInterval(() => {
        socket.send('frame');
        sent += 1;
        if (sent >= 100) {
          socket.close();
        }
      }, 100); // 10 fps
    });

    socket.on('message', () => {
      received += 1;
    });

    socket.on('close', () => {
      const drop = sent ? ((sent - received) / sent) * 100 : 0;
      frameDropPct.add(drop);
    });
  });

  check(res, { 'status is 101': (r) => r && r.status === 101 });
}
