import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Layers, RefreshCw } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useTheme } from '../hooks/useTheme';
import { useCMS } from '../context/CMSContext';
import type { Hero3DSettings, Hero3DGeometry } from '../types/cms';

interface HeroSceneProps {
  className?: string;
  overrideSettings?: Hero3DSettings;
}

function createGeometries(geomType: Hero3DGeometry = 'icosahedron', scaleFactor = 1.0) {
  const s = 1.45 * scaleFactor;
  switch (geomType) {
    case 'torus_knot':
      return {
        core: new THREE.TorusKnotGeometry(s * 0.72, s * 0.22, 120, 16),
        wire: new THREE.TorusKnotGeometry(s * 0.74, s * 0.23, 64, 12),
      };
    case 'octahedron':
      return {
        core: new THREE.OctahedronGeometry(s * 1.05, 0),
        wire: new THREE.OctahedronGeometry(s * 1.07, 1),
      };
    case 'dodecahedron':
      return {
        core: new THREE.DodecahedronGeometry(s * 0.98, 0),
        wire: new THREE.DodecahedronGeometry(s * 1.01, 1),
      };
    case 'sphere':
      return {
        core: new THREE.SphereGeometry(s * 0.98, 28, 28),
        wire: new THREE.SphereGeometry(s * 1.01, 14, 14),
      };
    case 'box':
      return {
        core: new THREE.BoxGeometry(s * 1.3, s * 1.3, s * 1.3),
        wire: new THREE.BoxGeometry(s * 1.33, s * 1.33, s * 1.33),
      };
    case 'torus':
      return {
        core: new THREE.TorusGeometry(s * 0.9, s * 0.35, 16, 80),
        wire: new THREE.TorusGeometry(s * 0.92, s * 0.36, 12, 40),
      };
    case 'icosahedron':
    default:
      return {
        core: new THREE.IcosahedronGeometry(s, 0),
        wire: new THREE.IcosahedronGeometry(s * 1.02, 1),
      };
  }
}

