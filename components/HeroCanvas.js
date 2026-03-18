'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Sparkles } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function RootParticles({ count = 200 }) {
  const points = useRef();
  
  // Custom geometry for organic leaf-like particles
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * 10;
        const y = (Math.random() - 0.5) * 10;
        const z = (Math.random() - 0.5) * 10;
        temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;
    points.current.rotation.y += 0.0005;
    points.current.rotation.x += 0.0002;
    
    // Slight pulsing motion
    const time = state.clock.getElapsedTime();
    points.current.position.y = Math.sin(time * 0.5) * 0.1;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#00ff00"
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
      />
    </points>
  );
}

export default function HeroCanvas() {
  return (
    <Canvas 
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00ff00" />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={100} scale={10} size={2} speed={0.5} opacity={0.3} color="#00ff00" />
      
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
         <RootParticles count={150} />
      </Float>
    </Canvas>
  );
}
