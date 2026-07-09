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
import type { EngineBaySection } from "@/lib/types";

const CYAN = "#39f4ff";

// Stylized procedural M57 straight-6 diesel — built from the reference
// photos the project owner supplied (ridged plastic cover, badge end cap,
// twin-turbo, intercooler, front pulley stack), not a scanned/licensed
// model. No trademarked badge artwork is reproduced.

const materials = {
  cover: { color: "#9a9a95", roughness: 0.55, metalness: 0.15 },
  badge: { color: "#2c2f34", roughness: 0.4, metalness: 0.3 },
  block: { color: "#3a3d43", roughness: 0.5, metalness: 0.6 },
  bellhousing: { color: "#2c2e33", roughness: 0.55, metalness: 0.5 },
  turbo: { color: "#b8bcc2", roughness: 0.4, metalness: 0.65 },
  intercooler: { color: "#c7cad0", roughness: 0.4, metalness: 0.7 },
  hoseBlack: { color: "#111315", roughness: 0.8, metalness: 0.05 },
  hoseBlue: { color: "#2d6fd9", roughness: 0.5, metalness: 0.3 },
  pulley: { color: "#7d8188", roughness: 0.4, metalness: 0.75 },
  cap: { color: "#e8b400", roughness: 0.45, metalness: 0.4 },
};

function EngineCover() {
  const ridgeZ = [-0.2, -0.12, -0.04, 0.04, 0.12, 0.2];
  return (
    <group>
      <RoundedBox args={[1.0, 0.18, 0.55]} radius={0.05} smoothness={4} position={[0, 0.63, 0]} castShadow>
        <meshStandardMaterial {...materials.cover} />
      </RoundedBox>
      {ridgeZ.map((z) => (
        <RoundedBox
          key={z}
          args={[0.95, 0.045, 0.06]}
          radius={0.02}
          smoothness={3}
          position={[0, 0.725, z]}
          castShadow
        >
          <meshStandardMaterial {...materials.cover} roughness={0.4} />
        </RoundedBox>
      ))}
      {/* Badge end-cap (plain disc, no logo artwork) */}
      <mesh position={[-0.505, 0.66, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.015, 24]} />
        <meshStandardMaterial {...materials.badge} />
      </mesh>
      <mesh position={[-0.5, 0.66, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.036, 0.036, 0.012, 24]} />
        <meshStandardMaterial color="#e4e6e8" roughness={0.3} metalness={0.5} />
      </mesh>
    </group>
  );
}

function Turbo() {
  return (
    <group position={[0.32, 0.24, -0.36]}>
      <mesh scale={[1, 0.82, 1.1]} castShadow>
        <sphereGeometry args={[0.15, 20, 16]} />
        <meshStandardMaterial {...materials.turbo} />
      </mesh>
      <mesh position={[0.12, -0.02, -0.05]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.11, 0.16, 18]} />
        <meshStandardMaterial {...materials.turbo} />
      </mesh>
      <mesh position={[-0.05, 0.1, 0.08]} rotation={[0.3, 0, 0.2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.09, 12]} />
        <meshStandardMaterial {...materials.turbo} roughness={0.5} />
      </mesh>
    </group>
  );
}

function Intercooler() {
  const fins = [-0.14, -0.07, 0, 0.07, 0.14];
  return (
    <group position={[0.68, 0.14, -0.5]} rotation={[0, -0.35, 0.08]}>
      <RoundedBox args={[0.46, 0.32, 0.1]} radius={0.02} smoothness={3} castShadow>
        <meshStandardMaterial {...materials.intercooler} />
      </RoundedBox>
      {fins.map((y) => (
        <RoundedBox
          key={y}
          args={[0.44, 0.015, 0.11]}
          radius={0.005}
          smoothness={2}
          position={[0, y, 0]}
        >
          <meshStandardMaterial {...materials.intercooler} roughness={0.3} metalness={0.8} />
        </RoundedBox>
      ))}
    </group>
  );
}

