import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Compass,
  ChevronDown,
  Ruler
} from 'lucide-react';

export const CAD_PARTS = [
  { id: 'baseplate', name: 'Baseplate (180mm x 440mm)', domain: 'SAMBED', material: '6061-T6 Aluminum' },
  { id: 'pillars', name: 'Support Pillars (x2)', domain: 'SAMBED', material: 'Stainless Steel 304' },
  { id: 'platform', name: 'Elevated Staging Platform', domain: 'SAMBED', material: 'CNC Machined Delrin' },
  { id: 'tower', name: 'Gravity Tower (57x57x400mm)', domain: 'SAMBED', material: 'Anodized 6063 Alloy' },
  { id: 'chute', name: '45° Precision Chute & Gate', domain: 'SAMBED', material: 'Cast Acrylic / PTFE' },
  { id: 'bins', name: '3-Compartment Sorting Vault', domain: 'SAMBED', material: 'Open Chamber Aluminum' },
  { id: 'diverter', name: '32ms High-Torque Diverter', domain: 'SPACED', material: 'Hinged Flap & Servo' },
  { id: 'avionics', name: 'Vision Engine & Telemetry', domain: 'SIESED', material: '120 FPS Optical Gantry' },
];

export const STEPS = [
  { label: '00', title: 'SolidWorks Model', desc: '1:1 collegiate autonomous media sorter assembly with 8 modular subsystems' },
  { label: '01', title: 'Feeder Staging', desc: '57x57mm gravity magazine queues media; pusher feeds throat at 0.42 m/s' },
  { label: '02', title: '120 FPS CV Scan', desc: 'Optical gantry classifies multi-spectral media via RGB/IR down-firing camera' },
  { label: '03', title: 'Chute Descent', desc: '45.0° calibrated acrylic slide delivers smooth gravitational acceleration' },
  { label: '04', title: '32ms Diverter', desc: 'High-torque micro servo swings hinged deflector 34.6° across the slide bed' },
  { label: '05', title: 'Vault Sorting', desc: 'Deflected package drops through lateral doorway into quarantined Bay 2' },
  { label: '06', title: 'Exploded BOM', desc: 'Technical breakdown of all 8 precision modular sub-assemblies along axes' },
];

const WAYPOINTS = [
  { p: 0.00, theta: 0.72, phi: 1.15, radius: 820, explode: 0.0, step: 0 }, // 00 Overview
  { p: 0.16, theta: 1.08, phi: 0.92, radius: 560, explode: 0.0, step: 1 }, // 01 Feeder Staging
  { p: 0.32, theta: 1.48, phi: 0.80, radius: 480, explode: 0.0, step: 2 }, // 02 Vision Scan
  { p: 0.49, theta: 1.88, phi: 1.06, radius: 550, explode: 0.0, step: 3 }, // 03 Chute Descent
  { p: 0.66, theta: 2.32, phi: 0.88, radius: 460, explode: 0.0, step: 4 }, // 04 32ms Diverter
  { p: 0.82, theta: 2.74, phi: 0.78, radius: 500, explode: 0.0, step: 5 }, // 05 Vault Sorting
  { p: 0.93, theta: 0.85, phi: 1.12, radius: 920, explode: 1.0, step: 6 }, // 06 Exploded BOM
];

function interpolateWaypoints(p) {
  const clamped = Math.max(0, Math.min(1, p));
  for (let i = 0; i < WAYPOINTS.length - 1; i++) {
    const w0 = WAYPOINTS[i];
    const w1 = WAYPOINTS[i + 1];
    if (clamped >= w0.p && clamped <= w1.p) {
      const segT = (clamped - w0.p) / (w1.p - w0.p);
      const t = segT * segT * (3 - 2 * segT); // smoothstep
      return {
        theta: w0.theta + (w1.theta - w0.theta) * t,
        phi: w0.phi + (w1.phi - w0.phi) * t,
        radius: w0.radius + (w1.radius - w0.radius) * t,
        explode: w0.explode + (w1.explode - w0.explode) * t,
        step: segT > 0.5 ? w1.step : w0.step,
      };
    }
  }
  return WAYPOINTS[WAYPOINTS.length - 1];
}

