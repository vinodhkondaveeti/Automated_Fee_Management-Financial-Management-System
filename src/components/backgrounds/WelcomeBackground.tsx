
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

function FloatingCubes() {
  const cubes = Array.from({ length: 8 }, (_, i) => (
    <Float key={i} speed={2 + Math.random() * 2} rotationIntensity={1} floatIntensity={2}>
      <mesh
        position={[
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        ]}
        rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={new THREE.Color().setHSL(Math.random(), 0.8, 0.6)}
          transparent
          opacity={0.6}
          wireframe
        />
      </mesh>
    </Float>
  ));

  return <>{cubes}</>;
}

function Particles() {
  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 50;
  }

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#00ffff" transparent opacity={0.8} />
    </points>
  );
}

const WelcomeBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={2} />
          <FloatingCubes />
          <Particles />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default WelcomeBackground;
