// Homepage-grade heart background with code/frost shader
(function initSharedHeartBackground(){
  const CDN_THREE = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  const CDN_GLTF = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js';

  function loadScript(src){
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src; s.async = true; s.onload = resolve; s.onerror = reject; document.head.appendChild(s);
    });
  }

  async function ensureThree(){
    if (!window.THREE) await loadScript(CDN_THREE);
    if (!window.THREE) throw new Error('THREE failed to load');
    if (!THREE.GLTFLoader) await loadScript(CDN_GLTF);
    if (!THREE.GLTFLoader) throw new Error('GLTFLoader failed to load');
  }

  function ensureCanvas(){
    let canvas = document.getElementById('heartBackgroundCanvas');
    if (!canvas){
      canvas = document.createElement('canvas');
      canvas.id = 'heartBackgroundCanvas';
      document.body.insertBefore(canvas, document.body.firstChild);
    }
    return canvas;
  }

  // Lightweight header heart initializer (small, centered, reuses shader)
  function initHeaderHeart(targetId){
    if (!window.THREE) return;
    const tgt = document.getElementById(targetId);
    if (!tgt) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ canvas: tgt, alpha: true, antialias: true });
    renderer.setSize(tgt.clientWidth, tgt.clientHeight);
    const loader = new THREE.GLTFLoader();
    let heart = null;

    // Reuse main shader if present, else basic fallback
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }, scrollDepth: { value: 0 },
        resolution: { value: new THREE.Vector2(tgt.clientWidth, tgt.clientHeight) },
        lightDir1: { value: new THREE.Vector3(0.6,0.5,0.2).normalize() },
        lightDir2: { value: new THREE.Vector3(-0.4,0.3,-0.7).normalize() },
        fogColor: { value: new THREE.Color(0x000000) }, fogDensity: { value: 0.0 }, pulse: { value: 0.0 }
      },
      vertexShader: `varying vec3 vWorldPosition; varying vec3 vNormal; varying vec3 vViewPosition; varying float vDepth; void main(){ vNormal = normalize(normalMatrix*normal); vec4 wp = modelMatrix*vec4(position,1.0); vWorldPosition=wp.xyz; vec4 vp=modelViewMatrix*vec4(position,1.0); vViewPosition=vp.xyz; vDepth=-vp.z; gl_Position=projectionMatrix*vp; }`,
      fragmentShader: `varying vec3 vWorldPosition; varying vec3 vNormal; uniform float time; uniform vec3 lightDir1; uniform vec3 lightDir2; uniform float pulse; vec3 col(vec3 N){ float nl1=max(0.0,dot(N,normalize(lightDir1))); float nl2=max(0.0,dot(N,normalize(lightDir2))); float sss=pow(nl1,1.4)*0.6+pow(nl2,2.0)*0.4; vec3 base=vec3(0.1,0.2,0.25)+vec3(1.0,0.2,0.25)*sss*(0.35*(0.9+0.1*sin(time*1.2))); return base; } void main(){ vec3 N=normalize(vNormal); vec3 c=col(N); gl_FragColor=vec4(c,0.85); }`,
      transparent: true, side: THREE.DoubleSide
    });

    loader.load('/realistic_human_heart.glb', (g)=>{
      heart = g.scene; heart.traverse(ch=>{ if (ch.isMesh) ch.material = material; });
      heart.scale.setScalar(1.2); heart.rotation.x = Math.PI*0.06; scene.add(heart);
      camera.position.z = 3.3;
    });

    function animate(){ requestAnimationFrame(animate); if (heart) heart.rotation.y += 0.002; material.uniforms.time.value += 0.016; renderer.render(scene, camera); }
    animate();
  }

  function init(){
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const canvas = ensureCanvas();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const ambient = new THREE.AmbientLight(0x404040, 0.35); scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 0.6); dir.position.set(2,2,3); scene.add(dir);

    const loader = new THREE.GLTFLoader();
    let heartModel = null;

    // Shader material (trimmed from homepage for shared usage)
    let shaderMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        scrollDepth: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        lightDir1: { value: new THREE.Vector3(0.6, 0.5, 0.2).normalize() },
        lightDir2: { value: new THREE.Vector3(-0.4, 0.3, -0.7).normalize() },
        fogColor: { value: new THREE.Color(0x001018) },
        fogDensity: { value: 0.035 },
        pulse: { value: 0.0 },
      },
      vertexShader: `
        varying vec2 vUv; varying vec3 vNormal; varying vec3 vWorldPosition; varying vec3 vViewPosition; varying float vDepth;
        void main(){ vUv = uv; vNormal = normalize(normalMatrix * normal); vec4 wp = modelMatrix * vec4(position,1.0); vWorldPosition = wp.xyz; vec4 vp = modelViewMatrix * vec4(position,1.0); vViewPosition = vp.xyz; vDepth = -vp.z; gl_Position = projectionMatrix * vp; }
      `,
      fragmentShader: `
        varying vec2 vUv; varying vec3 vNormal; varying vec3 vWorldPosition; varying vec3 vViewPosition; varying float vDepth;
        uniform float time; uniform float scrollDepth; uniform vec2 resolution; uniform vec3 lightDir1; uniform vec3 lightDir2; uniform vec3 fogColor; uniform float fogDensity; uniform float pulse;
        float rand(vec2 st){ return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); }
        float noise(vec2 st){ vec2 i=floor(st); vec2 f=fract(st); float a=rand(i); float b=rand(i+vec2(1.0,0.0)); float c=rand(i+vec2(0.0,1.0)); float d=rand(i+vec2(1.0,1.0)); vec2 u=f*f*(3.0-2.0*f); return mix(a,b,u.x)+(c-a)*u.y*(1.0-u.x)+(d-b)*u.x*u.y; }
        float digit(vec2 uv, int num){ uv = fract(uv); float d = 1e10; if(num==0){ vec2 c=vec2(0.5); float o=length(uv-c)-0.35; float inr=length(uv-c)-0.2; d=max(o,-inr);} else if(num==1){ d=abs(uv.x-0.5)-0.05;} return 1.0 - smoothstep(0.0, 0.02, d); }
        float renderChar(vec2 uv,float seed){ vec2 grid=fract(uv*40.0); vec2 id=floor(uv*40.0); float r=rand(id+seed); int t=int(r*10.0); float ch=0.0; if(t<5){ ch=digit(grid,t);} else if(t<8){ ch=step(0.5, rand(grid+seed)) * step(0.3, sin(grid.x*20.0)) * step(0.3, sin(grid.y*20.0)); } else { float sym=0.0; sym+=step(0.7, sin(grid.x*15.0+grid.y*15.0)); sym+=step(0.8, cos(grid.x*25.0)*sin(grid.y*25.0)); ch=sym;} return ch; }
        float frostPattern(vec2 uv,float intensity){ vec2 st=uv*8.0; float f=0.0; for(int i=0;i<4;i++){ float sc=pow(2.0,float(i)); vec2 fu=st*sc; float cry=abs(sin(fu.x*3.14159))*abs(sin(fu.y*3.14159)); cry=pow(cry,2.0+intensity*3.0); vec2 hex=fu; hex.x*=0.57735*2.0; hex.y+=mod(floor(hex.x),2.0)*0.5; hex=abs((mod(hex,1.0)-0.5)); float hexp=abs(max(hex.x*1.5+hex.y, hex.y*2.0)-1.0); f+=cry*hexp*(1.0/sc);} return f*intensity; }
        vec3 rain(vec2 uv){ vec3 col=vec3(0.0); for(int i=0;i<6;i++){ float L=float(i); vec2 ruv=uv; float sp=1.0+L*0.3; ruv.y+=time*sp; ruv.x+=sin(time*0.5+L)*0.1; float ch=renderChar(ruv,L+time*0.1); float trail=smoothstep(0.0,0.4,fract(ruv.y)); trail*=smoothstep(1.0,0.6,fract(ruv.y)); trail=pow(trail,1.5); float inten=(1.0-L*0.12)*trail; vec3 layer=(ch>0.9?vec3(1.0):ch>0.7?vec3(0.8,1.0,0.9):ch>0.5?vec3(0.0,0.9,0.6):vec3(0.0,0.6,0.8)); col+=layer*ch*inten;} return col; }
        void main(){ vec2 uv=vUv; vec2 wuv=vWorldPosition.xy*0.3+0.5; vec3 code=rain(wuv); float frost=frostPattern(uv, scrollDepth*0.8); float depth=clamp(vDepth/20.0,0.0,1.0); vec3 N=normalize(vNormal); vec3 viewDir=normalize(cameraPosition - vWorldPosition); float fresnel=pow(1.0-abs(dot(N,viewDir)),2.0); float nl1=max(0.0, dot(N, normalize(lightDir1))*0.5+0.5); float nl2=max(0.0, dot(N, normalize(lightDir2))*0.5+0.5); float sss=pow(nl1,1.5)*0.6 + pow(nl2,2.0)*0.4; sss*=mix(1.0,1.2,pulse); vec3 sssCol=vec3(1.0,0.2,0.25)*sss*0.35; float veins=noise(vWorldPosition.xy*1.6 + time*0.2); veins=smoothstep(0.55,0.95,veins); vec3 veinCol=vec3(0.9,0.1,0.2)*veins*0.25; float lit=max(0.0, dot(N, normalize(lightDir1)))*0.6 + max(0.0, dot(N, normalize(lightDir2)))*0.4; float innerShadow=(1.0-lit)*(1.0-fresnel); vec3 perf=vec3(1.0,0.08,0.12)*innerShadow*(0.06+0.22*pulse); vec3 col=code + sssCol + veinCol + perf; vec3 frostCol=vec3(0.9,0.95,1.0)*frost; col=mix(col,frostCol,frost*0.6); vec3 edge=vec3(0.3,0.8,1.0)*fresnel*(0.45+0.08*pulse); col+=edge; col=mix(col, col*vec3(0.7,0.9,1.0), depth*0.3); float viewDist=length(vViewPosition); float fog=exp2(-pow(0.035*viewDist,2.0)); col=mix(fogColor,col,clamp(fog,0.0,1.0)); float a=length(col)*(0.68+0.06*pulse); a+=frost*0.3 + fresnel*0.2; a=clamp(a,0.0,0.85); gl_FragColor=vec4(col,a); }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });

    // Load heart and apply shader
    loader.load('/realistic_human_heart.glb', (gltf) => {
      heartModel = gltf.scene;
      heartModel.traverse((child)=>{ if(child.isMesh){ child.material = shaderMat; child.castShadow = true; child.receiveShadow = true; } });
      heartModel.scale.setScalar(8.0);
      heartModel.position.set(0,0,0);
      heartModel.rotation.x = Math.PI * 0.05;
      scene.add(heartModel);
    });

    // Camera/renderer
    function onResize(){
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      shaderMat.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize, { passive: true });

    // Scroll coupling for frost
    function updateScrollDepth(){
      const body = document.scrollingElement || document.documentElement;
      const total = Math.max(1, body.scrollHeight - body.clientHeight);
      shaderMat.uniforms.scrollDepth.value = Math.min(1, (body.scrollTop || 0) / total);
    }
    document.addEventListener('scroll', updateScrollDepth, { passive: true });
    updateScrollDepth();

    // Subtle pulse
    let t0 = performance.now();
    (function animate(){
      requestAnimationFrame(animate);
      const t = performance.now();
      shaderMat.uniforms.time.value = (t - t0) / 1000;
      shaderMat.uniforms.pulse.value = 0.5 + 0.5 * Math.sin(shaderMat.uniforms.time.value * 1.2);
      if (heartModel){ heartModel.rotation.y += 0.0018; }
      renderer.render(scene, camera);
    })();
  }

  (async function start(){
    try { await ensureThree(); init(); initHeaderHeart('heroHeartCanvas'); } catch (e) { console.warn('Heart background skipped:', e && e.message); }
  })();
})();

