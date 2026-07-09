"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Html,
  Grid,
  RoundedBox,
  Environment,
  Lightformer,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";
import type { GarageZone } from "@/lib/types";

const CYAN = "#39f4ff";
const TAILLIGHT = "#ff5c78";

// Stylized, geometry-only SUV — no external model, no copyrighted badges/logos.
// See README "How to add a real 3D model later" to swap in a licensed GLB.

function Wheel({ position }: { position: [number, number, number] }) {
  const spokes = 5;
  return (
    <group position={position}>
      {/* Tire */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.36, 0.135, 16, 28]} />
        <meshStandardMaterial color="#131417" roughness={0.9} metalness={0.05} />
      </mesh>
      {/* Rim outer ring */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.27, 0.27, 0.24, 24]} />
        <meshStandardMaterial color="#c9ccd1" roughness={0.25} metalness={0.9} />
      </mesh>
      {/* Rim spokes */}
      {Array.from({ length: spokes }).map((_, i) => (
        <mesh
          key={i}
          rotation={[(i * Math.PI * 2) / spokes, 0, Math.PI / 2]}
          castShadow
        >
          <boxGeometry args={[0.06, 0.24, 0.46]} />
          <meshStandardMaterial color="#9aa0a8" roughness={0.3} metalness={0.85} />
        </mesh>
      ))}
      {/* Brake disc glint */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.16, 0.16, 0.26, 20]} />
        <meshStandardMaterial color="#6b6f76" roughness={0.4} metalness={0.7} />
      </mesh>
      {/* Center cap */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 0.27, 16]} />
        <meshStandardMaterial color="#3a3d43" roughness={0.4} metalness={0.6} />
      </mesh>
    </group>
  );
}

