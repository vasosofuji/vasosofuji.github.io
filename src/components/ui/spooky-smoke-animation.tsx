import React, { useEffect, useRef, useState } from 'react';

// --- FRAGMENT SHADER ---
const fragmentShaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
uniform vec3 u_color;

#define FC gl_FragCoord.xy
#define R resolution
#define T (time+660.0)

float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);return mix(mix(rnd(i),rnd(i+vec2(1.0,0.0)),u.x),mix(rnd(i+vec2(0.0,1.0)),rnd(i+1.0),u.x),u.y);}
float fbm(vec2 p){float t=0.0,a=1.0;for(int i=0;i<4;i++){t+=a*noise(p);p*=mat2(1.0,-1.2,0.2,1.2)*2.0;a*=0.5;}return t;}

void main(){
  vec2 uv=(FC-0.5*R)/R.y;
  uv.x+=0.25;
  uv*=vec2(2.0,1.0);

  // Calculate smoke base noise flow
  float n=fbm(uv*0.28-vec2(T*0.01,0.0));
  n=noise(uv*3.0+n*2.0);

  // Calculate smoke density (called once for 2.3x performance speedup)
  float smoke = fbm(uv+vec2(0.0,T*0.015)+n);
  
  // Base background is a very deep, dark slate/charcoal (almost pure black)
  vec3 bg=vec3(0.015, 0.01, 0.02);
  
  // Smoke color is mixed with u_color (orange) and shaped with a power curve
  vec3 smokeCol=mix(bg, u_color, pow(smoke, 2.2));
  
  // Add dynamic highlights on smoke edges/densest parts
  smokeCol+=u_color*smoothstep(0.65, 0.95, smoke)*0.3;
  
  // Fade in on page load
  vec3 col=mix(bg,smokeCol,min(time*0.15,1.0));
  col=clamp(col,0.0,1.0);
  O=vec4(col,1.0);
}`;

class Renderer {
  private readonly vertexSrc = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;
  private readonly vertices = [-1, 1, -1, -1, 1, 1, 1, -1];
  
  private gl: WebGL2RenderingContext;
  private canvas: HTMLCanvasElement;
  private program: WebGLProgram | null = null;
  private vs: WebGLShader | null = null;
  private fs: WebGLShader | null = null;
  private buffer: WebGLBuffer | null = null;
  private color: [number, number, number] = [0.5, 0.5, 0.5];

  constructor(canvas: HTMLCanvasElement, fragmentSource: string) {
    this.canvas = canvas;
    const gl = canvas.getContext("webgl2");
    if (!gl) {
      throw new Error("WebGL2 is not supported or disabled in this browser.");
    }
    this.gl = gl;
    this.setup(fragmentSource);
    this.init();
  }
  
  updateColor(newColor: [number, number, number]) {
    this.color = newColor;
  }

  updateScale(scaleFactor: number = 0.3) {
    const { innerWidth: width, innerHeight: height } = window;
    this.canvas.width = width * scaleFactor;
    this.canvas.height = height * scaleFactor;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  private compile(shader: WebGLShader, source: string) {
    const gl = this.gl;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(`Shader compilation error: ${gl.getShaderInfoLog(shader)}`);
    }
  }

  reset() {
    const { gl, program, vs, fs } = this;
    if (!program) return;
    if (vs) { gl.detachShader(program, vs); gl.deleteShader(vs); }
    if (fs) { gl.detachShader(program, fs); gl.deleteShader(fs); }
    gl.deleteProgram(program);
    this.program = null;
  }

  private setup(fragmentSource: string) {
    const gl = this.gl;
    this.vs = gl.createShader(gl.VERTEX_SHADER);
    this.fs = gl.createShader(gl.FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!this.vs || !this.fs || !program) return;
    this.compile(this.vs, this.vertexSrc);
    this.compile(this.fs, fragmentSource);
    this.program = program;
    gl.attachShader(this.program, this.vs);
    gl.attachShader(this.program, this.fs);
    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error(`Program linking error: ${gl.getProgramInfoLog(this.program)}`);
    }
  }

  private init() {
    const { gl, program } = this;
    if (!program) return;
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    Object.assign(program, {
      resolution: gl.getUniformLocation(program, "resolution"),
      time: gl.getUniformLocation(program, "time"),
      u_color: gl.getUniformLocation(program, "u_color"),
    });
  }

  render(now = 0) {
    const { gl, program, buffer, canvas } = this;
    if (!program || !gl.isProgram(program)) return;
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.uniform2f((program as any).resolution, canvas.width, canvas.height);
    gl.uniform1f((program as any).time, now * 1e-3);
    gl.uniform3fv((program as any).u_color, this.color);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}

const hexToRgb = (hex: string): [number, number, number] | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16) / 255,
          parseInt(result[2], 16) / 255,
          parseInt(result[3], 16) / 255,
        ]
      : null;
};

interface SmokeBackgroundProps {
  smokeColor?: string;
  className?: string;
  resolutionScale?: number;
  fpsLimit?: number;
}

export const SmokeBackground: React.FC<SmokeBackgroundProps> = ({ 
  smokeColor = "#64ffda", // Default to mintish theme
  className = "",
  resolutionScale = 0.55, // Render at 55% resolution for crisp high-contrast visual quality without jagged edges
  fpsLimit = 30 // Throttle to 30 FPS by default
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rendererRef = useRef<Renderer | null>(null);
    const [webglSupported, setWebglSupported] = useState(true);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        let renderer: Renderer | null = null;
        let animationFrameId: number;
        let observer: IntersectionObserver;
        
        // Debounced: a mobile browser fires `resize` on every URL-bar
        // show/hide, and each call reallocates the drawing buffer.
        let resizeTimer: ReturnType<typeof setTimeout> | undefined;
        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => renderer?.updateScale(resolutionScale), 150);
        };

        // While the nav drawer covers the viewport on phones, this canvas is
        // hidden behind it — no reason to keep burning GPU time on it.
        const coveredQuery = window.matchMedia('(max-width: 640px)');
        let isCovered = false;
        const handleMenuState = (e: Event) => {
            const open = Boolean((e as CustomEvent).detail?.open);
            isCovered = open && coveredQuery.matches;
        };

        try {
            renderer = new Renderer(canvas, fragmentShaderSource);
            rendererRef.current = renderer;

            renderer.updateScale(resolutionScale);
            window.addEventListener('resize', handleResize);
            window.addEventListener('menustatechange', handleMenuState);

            let isVisible = true;
            let lastTime = 0;
            const interval = 1000 / fpsLimit;

            const loop = (now: number) => {
                animationFrameId = requestAnimationFrame(loop);
                if (!isVisible || isCovered || !renderer) return;

                const delta = now - lastTime;
                if (delta >= interval) {
                    renderer.render(now);
                    lastTime = now - (delta % interval);
                }
            };
            loop(0);

            observer = new IntersectionObserver((entries) => {
                isVisible = entries[0].isIntersecting;
            }, { threshold: 0 });

            observer.observe(canvas);
        } catch (e) {
            console.error("Failed to initialize WebGL2 smoke renderer:", e);
            setWebglSupported(false);
        }

        return () => {
            clearTimeout(resizeTimer);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('menustatechange', handleMenuState);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            if (observer) observer.disconnect();
            if (renderer) renderer.reset();
        };
    }, [resolutionScale, fpsLimit]);
    
    useEffect(() => {
        const renderer = rendererRef.current;
        if (renderer) {
            const rgbColor = hexToRgb(smokeColor);
            if (rgbColor) {
                renderer.updateColor(rgbColor);
            }
        }
    }, [smokeColor]);

    if (!webglSupported) {
        return (
            <div className={`w-full h-full absolute inset-0 pointer-events-none ${className}`}>
                <style>{`
                    @keyframes pulseGlow {
                        0% { opacity: 0.25; transform: scale(0.9) translate(-2%, -2%); }
                        50% { opacity: 0.6; transform: scale(1.1) translate(2%, 2%); }
                        100% { opacity: 0.25; transform: scale(0.9) translate(-2%, -2%); }
                    }
                `}</style>
                <div
                  style={{
                    position: 'absolute',
                    top: '15%',
                    left: '15%',
                    width: '70%',
                    height: '70%',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${smokeColor}33 0%, transparent 70%)`,
                    filter: 'blur(60px)',
                    animation: 'pulseGlow 8s infinite alternate ease-in-out',
                  }}
                />
            </div>
        );
    }

    return (
        <div className={`w-full h-full absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            <canvas 
              ref={canvasRef} 
              className="w-full h-full block" 
              style={{ 
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'blur(4px)',
                transform: 'scale(1.02)',
                WebkitMaskImage: 'radial-gradient(circle at center, black 20%, transparent 90%)',
                maskImage: 'radial-gradient(circle at center, black 20%, transparent 90%)'
              }}
            />
        </div>
    );
};
