import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  RotateCcw,
  Sliders,
  Download,
  CheckCircle2,
  Info
} from 'lucide-react';

export const CAD_PARTS = [
  {
    id: 'chassis',
    name: 'Baseplate & T-Slot Frame',
    domain: 'SAMBED',
    material: 'Anodized 6061-T6 Aluminum',
    dimensions: '420mm × 260mm × 25mm',
    weight: '1,420 g',
    specs: 'Laser-etched metric calibration grid, vibration-damped polymer feet.',
    description: 'Forms the structural baseline for the entire sorting rig, absorbing motor and flap deceleration shocks.',
  },
  {
    id: 'hopper',
    name: 'Vertical Gravity Hopper',
    domain: 'SAMBED',
    material: 'Clear Cast Acrylic & Standoffs',
    dimensions: '115mm × 115mm × 320mm',
    weight: '680 g',
    specs: 'Stack capacity: 18 sample tiles (80×80×15mm each), low-friction interior guide rails.',
    description: 'Maintains vertical alignment of raw package batches. Gravity-fed with zero-jam taper clearance at the bottom exit gate.',
  },
  {
    id: 'pusher',
    name: 'DC Indexing Pusher',
    domain: 'SAMBED',
    material: 'Brass Pinion & CNC Delrin Cam',
    dimensions: '140mm × 65mm × 45mm',
    weight: '340 g',
    specs: '12V DC Planetary Gear Motor, 120 RPM, microswitch homing limit.',
    description: 'Indexes one tile per cycle from the bottom of the gravity stack onto the 45° slide chute at up to 2 units/sec.',
  },
  {
    id: 'chute',
    name: '45° Precision Slide Chute',
    domain: 'SAMBED',
    material: 'Laser-Cut Acrylic with Low-Friction Coating',
    dimensions: '360mm × 110mm × 18mm',
    weight: '510 g',
    specs: 'Exact 45.0° inclination slope, dual side retainers.',
    description: 'Guarantees uniform velocity during camera fly-by, providing optimal motion-blur resistance for the SIFT/ORB vision algorithm.',
  },
  {
    id: 'camera_gantry',
    name: 'Vision Sensor Gantry',
    domain: 'SIESED',
    material: 'Carbon-Fiber Reinforced Arch & PETG Housing',
    dimensions: '220mm × 80mm × 240mm',
    weight: '290 g',
    specs: 'High-speed optical sensor, 5500K ring diffuser, 180mm focal distance.',
    description: 'Overhead optical bridge housing the computer vision sensor. Captures RGB data under uniform illumination.',
  },
  {
    id: 'diverter_flap',
    name: 'Servo Diversion Trapdoor',
    domain: 'SAMBED',
    material: 'Aviation Aluminum & Metal-Gear Servo',
    dimensions: '95mm × 85mm × 3mm',
    weight: '115 g',
    specs: 'Servo response: 32ms for 90° actuation, 4.8V-6.0V.',
    description: 'Dynamic trapdoor embedded in the slide. When a Key Competitor is detected, it swings open in under 35ms to divert the tile into isolation.',
  },
  {
    id: 'isolation_bin',
    name: 'Competitor Quarantine Bin',
    domain: 'SAMBED',
    material: 'Reinforced Polycarbonate with Neoprene Damping',
    dimensions: '150mm × 120mm × 140mm',
    weight: '380 g',
    specs: 'Capacity: 12 isolated targets, integrated infrared beam break sensor.',
    description: 'Quarantine chamber located beneath the trapdoor flap to collect target competitor media for detailed analysis.',
  },
  {
    id: 'avionics',
    name: 'Embedded Telemetry Hub',
    domain: 'SPACED',
    material: 'Shielded ABS Enclosure with Aluminum Heat Sinks',
    dimensions: '130mm × 90mm × 40mm',
    weight: '210 g',
    specs: 'Arduino MCU, Optocoupled Motor Drivers, 115200 Baud UART, 16×2 LCD.',
    description: 'Bridges Python computer vision decision packets to real-time hardware actuation and drives the live LCD status readout.',
  },
];

