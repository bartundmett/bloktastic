import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Html, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// =============================================================================
// SOFT CLAY MATERIAL
// =============================================================================
const ClayMaterial = ({ color }: { color: string }) => (
  <meshStandardMaterial
    color={color}
    roughness={0.55}
    metalness={0.0}
    envMapIntensity={0.1}
  />
);

// =============================================================================
// COLORS - Storyblok-inspired but softer
// =============================================================================
const colors = {
  teal: '#5ec6b8',
  mint: '#7dd4a8',
  coral: '#f0a080',
  blue: '#7eb8e8',
  purple: '#b0a0d8',
  slate: '#8898a8',
  yellow: '#e8d888',
};

// =============================================================================
// COMPONENT BLOCK - A block with a label
// =============================================================================
const ComponentBlock = ({ 
  position, 
  size, 
  color, 
  label,
  rotation = [0, 0, 0],
  wobbleSpeed = 1,
  wobbleAmount = 0.012,
  delay = 0,
}: { 
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  label: string;
  rotation?: [number, number, number];
  wobbleSpeed?: number;
  wobbleAmount?: number;
  delay?: number;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime() + delay;
      
      groupRef.current.rotation.x = rotation[0] + Math.sin(t * wobbleSpeed * 0.5) * wobbleAmount;
      groupRef.current.rotation.y = rotation[1] + Math.sin(t * wobbleSpeed * 0.4 + 0.5) * wobbleAmount;
      groupRef.current.rotation.z = rotation[2] + Math.sin(t * wobbleSpeed * 0.45 + 1) * wobbleAmount;
      
      groupRef.current.position.y = position[1] + Math.sin(t * wobbleSpeed * 0.3) * 0.035;
    }
  });

  const radius = Math.min(size[0], size[1], size[2]) * 0.25;

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <RoundedBox 
        args={size} 
        radius={radius}
        smoothness={6}
        castShadow
        receiveShadow
      >
        <ClayMaterial color={color} />
      </RoundedBox>
      
      {/* HTML Label */}
      <Html
        center
        position={[0, 0, size[2] / 2 + 0.05]}
        style={{
          color: 'white',
          fontSize: '14px',
          fontWeight: 600,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textShadow: `0 1px 3px ${color}`,
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </Html>
    </group>
  );
};

// =============================================================================
// SMALL ACCENT BLOCK (no label)
// =============================================================================
const AccentBlock = ({ 
  position, 
  size, 
  color, 
  rotation = [0, 0, 0],
  delay = 0,
}: { 
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  rotation?: [number, number, number];
  delay?: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime() + delay;
      ref.current.rotation.x = rotation[0] + Math.sin(t * 0.6) * 0.02;
      ref.current.rotation.z = rotation[2] + Math.sin(t * 0.5) * 0.02;
      ref.current.position.y = position[1] + Math.sin(t * 0.4) * 0.05;
    }
  });

  const radius = Math.min(size[0], size[1], size[2]) * 0.3;

  return (
    <RoundedBox 
      ref={ref}
      args={size} 
      radius={radius}
      smoothness={4}
      position={position}
      rotation={rotation}
      castShadow
    >
      <ClayMaterial color={color} />
    </RoundedBox>
  );
};

// =============================================================================
// DECORATIVE DOT
// =============================================================================
const Dot = ({ 
  position, 
  color, 
  scale = 0.12,
  delay = 0,
}: { 
  position: [number, number, number]; 
  color: string; 
  scale?: number;
  delay?: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime() + delay;
      ref.current.position.y = position[1] + Math.sin(t * 1.0) * 0.06;
    }
  });

  return (
    <mesh ref={ref} position={position} castShadow>
      <sphereGeometry args={[scale, 16, 16]} />
      <ClayMaterial color={color} />
    </mesh>
  );
};

// =============================================================================
// MOUSE PARALLAX RIG
// =============================================================================
function Rig({ children }: { children?: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      const x = state.pointer.x * 0.08;
      const y = state.pointer.y * 0.05;
      
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, x, 0.03);
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -y, 0.03);
    }
  });
  
  return <group ref={ref}>{children}</group>;
}