function CarBody({ exploded }: { exploded: boolean }) {
  const hoodOffset = exploded ? 0.55 : 0;
  const cabinOffset = exploded ? 0.4 : 0;
  const bumperOffset = exploded ? 0.6 : 0;
  const doorOffset = exploded ? 0.75 : 0;

  // BMW 354 "Titan(ium) Silver Metallic" — warm-toned medium silver.
  const paint = useMemo(
    () => ({
      color: "#a3a19b",
      roughness: 0.28,
      metalness: 0.75,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
    }),
    []
  );
  const trim = { color: "#1c2229", roughness: 0.5, metalness: 0.4 };
  const glass = {
    color: "#0d161c",
    roughness: 0.05,
    metalness: 0.2,
    transparent: true,
    opacity: 0.72,
  };

  return (
    <group>
      {/* Lower chassis / subframe */}
      <RoundedBox
        args={[1.86, 0.22, 4.5]}
        radius={0.05}
        smoothness={4}
        position={[0, 0.22, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#15191e" roughness={0.8} metalness={0.3} />
      </RoundedBox>

      {/* Rocker / lower cladding */}
      <RoundedBox
        args={[1.98, 0.16, 4.1]}
        radius={0.05}
        smoothness={4}
        position={[0, 0.38, -0.1]}
        castShadow
      >
        <meshStandardMaterial {...trim} />
      </RoundedBox>

      {/* Main body shell */}
      <RoundedBox
        args={[1.94, 0.66, 3.85]}
        radius={0.14}
        smoothness={5}
        position={[0, 0.68, -0.2]}
        castShadow
      >
        <meshPhysicalMaterial {...paint} />
      </RoundedBox>

      {/* Beltline crease strip */}
      <RoundedBox
        args={[1.97, 0.05, 3.85]}
        radius={0.02}
        smoothness={3}
        position={[0, 0.94, -0.2]}
      >
        <meshStandardMaterial color="#818177" roughness={0.3} metalness={0.7} />
      </RoundedBox>

      {/* Cabin / greenhouse (glass) */}
      <RoundedBox
        args={[1.68 - cabinOffset * 0.1, 0.5, 2.05]}
        radius={0.16}
        smoothness={5}
        position={[0, 1.28 + cabinOffset * 0.25, -0.55]}
        castShadow
      >
        <meshPhysicalMaterial {...glass} />
      </RoundedBox>

      {/* Roof panel */}
      <RoundedBox
        args={[1.62, 0.08, 1.9]}
        radius={0.08}
        smoothness={4}
        position={[0, 1.56 + cabinOffset * 0.25, -0.55]}
        castShadow
      >
        <meshPhysicalMaterial {...paint} />
      </RoundedBox>

      {/* Roof rails */}
      {[0.72, -0.72].map((x) => (
        <RoundedBox
          key={x}
          args={[0.06, 0.06, 1.7]}
          radius={0.025}
          smoothness={3}
          position={[x, 1.65 + cabinOffset * 0.25, -0.55]}
        >
          <meshStandardMaterial color="#9aa0a8" roughness={0.3} metalness={0.85} />
        </RoundedBox>
      ))}

      {/* Windshield (raked) */}
      <group position={[0, 1.15, 0.55]} rotation={[0.55, 0, 0]}>
        <RoundedBox args={[1.62, 0.55, 0.04]} radius={0.06} smoothness={4} castShadow>
          <meshPhysicalMaterial {...glass} />
        </RoundedBox>
      </group>

      {/* Rear hatch glass (raked) */}
      <group position={[0, 1.12, -1.62]} rotation={[-0.42, 0, 0]}>
        <RoundedBox args={[1.6, 0.5, 0.04]} radius={0.06} smoothness={4} castShadow>
          <meshPhysicalMaterial {...glass} />
        </RoundedBox>
      </group>

      {/* Hood (front) */}
      <group position={[0, 0.9 + hoodOffset, 1.55]} rotation={[0.06, 0, 0]}>
        <RoundedBox args={[1.8, 0.16, 1.55]} radius={0.08} smoothness={4} castShadow>
          <meshPhysicalMaterial {...paint} />
        </RoundedBox>
      </group>

      {/* Kidney-adjacent front grille (generic, no badge) */}
      <RoundedBox
        args={[1.1, 0.32, 0.06]}
        radius={0.04}
        smoothness={3}
        position={[0, 0.78, 2.36 + bumperOffset]}
        castShadow
      >
        <meshStandardMaterial color="#0f1216" roughness={0.35} metalness={0.6} />
      </RoundedBox>

      {/* Front bumper */}
      <RoundedBox
        args={[1.9, 0.46, 0.3]}
        radius={0.1}
        smoothness={4}
        position={[0, 0.44, 2.35 + bumperOffset]}
        castShadow
      >
        <meshStandardMaterial {...trim} />
      </RoundedBox>

      {/* Headlight clusters */}
      {[0.68, -0.68].map((x) => (
        <RoundedBox
          key={x}
          args={[0.32, 0.14, 0.06]}
          radius={0.03}
          smoothness={3}
          position={[x, 0.86, 2.45 + bumperOffset]}
        >
          <meshStandardMaterial
            color={CYAN}
            emissive={CYAN}
            emissiveIntensity={1.8}
          />
        </RoundedBox>
      ))}

      {/* Rear bumper */}
      <RoundedBox
        args={[1.9, 0.46, 0.3]}
        radius={0.1}
        smoothness={4}
        position={[0, 0.44, -2.35]}
        castShadow
      >
        <meshStandardMaterial {...trim} />
      </RoundedBox>

      {/* Taillight clusters */}
      {[0.72, -0.72].map((x) => (
        <RoundedBox
          key={x}
          args={[0.28, 0.32, 0.06]}
          radius={0.03}
          smoothness={3}
          position={[x, 0.95, -2.45]}
        >
          <meshStandardMaterial
            color={TAILLIGHT}
            emissive={TAILLIGHT}
            emissiveIntensity={1.6}
          />
        </RoundedBox>
      ))}

      {/* Side mirrors */}
      {[0.95, -0.95].map((x) => (
        <RoundedBox
          key={x}
          args={[0.08, 0.12, 0.22]}
          radius={0.03}
          smoothness={3}
          position={[x + (x > 0 ? doorOffset * 0.1 : -doorOffset * 0.1), 1.1, 0.9]}
          castShadow
        >
          <meshStandardMaterial {...trim} />
        </RoundedBox>
      ))}

      {/* Door seams (visual only, thin creases) */}
      {[1.35, 0.35, -0.65].map((z) => (
        <RoundedBox
          key={z}
          args={[1.98, 0.62, 0.015]}
          radius={0.01}
          smoothness={2}
          position={[0, 0.7, z]}
        >
          <meshStandardMaterial color="#12161b" roughness={0.6} metalness={0.3} />
        </RoundedBox>
      ))}

      {/* Wheels */}
      <Wheel position={[0.98, 0.36, 1.35]} />
      <Wheel position={[-0.98, 0.36, 1.35]} />
      <Wheel position={[0.98, 0.36, -1.55]} />
      <Wheel position={[-0.98, 0.36, -1.55]} />

      {/* Wheel arches */}
      {[
        [0.98, 1.35],
        [-0.98, 1.35],
        [0.98, -1.55],
        [-0.98, -1.55],
      ].map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[x, 0.62, z]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.42, 0.06, 8, 20, Math.PI]} />
          <meshStandardMaterial {...trim} />
        </mesh>
      ))}
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
      <ambientLight intensity={0.5} />
      <hemisphereLight args={["#5b6a78", "#1c1e22", 0.55]} />
      <directionalLight
        position={[5, 8, 4]}
        intensity={1.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <directionalLight position={[-5, 4, -3]} intensity={0.55} color="#8fd9ff" />
      <pointLight position={[-4, 2, -4]} intensity={0.6} color="#2d8fff" />
      <pointLight position={[0, 1.5, 4]} intensity={0.7} color={CYAN} />

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
          color="#8fd9ff"
        />
        <Lightformer
          form="rect"
          intensity={1}
          position={[4, 1.5, -2]}
          scale={[4, 2, 1]}
          rotation={[0, -Math.PI / 3, 0]}
          color="#39f4ff"
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