export default function CadViewer() {
  const mountRef = useRef(null);
  const [selectedPartId, setSelectedPartId] = useState('chassis');
  const [renderMode, setRenderMode] = useState('shaded'); // 'shaded' | 'wireframe' | 'blueprint'
  const [explodedAmount, setExplodedAmount] = useState(0); // 0 to 1
  const [autoRotate, setAutoRotate] = useState(true);

  // References for Three.js objects
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const partsGroupRef = useRef({});
  const isDraggingRef = useRef(false);
  const mousePrevRef = useRef({ x: 0, y: 0 });
  const cameraAngleRef = useRef({ theta: Math.PI / 4, phi: Math.PI / 3.8, radius: 680 });

  const activePart = CAD_PARTS.find((p) => p.id === selectedPartId) || CAD_PARTS[0];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. SCENE
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x02040c);

    // 2. CAMERA
    const camera = new THREE.PerspectiveCamera(40, width / height, 1, 2500);
    cameraRef.current = camera;
    updateCameraPosition();

    // 3. RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.replaceChildren(renderer.domElement);

    // 4. LIGHTS
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(300, 500, 300);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x94a3b8, 1.0);
    fillLight.position.set(-300, 200, -200);
    scene.add(fillLight);

    const solarAmberLight = new THREE.DirectionalLight(0xef6522, 1.4);
    solarAmberLight.position.set(0, -200, 300);
    scene.add(solarAmberLight);

    // 5. GROUND GRID
    const gridHelper = new THREE.GridHelper(800, 32, 0xef6522, 0x1f140d);
    gridHelper.position.y = -100;
    scene.add(gridHelper);

    // 6. 3D ROBOT ASSEMBLY
    const baseGroup = new THREE.Group();
    scene.add(baseGroup);

    const materials = {
      aluminum: new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        metalness: 0.8,
        roughness: 0.3,
      }),
      darkMetal: new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.9,
        roughness: 0.4,
      }),
      acrylicClear: new THREE.MeshPhysicalMaterial({
        color: 0xe2e8f0,
        transparent: true,
        opacity: 0.4,
        roughness: 0.1,
        transmission: 0.85,
        thickness: 4,
      }),
      acrylicAccent: new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.5,
        roughness: 0.15,
      }),
      copper: new THREE.MeshStandardMaterial({
        color: 0xb45309,
        metalness: 0.7,
        roughness: 0.3,
      }),
    };

    // Part 1: Chassis
    const chassisGroup = new THREE.Group();
    chassisGroup.userData = { id: 'chassis', defaultPos: new THREE.Vector3(0, -90, 0), explodeOffset: new THREE.Vector3(0, 0, 0) };
    const basePlate = new THREE.Mesh(new THREE.BoxGeometry(420, 16, 260), materials.darkMetal);
    basePlate.castShadow = true;
    basePlate.receiveShadow = true;
    chassisGroup.add(basePlate);

    [-115, 115].forEach((z) => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(400, 20, 20), materials.aluminum);
      rail.position.set(0, 15, z);
      chassisGroup.add(rail);
    });

    [[-190, -110], [-190, 110], [190, -110], [190, 110]].forEach(([x, z]) => {
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(16, 18, 12, 16), materials.darkMetal);
      foot.position.set(x, -14, z);
      chassisGroup.add(foot);
    });
    baseGroup.add(chassisGroup);
    partsGroupRef.current.chassis = chassisGroup;

    // Part 2: Hopper
    const hopperGroup = new THREE.Group();
    hopperGroup.userData = { id: 'hopper', defaultPos: new THREE.Vector3(-140, 60, 0), explodeOffset: new THREE.Vector3(-50, 160, 0) };
    [[-45, -45], [-45, 45], [45, -45], [45, 45]].forEach(([x, z]) => {
      const post = new THREE.Mesh(new THREE.BoxGeometry(10, 220, 10), materials.aluminum);
      post.position.set(x, 20, z);
      hopperGroup.add(post);
    });
    const acrylicWallZ = new THREE.Mesh(new THREE.BoxGeometry(86, 210, 4), materials.acrylicClear);
    acrylicWallZ.position.set(0, 20, 45);
    hopperGroup.add(acrylicWallZ);
    const acrylicWallBack = new THREE.Mesh(new THREE.BoxGeometry(86, 210, 4), materials.acrylicClear);
    acrylicWallBack.position.set(0, 20, -45);
    hopperGroup.add(acrylicWallBack);
    for (let i = 0; i < 5; i++) {
      const tile = new THREE.Mesh(
        new THREE.BoxGeometry(75, 12, 75),
        i % 2 === 0 ? materials.acrylicAccent : materials.copper
      );
      tile.position.set(0, -60 + i * 22, 0);
      hopperGroup.add(tile);
    }
    baseGroup.add(hopperGroup);
    partsGroupRef.current.hopper = hopperGroup;

    // Part 3: Pusher
    const pusherGroup = new THREE.Group();
    pusherGroup.userData = { id: 'pusher', defaultPos: new THREE.Vector3(-195, -60, 0), explodeOffset: new THREE.Vector3(-140, 0, 0) };
    const motorHousing = new THREE.Mesh(new THREE.CylinderGeometry(20, 20, 55, 20), materials.darkMetal);
    motorHousing.rotation.z = Math.PI / 2;
    pusherGroup.add(motorHousing);
    const pushArm = new THREE.Mesh(new THREE.BoxGeometry(70, 12, 28), materials.aluminum);
    pushArm.position.set(38, 0, 0);
    pusherGroup.add(pushArm);
    baseGroup.add(pusherGroup);
    partsGroupRef.current.pusher = pusherGroup;

    // Part 4: 45° Chute
    const chuteGroup = new THREE.Group();
    chuteGroup.userData = { id: 'chute', defaultPos: new THREE.Vector3(20, -25, 0), explodeOffset: new THREE.Vector3(0, 80, 0) };
    const rampWidth = 90;
    const rampLength = 300;
    const rampMesh = new THREE.Mesh(new THREE.BoxGeometry(rampLength, 8, rampWidth), materials.aluminum);
    rampMesh.rotation.z = -Math.PI / 4;
    chuteGroup.add(rampMesh);
    [-rampWidth / 2 - 4, rampWidth / 2 + 4].forEach((z) => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(rampLength, 24, 6), materials.acrylicAccent);
      rail.rotation.z = -Math.PI / 4;
      rail.position.set(0, 8 * Math.cos(Math.PI / 4), z);
      chuteGroup.add(rail);
    });
    baseGroup.add(chuteGroup);
    partsGroupRef.current.chute = chuteGroup;

    // Part 5: Gantry
    const gantryGroup = new THREE.Group();
    gantryGroup.userData = { id: 'camera_gantry', defaultPos: new THREE.Vector3(-10, 85, 0), explodeOffset: new THREE.Vector3(0, 180, 70) };
    const leftPillar = new THREE.Mesh(new THREE.BoxGeometry(16, 170, 18), materials.darkMetal);
    leftPillar.position.set(0, -20, -90);
    gantryGroup.add(leftPillar);
    const rightPillar = new THREE.Mesh(new THREE.BoxGeometry(16, 170, 18), materials.darkMetal);
    rightPillar.position.set(0, -20, 90);
    gantryGroup.add(rightPillar);
    const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(22, 16, 198), materials.darkMetal);
    crossBeam.position.set(0, 65, 0);
    gantryGroup.add(crossBeam);
    const camBody = new THREE.Mesh(new THREE.BoxGeometry(38, 38, 38), materials.aluminum);
    camBody.position.set(0, 40, 0);
    gantryGroup.add(camBody);
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(14, 16, 22, 24), materials.darkMetal);
    lens.position.set(0, 15, 0);
    gantryGroup.add(lens);
    baseGroup.add(gantryGroup);
    partsGroupRef.current.camera_gantry = gantryGroup;

    // Part 6: Flap
    const diverterGroup = new THREE.Group();
    diverterGroup.userData = { id: 'diverter_flap', defaultPos: new THREE.Vector3(45, -50, 0), explodeOffset: new THREE.Vector3(100, 60, -80) };
    const servoBody = new THREE.Mesh(new THREE.BoxGeometry(24, 38, 32), materials.darkMetal);
    servoBody.position.set(0, 10, -65);
    diverterGroup.add(servoBody);
    const flapMesh = new THREE.Mesh(new THREE.BoxGeometry(70, 4, 80), materials.aluminum);
    flapMesh.position.set(0, 0, 0);
    flapMesh.rotation.z = -Math.PI / 4;
    diverterGroup.add(flapMesh);
    baseGroup.add(diverterGroup);
    partsGroupRef.current.diverter_flap = diverterGroup;

    // Part 7: Quarantine Bin
    const isolationGroup = new THREE.Group();
    isolationGroup.userData = { id: 'isolation_bin', defaultPos: new THREE.Vector3(55, -80, 0), explodeOffset: new THREE.Vector3(120, -50, 80) };
    const binBox = new THREE.Mesh(new THREE.BoxGeometry(100, 60, 110), materials.acrylicClear);
    isolationGroup.add(binBox);
    const rim = new THREE.Mesh(new THREE.BoxGeometry(106, 6, 116), materials.acrylicAccent);
    rim.position.set(0, 30, 0);
    isolationGroup.add(rim);
    baseGroup.add(isolationGroup);
    partsGroupRef.current.isolation_bin = isolationGroup;

    // Part 8: Avionics
    const avionicsGroup = new THREE.Group();
    avionicsGroup.userData = { id: 'avionics', defaultPos: new THREE.Vector3(-30, -78, 90), explodeOffset: new THREE.Vector3(0, -60, 130) };
    const pcbEnclosure = new THREE.Mesh(new THREE.BoxGeometry(105, 20, 75), materials.darkMetal);
    avionicsGroup.add(pcbEnclosure);
    const lcdScreen = new THREE.Mesh(new THREE.BoxGeometry(60, 3, 22), materials.acrylicAccent);
    lcdScreen.position.set(0, 11, -8);
    avionicsGroup.add(lcdScreen);
    baseGroup.add(avionicsGroup);
    partsGroupRef.current.avionics = avionicsGroup;

    // Initial transforms
    applyExplodedTransforms(explodedAmount);

    // Orbit Controls
    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      mousePrevRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - mousePrevRef.current.x;
      const dy = e.clientY - mousePrevRef.current.y;
      cameraAngleRef.current.theta -= dx * 0.007;
      cameraAngleRef.current.phi = Math.max(
        0.1,
        Math.min(Math.PI / 2 - 0.05, cameraAngleRef.current.phi + dy * 0.007)
      );
      mousePrevRef.current = { x: e.clientX, y: e.clientY };
      updateCameraPosition();
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e) => {
      e.preventDefault();
      cameraAngleRef.current.radius = Math.max(
        320,
        Math.min(1300, cameraAngleRef.current.radius + e.deltaY * 0.8)
      );
      updateCameraPosition();
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    domElement.addEventListener('wheel', handleWheel, { passive: false });

    // Render loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (autoRotate && !isDraggingRef.current) {
        cameraAngleRef.current.theta += 0.003;
        updateCameraPosition();
      }
      renderer.render(scene, camera);
    };
    animate();

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

  const updateCameraPosition = () => {
    if (!cameraRef.current) return;
    const { theta, phi, radius } = cameraAngleRef.current;
    cameraRef.current.position.x = radius * Math.sin(phi) * Math.sin(theta);
    cameraRef.current.position.y = radius * Math.cos(phi);
    cameraRef.current.position.z = radius * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.lookAt(0, -10, 0);
  };

  const applyExplodedTransforms = (amount) => {
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

  const handleExplodeChange = (e) => {
    const val = parseFloat(e.target.value);
    setExplodedAmount(val);
    applyExplodedTransforms(val);
  };

  useEffect(() => {
    if (!sceneRef.current) return;
    Object.values(partsGroupRef.current).forEach((group) => {
      group.traverse((child) => {
        if (child.isMesh) {
          if (!child.userData.origMaterial) {
            child.userData.origMaterial = child.material;
          }
          if (renderMode === 'wireframe') {
            child.material = new THREE.MeshBasicMaterial({
              color: 0x38bdf8,
              wireframe: true,
            });
          } else if (renderMode === 'blueprint') {
            child.material = new THREE.MeshBasicMaterial({
              color: 0x0284c7,
              wireframe: false,
              transparent: true,
              opacity: 0.85,
            });
          } else {
            child.material = child.userData.origMaterial;
          }
        }
      });
    });

    if (renderMode === 'blueprint') {
      sceneRef.current.background = new THREE.Color(0x04182e);
    } else {
      sceneRef.current.background = new THREE.Color(0x090d16);
    }
  }, [renderMode]);

  useEffect(() => {
    Object.entries(partsGroupRef.current).forEach(([id, group]) => {
      const isSelected = id === selectedPartId;
      group.traverse((child) => {
        if (child.isMesh && child.material) {
          if (isSelected) {
            child.material.emissive = new THREE.Color(0x004466);
          } else if (child.material.emissive) {
            child.material.emissive = new THREE.Color(0x000000);
          }
        }
      });
    });
  }, [selectedPartId]);

  const setCameraPreset = (preset) => {
    setAutoRotate(false);
    if (preset === 'iso') {
      cameraAngleRef.current = { theta: Math.PI / 4, phi: Math.PI / 3.8, radius: 680 };
    } else if (preset === 'side') {
      cameraAngleRef.current = { theta: 0, phi: Math.PI / 2.2, radius: 620 };
    } else if (preset === 'top') {
      cameraAngleRef.current = { theta: 0, phi: 0.1, radius: 720 };
    } else if (preset === 'front') {
      cameraAngleRef.current = { theta: Math.PI / 2, phi: Math.PI / 2.2, radius: 600 };
    }
    updateCameraPosition();
  };

  const handleExportSnapshot = () => {
    if (!rendererRef.current) return;
    const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `SEGROBOT_CAD_${selectedPartId}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="cad-cockpit-frame">
      {/* Cockpit HUD Header */}
      <div className="cad-cockpit-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h3 className="cad-cockpit-title">SEGROBOT 3D Digital Twin Studio</h3>
            <span className="cad-cockpit-tag">8 Sub-Assemblies</span>
          </div>
          <p className="cad-cockpit-sub">
            Interactive SolidWorks Kinematics Inspection Model • Exploded View Telemetry
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => {
              setExplodedAmount(0);
              applyExplodedTransforms(0);
              setCameraPreset('iso');
            }}
            className="btn-cockpit-pill"
          >
            <RotateCcw size={13} color="var(--accent-orange)" />
            <span>Reset View</span>
          </button>
          <button onClick={handleExportSnapshot} className="btn-cockpit-pill">
            <Download size={13} color="var(--accent-orange)" />
            <span>Snapshot</span>
          </button>
        </div>
      </div>

      {/* Main Cockpit Grid */}
      <div className="cad-cockpit-grid">
        {/* Three.js Viewport */}
        <div className="cad-cockpit-viewport">
          <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

          {/* Mode Pills */}
          <div className="cad-cockpit-modes">
            {['shaded', 'wireframe', 'blueprint'].map((mode) => (
              <button
                key={mode}
                onClick={() => setRenderMode(mode)}
                className={`cad-cockpit-mode-btn ${renderMode === mode ? 'active' : ''}`}
              >
                {mode === 'shaded' ? 'Solid' : mode}
              </button>
            ))}
          </div>

          {/* View Presets */}
          <div className="cad-cockpit-angles">
            {['iso', 'front', 'side', 'top'].map((preset) => (
              <button
                key={preset}
                onClick={() => setCameraPreset(preset)}
                className="btn-cockpit-pill"
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.6875rem' }}
              >
                {preset.toUpperCase()}
              </button>
            ))}
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className="btn-cockpit-pill"
              style={{
                padding: '0.2rem 0.5rem',
                color: autoRotate ? 'var(--accent-orange)' : 'var(--text-faint)'
              }}
              title="Toggle Auto Rotation"
            >
              <RotateCcw size={12} />
            </button>
          </div>

          {/* Exploded Slider Dock */}
          <div className="cad-cockpit-slider-dock">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-orange)' }}>
              <Sliders size={13} />
              <span>Explode:</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={explodedAmount}
              onChange={handleExplodeChange}
              style={{
                width: '120px',
                accentColor: 'var(--accent-orange)',
                cursor: 'pointer'
              }}
            />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#ffffff', minWidth: '35px' }}>
              {Math.round(explodedAmount * 100)}%
            </span>
          </div>

          <div style={{ position: 'absolute', bottom: '0.75rem', right: '0.85rem', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--text-faint)', pointerEvents: 'none' }}>
            Drag to orbit • Scroll to zoom
          </div>
        </div>

        {/* Sidebar Inspector */}
        <div className="cad-cockpit-sidebar">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.875rem', fontWeight: 700, color: '#ffffff' }}>Components</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--accent-orange)' }}>Click to inspect</span>
            </div>

            {/* Part Selection Pills */}
            <div className="cad-parts-selector">
              {CAD_PARTS.map((part) => (
                <button
                  key={part.id}
                  onClick={() => setSelectedPartId(part.id)}
                  className={`cad-part-pill ${part.id === selectedPartId ? 'selected' : ''}`}
                >
                  <span>{part.name.split(' ')[0]}</span>
                  <span className="cad-part-domain">{part.domain}</span>
                </button>
              ))}
            </div>

            {/* Spec Details Card */}
            <div className="cad-spec-card">
              <div className="cad-spec-header">
                <div>
                  <span className="cad-spec-domain-tag">
                    {activePart.domain} Division
                  </span>
                  <h4 className="cad-spec-name">{activePart.name}</h4>
                </div>
                <CheckCircle2 size={16} color="var(--accent-orange)" />
              </div>

              <p className="cad-spec-desc">{activePart.description}</p>

              <div className="cad-attrs-list">
                <div className="cad-attr-row">
                  <span className="cad-attr-key">Material:</span>
                  <span className="cad-attr-val" title={activePart.material}>
                    {activePart.material}
                  </span>
                </div>
                <div className="cad-attr-row">
                  <span className="cad-attr-key">Dimensions:</span>
                  <span className="cad-attr-val">{activePart.dimensions}</span>
                </div>
                <div className="cad-attr-row">
                  <span className="cad-attr-key">Est. Weight:</span>
                  <span className="cad-attr-val">{activePart.weight}</span>
                </div>
                <div className="cad-attr-specs">{activePart.specs}</div>
              </div>
            </div>
          </div>

          {/* Prototype Footnote */}
          <div className="cad-footnote">
            <div className="cad-footnote-title">
              <Info size={13} />
              <span>Physical Prototype Parity</span>
            </div>
            <p style={{ color: 'var(--text-faint)', fontSize: '0.6875rem', lineHeight: 1.4 }}>
              CAD components match the calibrated prototype fabricated for Robocon. The 45° slide slope balances steady descent velocity with optical capture clarity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
