export function initViz(wsUrl) {
  const hb = document.getElementById('hb');
  const ctx = hb.getContext('2d');
  const shaderBox = document.getElementById('shaderBox');
  const spiralHolder = document.getElementById('spiral-holder');
  let spiralPoints = [];

  const p5Script = document.createElement('script');
  p5Script.src = 'https://unpkg.com/p5';
  document.body.appendChild(p5Script);
  p5Script.onload = () => new p5(p => {
    p.setup = () => p.createCanvas(240, 240).parent(spiralHolder);
    p.draw = () => {
      p.background(0); p.translate(120, 120); p.stroke(255); p.noFill(); p.beginShape();
      spiralPoints.forEach(pt => {
        const x = pt.r * Math.cos(pt.theta) * 15;
        const y = pt.r * Math.sin(pt.theta) * 15;
        p.vertex(x, y);
      });
      p.endShape();
    };
  });

  const ws = new WebSocket(wsUrl);
  ws.onmessage = ({ data }) => {
    const msg = JSON.parse(data);
    if (msg.type === 'heartbeat') drawPulse(ctx);
    if (msg.type === 'shader') shaderBox.className = `shader-box ${msg.shader}`;
    if (msg.type === 'thought') {
      spiralPoints.push(msg);
      if (spiralPoints.length > 500) spiralPoints.shift();
    }
  };
}

function drawPulse(ctx) {
  const img = ctx.getImageData(2, 0, 238, 60);
  ctx.putImageData(img, 0, 0);
  const y = 30 + Math.random() * 15 - 7;
  ctx.fillStyle = '#00FF88';
  ctx.fillRect(238, y, 2, 2);
}