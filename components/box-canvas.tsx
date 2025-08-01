/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Html } from "@react-three/drei";
import { Suspense, useRef } from "react";
// import confetti from "canvas-confetti";

function BoxModel({ isOpening }: { isOpening: boolean }) {
  const { scene } = useGLTF("/base_basic_pbr.glb");
  const ref = useRef<any>(null);

  useFrame(({ clock }) => {
    if (isOpening && ref.current) {
      ref.current.rotation.y += 0.2;
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 5) * 0.1;
    }
  });

  return <primitive ref={ref} object={scene} scale={1.5} />;
}

export default function ThreeBoxCanvas({
  isOpening,
  rotateSpeed,
}: {
  isOpening: boolean;
  rotateSpeed: number;
}) {
  return (
    <div className="w-full h-[250px] relative">
      <Canvas camera={{ position: [0, 1.5, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={2} />
        <Suspense fallback={<Html>...</Html>}>
          <BoxModel isOpening={isOpening} />
          <Environment preset="sunset" />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enableRotate={false}
          autoRotate={true}
          autoRotateSpeed={rotateSpeed}
        />
      </Canvas>
    </div>
  );
}