// =============================================================================
// COMPONENT ASSEMBLY
// =============================================================================
const ComponentAssembly = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  
  const isMobile = viewport.width < 8;
  const scale = isMobile ? 0.45 : 0.65;
  const offsetX = isMobile ? 0 : 2.5;

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.12) * 0.015;
    }
  });

  return (
    <group 
      ref={groupRef} 
      scale={scale}
      position={[offsetX, 0, 0]}
      rotation={[0.15, -0.25, 0.02]}
    >
      {/* Main Component Blocks */}
      <ComponentBlock 
        position={[0, 1.8, 0]}
        size={[2.8, 1.2, 0.5]}
        color={colors.teal}
        label="Hero"
        rotation={[0.05, 0.1, 0.02]}
        wobbleSpeed={0.7}
        delay={0}
      />
      
      <ComponentBlock 
        position={[-0.8, 0.3, 0.3]}
        size={[2.2, 1.0, 0.45]}
        color={colors.mint}
        label="Grid"
        rotation={[0.03, -0.08, -0.02]}
        wobbleSpeed={0.8}
        delay={0.8}
      />
      
      <ComponentBlock 
        position={[1.5, 0.5, -0.2]}
        size={[1.8, 0.9, 0.4]}
        color={colors.coral}
        label="Teaser"
        rotation={[-0.02, 0.15, 0.03]}
        wobbleSpeed={0.9}
        delay={1.2}
      />
      
      <ComponentBlock 
        position={[0.3, -1.0, 0.5]}
        size={[2.0, 0.95, 0.42]}
        color={colors.blue}
        label="FAQ"
        rotation={[0.04, -0.05, -0.01]}
        wobbleSpeed={0.85}
        delay={1.6}
      />
      
      <ComponentBlock 
        position={[-1.5, -1.4, -0.1]}
        size={[1.6, 0.85, 0.38]}
        color={colors.purple}
        label="Accordion"
        rotation={[-0.03, 0.12, 0.04]}
        wobbleSpeed={1.0}
        delay={2.0}
      />
      
      <ComponentBlock 
        position={[2.5, -0.5, 0.6]}
        size={[1.4, 0.8, 0.36]}
        color={colors.yellow}
        label="Card"
        rotation={[0.06, -0.1, -0.03]}
        wobbleSpeed={1.1}
        delay={2.4}
      />

      {/* Small Accent Blocks */}
      <AccentBlock 
        position={[-2.5, 1.2, 0.2]}
        size={[0.7, 0.5, 0.28]}
        color={colors.slate}
        rotation={[0.1, 0.2, -0.1]}
        delay={3}
      />
      
      <AccentBlock 
        position={[3.2, 1.5, 0.3]}
        size={[0.6, 0.45, 0.25]}
        color={colors.mint}
        rotation={[-0.1, -0.15, 0.08]}
        delay={3.5}
      />
      
      <AccentBlock 
        position={[2.8, -2, 0.4]}
        size={[0.55, 0.4, 0.22]}
        color={colors.teal}
        rotation={[0.08, 0.1, 0.05]}
        delay={4}
      />

      {/* Dots */}
      <Dot position={[-2.8, 0.2, 0.4]} color={colors.coral} scale={0.14} delay={0} />
      <Dot position={[3.5, 0.8, 0.5]} color={colors.purple} scale={0.12} delay={1} />
      <Dot position={[-1.8, -2.2, 0.3]} color={colors.blue} scale={0.1} delay={2} />
      <Dot position={[1.5, 2.5, 0.4]} color={colors.mint} scale={0.11} delay={3} />
      <Dot position={[-0.5, -2.5, 0.5]} color={colors.yellow} scale={0.13} delay={4} />
    </group>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
const Hero3D: React.FC = () => {
  return (
    <div className="w-full h-full">
      <Canvas 
        shadows 
        camera={{ position: [0, 0, 10], fov: 40 }} 
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          toneMapping: THREE.NoToneMapping,
        }}
        flat
      >
        <hemisphereLight args={['#ffffff', '#f0f5ff', 1.6]} />
        
        <directionalLight
          position={[5, 10, 5]}
          intensity={0.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0001}
        />
        
        <directionalLight
          position={[-5, 5, 8]}
          intensity={0.35}
        />
        
        <Rig>
          <ComponentAssembly />
        </Rig>

        <ContactShadows
          position={[0, -3.5, 0]}
          opacity={0.1}
          scale={20}
          blur={3}
          far={6}
          color="#1a365d"
        />
      </Canvas>
    </div>
  );
};

export default Hero3D;