// Real-Time Mechanical Simulation Coordinate Solver
function calculateSimulationState(p, explode = 0) {
  let pkgPos = { x: -140, y: 9, z: 0 };
  let pkgRot = { x: 0, y: 0, z: 0 };
  let pusherX = -20;
  let flapT = 0; // 0 = retracted flush against outer rail, 1 = fully deployed
  let laserOpacity = 0;
  let bay2Active = false;
  let queued1Y = 27;
  let queued2Y = 45;
  let queued3Y = 63;

  const chuteAngle = -Math.atan2(84, 200); // -0.3971 rad

  if (p < 0.14) {
    // Phase 0: At rest in the 57x57mm Gravity Magazine
    pkgPos = { x: -140, y: 9, z: 0 };
    pkgRot = { x: 0, y: 0, z: 0 };
    pusherX = -20;
    queued1Y = 27;
    queued2Y = 45;
    queued3Y = 63;
  } else if (p < 0.28) {
    // Phase 1: Feeder Pusher Slides Package onto Staging Platform Throat
    const t = (p - 0.14) / (0.28 - 0.14);
    pusherX = -20 + t * 40;
    pkgPos = {
      x: -140 + t * 55, // -140 to -85 (reaches slide throat)
      y: 9,
      z: t * 16, // moves from 0 to +16 (chute centerline)
    };
    pkgRot = { x: 0, y: 0, z: 0 };
    queued1Y = 27;
    queued2Y = 45;
    queued3Y = 63;
  } else if (p < 0.46) {
    // Phase 2: Slide Entrance & Vision Scanning Gantry
    const t = (p - 0.28) / (0.46 - 0.28);
    pusherX = 20 - t * 40; // Pusher resets back
    const startX = -85;
    const endX = -20;
    const currX = startX + t * (endX - startX);
    const currY = 9 - (currX - startX) * 0.42;
    pkgPos = { x: currX, y: currY, z: 16 };
    pkgRot = { x: 0, y: 0, z: chuteAngle }; // matches chute slope

    // Laser sweeps over package under the camera arch
    if (t > 0.25 && t < 0.85) {
      laserOpacity = Math.sin(((t - 0.25) / 0.6) * Math.PI);
    }

    // Magazine stack drops down by 18mm under gravity as bottom slot clears
    const dropT = Math.min(1, Math.max(0, (t - 0.1) * 1.6));
    queued1Y = 27 - dropT * 18; // 27 -> 9 (lands on platform floor)
    queued2Y = 45 - dropT * 18; // 45 -> 27
    queued3Y = 63 - dropT * 18; // 63 -> 45
  } else if (p < 0.58) {
    // Phase 3: Approach Diverter Gate & Servo Flap Deployment
    const t = (p - 0.46) / (0.58 - 0.46);
    const startX = -20;
    const endX = 2; // Arrives at contact point of deflector blade
    const currX = startX + t * (endX - startX);
    const currY = -18.3 - (currX - startX) * 0.42;
    pkgPos = { x: currX, y: currY, z: 16 };
    pkgRot = { x: 0, y: 0, z: chuteAngle };
    // Flap deploys smoothly across the chute bed ahead of the package
    flapT = Math.min(1, t * 1.4);
    queued1Y = 9;
    queued2Y = 27;
    queued3Y = 45;
  } else if (p < 0.72) {
    // Phase 4: 32ms Deflection along Blade Face & through Elevated Doorway Arch
    const t = (p - 0.58) / (0.72 - 0.58);
    flapT = 1.0; // Flap held firm across channel forming diagonal guide fence
    const startX = 2;
    const endX = 15; // Directly targets Bay 2 center (x = 15)
    const currX = startX + t * (endX - startX);
    // Glides down ramp and through doorway
    const currY = -27.5 - t * 7.5; // -27.5 down to -35 (above vault threshold)
    const currZ = 16 - t * 40; // Deflects from centerline (+16) through doorway to -24
    // Smooth yaw rotation following deflection angle:
    const yaw = -t * 0.62;
    pkgPos = { x: currX, y: currY, z: currZ };
    pkgRot = { x: 0, y: yaw, z: chuteAngle * (1 - t * 0.5) };
    queued1Y = 9;
    queued2Y = 27;
    queued3Y = 45;
  } else if (p < 0.86) {
    // Phase 5: Smooth Parabolic Drop squarely into Sorting Vault Bay 2
    const t = (p - 0.72) / (0.86 - 0.72);
    flapT = Math.max(0, 1 - t * 2.8); // Flap quickly snaps back flush against rail
    const currX = 15; // Centered with 5.5mm clearance from bulkheads on both sides
    const currZ = -24 - t * 20; // Travels to center of Bay 2 depth (z = -44)
    // Parabolic drop settling onto vault floor (Y = -71)
    const dropS = t * t * (3 - 2 * t);
    const currY = -35 - dropS * 36; // -35 -> -71
    // Levels out flat and square inside the bay:
    const yaw = -0.62 * (1 - t);
    const roll = chuteAngle * 0.5 * (1 - t);
    pkgPos = { x: currX, y: currY, z: currZ };
    pkgRot = { x: 0, y: yaw, z: roll };
    bay2Active = t > 0.35;
    queued1Y = 9;
    queued2Y = 27;
    queued3Y = 45;
  } else {
    // Phase 6: Exploded Technical CAD Architecture (follows Bay 2 vault explosion offset)
    pkgPos = { x: 15, y: -71 - 15 * explode, z: -44 - 75 * explode };
    pkgRot = { x: 0, y: 0, z: 0 };
    flapT = 0;
    bay2Active = true;
    queued1Y = 9;
    queued2Y = 27;
    queued3Y = 45;
  }

  return {
    pkgPos,
    pkgRot,
    pusherX,
    flapT,
    laserOpacity,
    bay2Active,
    queued1Y,
    queued2Y,
    queued3Y,
  };
}