function PulleyStack() {
  const pulleys: { pos: [number, number, number]; r: number }[] = [
    { pos: [0, 0.14, -0.36], r: 0.13 },
    { pos: [0.27, 0.35, -0.36], r: 0.07 },
    { pos: [-0.26, 0.4, -0.36], r: 0.08 },
    { pos: [0.02, 0.42, -0.37], r: 0.05 },
  ];
  return (
    <group>
      {pulleys.map((p, i) => (
        <mesh key={i} position={p.pos} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[p.r, p.r, 0.045, 20]} />
          <meshStandardMaterial {...materials.pulley} />
        </mesh>
      ))}
      <mesh position={[0, 0.14, -0.36]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.13, 0.008, 8, 24]} />
        <meshStandardMaterial {...materials.hoseBlack} />
      </mesh>
    </group>
  );
}

function Hose({ points, color, radius }: { points: [number, number, number][]; color: string; radius: number }) {
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))),
    [points]
  );
  return (
    <mesh castShadow>
      <tubeGeometry args={[curve, 24, radius, 8, false]} />
      <meshStandardMaterial color={color} roughness={0.75} metalness={0.1} />
    </mesh>
  );
}

function EngineBody() {
  return (
    <group>
      {/* Block */}
      <RoundedBox args={[1.05, 0.48, 0.62]} radius={0.04} smoothness={4} position={[0, 0.33, 0]} castShadow receiveShadow>
        <meshStandardMaterial {...materials.block} />
      </RoundedBox>

      {/* Bellhousing bulge at the transmission end */}
      <RoundedBox args={[0.7, 0.55, 0.32]} radius={0.05} smoothness={4} position={[0, 0.34, 0.46]} castShadow>
        <meshStandardMaterial {...materials.bellhousing} />
      </RoundedBox>

      {/* Oil pan */}
      <RoundedBox args={[0.9, 0.14, 0.5]} radius={0.03} smoothness={3} position={[0, 0.06, 0]} castShadow>
        <meshStandardMaterial {...materials.bellhousing} />
      </RoundedBox>

      <EngineCover />
      <Turbo />
      <Intercooler />
      <PulleyStack />

      {/* Intake/charge hose: turbo -> intercooler */}
      <Hose
        points={[
          [0.32, 0.28, -0.42],
          [0.5, 0.2, -0.48],
          [0.62, 0.16, -0.5],
        ]}
        color={materials.hoseBlack.color}
        radius={0.035}
      />
      {/* Return charge hose: intercooler -> intake manifold */}
      <Hose
        points={[
          [0.7, 0.28, -0.48],
          [0.55, 0.45, -0.3],
          [0.3, 0.58, -0.15],
        ]}
        color={materials.hoseBlack.color}
        radius={0.03}
      />
      {/* Coolant supply hose (blue accent, matches reference photos) */}
      <Hose
        points={[
          [-0.2, 0.62, -0.25],
          [-0.35, 0.5, -0.35],
          [-0.42, 0.32, -0.38],
        ]}
        color={materials.hoseBlue.color}
        radius={0.02}
      />

      {/* Oil filler cap (yellow accent) */}
      <mesh position={[0.35, 0.73, 0.15]}>
        <cylinderGeometry args={[0.045, 0.045, 0.03, 16]} />
        <meshStandardMaterial {...materials.cap} />
      </mesh>
    </group>
  );
}

type SystemTag = "cooling" | "turbo" | "fuel" | "electrical" | "drivetrain";

const sectionSystem: Record<string, SystemTag> = {
  battery: "electrical",
  "ecu-box": "electrical",
  intake: "turbo",
  "maf-sensor": "turbo",
  "map-sensor": "turbo",
  "glow-plug-controller": "electrical",
  injectors: "fuel",
  "fuel-rail": "fuel",
  turbochargers: "turbo",
  "vacuum-lines": "turbo",
  "coolant-hoses": "cooling",
  radiator: "cooling",
  intercooler: "cooling",
  fan: "cooling",
  "engine-mounts": "drivetrain",
  "transmission-bellhousing": "drivetrain",
  "grounding-straps": "electrical",
  "wiring-harness": "electrical",
};

