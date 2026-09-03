import { useEffect, useRef } from 'react';

interface Props {
  className?: string;
  intensity?: number;
}

export function ShaderBackground({ className = '', intensity = 1.0 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
    if (!gl) return;

    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform float u_intensity;

      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      void main() {
        vec2 uv = v_texCoord;
        vec2 center = vec2(0.5);
        vec2 p = (uv - center) * vec2(u_resolution.x / min(u_resolution.x, u_resolution.y), u_resolution.y / min(u_resolution.x, u_resolution.y));
        float d = length(p);

        // Deep cosmic void background
        vec3 color = vec3(0.02, 0.03, 0.06);

        // Procedural Star layer with blinking
        for (float i = 1.0; i < 3.5; i += 1.0) {
          vec2 starUV = uv * (80.0 * i);
          vec2 ipos = floor(starUV);
          float h = hash(ipos);
          if (h > 0.985) {
            float blink = 0.4 + 0.6 * sin(u_time * 1.5 + h * 80.0);
            float star = smoothstep(0.35, 0.0, length(fract(starUV) - 0.5));
            color += vec3(0.7, 0.9, 1.0) * star * blink * 0.7;
          }
        }

        // Pulsing orbital glow rings
        float pulse = 0.5 + 0.5 * sin(u_time * 0.6);
        float ring1 = smoothstep(0.35, 0.355, d) - smoothstep(0.365, 0.37, d);
        float ring2 = smoothstep(0.48, 0.485, d) - smoothstep(0.495, 0.50, d);
        ring1 *= (0.6 + 0.4 * pulse);
        ring2 *= (0.4 + 0.3 * sin(u_time * 0.4 + 1.5));

        // High-tech subtle coordinate grid
        float grid = step(0.985, fract(uv.x * 24.0)) + step(0.985, fract(uv.y * 24.0));

        // Color additions
        color += vec3(0.0, 0.86, 0.91) * ring1 * 0.7 * u_intensity; // Cyan Ring
        color += vec3(0.56, 0.0, 1.0) * ring2 * 0.5 * u_intensity; // Violet Ring
        color += vec3(0.3, 0.05, 0.6) * grid * 0.05 * u_intensity;  // Violet Grid

        // Soft Nebula radial bloom
        float nebula = 0.5 + 0.5 * sin(u_time * 0.2 + d * 1.8);
        color += vec3(0.0, 0.2, 0.3) * (1.0 - smoothstep(0.0, 0.6, d)) * 0.25 * nebula;

        // Vignette
        color *= clamp(1.15 - d * 0.9, 0.0, 1.0);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    function createShader(glCtx: WebGLRenderingContext, type: number, source: string) {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        console.warn(glCtx.getShaderInfoLog(shader));
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const posAttr = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const uTimeLoc = gl.getUniformLocation(program, 'u_time');
    const uResLoc = gl.getUniformLocation(program, 'u_resolution');
    const uIntensityLoc = gl.getUniformLocation(program, 'u_intensity');

    const syncSize = () => {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    syncSize();
    const ro = new ResizeObserver(syncSize);
    ro.observe(canvas);

    let animationId: number;
    const render = (time: number) => {
      if (uTimeLoc) gl.uniform1f(uTimeLoc, time * 0.001);
      if (uResLoc) gl.uniform2f(uResLoc, canvas.width, canvas.height);
      if (uIntensityLoc) gl.uniform1f(uIntensityLoc, intensity);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      ro.disconnect();
    };
  }, [intensity]);

  return (
    <div className={`pointer-events-none overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