export default function HeroCadScrollExperience({ onExploreTimeline, onExploreMandates }) {
  const containerRef = useRef(null);
  const mountRef = useRef(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [isOrbitMode, setIsOrbitMode] = useState(false);
  const [renderMode, setRenderMode] = useState('shaded'); // 'shaded' | 'wireframe' | 'blueprint'
  const [showDimensions, setShowDimensions] = useState(true);

  // Three.js References
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const partsGroupRef = useRef({});
  const baseGroupRef = useRef(null);
  const dimsGroupRef = useRef(null);
  const isDraggingRef = useRef(false);
  const mousePrevRef = useRef({ x: 0, y: 0 });
  const cameraAngleRef = useRef({ theta: 0.72, phi: 1.15, radius: 820 });
  const targetAngleRef = useRef({ theta: 0.72, phi: 1.15, radius: 820, explode: 0 });
  const currentExplodeRef = useRef(0);
  const scrollProgressRef = useRef(0);

  // Interactive Simulation Mechanism Refs
  const simMeshRefs = useRef({
    simPackage: null,
    laserCone: null,
    laserLine: null,
    pusher: null,
    servoHorn: null,
    pushrod: null,
    flapBlade: null,
    bay2Led: null,
    queuedPkg1: null,
    queuedPkg2: null,
    queuedPkg3: null,
  });

  // 1. Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x02040c);

    // Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 1, 3500);
    cameraRef.current = camera;
    updateCamera();

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.replaceChildren(renderer.domElement);

    // Studio Lighting Rig (Eliminates all dark silhouettes and guarantees 100% CAD visibility)
    // 1. Hemisphere Light (Soft sky-to-ground ambient bounce, prevents any surface from turning black)
    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x1e293b, 2.0);
    scene.add(hemiLight);

    // 2. Ambient Base Fill Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    // 3. Primary Key Studio Light (High-angle crisp illumination with soft shadows)
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(450, 650, 450);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    scene.add(keyLight);

    // 4. Cool Fill Light (Softens opposite side and highlights metal facets)
    const fillLight = new THREE.DirectionalLight(0x93c5fd, 1.8);
    fillLight.position.set(-450, 300, -350);
    scene.add(fillLight);

    // 5. Frontal Studio Fill Light (Illuminates front faces and hollow bin cavities directly)
    const frontLight = new THREE.DirectionalLight(0xffffff, 1.6);
    frontLight.position.set(0, 350, 500);
    scene.add(frontLight);

    // 6. Signature Aaruush Solar Amber Rim Light
    const solarAmberLight = new THREE.DirectionalLight(0xef6522, 2.8);
    solarAmberLight.position.set(-250, -100, 350);
    scene.add(solarAmberLight);

    // Perspective Floor Grid (Aaruush aesthetic with soft warm glow)
    const gridHelper = new THREE.GridHelper(1100, 44, 0xef6522, 0x2a1c12);
    gridHelper.position.y = -115;
    scene.add(gridHelper);

    // Assembly Group (Centered & perfectly proportioned)
    const baseGroup = new THREE.Group();
    baseGroup.position.set(0, -10, 0);
    baseGroup.scale.set(0.75, 0.75, 0.75);
    baseGroupRef.current = baseGroup;
    scene.add(baseGroup);

    // Dimensions Group (SolidWorks Annotation Overlay)
    const dimsGroup = new THREE.Group();
    dimsGroupRef.current = dimsGroup;
    baseGroup.add(dimsGroup);

    // High-Visibility SolidWorks CAD Materials Palette (Crisp Machined Alloys & Radiant Acrylics)
    const materials = {
      anodizedDark: new THREE.MeshStandardMaterial({
        color: 0x5a6d85,
        metalness: 0.52,
        roughness: 0.32,
      }),
      aluminumBrushed: new THREE.MeshStandardMaterial({
        color: 0xdde6ed,
        metalness: 0.82,
        roughness: 0.18,
      }),
      tSlotExtrusion: new THREE.MeshStandardMaterial({
        color: 0x3d4e63,
        metalness: 0.55,
        roughness: 0.3,
      }),
      chuteAcrylic: new THREE.MeshPhysicalMaterial({
        color: 0x00d2ff,
        metalness: 0.08,
        roughness: 0.05,
        transmission: 0.65,
        transparent: true,
        opacity: 0.85,
        reflectivity: 0.8,
        emissive: 0x0077aa,
        emissiveIntensity: 0.32,
      }),
      towerAcrylic: new THREE.MeshPhysicalMaterial({
        color: 0xe0f2fe,
        metalness: 0.05,
        roughness: 0.08,
        transmission: 0.85,
        transparent: true,
        opacity: 0.55,
      }),
      carbonFiber: new THREE.MeshStandardMaterial({
        color: 0x242e3d,
        metalness: 0.45,
        roughness: 0.4,
      }),
      solarOrange: new THREE.MeshStandardMaterial({
        color: 0xef6522,
        metalness: 0.35,
        roughness: 0.22,
        emissive: 0xef6522,
        emissiveIntensity: 0.22,
      }),
      brassGold: new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.85,
        roughness: 0.2,
      }),
      hardwareSilver: new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        metalness: 0.92,
        roughness: 0.12,
      }),
      rubberFoot: new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.75,
      }),
      binBody: new THREE.MeshStandardMaterial({
        color: 0x485a70,
        metalness: 0.52,
        roughness: 0.3,
      }),
      binRim: new THREE.MeshStandardMaterial({
        color: 0xef6522,
        metalness: 0.35,
        roughness: 0.22,
        emissive: 0xef6522,
        emissiveIntensity: 0.25,
      }),
      cartridgeRed: new THREE.MeshStandardMaterial({
        color: 0xef4444,
        metalness: 0.4,
        roughness: 0.25,
        emissive: 0xdc2626,
        emissiveIntensity: 0.15,
      }),
      cartridgeGold: new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.4,
        roughness: 0.25,
        emissive: 0xd97706,
        emissiveIntensity: 0.15,
      }),
      cartridgeBlue: new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        metalness: 0.4,
        roughness: 0.25,
        emissive: 0x2563eb,
        emissiveIntensity: 0.15,
      }),
      cartridgeGreen: new THREE.MeshStandardMaterial({
        color: 0x10b981,
        metalness: 0.4,
        roughness: 0.25,
        emissive: 0x059669,
        emissiveIntensity: 0.15,
      }),
      dimensionLine: new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 }),
      dimensionOrange: new THREE.LineBasicMaterial({ color: 0xef6522, transparent: true, opacity: 0.9 }),
    };

    // Build the Exact SolidWorks CAD Assemblies
    const parts = {};

    // 1. Baseplate (180.00 ± 0.13 Width x 440mm Length - Solid Bead-Blasted 6061-T6 Aluminum)
    const baseplateGroup = new THREE.Group();
    baseplateGroup.userData = { defaultPos: new THREE.Vector3(0, -90, 0), explodeOffset: new THREE.Vector3(0, -90, 0) };
    const plate = new THREE.Mesh(new THREE.BoxGeometry(440, 12, 180), materials.anodizedDark);
    baseplateGroup.add(plate);

    // M5 Mounting Countersinks
    [[-195, -70], [195, -70], [-195, 70], [195, 70], [0, -70], [0, 70]].forEach(([cx, cz]) => {
      const hole = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.5, 14, 16), materials.hardwareSilver);
      hole.position.set(cx, 0, cz);
      baseplateGroup.add(hole);
    });

    // Solar Orange Datum Corner Markers
    [[-218, 88], [218, 88], [-218, -88], [218, -88]].forEach(([cx, cz]) => {
      const corner = new THREE.Mesh(new THREE.BoxGeometry(4, 13, 4), materials.solarOrange);
      corner.position.set(cx, 0, cz);
      baseplateGroup.add(corner);
    });
    baseplateGroup.position.copy(baseplateGroup.userData.defaultPos);
    baseGroup.add(baseplateGroup);
    parts.baseplate = baseplateGroup;

    // 2. Vertical Cylindrical Support Pillars (Turned 304 Stainless Steel)
    const pillarsGroup = new THREE.Group();
    pillarsGroup.userData = { defaultPos: new THREE.Vector3(-140, -47, 0), explodeOffset: new THREE.Vector3(-30, -40, 0) };
    [[-45], [45]].forEach(([pz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(7.5, 7.5, 74, 24), materials.aluminumBrushed);
      leg.position.set(0, 0, pz);
      pillarsGroup.add(leg);
      const bottomCollar = new THREE.Mesh(new THREE.CylinderGeometry(11, 11, 6, 24), materials.hardwareSilver);
      bottomCollar.position.set(0, -34, pz);
      pillarsGroup.add(bottomCollar);
      const topCollar = new THREE.Mesh(new THREE.CylinderGeometry(11, 11, 6, 24), materials.hardwareSilver);
      topCollar.position.set(0, 34, pz);
      pillarsGroup.add(topCollar);
    });
    pillarsGroup.position.copy(pillarsGroup.userData.defaultPos);
    baseGroup.add(pillarsGroup);
    parts.pillars = pillarsGroup;

    // 3. Elevated Intermediate Staging Platform ("Plane 4" in SolidWorks)
    const platformGroup = new THREE.Group();
    platformGroup.userData = { defaultPos: new THREE.Vector3(-140, -5, 0), explodeOffset: new THREE.Vector3(-60, 15, 0) };
    const platPlate = new THREE.Mesh(new THREE.BoxGeometry(110, 10, 150), materials.anodizedDark);
    platformGroup.add(platPlate);

    // Staging throat feed guide chamfer
    const feedGuide = new THREE.Mesh(new THREE.BoxGeometry(30, 4, 54), materials.aluminumBrushed);
    feedGuide.position.set(38, 7, 16);
    platformGroup.add(feedGuide);

    // Dynamic Feeder Pusher Slider Block
    const pusherBlock = new THREE.Mesh(new THREE.BoxGeometry(24, 8, 36), materials.solarOrange);
    pusherBlock.position.set(-20, 8, 0);
    platformGroup.add(pusherBlock);
    simMeshRefs.current.pusher = pusherBlock;

    platformGroup.position.copy(platformGroup.userData.defaultPos);
    baseGroup.add(platformGroup);
    parts.platform = platformGroup;

    // 4. SolidWorks 400mm Gravity Feeder Magazine Tower (57.00 ± 0.13 x 57.00 Square Hollow Extrusion)
    const towerGroup = new THREE.Group();
    towerGroup.userData = { defaultPos: new THREE.Vector3(-140, 0, 0), explodeOffset: new THREE.Vector3(0, 110, 0) };
    const towerH = 260;
    const tw = 57;
    const wallThick = 3.5;

    // A. Back Side Wall (-Z, Vault Side - solid extruded 6061-T6 plate resting on platform at Y=0)
    const towerBackWall = new THREE.Mesh(new THREE.BoxGeometry(tw, towerH, wallThick), materials.anodizedDark);
    towerBackWall.position.set(0, towerH / 2, -tw / 2 + wallThick / 2);
    towerGroup.add(towerBackWall);

    // B. Rear Wall (-X, Pusher Entrance Side - with 16mm bottom pusher slot)
    const rearWallH = towerH - 16;
    const towerRearUpper = new THREE.Mesh(new THREE.BoxGeometry(wallThick, rearWallH, tw - wallThick * 2), materials.anodizedDark);
    towerRearUpper.position.set(-tw / 2 + wallThick / 2, 16 + rearWallH / 2, 0);
    towerGroup.add(towerRearUpper);

    // Rear lower corner jambs framing the pusher slot
    [-tw / 2 + wallThick + 4, tw / 2 - wallThick - 4].forEach((jz) => {
      const rearJamb = new THREE.Mesh(new THREE.BoxGeometry(wallThick, 16, 8), materials.anodizedDark);
      rearJamb.position.set(-tw / 2 + wallThick / 2, 8, jz);
      towerGroup.add(rearJamb);
    });

    // C. Front Discharge Wall (+X, Facing Slide Chute - with 26mm open discharge throat)
    const frontWallH = towerH - 26;
    const towerFrontUpper = new THREE.Mesh(new THREE.BoxGeometry(wallThick, frontWallH, tw - wallThick * 2), materials.anodizedDark);
    towerFrontUpper.position.set(tw / 2 - wallThick / 2, 26 + frontWallH / 2, 0);
    towerGroup.add(towerFrontUpper);

    // Precision CNC Discharge Throat Lintel Header (marking the 26mm cartridge exit clearance boundary)
    const throatLintel = new THREE.Mesh(new THREE.BoxGeometry(wallThick + 1.5, 3.5, tw - wallThick * 2 + 1), materials.solarOrange);
    throatLintel.position.set(tw / 2 - wallThick / 2, 26 + 1.75, 0);
    towerGroup.add(throatLintel);

    // D. Front Operator Face (+Z, Inspection Window side facing viewer)
    const frontColL = new THREE.Mesh(new THREE.BoxGeometry(9, towerH, wallThick), materials.anodizedDark);
    frontColL.position.set(-tw / 2 + 4.5, towerH / 2, tw / 2 - wallThick / 2);
    towerGroup.add(frontColL);

    const frontColR = new THREE.Mesh(new THREE.BoxGeometry(9, towerH, wallThick), materials.anodizedDark);
    frontColR.position.set(tw / 2 - 4.5, towerH / 2, tw / 2 - wallThick / 2);
    towerGroup.add(frontColR);

    // Polycarbonate Inspection Window (transparent acrylic, Y = 26 to 256)
    const winH = towerH - 30;
    const frontWindow = new THREE.Mesh(new THREE.BoxGeometry(tw - 18, winH, 1.8), materials.towerAcrylic);
    frontWindow.position.set(0, 26 + winH / 2, tw / 2 - wallThick / 2);
    towerGroup.add(frontWindow);

    // CNC Aluminum Window Retaining Trim Strips
    [-18.5, 18.5].forEach((tx) => {
      const trim = new THREE.Mesh(new THREE.BoxGeometry(1.5, winH, 2.2), materials.aluminumBrushed);
      trim.position.set(tx, 26 + winH / 2, tw / 2 - wallThick / 2 + 1.1);
      towerGroup.add(trim);
    });

    // E. Top Intake Collar / Funnel Hopper
    const topHopper = new THREE.Mesh(new THREE.BoxGeometry(tw + 5, 8, tw + 5), materials.solarOrange);
    topHopper.position.set(0, towerH + 4, 0);
    towerGroup.add(topHopper);

    const topHopperInner = new THREE.Mesh(new THREE.BoxGeometry(tw + 1, 4, tw + 1), materials.hardwareSilver);
    topHopperInner.position.set(0, towerH + 1, 0);
    towerGroup.add(topHopperInner);

    // F. Rigid CNC Base-Flange Mounting Brackets (Bolted to platform at Y=0, replacing unstable standoffs)
    [-1, 1].forEach((side) => {
      const bz = side * (tw / 2 + 5);
      // Foot plate
      const foot = new THREE.Mesh(new THREE.BoxGeometry(36, 6, 10), materials.aluminumBrushed);
      foot.position.set(0, 3, bz);
      towerGroup.add(foot);

      // Vertical mounting tab against extrusion side wall
      const tab = new THREE.Mesh(new THREE.BoxGeometry(36, 20, 3.5), materials.aluminumBrushed);
      tab.position.set(0, 10, side * (tw / 2 + 1.75));
      towerGroup.add(tab);

      // M5 Hex socket cap screws
      [-11, 11].forEach((bx) => {
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 2.8, 2.5, 16), materials.hardwareSilver);
        bolt.position.set(bx, 6.5, bz);
        towerGroup.add(bolt);
      });
    });

    // G. 3 Queued Multi-Spectral Media Cartridges (Zero-gap gravity stack directly above active package)
    const createQueuedCartridge = (mat, initialY) => {
      const group = new THREE.Group();
      const body = new THREE.Mesh(new THREE.BoxGeometry(35, 18, 35), mat);
      group.add(body);
      const rim = new THREE.Mesh(new THREE.BoxGeometry(36, 2, 36), materials.hardwareSilver);
      rim.position.set(0, 8, 0);
      group.add(rim);
      const decal = new THREE.Mesh(
        new THREE.PlaneGeometry(22, 22),
        new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.75 })
      );
      decal.rotation.x = -Math.PI / 2;
      decal.position.set(0, 9.1, 0);
      group.add(decal);
      group.position.set(0, initialY, 0);
      return group;
    };

    // Cartridge 1 (Gold) - rests directly on top of Red package (Y = 18 to 36, center at Y = 27)
    const queuedPkg1 = createQueuedCartridge(materials.cartridgeGold, 27);
    towerGroup.add(queuedPkg1);
    simMeshRefs.current.queuedPkg1 = queuedPkg1;

    // Cartridge 2 (Blue) - rests directly on top of Gold package (Y = 36 to 54, center at Y = 45)
    const queuedPkg2 = createQueuedCartridge(materials.cartridgeBlue, 45);
    towerGroup.add(queuedPkg2);
    simMeshRefs.current.queuedPkg2 = queuedPkg2;

    // Cartridge 3 (Green) - rests directly on top of Blue package (Y = 54 to 72, center at Y = 63)
    const queuedPkg3 = createQueuedCartridge(materials.cartridgeGreen, 63);
    towerGroup.add(queuedPkg3);
    simMeshRefs.current.queuedPkg3 = queuedPkg3;

    towerGroup.position.copy(towerGroup.userData.defaultPos);
    baseGroup.add(towerGroup);
    parts.tower = towerGroup;

    // 5. SolidWorks 45.0° Precision Slide Ramp (`Boss-Extrude17`)
    const chuteGroup = new THREE.Group();
    chuteGroup.userData = { defaultPos: new THREE.Vector3(15, -42, 16), explodeOffset: new THREE.Vector3(50, 20, 40) };
    const chuteAngle = -Math.atan2(84, 200);
    const rampLength = Math.hypot(200, 84);
    const chuteWidth = 54;

    // Smooth Optical Cyan Acrylic Slide Floor Plate
    const slideFloor = new THREE.Mesh(new THREE.BoxGeometry(rampLength, 6, chuteWidth), materials.chuteAcrylic);
    slideFloor.rotation.z = chuteAngle;
    chuteGroup.add(slideFloor);

    // Continuous Outer Guide Rail (Far side)
    const outerRail = new THREE.Mesh(new THREE.BoxGeometry(rampLength, 24, 4), materials.tSlotExtrusion);
    outerRail.rotation.z = chuteAngle;
    outerRail.position.set(0, 10, chuteWidth / 2);
    chuteGroup.add(outerRail);

    // Inner Guide Rail with Boss-Extrude17 Arched Diversion Doorway
    const innerRailUpper = new THREE.Mesh(new THREE.BoxGeometry(70, 24, 4), materials.tSlotExtrusion);
    innerRailUpper.rotation.z = chuteAngle;
    innerRailUpper.position.set(-68, 30, -chuteWidth / 2);
    chuteGroup.add(innerRailUpper);

    const innerRailLower = new THREE.Mesh(new THREE.BoxGeometry(70, 24, 4), materials.tSlotExtrusion);
    innerRailLower.rotation.z = chuteAngle;
    innerRailLower.position.set(68, -26, -chuteWidth / 2);
    chuteGroup.add(innerRailLower);

    // Elevated Overhead Gate Portal Arch (High headroom: 32mm clear vertical opening so packages glide underneath!)
    const doorPostUpstream = new THREE.Mesh(new THREE.BoxGeometry(6, 26, 4), materials.tSlotExtrusion);
    doorPostUpstream.rotation.z = chuteAngle;
    doorPostUpstream.position.set(-32, 28, -chuteWidth / 2);
    chuteGroup.add(doorPostUpstream);

    const doorPostDownstream = new THREE.Mesh(new THREE.BoxGeometry(6, 26, 4), materials.tSlotExtrusion);
    doorPostDownstream.rotation.z = chuteAngle;
    doorPostDownstream.position.set(32, 2, -chuteWidth / 2);
    chuteGroup.add(doorPostDownstream);

    const gateLintelArch = new THREE.Mesh(new THREE.BoxGeometry(70, 6, 6), materials.tSlotExtrusion);
    gateLintelArch.rotation.z = chuteAngle;
    gateLintelArch.position.set(0, 36, -chuteWidth / 2);
    chuteGroup.add(gateLintelArch);

    const archTrim = new THREE.Mesh(new THREE.BoxGeometry(68, 2, 6.5), materials.solarOrange);
    archTrim.rotation.z = chuteAngle;
    archTrim.position.set(0, 32.5, -chuteWidth / 2);
    chuteGroup.add(archTrim);

    // Stainless Steel Vertical Hinge Pivot Pin on Outer Rail
    const pivotPin = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 24, 16), materials.hardwareSilver);
    pivotPin.rotation.z = chuteAngle;
    pivotPin.position.set(-18, 16, chuteWidth / 2);
    chuteGroup.add(pivotPin);

    // Bottom Baseplate Landing Pad
    const landingPad = new THREE.Mesh(new THREE.BoxGeometry(34, 8, chuteWidth + 8), materials.anodizedDark);
    landingPad.position.set(rampLength / 2 * Math.cos(chuteAngle) - 4, -40, 0);
    chuteGroup.add(landingPad);

    chuteGroup.position.copy(chuteGroup.userData.defaultPos);
    baseGroup.add(chuteGroup);
    parts.chute = chuteGroup;

    // 6. Mechanically Authentic 32ms Diverter Servo & Flap Mechanism
    const diverterGroup = new THREE.Group();
    diverterGroup.userData = { defaultPos: new THREE.Vector3(15, -42, 16), explodeOffset: new THREE.Vector3(30, 45, -30) };

    // CNC Bracket on outer rail
    const servoMountBracket = new THREE.Mesh(new THREE.BoxGeometry(28, 6, 18), materials.anodizedDark);
    servoMountBracket.rotation.z = chuteAngle;
    servoMountBracket.position.set(-8, 18, chuteWidth / 2 + 10);
    diverterGroup.add(servoMountBracket);

    // Servo Motor Body
    const servoMotor = new THREE.Mesh(new THREE.BoxGeometry(22, 28, 14), materials.solarOrange);
    servoMotor.rotation.z = chuteAngle;
    servoMotor.position.set(-8, 32, chuteWidth / 2 + 10);
    diverterGroup.add(servoMotor);

    // Splined Servo Output Horn
    const servoHorn = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 4, 16), materials.tSlotExtrusion);
    servoHorn.rotation.x = Math.PI / 2;
    servoHorn.rotation.z = chuteAngle;
    servoHorn.position.set(-8, 40, chuteWidth / 2 + 18);
    diverterGroup.add(servoHorn);
    simMeshRefs.current.servoHorn = servoHorn;

    // Pushrod Linkage
    const pushrod = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 24, 8), materials.hardwareSilver);
    pushrod.rotation.x = Math.PI / 2;
    pushrod.rotation.z = chuteAngle;
    pushrod.position.set(-13, 28, chuteWidth / 2 + 8);
    diverterGroup.add(pushrod);
    simMeshRefs.current.pushrod = pushrod;

    // Hinged Deflector Flap Assembly (Pivoting from Outer Rail across to Doorway)
    const flapPivot = new THREE.Group();
    flapPivot.rotation.z = chuteAngle;
    flapPivot.position.set(-18, 16, chuteWidth / 2);

    const flapBlade = new THREE.Group();
    flapPivot.add(flapBlade);

    const hingeSleeve = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 20, 16), materials.brassGold);
    flapBlade.add(hingeSleeve);

    const deflectorBlade = new THREE.Mesh(new THREE.BoxGeometry(68, 18, 2.5), materials.aluminumBrushed);
    deflectorBlade.position.set(34, 0, -1.25);
    flapBlade.add(deflectorBlade);

    const flapCushion = new THREE.Mesh(new THREE.BoxGeometry(68, 3, 2.5), materials.solarOrange);
    flapCushion.position.set(34, -7.5, -1.25);
    flapBlade.add(flapCushion);

    diverterGroup.add(flapPivot);
    simMeshRefs.current.flapBlade = flapBlade;

    diverterGroup.position.copy(diverterGroup.userData.defaultPos);
    baseGroup.add(diverterGroup);
    parts.diverter = diverterGroup;

    // 7. True SolidWorks 3-Bay Sorting Vault
    const binsGroup = new THREE.Group();
    binsGroup.userData = { defaultPos: new THREE.Vector3(15, -62, -44), explodeOffset: new THREE.Vector3(0, -15, -75) };

    const vaultLength = 156;
    const vaultHeight = 44;
    const vaultDepth = 52;
    const bayWidth = 46;
    const dividerThick = 4;

    // Floor Plate
    const vaultFloor = new THREE.Mesh(new THREE.BoxGeometry(vaultLength, 4, vaultDepth), materials.binBody);
    vaultFloor.position.set(0, -vaultHeight / 2 + 2, 0);
    binsGroup.add(vaultFloor);

    // Back Wall
    const vaultBack = new THREE.Mesh(new THREE.BoxGeometry(vaultLength, vaultHeight, 4), materials.binBody);
    vaultBack.position.set(0, 0, vaultDepth / 2 - 2);
    binsGroup.add(vaultBack);

    // End Walls
    const vaultEndL = new THREE.Mesh(new THREE.BoxGeometry(4, vaultHeight, vaultDepth - 8), materials.binBody);
    vaultEndL.position.set(-vaultLength / 2 + 2, 0, 0);
    binsGroup.add(vaultEndL);

    const vaultEndR = new THREE.Mesh(new THREE.BoxGeometry(4, vaultHeight, vaultDepth - 8), materials.binBody);
    vaultEndR.position.set(vaultLength / 2 - 2, 0, 0);
    binsGroup.add(vaultEndR);

    // Dividing Bulkheads
    [-bayWidth / 2 - dividerThick / 2, bayWidth / 2 + dividerThick / 2].forEach((dx) => {
      const bulkhead = new THREE.Mesh(new THREE.BoxGeometry(dividerThick, vaultHeight, vaultDepth - 8), materials.binBody);
      bulkhead.position.set(dx, 0, 0);
      binsGroup.add(bulkhead);
    });

    // Front Wall with Real Through-Slots & Solar Orange Bevel Trims
    [-52, 0, 52].forEach((bx) => {
      const fpL = new THREE.Mesh(new THREE.BoxGeometry(18, vaultHeight, 4), materials.binBody);
      fpL.position.set(bx - 14, 0, -vaultDepth / 2 + 2);
      binsGroup.add(fpL);

      const fpR = new THREE.Mesh(new THREE.BoxGeometry(18, vaultHeight, 4), materials.binBody);
      fpR.position.set(bx + 14, 0, -vaultDepth / 2 + 2);
      binsGroup.add(fpR);

      const slotTop = new THREE.Mesh(new THREE.BoxGeometry(10, 6, 4), materials.binBody);
      slotTop.position.set(bx, vaultHeight / 2 - 3, -vaultDepth / 2 + 2);
      binsGroup.add(slotTop);

      const slotBottom = new THREE.Mesh(new THREE.BoxGeometry(10, 6, 4), materials.binBody);
      slotBottom.position.set(bx, -vaultHeight / 2 + 3, -vaultDepth / 2 + 2);
      binsGroup.add(slotBottom);

      const slotBevel = new THREE.Mesh(new THREE.BoxGeometry(12, 28, 2), materials.solarOrange);
      slotBevel.position.set(bx, 0, -vaultDepth / 2);
      binsGroup.add(slotBevel);

      const rimF = new THREE.Mesh(new THREE.BoxGeometry(bayWidth, 2.5, 3), materials.binRim);
      rimF.position.set(bx, vaultHeight / 2 + 1, -vaultDepth / 2 + 2);
      binsGroup.add(rimF);

      const rimB = new THREE.Mesh(new THREE.BoxGeometry(bayWidth, 2.5, 3), materials.binRim);
      rimB.position.set(bx, vaultHeight / 2 + 1, vaultDepth / 2 - 2);
      binsGroup.add(rimB);
    });

    [-vaultLength / 2 + 2, -26, 26, vaultLength / 2 - 2].forEach((rx) => {
      const rimCross = new THREE.Mesh(new THREE.BoxGeometry(3, 2.5, vaultDepth - 4), materials.binRim);
      rimCross.position.set(rx, vaultHeight / 2 + 1, 0);
      binsGroup.add(rimCross);
    });

    // Sample Sorted Cartridge in Bay 1 (Gold) to illustrate historical sorting
    const sortedPkgGold = new THREE.Mesh(new THREE.BoxGeometry(36, 16, 36), materials.cartridgeGold);
    sortedPkgGold.position.set(-52, -vaultHeight / 2 + 10, 0);
    binsGroup.add(sortedPkgGold);

    // Bay 2 Live Indicator Lamp
    const bay2Led = new THREE.Mesh(
      new THREE.CylinderGeometry(2, 2, 2, 16),
      new THREE.MeshBasicMaterial({ color: 0xef6522, transparent: true, opacity: 0.3 })
    );
    bay2Led.position.set(0, vaultHeight / 2 + 3, -vaultDepth / 2 + 2);
    binsGroup.add(bay2Led);
    simMeshRefs.current.bay2Led = bay2Led;

    binsGroup.position.copy(binsGroup.userData.defaultPos);
    baseGroup.add(binsGroup);
    parts.bins = binsGroup;

    // 8. Vision Gantry Arch & Volumetric Laser Beam
    const avionicsGroup = new THREE.Group();
    avionicsGroup.userData = { defaultPos: new THREE.Vector3(-35, 12, 16), explodeOffset: new THREE.Vector3(0, 95, 0) };
    const bridgeArch = new THREE.Mesh(new THREE.BoxGeometry(18, 6, 80), materials.carbonFiber);
    bridgeArch.position.set(0, 24, 0);
    avionicsGroup.add(bridgeArch);

    const leg1 = new THREE.Mesh(new THREE.BoxGeometry(8, 52, 6), materials.tSlotExtrusion);
    leg1.position.set(0, -4, 38);
    avionicsGroup.add(leg1);

    const leg2 = new THREE.Mesh(new THREE.BoxGeometry(8, 52, 6), materials.tSlotExtrusion);
    leg2.position.set(0, -4, -38);
    avionicsGroup.add(leg2);

    const cam = new THREE.Mesh(new THREE.BoxGeometry(16, 14, 16), materials.solarOrange);
    cam.position.set(0, 16, 0);
    avionicsGroup.add(cam);

    const lens = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 5.5, 8, 16), materials.brassGold);
    lens.position.set(0, 5, 0);
    avionicsGroup.add(lens);

    // Dynamic Volumetric Laser Scan Cone (Projected from camera onto passing media)
    const laserConeGeom = new THREE.ConeGeometry(24, 42, 16, 1, true);
    const laserConeMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const laserCone = new THREE.Mesh(laserConeGeom, laserConeMat);
    laserCone.rotation.x = Math.PI; // point down
    laserCone.position.set(0, -14, 0);
    avionicsGroup.add(laserCone);
    simMeshRefs.current.laserCone = laserCone;

    avionicsGroup.position.copy(avionicsGroup.userData.defaultPos);
    baseGroup.add(avionicsGroup);
    parts.avionics = avionicsGroup;

    // 9. Active Animated Simulation Package (Moves through the entire machine as user scrolls!)
    const simPkgGroup = new THREE.Group();
    const simPkgBody = new THREE.Mesh(new THREE.BoxGeometry(35, 18, 35), materials.cartridgeRed);
    simPkgGroup.add(simPkgBody);

    const simPkgRim = new THREE.Mesh(new THREE.BoxGeometry(36, 2, 36), materials.solarOrange);
    simPkgRim.position.set(0, 8, 0);
    simPkgGroup.add(simPkgRim);

    // Top Technical Decal Target
    const decalGeom = new THREE.PlaneGeometry(22, 22);
    const decalMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    const decalMesh = new THREE.Mesh(decalGeom, decalMat);
    decalMesh.rotation.x = -Math.PI / 2;
    decalMesh.position.set(0, 9.1, 0);
    simPkgGroup.add(decalMesh);

    simPkgGroup.position.set(-140, 9, 0);
    baseGroup.add(simPkgGroup);
    simMeshRefs.current.simPackage = simPkgGroup;

    partsGroupRef.current = parts;

    // 10. Build SolidWorks Dimension Datum Lines matching media_1790911941997.png
    const createDimLine = (p1, p2, mat) => {
      const geom = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      return new THREE.Line(geom, mat);
    };
    // Tower 400.00 ± 0.13 mm Height Datum
    dimsGroup.add(createDimLine(new THREE.Vector3(-185, 0, 0), new THREE.Vector3(-185, 262, 0), materials.dimensionLine));
    dimsGroup.add(createDimLine(new THREE.Vector3(-192, 262, 0), new THREE.Vector3(-140, 262, 0), materials.dimensionLine));
    dimsGroup.add(createDimLine(new THREE.Vector3(-192, 0, 0), new THREE.Vector3(-140, 0, 0), materials.dimensionLine));

    // Tower 57.00 ± 0.13 mm Width Datum (Top Mouth)
    dimsGroup.add(createDimLine(new THREE.Vector3(-168.5, 275, -28.5), new THREE.Vector3(-111.5, 275, -28.5), materials.dimensionLine));
    dimsGroup.add(createDimLine(new THREE.Vector3(-168.5, 262, -28.5), new THREE.Vector3(-168.5, 280, -28.5), materials.dimensionLine));
    dimsGroup.add(createDimLine(new THREE.Vector3(-111.5, 262, -28.5), new THREE.Vector3(-111.5, 280, -28.5), materials.dimensionLine));

    // Baseplate 180.00 ± 0.13 mm Width Datum
    dimsGroup.add(createDimLine(new THREE.Vector3(210, -90, -90), new THREE.Vector3(210, -90, 90), materials.dimensionOrange));
    dimsGroup.add(createDimLine(new THREE.Vector3(195, -90, -90), new THREE.Vector3(220, -90, -90), materials.dimensionOrange));
    dimsGroup.add(createDimLine(new THREE.Vector3(195, -90, 90), new THREE.Vector3(220, -90, 90), materials.dimensionOrange));

    // Lateral Gate Doorway Datum (`Boss-Extrude17` Arch)
    dimsGroup.add(createDimLine(new THREE.Vector3(-25, 2, -18), new THREE.Vector3(-25, -24, -18), materials.dimensionLine));
    dimsGroup.add(createDimLine(new THREE.Vector3(45, -24, -18), new THREE.Vector3(45, -50, -18), materials.dimensionLine));

    // Mouse Drag Listeners (Free Orbit Mode)
    const domElement = renderer.domElement;
    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      mousePrevRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - mousePrevRef.current.x;
      const dy = e.clientY - mousePrevRef.current.y;
      mousePrevRef.current = { x: e.clientX, y: e.clientY };

      cameraAngleRef.current.theta -= dx * 0.006;
      cameraAngleRef.current.phi = Math.max(0.1, Math.min(Math.PI / 2.05, cameraAngleRef.current.phi - dy * 0.006));
      updateCamera();
    };

    const handleMouseUp = () => { isDraggingRef.current = false; };
    const handleWheel = (e) => {
      if (!isOrbitMode) return;
      e.preventDefault();
      cameraAngleRef.current.radius = Math.max(450, Math.min(1100, cameraAngleRef.current.radius + e.deltaY * 0.4));
      updateCamera();
    };

    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    domElement.addEventListener('wheel', handleWheel, { passive: false });

    // Animation & Real-Time Simulation Loop
    let animId;
    let clock = new THREE.Clock();

    const renderLoop = () => {
      animId = requestAnimationFrame(renderLoop);
      const elapsedTime = clock.getElapsedTime();

      // Smooth Lerp Camera & Explosion to Targets
      if (!isDraggingRef.current) {
        cameraAngleRef.current.theta += (targetAngleRef.current.theta - cameraAngleRef.current.theta) * 0.08;
        cameraAngleRef.current.phi += (targetAngleRef.current.phi - cameraAngleRef.current.phi) * 0.08;
        cameraAngleRef.current.radius += (targetAngleRef.current.radius - cameraAngleRef.current.radius) * 0.08;
        updateCamera();

        currentExplodeRef.current += (targetAngleRef.current.explode - currentExplodeRef.current) * 0.08;
        applyExplode(currentExplodeRef.current);

        baseGroup.position.y = -10 + Math.sin(elapsedTime * 1.5) * 3;
      }

      renderer.render(scene, camera);
    };
    renderLoop();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElement.removeEventListener('wheel', handleWheel);
      renderer.dispose();
    };
  }, []);

  const updateCamera = () => {
    if (!cameraRef.current) return;
    const { theta, phi, radius } = cameraAngleRef.current;
    cameraRef.current.position.x = radius * Math.sin(phi) * Math.sin(theta);
    cameraRef.current.position.y = radius * Math.cos(phi);
    cameraRef.current.position.z = radius * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.lookAt(0, -5, 0);
  };

  const applyExplode = (amount) => {
    Object.values(partsGroupRef.current).forEach((group) => {
      if (!group || !group.userData) return;
      const def = group.userData.defaultPos;
      const exp = group.userData.explodeOffset;
      group.position.set(
        def.x + exp.x * amount,
        def.y + exp.y * amount,
        def.z + exp.z * amount
      );
    });
  };

  // 2. Scroll-Driven 3D Interpolation & Physical Mechanism Simulation
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;

      const p = Math.max(0, Math.min(1, -rect.top / totalScrollable));
      scrollProgressRef.current = p;
      setScrollProgress(p);

      // Continuous Waypoint Interpolation
      const interpolated = interpolateWaypoints(p);
      setActiveStep(interpolated.step);

      targetAngleRef.current.theta = interpolated.theta;
      targetAngleRef.current.phi = interpolated.phi;
      targetAngleRef.current.radius = interpolated.radius;
      targetAngleRef.current.explode = interpolated.explode;

      // Update Physical Working Simulation
      const sim = calculateSimulationState(p, interpolated.explode);

      // Update 3D Meshes in Scene
      const {
        simPackage,
        laserCone,
        pusher,
        servoHorn,
        pushrod,
        flapBlade,
        bay2Led,
        queuedPkg1,
        queuedPkg2,
        queuedPkg3,
      } = simMeshRefs.current;
      if (simPackage) {
        simPackage.position.set(sim.pkgPos.x, sim.pkgPos.y, sim.pkgPos.z);
        simPackage.rotation.set(sim.pkgRot.x, sim.pkgRot.y, sim.pkgRot.z);
      }
      if (pusher) {
        pusher.position.x = sim.pusherX;
      }
      if (queuedPkg1) {
        queuedPkg1.position.y = sim.queued1Y;
      }
      if (queuedPkg2) {
        queuedPkg2.position.y = sim.queued2Y;
      }
      if (queuedPkg3) {
        queuedPkg3.position.y = sim.queued3Y;
      }
      if (laserCone) {
        laserCone.material.opacity = sim.laserOpacity * 0.45;
      }
      if (flapBlade) {
        // Rotates deflection baffle blade from outer rail across the chute bed to inner rail doorway
        flapBlade.rotation.y = sim.flapT * 0.88;
      }
      if (servoHorn) {
        // Servo horn rotates in sync with gate stroke
        servoHorn.rotation.z = Math.atan2(84, 200) + sim.flapT * 0.85;
      }
      if (pushrod) {
        // Pushrod strokes forward as servo turns
        pushrod.position.x = -13 + sim.flapT * 6;
      }
      if (bay2Led) {
        bay2Led.material.opacity = sim.bay2Active ? 0.95 : 0.25;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Jump to specific step
  const scrollToStep = (stepIdx) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const containerTop = rect.top + scrollTop;
    const totalScrollable = containerRef.current.clientHeight - window.innerHeight;
    const targetP = WAYPOINTS[stepIdx].p;
    window.scrollTo({
      top: containerTop + targetP * totalScrollable + 5,
      behavior: 'smooth'
    });
  };

  // Render Mode handling
  useEffect(() => {
    if (!sceneRef.current) return;
    Object.values(partsGroupRef.current).forEach((group) => {
      group.traverse((child) => {
        if (child.isMesh) {
          if (!child.userData.origMaterial) child.userData.origMaterial = child.material;
          if (renderMode === 'wireframe') {
            child.material = new THREE.MeshBasicMaterial({ color: 0xef6522, wireframe: true });
          } else if (renderMode === 'blueprint') {
            child.material = new THREE.MeshBasicMaterial({ color: 0x0284c7, wireframe: true, transparent: true, opacity: 0.85 });
          } else {
            child.material = child.userData.origMaterial;
          }
        }
      });
    });
    if (dimsGroupRef.current) {
      dimsGroupRef.current.visible = showDimensions;
    }
  }, [renderMode, showDimensions]);

  return (
    <div ref={containerRef} className="hero-scroll-track" style={{ height: '360vh', position: 'relative' }}>
      {/* Sticky Fullscreen 3D CAD Stage */}
      <div className="hero-scroll-viewport">
        {/* Aaruush Horizon Glow Backdrop */}
        <div className="hero-solar-backdrop" />
        <div className="hero-solar-glow" />

        {/* 3D WebGL Canvas Mount - Centerpiece */}
        <div ref={mountRef} className="hero-cad-canvas" />

        {/* Live Simulation Telemetry HUD Widget */}
        {/* Bottom-Left Floating Mode Dock */}
        <div className="hero-mode-dock">
          {['shaded', 'wireframe', 'blueprint'].map((m) => (
            <button
              key={m}
              onClick={() => setRenderMode(m)}
              className={`hud-mode-pill ${renderMode === m ? 'active' : ''}`}
            >
              {m === 'shaded' ? 'Solid' : m}
            </button>
          ))}
          <button
            onClick={() => setShowDimensions(!showDimensions)}
            className={`hud-mode-pill ${showDimensions ? 'active' : ''}`}
            title="Toggle Dimension Annotations"
          >
            <Ruler size={13} />
            <span>Dims</span>
          </button>
          <div className="dock-divider" />
          <button
            onClick={() => setIsOrbitMode(!isOrbitMode)}
            className={`hud-mode-pill ${isOrbitMode ? 'active' : ''}`}
            title="Click & Drag to freely orbit 3D model"
          >
            <Compass size={13} />
            <span>{isOrbitMode ? 'Orbit Active' : 'Free Orbit'}</span>
          </button>
        </div>

        {/* Right Step Navigator (Interactive 7-Step Aaruush Scrubber) */}
        <div className="hero-cad-step-nav">
          {STEPS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => scrollToStep(idx)}
              className={`step-nav-item ${activeStep === idx ? 'active' : ''}`}
            >
              <span className="step-nav-num">{item.label}</span>
              <span className="step-nav-label">{item.title}</span>
            </button>
          ))}
        </div>

        {/* Sleek Minimal Step Caption Capsule (Bottom-Center, Non-Intrusive) */}
        <div className="hero-step-caption-capsule">
          <span className="step-capsule-tag">{STEPS[activeStep]?.label}</span>
          <span className="step-capsule-dot" />
          <span className="step-capsule-title">{STEPS[activeStep]?.title}</span>
          <span className="step-capsule-sep">•</span>
          <span className="step-capsule-desc">{STEPS[activeStep]?.desc}</span>
        </div>

        {/* Bottom Scroll Cue */}
        <div
          className="hero-scroll-cue"
          style={{
            opacity: Math.max(0, 1 - scrollProgress * 7),
            pointerEvents: 'none',
          }}
        >
          <span className="cue-text">SCROLL TO SIMULATE SORTING SEQUENCE</span>
          <ChevronDown size={18} className="prompt-chevron" />
        </div>
      </div>
    </div>
  );
}
