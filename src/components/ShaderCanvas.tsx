"use client";
import { useEffect, useRef, useCallback } from "react";

const CHARS = "!<>-_\\/[]{}=+*^?#@&ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Mounts a mouse-reactive GLSL ripple shader as a full-screen canvas
 * behind everything (z-index: 2). Cyan ripples emanate from cursor.
 */
export default function ShaderCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const animId = useRef(0);

  const setupGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    // Vertex shader — a full-screen quad
    const vsrc = `
      attribute vec2 a_pos;
      void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
    `;

    // Fragment shader — mouse-reactive cyan ripple
    const fsrc = `
      precision mediump float;
      uniform float uTime;
      uniform vec2  uMouse;
      uniform vec2  uRes;

      void main() {
        vec2 uv  = gl_FragCoord.xy / uRes;
        vec2 asp = vec2(uRes.x / uRes.y, 1.0);

        // Mouse ripple
        float d  = length((uv - uMouse) * asp);
        float w  = sin(d * 38.0 - uTime * 3.2) * exp(-d * 5.0);

        // Ambient center pulse
        float cd = length((uv - 0.5) * asp);
        float ca = sin(cd * 22.0 - uTime * 1.4) * exp(-cd * 6.0) * 0.45;

        float total = clamp((w + ca) * 0.10, 0.0, 1.0);

        // Cyan with subtle indigo tint
        vec3 col = mix(vec3(0.22, 0.74, 0.97), vec3(0.45, 0.45, 0.98), d) * total;
        gl_FragColor = vec4(col, total * 0.85);
      }
    `;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src); gl.compileShader(s); return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vsrc));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fsrc));
    gl.linkProgram(prog); gl.useProgram(prog);

    // Full-screen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime  = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uRes   = gl.getUniformLocation(prog, "uRes");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    const tick = () => {
      t += 0.016;
      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, mouse.current.x, mouse.current.y);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animId.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId.current);
    };
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const c = canvasRef.current;
      if (!c) return;
      mouse.current = { x: e.clientX, y: c.height - e.clientY };
    };
    window.addEventListener("mousemove", onMove);
    const cleanup = setupGL();
    return () => {
      window.removeEventListener("mousemove", onMove);
      cleanup?.();
    };
  }, [setupGL]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 2 }}
    />
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// TEXT SCRAMBLE — exported as a hook
// ──────────────────────────────────────────────────────────────────────────────
export function useScramble(target: string, delay = 0, speed = 28) {
  const output = useRef(target.replace(/./g, "?"));
  const setters = useRef<Array<(v: string) => void>>([]);
  const isRunning = useRef(false);

  const subscribe = useCallback((setter: (v: string) => void) => {
    setters.current.push(setter);
    return () => { setters.current = setters.current.filter(s => s !== setter); };
  }, []);

  const emit = (val: string) => { output.current = val; setters.current.forEach(s => s(val)); };

  useEffect(() => {
    if (isRunning.current) return;
    isRunning.current = true;
    let iter = 0;
    let id: ReturnType<typeof setTimeout>;

    const go = () => {
      emit(
        target.split("").map((ch, idx) => {
          if (ch === " ") return " ";
          if (idx < iter) return ch;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join("")
      );
      if (iter < target.length) {
        iter += 0.45;
        id = setTimeout(go, speed);
      }
    };

    const startId = setTimeout(go, delay);
    return () => { clearTimeout(startId); clearTimeout(id); };
  }, [target, delay, speed]);

  return { subscribe, current: output };
}
