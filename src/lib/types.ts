// Shared type definitions for JARVIS X5 GARAGE OS

export type Priority = "critical" | "high" | "medium" | "low";
export type PartStatus = "needed" | "ordered" | "installed";
export type WireStatus = "connected" | "disconnected" | "unknown";
export type WireCategory =
  | "sensor"
  | "injector"
  | "ground"
  | "power"
  | "vacuum"
  | "coolant"
  | "fuel"
  | "unknown";

export interface VehicleInfo {
  name: string;
  year: number;
  make: string;
  model: string;
  chassis: string;
  trim: string;
  engineCode: string;
  engineName: string;
  vin: string;
  purchasePriceDkk: number;
  issue: string;
  projectStart: string;
  currentPhase: string;
  progressPercent: number;
  status: string;
}

export interface ChapterStep {
  order: number;
  text: string;
}

export interface Chapter {
  slug: string;
  number: number;
  title: string;
  category: string;
  objective: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  estimatedTime: string;
  tools: string[];
  parts: string[];
  warnings: string[];
  steps: ChapterStep[];
  checklist: string[];
}

export interface TorqueSpec {
  id: string;
  component: string;
  fastener: string;
  torqueValue: string;
  angle?: string;
  notes: string;
  source: string;
}

export interface Part {
  id: string;
  name: string;
  system: string;
  oemNumber: string;
  recommendedBrand: string;
  priceEstimateDkk: number;
  priority: Priority;
  status: PartStatus;
  notes: string;
}

export interface Tool {
  id: string;
  name: string;
  size: string;
  required: boolean;
  purpose: string;
  priceEstimateDkk: number;
  notes: string;
}

export interface EngineBaySection {
  id: string;
  name: string;
  x: number;
  y: number;
  description: string;
  removalSteps: string[];
  inspectionPoints: string[];
  torqueSpecRefs: string[];
  commonMistakes: string[];
  reconnectChecklist: string[];
}

export interface GarageZone {
  id: string;
  name: string;
  chapterSlug: string;
  position: [number, number, number];
  description: string;
  disassemblyOrder: number;
}

export interface FaultCode {
  code: string;
  system: string;
  description: string;
  commonCauses: string[];
  notes: string;
}

export interface BudgetItem {
  id: string;
  category: string;
  label: string;
  estimateDkk: number;
  actualDkk: number | null;
  notes: string;
}

export interface ChecklistDef {
  id: string;
  title: string;
  description: string;
  items: { id: string; text: string }[];
}

export interface SoundSystemOption {
  id: string;
  tier: "Factory Baseline" | "Entry Upgrade" | "Mid Upgrade" | "Reference Build";
  headUnit: string;
  amp: string;
  speakers: string;
  subwoofer: string;
  wiringNotes: string;
  estimateDkk: string;
}

export interface WireLabel {
  id: string;
  connectorId: string;
  name: string;
  system: WireCategory;
  location: string;
  connectorShape: string;
  wireColors: string;
  connectsTo: string;
  photoBefore: string | null;
  photoAfter: string | null;
  notes: string;
  removalDate: string;
  reinstalled: boolean;
  status: WireStatus;
  createdAt: string;
}

export interface PhotoNote {
  id: string;
  chapterSlug: string | null;
  stepText: string;
  photo: string | null;
  note: string;
  date: string;
  status: "planned" | "in-progress" | "done" | "issue";
}

export interface MaintenanceLogEntry {
  id: string;
  date: string;
  title: string;
  details: string;
  mileageKm: number | null;
}
