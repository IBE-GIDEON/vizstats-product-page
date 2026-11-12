"use client";

import { useEffect, useRef } from "react";

/**
 * Soft volumetric clouds — domain-warped fBm on a fullscreen triangle.
 * Rendered at low resolution (clouds are soft anyway) and paused off-screen.
 *
 *  variant "frame": clouds gather at the edges and bottom, leaving a clear centre for a title.
 *  variant "bank":  a cloud bank that thickens toward the bottom — used to dissolve one section into the next.
 */
type Props = {
  variant?: "frame" | "bank";
  className?: string;
  /** Render scale relative to CSS pixels. */
  resolution?: number;
  /** Overall cloud brightness. */
  intensity?: number;
  /** Stop drawing (e.g. while faded out) without tearing down the GL context. */
  paused?: boolean;
};

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uVariant;
uniform float uIntensity;
uniform vec3 uAsh;
uniform vec3 uGreen;

float hash(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 6; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y) * 2.1;
  p += uMouse * 0.06;
  float t = uTime * 0.03;

  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - vec2(t * 0.7, 0.0)));
  vec2 r = vec2(fbm(p + 1.7 * q + vec2(1.7, 9.2) + vec2(t * 0.5, 0.0)),
                fbm(p + 1.7 * q + vec2(8.3, 2.8) - vec2(0.0, t * 0.4)));
  float f = fbm(p + 1.6 * r);

  float mask;
  if (uVariant < 0.5) {
    vec2 c = uv - vec2(0.5, 0.54);
    c.x *= aspect * 0.5;
    float d = length(c);
    mask = smoothstep(0.16, 0.6, d);
    mask = max(mask, smoothstep(0.45, 0.0, uv.y));
  } else {
    mask = smoothstep(0.95, 0.1, uv.y);
  }

  float density = smoothstep(0.42, 0.82, f * (0.6 + 0.7 * mask)) * mask;

  // Cheap lighting: compare against a sample nudged toward a light at the top.
  float f2 = fbm(p + 1.6 * r + vec2(-0.035, 0.05));
  float light = clamp((f2 - f) * 7.0 + 0.5, 0.0, 1.0);
  vec3 col = mix(uAsh * 0.08, uAsh * 0.55, light);
  col = mix(col, uAsh * 0.8, smoothstep(0.72, 1.0, f) * 0.5);

  // Faint green underglow, strongest low in the frame.
  float under = smoothstep(0.6, 0.0, uv.y) * smoothstep(0.35, 0.85, r.y);
  col += uGreen * under * 0.2;

  float a = clamp(density * uIntensity, 0.0, 1.0);
  gl_FragColor = vec4(col * a, a);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn("CloudShader:", gl.getShaderInfoLog(s));
  }
  return s;
}

export default function CloudShader({
  variant = "frame",
  className,
  resolution = 0.5,
  intensity = 1,
  paused = false,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) return;

    const prog = gl.createProgram()!;
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(prog, name);
    const uRes = u("uRes");
    const uTime = u("uTime");
    const uMouse = u("uMouse");
    gl.uniform1f(u("uVariant"), variant === "frame" ? 0 : 1);
    gl.uniform1f(u("uIntensity"), intensity);
    gl.uniform3f(u("uAsh"), 0.765, 0.78, 0.77);
    gl.uniform3f(u("uGreen"), 0.21, 0.9, 0.69);

    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * resolution));
      const h = Math.max(1, Math.round(canvas.clientHeight * resolution));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.tx = e.clientX / window.innerWidth - 0.5;
      mouse.ty = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let visible = false;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);

    const seed = 40 + Math.random() * 40;
    const start = performance.now();
    let raf = 0;
    const draw = (time: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.03;
      mouse.y += (mouse.ty - mouse.y) * 0.03;
      gl.uniform1f(uTime, seed + time);
      gl.uniform2f(uMouse, mouse.x, -mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden || pausedRef.current) return;
      draw((performance.now() - start) / 1000);
    };
    if (reduced) draw(0);
    else loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      // Free GPU objects but keep the context: the canvas may be re-initialised
      // (React dev remounts effects) and a lost context can't be recovered.
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [variant, resolution, intensity]);

  return <canvas ref={ref} aria-hidden className={className} />;
}
