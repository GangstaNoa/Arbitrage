"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Html,
  Grid,
  Environment,
  Lightformer,
  ContactShadows,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";
import type { GarageZone } from "@/lib/types";

const CYAN = "#39f4ff";

const MODEL_URL = "/models/bmw-x5.glb";

// BMW 354 "Titan(ium) Silver Metallic" — warm-toned medium silver.
const TITAN_SILVER = "#a3a19b";

function RealCarBody() {
  const { scene } = useGLTF(MODEL_URL);

  useEffect(() => {
    scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      obj.castShadow = true;
      obj.receiveShadow = true;

      const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
      materials.forEach((mat, i) => {
        if (!(mat instanceof THREE.MeshStandardMaterial)) return;

        if (mat.name === "_091614SSUV_bodycolor") {
          // Swap in a physical material for a proper glossy clearcoat paint look.
          const paint = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(TITAN_SILVER),
            metalness: 0.75,
            roughness: 0.25,
            clearcoat: 1,
            clearcoatRoughness: 0.1,
          });
          if (Array.isArray(obj.material)) obj.material[i] = paint;
          else obj.material = paint;
        } else if (mat.name === "_091614SSUV_glass") {
          mat.color.set("#0d161c");
          mat.transparent = true;
          mat.opacity = 0.6;
          mat.roughness = 0.05;
          mat.metalness = 0.1;
        } else if (mat.name === "_091614SSUV_reflective") {
          mat.metalness = 0.95;
          mat.roughness = 0.15;
        } else if (mat.name === "_091614SSUV_trims") {
          mat.metalness = 0.1;
          mat.roughness = 0.75;
        } else if (mat.name === "_091614SSUV_HD_wheeltyre") {
          mat.metalness = 0.05;
          mat.roughness = 0.85;
        } else if (mat.name === "_091614SSUV_HD_wheelrim") {
          mat.metalness = 0.85;
          mat.roughness = 0.3;
        }
      });
    });
  }, [scene]);

  // Model is authored close to real-world scale (~4.85m long) with its
  // origin roughly at mid-height — nudge it down so wheels sit on the grid.
  return (
    <group scale={0.88} position={[0, 0.32, 0]}>
      <primitive object={scene} />
    </group>
  );
}

function ProceduralFallback() {
  return (
    <mesh position={[0, 0.6, 0]}>
      <boxGeometry args={[1.9, 1.2, 4.5]} />
      <meshStandardMaterial color={TITAN_SILVER} wireframe opacity={0.4} transparent />
    </mesh>
  );
}

function ZoneMarker({
  zone,
  active,
  orderMode,
  currentOrderIndex,
  onSelect,
}: {
  zone: GarageZone;
  active: boolean;
  orderMode: boolean;
  currentOrderIndex: number | null;
  onSelect: (zone: GarageZone) => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [hover, setHover] = useState(false);
  const isCurrent = orderMode && currentOrderIndex === zone.disassemblyOrder;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const scale = 1 + Math.sin(t * 3 + zone.disassemblyOrder) * 0.08;
    ref.current.scale.setScalar((hover || active || isCurrent ? 1.4 : 1) * scale);
  });

  const color = isCurrent ? "#ffb020" : active ? "#28ffb0" : CYAN;

  return (
    <group position={zone.position}>
      <mesh
        ref={ref}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(zone);
        }}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} />
      </mesh>
      {(hover || active) && (
        <Html distanceFactor={8} center>
          <div className="pointer-events-none whitespace-nowrap rounded border border-cyan-400/60 bg-[#26282c]/95 px-2 py-1 text-[11px] text-cyan-300 shadow-[0_0_8px_rgba(57,244,255,0.5)]">
            {orderMode ? `#${zone.disassemblyOrder} · ` : ""}
            {zone.name}
          </div>
        </Html>
      )}
    </group>
  );
}

export default function CarViewer({
  zones,
  exploded,
  orderMode,
  currentOrderIndex,
  onZoneSelect,
  selectedZoneId,
}: {
  zones: GarageZone[];
  exploded: boolean;
  orderMode: boolean;
  currentOrderIndex: number | null;
  onZoneSelect: (zone: GarageZone) => void;
  selectedZoneId: string | null;
}) {
  const expandedZones = useMemo(() => {
    if (!exploded) return zones;
    const center = new THREE.Vector3(0, 0.6, 0);
    return zones.map((z) => {
      const p = new THREE.Vector3(...z.position);
      const dir = p.clone().sub(center).normalize();
      const exploded = p.clone().add(dir.multiplyScalar(0.5));
      return { ...z, position: [exploded.x, exploded.y, exploded.z] as [number, number, number] };
    });
  }, [zones, exploded]);

  return (
    <Canvas shadows camera={{ position: [4.5, 3, 5.5], fov: 42 }}>
      <color attach="background" args={["#1c1e22"]} />
      <fog attach="fog" args={["#1c1e22", 11, 26]} />
      <ambientLight intensity={0.6} />
      <hemisphereLight args={["#9a9c9f", "#1c1e22", 0.5]} />
      <directionalLight
        position={[5, 8, 4]}
        intensity={1.9}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <directionalLight position={[-5, 4, -3]} intensity={0.3} color="#cfe3ec" />
      <pointLight position={[-4, 2, -4]} intensity={0.25} color="#4a90d9" />
      <pointLight position={[0, 1.5, 4]} intensity={0.3} color={CYAN} />

      {/* Synthetic studio environment (no external HDRI fetch, stays offline-first) */}
      <Environment environmentIntensity={0.6} resolution={128}>
        <Lightformer
          form="rect"
          intensity={2}
          position={[0, 4, 3]}
          scale={[6, 3, 1]}
          color="#dfeaff"
        />
        <Lightformer
          form="rect"
          intensity={1.2}
          position={[-4, 2, -2]}
          scale={[4, 3, 1]}
          rotation={[0, Math.PI / 3, 0]}
          color="#f3f1ea"
        />
        <Lightformer
          form="rect"
          intensity={1}
          position={[4, 1.5, -2]}
          scale={[4, 2, 1]}
          rotation={[0, -Math.PI / 3, 0]}
          color="#e9e7e0"
        />
        <Lightformer
          form="ring"
          intensity={0.8}
          position={[0, 3, -5]}
          scale={5}
          color="#ffffff"
        />
      </Environment>

      <Grid
        position={[0, 0, 0]}
        args={[30, 30]}
        cellColor="#33373d"
        sectionColor="#4c4f56"
        fadeDistance={20}
        infiniteGrid
      />
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.55}
        scale={12}
        blur={2.2}
        far={3}
      />

      <Suspense fallback={<ProceduralFallback />}>
        <RealCarBody />
      </Suspense>

      {expandedZones.map((zone) => (
        <ZoneMarker
          key={zone.id}
          zone={zone}
          active={selectedZoneId === zone.id}
          orderMode={orderMode}
          currentOrderIndex={currentOrderIndex}
          onSelect={onZoneSelect}
        />
      ))}

      <OrbitControls
        enablePan
        target={[0, 0.55, 0]}
        minDistance={2.5}
        maxDistance={14}
        maxPolarAngle={Math.PI / 2.05}
      />
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
