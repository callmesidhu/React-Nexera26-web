import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    
    return positions;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.02;
      ref.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#EF4524"
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  );
}

function GridPlane() {
  const ref = useRef<THREE.GridHelper>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.z = (state.clock.elapsedTime * 0.5) % 2;
    }
  });

  return (
    <gridHelper
      ref={ref}
      args={[40, 40, "#EF4524", "#1a1a1a"]}
      position={[0, -3, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

function FloatingRing() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.3;
      ref.current.rotation.y = state.clock.elapsedTime * 0.2;
      ref.current.position.y = Math.sin(state.clock.elapsedTime) * 0.3;
    }
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[2, 0.02, 16, 100]} />
      <meshBasicMaterial color="#EF4524" />
    </mesh>
  );
}

const ThreeScene = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <ParticleField />
        <GridPlane />
        <FloatingRing />
      </Canvas>
    </div>
  );
};

export default ThreeScene;
