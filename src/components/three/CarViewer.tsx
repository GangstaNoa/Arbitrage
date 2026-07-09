"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Grid } from "@react-three/drei";
import * as THREE from "three";
import type { GarageZone } from "@/lib/types";

const CYAN = "#39f4ff";

function Wheel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.36, 0.36, 0.28, 24]} />
        <meshStandardMaterial color="#2a3542" roughness={0.55} metalness={0.4} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.36, 0.025, 8, 24]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.4} />
      </mesh>
    </group>
  );
}

function CarBody({ exploded }: { exploded: boolean }) {
  const hoodOffset = exploded ? 0.55 : 0;
  const cabinOffset = exploded ? 0.35 : 0;
  const bumperOffset = exploded ? 0.6 : 0;
  const glassColor = "#274357";
  const bodyColor = "#25384a";
  const edgeColor = CYAN;

  return (
    <group>
      {/* Lower chassis / subframe */}
      <mesh position={[0, 0.22, 0]} receiveShadow>
        <boxGeometry args={[1.85, 0.22, 4.5]} />
        <meshStandardMaterial color="#1a2735" roughness={0.75} metalness={0.25} />
      </mesh>

      {/* Main body shell */}
      <mesh position={[0, 0.62, -0.2]} castShadow>
        <boxGeometry args={[1.9, 0.62, 3.9]} />
        <meshStandardMaterial color={bodyColor} roughness={0.35} metalness={0.55} />
      </mesh>

      {/* Cabin */}
      <mesh position={[0, 1.05 + cabinOffset * 0.2, -0.5]} castShadow>
        <boxGeometry args={[1.7, 0.5, 2.1]} />
        <meshStandardMaterial color={glassColor} roughness={0.15} metalness={0.6} transparent opacity={0.88} />
      </mesh>

      {/* Hood (front) */}
      <mesh position={[0, 0.78 + hoodOffset, 1.6]} rotation={[0.05, 0, 0]} castShadow>
        <boxGeometry args={[1.75, 0.14, 1.5]} />
        <meshStandardMaterial color="#2e4459" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Front bumper */}
      <mesh position={[0, 0.42, 2.35 + bumperOffset]} castShadow>
        <boxGeometry args={[1.85, 0.42, 0.28]} />
        <meshStandardMaterial color="#22333f" roughness={0.45} metalness={0.45} />
      </mesh>
      {/* Front glow strip */}
      <mesh position={[0, 0.55, 2.5 + bumperOffset]}>
        <boxGeometry args={[1.6, 0.04, 0.02]} />
        <meshStandardMaterial color={edgeColor} emissive={edgeColor} emissiveIntensity={1.6} />
      </mesh>

      {/* Rear bumper */}
      <mesh position={[0, 0.42, -2.35]} castShadow>
        <boxGeometry args={[1.85, 0.42, 0.28]} />
        <meshStandardMaterial color="#22333f" roughness={0.45} metalness={0.45} />
      </mesh>

      {/* Wheels */}
      <Wheel position={[0.98, 0.36, 1.35]} />
      <Wheel position={[-0.98, 0.36, 1.35]} />
      <Wheel position={[0.98, 0.36, -1.55]} />
      <Wheel position={[-0.98, 0.36, -1.55]} />
    </group>
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
          <div className="pointer-events-none whitespace-nowrap rounded border border-cyan-400/60 bg-[#04070d]/90 px-2 py-1 text-[11px] text-cyan-300 shadow-[0_0_8px_rgba(57,244,255,0.5)]">
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
      <color attach="background" args={["#04070d"]} />
      <fog attach="fog" args={["#04070d", 10, 24]} />
      <ambientLight intensity={0.75} />
      <hemisphereLight args={["#3aa9ff", "#04070d", 0.6]} />
      <directionalLight
        position={[5, 8, 4]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-5, 4, -3]} intensity={0.5} color="#8fd9ff" />
      <pointLight position={[-4, 2, -4]} intensity={0.8} color="#2d8fff" />
      <pointLight position={[0, 1.5, 4]} intensity={1} color={CYAN} />

      <Grid
        position={[0, 0, 0]}
        args={[30, 30]}
        cellColor="#0e2a3a"
        sectionColor="#1c5a72"
        fadeDistance={20}
        infiniteGrid
      />

      <CarBody exploded={exploded} />

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
