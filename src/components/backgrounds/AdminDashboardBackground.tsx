
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';

function DataCubes() {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const cubes = Array.from({ length: 20 }, (_, i) => (
    <mesh
      key={i}
      position={[
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      ]}
    >
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial
        color="#7c3aed"
        transparent
        opacity={0.7}
      />
    </mesh>
  ));

  return <group ref={group}>{cubes}</group>;
}

function GridLines() {
  const lines = [];
  
  for (let i = -10; i <= 10; i += 2) {
    // Vertical lines
    lines.push(
      <line key={`v${i}`}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([i, -10, 0, i, 10, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#a855f7" transparent opacity={0.3} />
      </line>
    );
    
    // Horizontal lines
    lines.push(
      <line key={`h${i}`}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([-10, i, 0, 10, i, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#a855f7" transparent opacity={0.3} />
      </line>
    );
  }
  
  return <>{lines}</>;
}

function FloatingCharts() {
  const charts = Array.from({ length: 4 }, (_, i) => {
    const ref = useRef<THREE.Mesh>(null);
    
    useFrame((state) => {
      if (ref.current) {
        ref.current.rotation.x = state.clock.elapsedTime * 0.3 + i;
        ref.current.rotation.z = state.clock.elapsedTime * 0.2;
        ref.current.position.y = Math.sin(state.clock.elapsedTime + i * 2) * 2;
      }
    });

    return (
      <mesh 
        key={i} 
        ref={ref}
        position={[
          (Math.random() - 0.5) * 15,
          0,
          (Math.random() - 0.5) * 15
        ]}
      >
        <cylinderGeometry args={[1, 1, 0.1, 8]} />
        <meshStandardMaterial
          color={new THREE.Color().setHSL(0.8 + i * 0.05, 0.8, 0.6)}
          transparent
          opacity={0.8}
        />
      </mesh>
    );
  });

  return <>{charts}</>;
}

const AdminDashboardBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#7c3aed" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ec4899" />
          <GridLines />
          <DataCubes />
          <FloatingCharts />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default AdminDashboardBackground;
