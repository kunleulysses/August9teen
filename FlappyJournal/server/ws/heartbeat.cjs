module.exports.attachHeartbeat = (ws, { interval = 30000, maxMissed = 2 }) => {
  let missed = 0;
  const iv = setInterval(() => {
    if (missed >= maxMissed) {
      ws.close(4001, 'ping_timeout');
      clearInterval(iv);
      return;
    }
    missed++;
    ws.ping();
  }, interval);
  ws.on('pong', () => {
    missed = 0;
  });
  ws.on('close', () => {
    clearInterval(iv);
  });
};