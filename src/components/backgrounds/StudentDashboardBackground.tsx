
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';

function WaveGrid() {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (mesh.current && mesh.current.geometry) {
      const time = state.clock.elapsedTime;
      const position = (mesh.current.geometry as THREE.PlaneGeometry).attributes.position;
      
      for (let i = 0; i < position.count; i++) {
        const x = position.getX(i);
        const y = position.getY(i);
        const wave = Math.sin(x * 0.5 + time) * Math.sin(y * 0.5 + time * 0.5) * 0.5;
        position.setZ(i, wave);
      }
      position.needsUpdate = true;
    }
  });

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
      <planeGeometry args={[20, 20, 50, 50]} />
      <meshStandardMaterial
        color="#1e40af"
        transparent
        opacity={0.3}
        wireframe
      />
    </mesh>
  );
}

function FloatingBooks() {
  const books = Array.from({ length: 6 }, (_, i) => {
    const ref = useRef<THREE.Group>(null);
    
    useFrame((state) => {
      if (ref.current) {
        ref.current.position.y = Math.sin(state.clock.elapsedTime + i) * 0.5;
        ref.current.rotation.y = state.clock.elapsedTime * 0.2 + i;
      }
    });

    return (
      <group 
        key={i} 
        ref={ref}
        position={[
          (Math.random() - 0.5) * 15,
          Math.random() * 5,
          (Math.random() - 0.5) * 15
        ]}
      >
        <mesh>
          <boxGeometry args={[0.8, 1.2, 0.1]} />
          <meshStandardMaterial color={new THREE.Color().setHSL(Math.random(), 0.7, 0.6)} />
        </mesh>
      </group>
    );
  });

  return <>{books}</>;
}

const StudentDashboardBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 5, 10], fov: 75 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
          <pointLight position={[-10, 5, -10]} intensity={0.5} color="#10b981" />
          <WaveGrid />
          <FloatingBooks />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default StudentDashboardBackground;
