import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Environment } from "@react-three/drei";
import * as THREE from "three";

/** The molten core: a distorted, self-lit sphere reacting to the pointer. */
function MoltenCore() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    const { x, y } = state.pointer;
    mesh.current.rotation.y += 0.0025;
    mesh.current.rotation.x = THREE.MathUtils.lerp(
      mesh.current.rotation.x,
      y * 0.35,
      0.05,
    );
    mesh.current.position.x = THREE.MathUtils.lerp(
      mesh.current.position.x,
      x * 0.4,
      0.04,
    );
  });

  return (
    <Float speed={1.4} rotationIntensity={0.5} floatIntensity={1.1}>
      <mesh ref={mesh} scale={1.65}>
        <icosahedronGeometry args={[1, 12]} />
        <MeshDistortMaterial
          color="#d24e01"
          emissive="#e88504"
          emissiveIntensity={1.35}
          roughness={0.25}
          metalness={0.6}
          distort={0.42}
          speed={1.8}
        />
      </mesh>
    </Float>
  );
}

/** Drifting ember particles rising through the scene. */
function Embers({ count = 380 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (!points.current) return;
    points.current.rotation.y += delta * 0.04;
    const pos = points.current.geometry.attributes.position
      .array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += delta * 0.28; // rise
      if (pos[i * 3 + 1] > 6) pos[i * 3 + 1] = -6;
    }
    points.current.geometry.attributes.position.needsUpdate = true;
    points.current.position.x = state.pointer.x * 0.3;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        color="#f1b04c"
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function Lights() {
  const light = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    if (!light.current) return;
    light.current.position.x = state.pointer.x * 4;
    light.current.position.y = -state.pointer.y * 4;
  });
  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight
        ref={light}
        position={[3, 3, 4]}
        intensity={45}
        color="#ee9f27"
        distance={20}
      />
      <pointLight
        position={[-5, -2, -3]}
        intensity={18}
        color="#d24e01"
        distance={16}
      />
    </>
  );
}

/** Full-bleed 3D backdrop for the hero. Pointer-reactive, self-cleaning. */
export function ForgeScene() {
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 6], fov: 42 }}
    >
      <Suspense fallback={null}>
        <Lights />
        <MoltenCore />
        <Embers />
        <Environment preset="sunset" />
      </Suspense>
    </Canvas>
  );
}
