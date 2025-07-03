
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedSphere() {
  const ref = useRef<THREE.Points>(null);
  
  const sphere = new Float32Array(2000 * 3);
  for (let i = 0; i < 2000; i++) {
    const i3 = i * 3;
    const radius = Math.random() * 10 + 5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    
    sphere[i3] = radius * Math.sin(phi) * Math.cos(theta);
    sphere[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    sphere[i3 + 2] = radius * Math.cos(phi);
  }

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.1;
      ref.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#4f46e5"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
}

function FloatingRings() {
  const rings = Array.from({ length: 3 }, (_, i) => {
    const ref = useRef<THREE.Mesh>(null);
    
    useFrame((state) => {
      if (ref.current) {
        ref.current.rotation.x = state.clock.elapsedTime * (0.2 + i * 0.1);
        ref.current.rotation.z = state.clock.elapsedTime * 0.1;
      }
    });

    return (
      <mesh key={i} ref={ref} position={[0, 0, -i * 2]}>
        <torusGeometry args={[3 + i, 0.1, 16, 100]} />
        <meshStandardMaterial
          color={new THREE.Color().setHSL(0.6 + i * 0.1, 0.8, 0.6)}
          transparent
          opacity={0.6}
          wireframe
        />
      </mesh>
    );
  });

  return <>{rings}</>;
}

const LoginBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#4f46e5" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />
          <AnimatedSphere />
          <FloatingRings />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default LoginBackground;
