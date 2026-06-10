import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

/* ─────────────── Water Shader ─────────────── */

const waterVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const waterFragmentShader = `
uniform float uTime;
uniform vec2 uSunPosition;
uniform vec3 uWaterColor;
uniform float uDistortionStrength;
varying vec2 vUv;

vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec2 fade(vec2 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }

float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod289(Pi);
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  gx = gx - floor(gx + 0.5);
  vec4 g00 = vec4(gx.x, gy.x, 0.0, 0.0);
  vec4 g10 = vec4(gx.y, gy.y, 0.0, 0.0);
  vec4 g01 = vec4(gx.z, gy.z, 0.0, 0.0);
  vec4 g11 = vec4(gx.w, gy.w, 0.0, 0.0);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11));
  g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
}

void main() {
  float noise = cnoise(vec2(vUv.x * 5.0 + uTime, vUv.y * 5.0 + uTime)) * uDistortionStrength;
  vec3 skyColor = vec3(0.3, 0.5, 0.7) + (vUv.y + noise) * 0.3;
  vec3 color = uWaterColor + skyColor * 0.1;
  vec2 sunDirection = normalize(uSunPosition - vUv);
  float sunReflection = dot(normalize(vec2(0.5, 1.0) + vec2(noise)), sunDirection);
  color += vec3(1.0, 0.9, 0.7) * pow(sunReflection, 64.0);
  color += vec3(1.0, 0.9, 0.7) * pow(sunReflection, 32.0) * 0.5;
  gl_FragColor = vec4(color, 1.0);
}
`;

function WaterPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uSunPosition: { value: new THREE.Vector2(0.2, 0.1) },
    uWaterColor: { value: new THREE.Vector3(0.012, 0.016, 0.031) },
    uDistortionStrength: { value: 0.15 },
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]}>
      <planeGeometry args={[200, 200, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={waterVertexShader}
        fragmentShader={waterFragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ─────────────── Sky Gradient ─────────────── */

const skyVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const skyFragmentShader = `
varying vec2 vUv;
void main() {
  vec3 color = mix(vec3(0.0, 0.0, 0.0), vec3(0.05, 0.0, 0.1), vUv.y);
  gl_FragColor = vec4(color, 1.0);
}
`;

function SkyGradient() {
  return (
    <mesh position={[0, 0, -50]}>
      <planeGeometry args={[200, 200]} />
      <shaderMaterial
        vertexShader={skyVertexShader}
        fragmentShader={skyFragmentShader}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ─────────────── Starfield ─────────────── */

const starVertexShader = `
uniform float uTime;
attribute float aOpacity;
varying float vAlpha;

void main() {
  vAlpha = aOpacity;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  float twinkle = sin(uTime * 2.0 + position.x * 100.0) * 0.3 + 0.7;
  gl_PointSize = (4.0 * twinkle) * (100.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const starFragmentShader = `
varying float vAlpha;

void main() {
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;
  float alpha = smoothstep(0.5, 0.1, dist) * vAlpha;
  gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
}
`;

function StarField({ count = 5000 }: { count?: number }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { geometry, material } = useMemo(() => {
    const starGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(count * 3);
    const opacityArray = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 40 + Math.random() * 60;
      posArray[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      posArray[i * 3 + 1] = Math.abs(r * Math.cos(phi));
      posArray[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      opacityArray[i] = Math.random();
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    starGeo.setAttribute('aOpacity', new THREE.BufferAttribute(opacityArray, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader: starVertexShader,
      fragmentShader: starFragmentShader,
      uniforms: { uTime: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return { geometry: starGeo, material: mat };
  }, [count]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points geometry={geometry}>
      <primitive object={material} ref={materialRef} attach="material" />
    </points>
  );
}

/* ─────────────── Jellyfish Bell ─────────────── */

const bellVertexShader = `
uniform float uTime;
uniform float uPulseSpeed;
varying vec2 vUv;
varying vec3 vNormal;
#define PI 3.14159265359

void main() {
  vec3 newPosition = position;
  float phi = acos(newPosition.y);
  float pulse = sin(uTime * uPulseSpeed) * 0.1;
  float opening = sin(phi) * pulse;
  newPosition.y += opening * 0.5;
  newPosition.x += opening * 0.8;
  newPosition.z += opening * 0.8;
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

const bellFragmentShader = `
uniform float uTime;
uniform vec3 uColor;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  float gradient = smoothstep(0.0, 1.0, vUv.y);
  vec3 finalColor = mix(vec3(1.0, 0.5, 0.8), uColor, gradient);
  float fresnel = pow(1.0 - dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 3.0);
  finalColor += fresnel * 0.5;
  gl_FragColor = vec4(finalColor, 0.8 + fresnel * 0.2);
}
`;

/* ─────────────── Tentacle Shader ─────────────── */

const tentacleVertexShader = `
uniform float uTime;
uniform float uSwaySpeed;
varying vec2 vUv;
#define PI 3.14159265359

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec3 P) {
  vec3 Pi0 = floor(P); vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod289(Pi0); Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;
  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);
  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);
  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);
  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
  vec4 norm0 = taylorInvSqrt(vec4(dot(g000,g000), dot(g010,g010), dot(g100,g100), dot(g110,g110)));
  g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001,g001), dot(g011,g011), dot(g101,g101), dot(g111,g111)));
  g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;
  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);
  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  return 2.2 * mix(n_yz.x, n_yz.y, fade_xyz.x);
}

void main() {
  vec3 newPosition = position;
  float noise = cnoise(vec3(newPosition.x * 2.0, newPosition.y * 2.0, uTime * uSwaySpeed));
  float swayAmount = (1.0 - uv.y) * 0.3;
  newPosition.x += noise * swayAmount;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

const tentacleFragmentShader = `
varying vec2 vUv;
void main() {
  gl_FragColor = vec4(0.5, 0.7, 1.0, 0.6);
}
`;

/* ─────────────── Single Jellyfish ─────────────── */

interface JellyfishData {
  position: THREE.Vector3;
  pulseSpeed: number;
  swaySpeed: number;
  color: THREE.Color;
  scale: number;
  id: number;
}

function Jellyfish({ data, scrollBoostRef }: { data: JellyfishData; scrollBoostRef: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const bellMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const tentacleMaterialRefs = useRef<THREE.ShaderMaterial[]>([]);

  const bellUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPulseSpeed: { value: data.pulseSpeed },
    uColor: { value: data.color },
  }), [data.pulseSpeed, data.color]);

  const tentacles = useMemo(() => {
    const numTentacles = 12;
    const tentacleData = [];
    for (let i = 0; i < numTentacles; i++) {
      const angle = (i / numTentacles) * Math.PI * 2;
      const path = new THREE.CatmullRomCurve3([
        new THREE.Vector3(Math.cos(angle) * 0.2, -0.2, Math.sin(angle) * 0.2),
        new THREE.Vector3(Math.cos(angle) * 0.3, -0.8, Math.sin(angle) * 0.3),
        new THREE.Vector3(Math.cos(angle + 0.2) * 0.5, -1.8, Math.sin(angle + 0.2) * 0.5),
        new THREE.Vector3(Math.cos(angle + 0.4) * 0.7, -2.5, Math.sin(angle + 0.4) * 0.7),
      ]);
      const geo = new THREE.TubeGeometry(path, 20, 0.02, 6, false);
      const swaySpeed = 0.5 + Math.random() * 0.5;
      tentacleData.push({ geometry: geo, swaySpeed, angle });
    }
    return tentacleData;
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const boost = scrollBoostRef.current;

    if (groupRef.current) {
      groupRef.current.position.y += 0.01 * boost;
      groupRef.current.position.x += Math.sin(time * 0.5 + data.id) * 0.005;
      groupRef.current.rotation.y = Math.sin(time * 0.2 + data.id) * 0.2;

      if (groupRef.current.position.y > 15) {
        groupRef.current.position.y = -5;
      }
    }

    if (bellMaterialRef.current) {
      bellMaterialRef.current.uniforms.uTime.value = time;
    }

    tentacleMaterialRefs.current.forEach((mat) => {
      if (mat) mat.uniforms.uTime.value = time;
    });
  });

  return (
    <group
      ref={groupRef}
      position={data.position}
      scale={[data.scale, data.scale, data.scale]}
    >
      {/* Bell */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <shaderMaterial
          ref={bellMaterialRef}
          vertexShader={bellVertexShader}
          fragmentShader={bellFragmentShader}
          uniforms={bellUniforms}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Tentacles */}
      {tentacles.map((tentacle, i) => (
        <mesh key={i} geometry={tentacle.geometry}>
          <shaderMaterial
            ref={(el) => {
              if (el) tentacleMaterialRefs.current[i] = el;
            }}
            vertexShader={tentacleVertexShader}
            fragmentShader={tentacleFragmentShader}
            uniforms={{
              uTime: { value: 0 },
              uSwaySpeed: { value: tentacle.swaySpeed },
            }}
            wireframe
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ─────────────── Jellyfish System ─────────────── */

function JellyfishSystem({ scrollBoostRef, count = 8 }: { scrollBoostRef: React.MutableRefObject<number>; count?: number }) {
  const jellyfishData = useMemo(() => {
    const colors = [
      new THREE.Color('#60D0FF'),
      new THREE.Color('#B866FF'),
      new THREE.Color('#FF66B8'),
      new THREE.Color('#66B8FF'),
      new THREE.Color('#D066FF'),
      new THREE.Color('#66D0FF'),
      new THREE.Color('#FF88CC'),
      new THREE.Color('#88CCFF'),
    ];

    return Array.from({ length: count }, (_, i) => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 40,
        Math.random() * 20 - 5,
        -Math.random() * 20 - 5
      ),
      pulseSpeed: 0.5 + Math.random() * 1.0,
      swaySpeed: 0.5 + Math.random() * 0.5,
      color: colors[i % colors.length],
      scale: 0.3 + Math.random() * 0.5,
      id: i,
    }));
  }, [count]);

  return (
    <>
      {jellyfishData.map((data) => (
        <Jellyfish key={data.id} data={data} scrollBoostRef={scrollBoostRef} />
      ))}
    </>
  );
}

/* ─────────────── Scene Content ─────────────── */

function SceneContent({ scrollBoostRef }: { scrollBoostRef: React.MutableRefObject<number> }) {
  const { camera, scene } = useThree();

  useEffect(() => {
    camera.position.set(0, -2, 5);
    camera.lookAt(0, 5, -10);
    scene.fog = new THREE.FogExp2(0x030508, 0.015);
  }, [camera, scene]);

  return (
    <>
      <ambientLight intensity={0.3} color="#404040" />
      <pointLight position={[0, 8, 0]} intensity={1} color="#60D0FF" distance={20} />

      <WaterPlane />
      <SkyGradient />
      <StarField count={3000} />
      <JellyfishSystem scrollBoostRef={scrollBoostRef} count={8} />

      <Html position={[-2, 2, -8]} transform pointerEvents="none">
        <div style={{ maxWidth: '600px' }}>
          <h1
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: 'clamp(3rem, 7vw, 5.5rem)',
              fontWeight: 400,
              color: '#E6EDF5',
              letterSpacing: '-0.02em',
              lineHeight: 0.95,
              textShadow: '0 2px 40px rgba(0,0,0,0.6)',
              margin: 0,
            }}
          >
            Siri Keerthana
          </h1>
          <p
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: 'italic',
              fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
              fontWeight: 400,
              color: '#3DAAE0',
              marginTop: '0.5rem',
              textShadow: '0 2px 40px rgba(0,0,0,0.6)',
            }}
          >
            Mobile App Developer
          </p>
        </div>
      </Html>

      <Html position={[0, -3, -6]} transform pointerEvents="none">
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.75rem',
              color: '#4A5A6E',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Scroll to explore
          </p>
          <div
            style={{
              width: '1px',
              height: '40px',
              backgroundColor: '#4A5A6E',
              margin: '0.5rem auto 0',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                backgroundColor: '#7A8B9E',
                position: 'absolute',
                left: '-2px',
              }}
              className="scroll-dot"
            />
          </div>
        </div>
      </Html>
    </>
  );
}

/* ─────────────── Main Export ─────────────── */

export default function JellyfishScene({ scrollBoostRef }: { scrollBoostRef: React.MutableRefObject<number> }) {
  return (
    <Canvas
      camera={{ position: [0, -2, 5], fov: 60, near: 0.1, far: 1000 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor('#030508');
      }}
    >
      <SceneContent scrollBoostRef={scrollBoostRef} />
      <EffectComposer>
        <Bloom
          intensity={1.5}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.5}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