const systemHeight: Record<SystemTag, number> = {
  cooling: 0.62,
  turbo: 0.3,
  fuel: 0.68,
  electrical: 0.4,
  drivetrain: 0.2,
};

function sectionToPosition(s: EngineBaySection): [number, number, number] {
  const x = ((s.x - 50) / 50) * 0.62;
  const z = ((s.y - 50) / 50) * 0.55;
  const y = systemHeight[sectionSystem[s.id] ?? "drivetrain"];
  return [x, y, z];
}

function Hotspot({
  section,
  active,
  onSelect,
}: {
  section: EngineBaySection;
  active: boolean;
  onSelect: (section: EngineBaySection) => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [hover, setHover] = useState(false);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const pulse = 1 + Math.sin(t * 3) * 0.08;
    ref.current.scale.setScalar((hover || active ? 1.4 : 1) * pulse);
  });

  const color = active ? "#28ffb0" : CYAN;

  return (
    <group position={sectionToPosition(section)}>
      <mesh
        ref={ref}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(section);
        }}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} />
      </mesh>
      {(hover || active) && (
        <Html distanceFactor={2.8} center>
          <div className="pointer-events-none whitespace-nowrap rounded border border-cyan-400/60 bg-[#26282c]/95 px-2 py-1 text-[11px] text-cyan-300 shadow-[0_0_8px_rgba(57,244,255,0.5)]">
            {section.name}
          </div>
        </Html>
      )}
    </group>
  );
}

export default function EngineViewer({
  sections,
  selectedId,
  onSelect,
}: {
  sections: EngineBaySection[];
  selectedId: string | null;
  onSelect: (section: EngineBaySection) => void;
}) {
  return (
    <Canvas shadows camera={{ position: [1.8, 1.1, 2.1], fov: 40 }}>
      <color attach="background" args={["#1c1e22"]} />
      <fog attach="fog" args={["#1c1e22", 4, 9]} />
      <ambientLight intensity={0.85} />
      <hemisphereLight args={["#9a9c9f", "#3a3d43", 0.6]} />
      <directionalLight
        position={[2, 3, 1.5]}
        intensity={1.9}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-2, 1.5, -1]} intensity={0.6} color="#cfe3ec" />
      <directionalLight position={[0, -1, 2]} intensity={0.35} color="#e8e8e4" />
      <pointLight position={[0, 1, 1.5]} intensity={0.3} color={CYAN} />

      <Environment environmentIntensity={0.6} resolution={128}>
        <Lightformer form="rect" intensity={2} position={[0, 2, 1.5]} scale={[3, 1.5, 1]} color="#f3f1ea" />
        <Lightformer form="rect" intensity={1} position={[-2, 1, -1]} scale={[2, 1.5, 1]} rotation={[0, Math.PI / 3, 0]} color="#e9e7e0" />
        <Lightformer form="ring" intensity={0.6} position={[0, 1.5, -2.5]} scale={2.5} color="#ffffff" />
      </Environment>

      <Grid position={[0, 0, 0]} args={[10, 10]} cellColor="#33373d" sectionColor="#4c4f56" fadeDistance={8} infiniteGrid />
      <ContactShadows position={[0, 0.005, 0]} opacity={0.5} scale={4} blur={2} far={2} />

      <EngineBody />

      {sections.map((s) => (
        <Hotspot key={s.id} section={s} active={selectedId === s.id} onSelect={onSelect} />
      ))}

      <OrbitControls enablePan target={[0, 0.4, 0]} minDistance={0.8} maxDistance={5} maxPolarAngle={Math.PI / 2.1} />
    </Canvas>
  );
}
