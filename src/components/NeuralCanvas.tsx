"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function NeuralCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = window.innerWidth, H = window.innerHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 1000);
    camera.position.set(0, 0, 90);

    // ── Main large wireframe sphere ─────────────────────────────
    const mainGeo = new THREE.IcosahedronGeometry(22, 2);
    const mainMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.07,
    });
    const mainSphere = new THREE.Mesh(mainGeo, mainMat);
    mainSphere.position.set(30, 0, -10);
    scene.add(mainSphere);

    // ── Inner solid sphere (glass-like) ────────────────────────
    const innerGeo = new THREE.SphereGeometry(18, 64, 64);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x111111,
      transparent: true,
      opacity: 0.6,
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    innerSphere.position.set(30, 0, -10);
    scene.add(innerSphere);

    // ── Equatorial ring around main sphere ─────────────────────
    const ringGeo = new THREE.TorusGeometry(21, 0.25, 8, 120);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(30, 0, -10);
    ring.rotation.x = Math.PI / 5;
    scene.add(ring);

    // Second tilted ring
    const ring2Geo = new THREE.TorusGeometry(21, 0.12, 8, 120);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.08 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.position.set(30, 0, -10);
    ring2.rotation.x = -Math.PI / 3;
    ring2.rotation.y = Math.PI / 6;
    scene.add(ring2);

    // ── Orbiting small spheres ──────────────────────────────────
    const orbiters: { mesh: THREE.Mesh; speed: number; radius: number; angle: number; tilt: number; y: number }[] = [];
    const ORBIT_CONFIG = [
      { radius: 30, speed: 0.004, size: 2.2, tilt: 0.4, y: 8 },
      { radius: 36, speed: -0.0025, size: 1.4, tilt: -0.6, y: -5 },
      { radius: 42, speed: 0.0018, size: 1.0, tilt: 0.8, y: 0 },
      { radius: 26, speed: -0.006, size: 0.8, tilt: -0.3, y: 12 },
    ];

    ORBIT_CONFIG.forEach((cfg, i) => {
      const geo = new THREE.IcosahedronGeometry(cfg.size, 1);
      const mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
      });
      const mesh = new THREE.Mesh(geo, mat);
      orbiters.push({ mesh, speed: cfg.speed, radius: cfg.radius, angle: (i * Math.PI * 2) / 4, tilt: cfg.tilt, y: cfg.y });
      scene.add(mesh);
    });

    // ── Flowing particle stream ─────────────────────────────────
    const FLOW_COUNT = W < 768 ? 600 : 1200;
    const flowPositions = new Float32Array(FLOW_COUNT * 3);
    const flowData: { x: number; y: number; z: number; vx: number; vy: number; vz: number; life: number; maxLife: number }[] = [];

    for (let i = 0; i < FLOW_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 20 + Math.random() * 60;
      flowData.push({
        x: Math.cos(angle) * r,
        y: (Math.random() - 0.5) * 80,
        z: Math.sin(angle) * r * 0.4 - 10,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        vz: (Math.random() - 0.5) * 0.04,
        life: Math.random(),
        maxLife: 0.5 + Math.random() * 0.5,
      });
      flowPositions[i * 3]     = flowData[i].x;
      flowPositions[i * 3 + 1] = flowData[i].y;
      flowPositions[i * 3 + 2] = flowData[i].z;
    }

    const flowGeo = new THREE.BufferGeometry();
    flowGeo.setAttribute("position", new THREE.BufferAttribute(flowPositions, 3));

    // Per-vertex sizes for variety
    const sizes = new Float32Array(FLOW_COUNT);
    for (let i = 0; i < FLOW_COUNT; i++) sizes[i] = 0.5 + Math.random() * 1.5;
    flowGeo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const flowMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.9,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    });
    scene.add(new THREE.Points(flowGeo, flowMat));

    // ── Secondary scattered small particles ─────────────────────
    const SCATTER_COUNT = 200;
    const scatterPos = new Float32Array(SCATTER_COUNT * 3);
    for (let i = 0; i < SCATTER_COUNT; i++) {
      scatterPos[i * 3]     = (Math.random() - 0.5) * 260;
      scatterPos[i * 3 + 1] = (Math.random() - 0.5) * 160;
      scatterPos[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    const scatterGeo = new THREE.BufferGeometry();
    scatterGeo.setAttribute("position", new THREE.BufferAttribute(scatterPos, 3));
    const scatterMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.35, transparent: true, opacity: 0.18 });
    scene.add(new THREE.Points(scatterGeo, scatterMat));

    // ── Mouse tracking ──────────────────────────────────────────
    let mouseX = 0, mouseY = 0, scrollY = 0;
    const onMouse = (e: MouseEvent) => { mouseX = (e.clientX / W - 0.5) * 2; mouseY = -(e.clientY / H - 0.5) * 2; };
    const onScroll = () => { scrollY = window.scrollY; };
    document.addEventListener("mousemove", onMouse);
    window.addEventListener("scroll", onScroll, { passive: true });

    let raf = 0, t = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      t += 0.005;

      // Rotate main sphere slowly
      mainSphere.rotation.y += 0.0015;
      mainSphere.rotation.x += 0.0005;
      ring.rotation.z += 0.002;
      ring2.rotation.z -= 0.0015;
      ring2.rotation.x += 0.001;
      innerSphere.rotation.y += 0.0008;

      // Orbit small spheres
      orbiters.forEach(orb => {
        orb.angle += orb.speed;
        orb.mesh.position.set(
          30 + Math.cos(orb.angle) * orb.radius,
          orb.y + Math.sin(orb.angle * 0.7) * 6,
          -10 + Math.sin(orb.angle + orb.tilt) * orb.radius * 0.4
        );
        orb.mesh.rotation.y += orb.speed * 2;
        orb.mesh.rotation.x += orb.speed;
      });

      // Animate flow particles
      for (let i = 0; i < FLOW_COUNT; i++) {
        const d = flowData[i];
        // Gentle noise-like drift
        d.vx += (Math.random() - 0.5) * 0.005;
        d.vy += (Math.random() - 0.5) * 0.005;
        d.vx *= 0.98;
        d.vy *= 0.98;
        d.x += d.vx;
        d.y += d.vy;
        d.z += d.vz;
        d.life += 0.004;

        // Respawn when out of bounds or life over
        if (d.life > d.maxLife || Math.abs(d.x) > 140 || Math.abs(d.y) > 85) {
          const angle = Math.random() * Math.PI * 2;
          const r = 20 + Math.random() * 60;
          d.x = Math.cos(angle) * r;
          d.y = (Math.random() - 0.5) * 80;
          d.z = Math.sin(angle) * r * 0.4 - 10;
          d.vx = (Math.random() - 0.5) * 0.08;
          d.vy = (Math.random() - 0.5) * 0.08;
          d.vz = (Math.random() - 0.5) * 0.04;
          d.life = 0;
          d.maxLife = 0.5 + Math.random() * 0.5;
        }

        flowPositions[i * 3]     = d.x;
        flowPositions[i * 3 + 1] = d.y;
        flowPositions[i * 3 + 2] = d.z;
      }
      flowGeo.attributes.position.needsUpdate = true;

      // Subtle breathing scale on main sphere
      const breathe = 1 + Math.sin(t * 0.8) * 0.012;
      mainSphere.scale.setScalar(breathe);
      innerSphere.scale.setScalar(breathe * 0.98);

      // Camera parallax + scroll depth
      camera.position.x += (mouseX * 10 - camera.position.x) * 0.04;
      camera.position.y += (mouseY * 6 - camera.position.y) * 0.04;
      camera.position.z = 90 - scrollY * 0.035;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
}