export const HeroScene: React.FC<HeroSceneProps> = ({ className = '', overrideSettings }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();
  const { siteSettings } = useCMS();
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [isWireframeMode, setIsWireframeMode] = useState<boolean>(false);
  const [isSpinning, setIsSpinning] = useState<boolean>(true);
  const prefersReducedMotion = useReducedMotion();

  const config: Hero3DSettings = overrideSettings || siteSettings?.hero3D || {
    geometry: 'icosahedron',
    wireframeOnly: false,
    wireframeOverlay: true,
    showRings: true,
    showParticles: true,
    particleCount: 220,
    rotationSpeed: 1.0,
    autoSpin: true,
    mouseReactivity: true,
    primaryColor: '#c7ff6b',
    secondaryColor: '#70b9ff',
    accentColor: '#c7ff6b',
    roughness: 0.22,
    metalness: 0.88,
    scale: 1.0,
  };

  // Internal mutable state to communicate UI toggles to animation loop
  const controlsRef = useRef({
    wireframe: false,
    spinning: true,
  });

  useEffect(() => {
    controlsRef.current.wireframe = isWireframeMode;
    controlsRef.current.spinning = isSpinning;
  }, [isWireframeMode, isSpinning]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. WebGL Context Availability Check
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    // 2. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(isDark ? 0x090b10 : 0xf7f8fa, isDark ? 0.045 : 0.012);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.8);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setHasWebGL(false);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDark ? 1.15 : 1.25;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';

    // 3. Dynamic Studio Lighting
    const pColor = config.primaryColor || (isDark ? '#c7ff6b' : '#16a34a');
    const sColor = config.secondaryColor || (isDark ? '#70b9ff' : '#2563eb');
    const aColor = config.accentColor || (isDark ? '#c7ff6b' : '#16a34a');

    const ambientLight = new THREE.AmbientLight(isDark ? 0x131720 : 0xffffff, isDark ? 1.6 : 3.0);
    scene.add(ambientLight);

    const limeLight = new THREE.PointLight(new THREE.Color(pColor), isDark ? 3.2 : 4.5, 16);
    limeLight.position.set(3.5, 4.2, 3.5);
    scene.add(limeLight);

    const blueLight = new THREE.PointLight(new THREE.Color(sColor), isDark ? 2.8 : 4.0, 16);
    blueLight.position.set(-4.5, -3.5, 2.5);
    scene.add(blueLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, isDark ? 0.6 : 2.2);
    fillLight.position.set(0, 6, isDark ? -3 : 4);
    scene.add(fillLight);

    // 4. Procedural Geometry & Hierarchy
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    const scaleVal = config.scale ?? 1.0;
    const { core: coreGeometry, wire: wireGeometry } = createGeometries(config.geometry, scaleVal);

    // Core Solid Form
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: isDark
        ? (config.primaryColor ? new THREE.Color(config.primaryColor).multiplyScalar(0.18) : 0x10141f)
        : 0xffffff,
      roughness: config.roughness ?? (isDark ? 0.22 : 0.2),
      metalness: config.metalness ?? (isDark ? 0.88 : 0.25),
      reflectivity: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      flatShading: true,
      wireframe: config.wireframeOnly,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    coreMesh.visible = !config.wireframeOnly;
    masterGroup.add(coreMesh);

    // Inner Accent Wireframe Cage
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(pColor),
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.38 : 0.45,
    });
    const wireMesh = new THREE.Mesh(wireGeometry, wireMaterial);
    wireMesh.visible = config.wireframeOnly || config.wireframeOverlay !== false;
    masterGroup.add(wireMesh);

    // Outer Primary Orbit Ring
    const ring1Geometry = new THREE.TorusGeometry(2.4 * scaleVal, 0.02 * scaleVal, 16, 100);
    const ring1Material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(sColor),
      emissive: new THREE.Color(sColor).multiplyScalar(0.2),
      roughness: 0.25,
      metalness: 0.85,
    });
    const ring1 = new THREE.Mesh(ring1Geometry, ring1Material);
    ring1.rotation.x = Math.PI / 3;
    ring1.visible = config.showRings !== false;
    masterGroup.add(ring1);

    // Secondary Counter-Angled Orbit Ring
    const ring2Geometry = new THREE.TorusGeometry(2.9 * scaleVal, 0.016 * scaleVal, 16, 120);
    const ring2Material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(aColor),
      emissive: new THREE.Color(aColor).multiplyScalar(0.2),
      roughness: 0.25,
      metalness: 0.85,
    });
    const ring2 = new THREE.Mesh(ring2Geometry, ring2Material);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.z = Math.PI / 6;
    ring2.visible = config.showRings !== false;
    masterGroup.add(ring2);

    // Orbital Satellite Nodes (Small glowing spheres on rings)
    const satGeometry = new THREE.SphereGeometry(0.06 * scaleVal, 12, 12);
    const satMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(aColor) });
    const satMesh1 = new THREE.Mesh(satGeometry, satMaterial);
    satMesh1.position.set(2.4 * scaleVal, 0, 0);
    ring1.add(satMesh1);

    const satMaterial2 = new THREE.MeshBasicMaterial({ color: new THREE.Color(sColor) });
    const satMesh2 = new THREE.Mesh(satGeometry, satMaterial2);
    satMesh2.position.set(-2.9 * scaleVal, 0, 0);
    ring2.add(satMesh2);

    // Constellation Particles
    const particleCount = config.particleCount ?? 220;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorP = new THREE.Color(pColor);
    const colorS = new THREE.Color(sColor);
    const colorWhite = new THREE.Color(isDark ? 0xf7f7f2 : 0x94a3b8);

    for (let i = 0; i < particleCount; i++) {
      const radius = (3.2 + Math.random() * 4.8) * scaleVal;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const mixedColor = Math.random() > 0.5 ? (Math.random() > 0.5 ? colorP : colorS) : colorWhite;
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.042,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    masterGroup.add(particles);

    // 5. Pointer & Scroll Reactivity
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let scrollY = 0;
    let isVisible = true;

    const handlePointerMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Container ResizeObserver with rAF throttling
    let resizeFrameId: number;
    const handleResize = () => {
      cancelAnimationFrame(resizeFrameId);
      resizeFrameId = requestAnimationFrame(() => {
        if (!container || !renderer) return;
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        if (newWidth === 0 || newHeight === 0) return;

        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight, false);
      });
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // IntersectionObserver to sleep offscreen
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);


    // 6. Animation Loop with Dynamic State Sync
    let animationFrameId: number;
    let clock = new THREE.Clock();
    const speedMultiplier = config.rotationSpeed ?? 1.0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Dynamic Wireframe state check
      if (!config.wireframeOnly) {
        coreMaterial.wireframe = controlsRef.current.wireframe;
      }

      // Pointer interpolation (lerp)
      const lerpSpeed = prefersReducedMotion ? 0.01 : 0.045;
      mouse.x += (mouse.targetX - mouse.x) * lerpSpeed;
      mouse.y += (mouse.targetY - mouse.y) * lerpSpeed;

      // Dynamic Point light positioning tracking pointer for specular sparkle
      limeLight.position.x = 3.5 + mouse.x * 2.5;
      limeLight.position.y = 4.2 + mouse.y * 2;

      if (!prefersReducedMotion && controlsRef.current.spinning && config.autoSpin !== false) {
        coreMesh.rotation.x += delta * 0.22 * speedMultiplier;
        coreMesh.rotation.y += delta * 0.32 * speedMultiplier;

        wireMesh.rotation.x = coreMesh.rotation.x;
        wireMesh.rotation.y = coreMesh.rotation.y;

        ring1.rotation.x += delta * 0.16 * speedMultiplier;
        ring1.rotation.y -= delta * 0.22 * speedMultiplier;

        ring2.rotation.z += delta * 0.14 * speedMultiplier;
        ring2.rotation.x -= delta * 0.12 * speedMultiplier;

        particles.rotation.y = elapsedTime * 0.04 * speedMultiplier;
      }

      // Responsive reactivity to mouse & scroll
      if (config.mouseReactivity !== false) {
        masterGroup.rotation.y = mouse.x * 0.42;
        masterGroup.rotation.x = -mouse.y * 0.32;
      }

      const scrollFactor = Math.min(scrollY / 800, 1.5);
      masterGroup.position.y = -scrollFactor * 0.75;
      masterGroup.scale.setScalar(scaleVal * Math.max(0.78, 1 - scrollFactor * 0.18));

      renderer.render(scene, camera);
    };

    animate();

    // 7. Cleanup & Dispose
    return () => {
      cancelAnimationFrame(resizeFrameId);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      coreGeometry.dispose();
      coreMaterial.dispose();
      wireGeometry.dispose();
      wireMaterial.dispose();
      ring1Geometry.dispose();
      ring1Material.dispose();
      ring2Geometry.dispose();
      ring2Material.dispose();
      satGeometry.dispose();
      satMaterial.dispose();
      satMaterial2.dispose();
      particleGeo.dispose();
      particleMat.dispose();

      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [
    prefersReducedMotion,
    isDark,
    config.geometry,
    config.wireframeOnly,
    config.wireframeOverlay,
    config.showRings,
    config.showParticles,
    config.particleCount,
    config.rotationSpeed,
    config.autoSpin,
    config.mouseReactivity,
    config.primaryColor,
    config.secondaryColor,
    config.accentColor,
    config.roughness,
    config.metalness,
    config.scale,
  ]);

  if (!hasWebGL) {
    return (
      <div className={`hero-3d-fallback ${className}`} aria-hidden="true">
        <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%', maxWidth: '380px', margin: 'auto' }}>
          <circle cx="200" cy="200" r="140" stroke="#1f2637" strokeWidth="1" fill="none" />
          <polygon points="200,80 300,260 100,260" stroke="#C7FF6B" strokeWidth="1.5" fill="none" opacity="0.8" />
          <polygon points="200,320 300,140 100,140" stroke="#70B9FF" strokeWidth="1.2" fill="none" opacity="0.4" />
          <circle cx="200" cy="200" r="10" fill="#C7FF6B" />
        </svg>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Background Volumetric Glow Halo only in Dark Mode */}
      {isDark && (
        <>
          <div
            className="glow-aurora glow-lime"
            style={{
              width: '380px',
              height: '380px',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 0,
            }}
          />
          <div
            className="glow-aurora glow-blue"
            style={{
              width: '420px',
              height: '420px',
              top: '40%',
              left: '60%',
              transform: 'translate(-50%, -50%)',
              zIndex: 0,
            }}
          />
        </>
      )}

      {/* Three.js Canvas Container */}
      <div
        ref={mountRef}
        className={`hero-3d-container ${className}`}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          zIndex: 1,
          opacity: 1,
        }}
        aria-hidden="true"
      />

      {/* Interactive 3D Control HUD Badge */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          zIndex: 10,
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          backgroundColor: 'var(--bg-elevated)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border-medium)',
          boxShadow: 'var(--shadow-sm)',
          padding: '5px 10px',
          borderRadius: '4px',
        }}
      >
        <button
          type="button"
          onClick={() => setIsWireframeMode(!isWireframeMode)}
          className="mono"
          title="Toggle wireframe topology view"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'none',
            border: 'none',
            color: isWireframeMode ? 'var(--accent-lime)' : 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '0.6875rem',
            padding: '2px 6px',
            borderRadius: '2px',
          }}
        >
          <Layers size={11} />
          <span>MESH {isWireframeMode ? 'LATTICE' : 'SOLID'}</span>
        </button>

        <span style={{ color: 'var(--border-subtle)' }}>|</span>

        <button
          type="button"
          onClick={() => setIsSpinning(!isSpinning)}
          className="mono"
          title="Pause or resume procedural spin"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'none',
            border: 'none',
            color: isSpinning ? 'var(--accent-blue)' : 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '0.6875rem',
            padding: '2px 6px',
            borderRadius: '2px',
          }}
        >
          <RefreshCw size={11} className={isSpinning ? 'animate-spin' : ''} />
          <span>{isSpinning ? '60FPS ROT' : 'PAUSED'}</span>
        </button>
      </div>
    </div>
  );
};
