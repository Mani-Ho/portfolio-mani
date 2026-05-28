import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Orb — the site's single focal 3D moment, sitting behind Contact.
 * Icosahedral sphere with a custom shader:
 *  - Vertex displacement via animated 3D simplex noise
 *  - Fragment side: fresnel + depth gradient + accent glow
 *  - Interaction: drag to orbit, click to pulse
 * Framed by the 4 CSS rings + 60 SVG tick-marks (kept from the original design).
 */
export default function Orb() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const size = 340;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 3.5;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(size, size, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // detail 24 still resolves the noise ridges with ~4x fewer triangles than 48
    const geo = new THREE.IcosahedronGeometry(1, 24);

    const uniforms = {
      uTime: { value: 0 },
      uPulse: { value: 0 },
      uAccent: { value: new THREE.Color('#5ec6f7') },
    };

    const vertexShader = /* glsl */ `
      uniform float uTime;
      uniform float uPulse;
      varying vec3 vNormal;
      varying vec3 vPos;
      varying float vDisp;

      // Simplex 3D noise — Ashima Arts
      vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
      vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
      vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
      vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
      float snoise(vec3 v){
        const vec2 C=vec2(1.0/6.0,1.0/3.0);
        const vec4 D=vec4(0.0,0.5,1.0,2.0);
        vec3 i=floor(v+dot(v,C.yyy));
        vec3 x0=v-i+dot(i,C.xxx);
        vec3 g=step(x0.yzx,x0.xyz);
        vec3 l=1.0-g;
        vec3 i1=min(g.xyz,l.zxy);
        vec3 i2=max(g.xyz,l.zxy);
        vec3 x1=x0-i1+C.xxx;
        vec3 x2=x0-i2+C.yyy;
        vec3 x3=x0-D.yyy;
        i=mod289(i);
        vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
        float n_=0.142857142857;
        vec3 ns=n_*D.wyz-D.xzx;
        vec4 j=p-49.0*floor(p*ns.z*ns.z);
        vec4 x_=floor(j*ns.z);
        vec4 y_=floor(j-7.0*x_);
        vec4 xx=x_*ns.x+ns.yyyy;
        vec4 yy=y_*ns.x+ns.yyyy;
        vec4 h=1.0-abs(xx)-abs(yy);
        vec4 b0=vec4(xx.xy,yy.xy);
        vec4 b1=vec4(xx.zw,yy.zw);
        vec4 s0=floor(b0)*2.0+1.0;
        vec4 s1=floor(b1)*2.0+1.0;
        vec4 sh=-step(h,vec4(0.0));
        vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
        vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
        vec3 p0=vec3(a0.xy,h.x);
        vec3 p1=vec3(a0.zw,h.y);
        vec3 p2=vec3(a1.xy,h.z);
        vec3 p3=vec3(a1.zw,h.w);
        vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
        p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
        vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
        m=m*m;
        return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
      }

      void main(){
        float n  = snoise(position * 1.4 + vec3(uTime * 0.35));
        float n2 = snoise(position * 3.8 + vec3(uTime * 0.7));
        float disp = n * 0.18 + n2 * 0.05 + uPulse * 0.18;
        vec3 pos = position + normal * disp;
        vNormal = normalize(normalMatrix * normal);
        vPos = pos;
        vDisp = disp;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const fragmentShader = /* glsl */ `
      uniform vec3 uAccent;
      uniform float uTime;
      uniform float uPulse;
      varying vec3 vNormal;
      varying vec3 vPos;
      varying float vDisp;

      void main(){
        vec3 viewDir = vec3(0.0, 0.0, 1.0);
        float fres = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.5);

        vec3 deep = vec3(0.04, 0.06, 0.12);
        vec3 mid  = mix(deep, uAccent * 0.65, 0.5);
        float depth = smoothstep(-1.0, 1.0, vPos.z);

        vec3 col = mix(deep, mid, depth);
        col += uAccent * fres * (1.0 + uPulse * 1.8);
        col += uAccent * 0.06 * sin(uTime * 1.5 + vPos.y * 4.0);
        col += vec3(vDisp * 0.4); // highlight the displacement ridges
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: false,
    });

    const sphere = new THREE.Mesh(geo, mat);
    scene.add(sphere);

    // ---- Interaction: drag to orbit, click to pulse
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let rotX = 0;
    let rotY = 0;
    let pulse = 0;

    const onDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
    };
    const onMove = (e: PointerEvent) => {
      if (!isDragging) return;
      targetRotY += (e.clientX - prevX) * 0.005;
      targetRotX += (e.clientY - prevY) * 0.005;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onUp = (e: PointerEvent) => {
      try {
        if (canvas.hasPointerCapture(e.pointerId)) {
          canvas.releasePointerCapture(e.pointerId);
        }
      } catch {
        /* noop */
      }
      isDragging = false;
    };
    const onClick = () => {
      pulse = 1;
    };

    const clock = new THREE.Clock();
    let t = 0;
    let rafId = 0;
    let running = false;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      t += clock.getDelta();
      uniforms.uTime.value = t;
      pulse *= 0.94;
      uniforms.uPulse.value = pulse;
      rotX += (targetRotX - rotX) * 0.08;
      rotY += (targetRotY - rotY) * 0.08;
      sphere.rotation.x = rotX + Math.sin(t * 0.2) * 0.05;
      sphere.rotation.y = rotY + t * 0.12;
      renderer.render(scene, camera);
    };

    // Only render while on-screen — saves GPU/battery when scrolled away.
    const start = () => {
      if (running) return;
      running = true;
      clock.start(); // reset delta so rotation doesn't jump after a pause
      rafId = requestAnimationFrame(animate);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(rafId);
    };

    renderer.render(scene, camera); // initial static frame

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let io: IntersectionObserver | null = null;

    if (!reduced) {
      canvas.addEventListener('pointerdown', onDown);
      canvas.addEventListener('pointermove', onMove);
      canvas.addEventListener('pointerup', onUp);
      canvas.addEventListener('pointercancel', onUp);
      canvas.addEventListener('click', onClick);

      io = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) start();
          else stop();
        },
        { threshold: 0.01 },
      );
      io.observe(wrap);
    }

    return () => {
      stop();
      io?.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      canvas.removeEventListener('click', onClick);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, []);

  const ticks = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className="orb-wrap" ref={wrapRef}>
      <div className="orb-ring r1" />
      <div className="orb-ring r2" />
      <div className="orb-ring r3" />
      <div className="orb-ring r4" />

      <svg className="orb-ticks" viewBox="0 0 540 540" aria-hidden="true">
        {ticks.map((i) => {
          const a = (i / 60) * Math.PI * 2;
          const r1 = 268;
          const r2 = i % 5 === 0 ? 256 : 262;
          return (
            <line
              key={i}
              x1={270 + Math.cos(a) * r1}
              y1={270 + Math.sin(a) * r1}
              x2={270 + Math.cos(a) * r2}
              y2={270 + Math.sin(a) * r2}
              stroke="#5ec6f7"
              strokeOpacity={i % 5 === 0 ? 0.7 : 0.3}
              strokeWidth={1}
            />
          );
        })}
      </svg>

      <canvas ref={canvasRef} className="orb-canvas" width={340} height={340} />

      <div className="orb-label top">◆ DRAG · CLICK</div>
      <div className="orb-label bot">SHADER · GLSL · 60FPS</div>
    </div>
  );
}
