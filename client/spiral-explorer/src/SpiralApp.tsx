import React, { useEffect, useState } from 'react';
import * as THREE from 'three';

interface NodeData {
  id: string;
  x: number;
  y: number;
  z: number;
  tenantId: string;
  type: string;
  depth: string;
  resonance: number;
  lastAccessed: string;
}

const colors: Record<string, string> = {
  public: '#888',
  tenantA: '#4f8',
  tenantB: '#8af',
  tenantC: '#f84'
};

function SpiralCanvas({ nodes, onSelect }: { nodes: NodeData[], onSelect: (n: NodeData) => void }) {
  const ref = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    // Clear previous scene
    ref.current.innerHTML = '';
    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 50;
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(400, 400);
    ref.current.appendChild(renderer.domElement);

    // Nodes
    nodes.forEach(node => {
      const geom = new THREE.SphereGeometry(0.7, 12, 12);
      const mat = new THREE.MeshBasicMaterial({ color: colors[node.tenantId] || '#f8f' });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(node.x, node.y, node.z);
      mesh.userData = node;
      scene.add(mesh);
    });

    // Raycaster for click
    function onClick(event: MouseEvent) {
      const rect = renderer.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / 400) * 2 - 1,
        -((event.clientY - rect.top) / 400) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);
      if (intersects.length > 0) {
        const node: NodeData = intersects[0].object.userData;
        onSelect(node);
      }
    }
    renderer.domElement.addEventListener('click', onClick);

    // Animate
    function animate() {
      scene.rotation.y += 0.0025;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();

    return () => {
      renderer.domElement.remove();
    };
  }, [nodes, onSelect]);
  return <div ref={ref} />;
}

export default function SpiralApp() {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [selected, setSelected] = useState<NodeData | null>(null);

  useEffect(() => {
    fetch('/api/spiral')
      .then(r => r.json())
      .then(j => setNodes(j.nodes));
    // TODO: websocket live updates
  }, []);

  return (
    <div style={{ display: 'flex', gap: 24, padding: 24 }}>
      <SpiralCanvas nodes={nodes} onSelect={setSelected} />
      <div style={{ minWidth: 240, fontFamily: 'monospace' }}>
        <h2>Node Info</h2>
        {selected ? (
          <pre>
            id: {selected.id}
            {'\n'}type: {selected.type}
            {'\n'}depth: {selected.depth}
            {'\n'}tenant: {selected.tenantId}
            {'\n'}resonance: {selected.resonance?.toFixed(3)}
            {'\n'}lastAccessed: {selected.lastAccessed}
          </pre>
        ) : (
          <span>Click a node</span>
        )}
      </div>
    </div>
  );
}