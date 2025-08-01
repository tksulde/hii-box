"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Html } from "@react-three/drei";
import { Suspense } from "react";

function BoxModel() {
  const { scene } = useGLTF("/base_basic_pbr-hero.glb");
  return <primitive object={scene} scale={1.2} />;
}

export default function ThreeBoxCanvasHero() {
  return (
    <div className="w-full h-[386px] border-2 rounded-lg relative">
      <Canvas camera={{ position: [0, 1.5, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Suspense fallback={<Html>...</Html>}>
          <BoxModel />
          <Environment preset="sunset" />
        </Suspense>
        <OrbitControls enableZoom={false} autoRotate />
      </Canvas>
    </div>
  );
}
