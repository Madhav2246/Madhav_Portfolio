"use client";
import { useEffect, useRef } from "react";

interface Shape3D {
  type: "cube" | "octahedron" | "pyramid";
  x: number;
  y: number;
  z: number;
  size: number;
  rx: number;
  ry: number;
  rz: number;
  drx: number;
  dry: number;
  speedY: number;
  opacity: number;
  isTranslucent: boolean;
}

export default function NeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    let animId: number;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Cube vertices
    const cubeVertices = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1],
    ];
    const cubeEdges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];

    // Octahedron vertices
    const octaVertices = [
      [0, -1, 0], [1, 0, 0], [0, 0, 1], [-1, 0, 0], [0, 0, -1], [0, 1, 0]
    ];
    const octaEdges = [
      [0, 1], [0, 2], [0, 3], [0, 4],
      [5, 1], [5, 2], [5, 3], [5, 4],
      [1, 2], [2, 3], [3, 4], [4, 1]
    ];

    // Instantiate 14 floating 3D shapes across background depth
    const shapes: Shape3D[] = Array.from({ length: 14 }, (_, i) => ({
      type: i % 3 === 0 ? "cube" : i % 3 === 1 ? "octahedron" : "pyramid",
      x: Math.random() * W,
      y: Math.random() * H,
      z: Math.random() * 400 + 100,
      size: Math.random() * 20 + 18,
      rx: Math.random() * Math.PI,
      ry: Math.random() * Math.PI,
      rz: Math.random() * Math.PI,
      drx: (Math.random() - 0.5) * 0.008,
      dry: (Math.random() - 0.5) * 0.012,
      speedY: Math.random() * 0.35 + 0.15,
      opacity: Math.random() * 0.18 + 0.07,
      isTranslucent: i % 2 === 0,
    }));

    // Ambient background dust nodes
    const nodes = Array.from({ length: 35 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      r: Math.random() * 1.5 + 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // 1. Draw ambient node network connections
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            const alpha = 0.08 * (1 - dist / 140);
            ctx.strokeStyle = `rgba(212, 168, 71, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // 2. Render tumbling 3D shapes (opaque, translucent, wireframe)
      shapes.forEach((s) => {
        s.y += s.speedY;
        s.rx += s.drx;
        s.ry += s.dry;

        if (s.y > H + 50) {
          s.y = -50;
          s.x = Math.random() * W;
        }

        const verts = s.type === "octahedron" ? octaVertices : cubeVertices;
        const edges = s.type === "octahedron" ? octaEdges : cubeEdges;

        const cosX = Math.cos(s.rx);
        const sinX = Math.sin(s.rx);
        const cosY = Math.cos(s.ry);
        const sinY = Math.sin(s.ry);

        const proj: [number, number][] = [];

        for (const [vx, vy, vz] of verts) {
          // Rotate Y
          const x1 = vx * cosY - vz * sinY;
          const z1 = vx * sinY + vz * cosY;

          // Rotate X
          const y2 = vy * cosX - z1 * sinX;
          const z2 = vy * sinX + z1 * cosX;

          const distance = 4.0;
          const sz = z2 + distance;
          const px = s.x + (x1 * s.size * 3.5) / sz;
          const py = s.y + (y2 * s.size * 3.5) / sz;

          proj.push([px, py]);
        }

        // Draw translucent shape fill
        if (s.isTranslucent) {
          ctx.fillStyle = `rgba(212, 168, 71, ${s.opacity * 0.4})`;
          ctx.beginPath();
          ctx.moveTo(proj[0][0], proj[0][1]);
          for (let i = 1; i < Math.min(4, proj.length); i++) {
            ctx.lineTo(proj[i][0], proj[i][1]);
          }
          ctx.closePath();
          ctx.fill();
        }

        // Draw wireframe edges
        ctx.strokeStyle = `rgba(240, 234, 214, ${s.opacity})`;
        ctx.lineWidth = 0.9;

        for (const [start, end] of edges) {
          if (proj[start] && proj[end]) {
            ctx.beginPath();
            ctx.moveTo(proj[start][0], proj[start][1]);
            ctx.lineTo(proj[end][0], proj[end][1]);
            ctx.stroke();
          }
        }
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", opacity: 0.7, pointerEvents: "none" }}
    />
  );
}
