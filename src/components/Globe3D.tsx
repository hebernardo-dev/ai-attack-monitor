import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { Incident } from '../types';

interface Globe3DProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
  selectedIncident: Incident | null;
}

// Function to generate smooth glowing radial gradient sprite texture without white center
function createGlowSpriteTexture(coreColor: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    // Pure vibrant category color (NO white core)
    gradient.addColorStop(0, coreColor);             // 100% pure saturated color
    gradient.addColorStop(0.35, coreColor);          // Rich solid core
    gradient.addColorStop(0.65, coreColor + '99');   // Smooth gradient falloff
    gradient.addColorStop(0.85, coreColor + '33');   // Soft outer aura
    gradient.addColorStop(1, 'rgba(0,0,0,0)');       // 0% smooth fade at edges
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
  }
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export const Globe3D: React.FC<Globe3DProps> = ({
  incidents,
  onSelectIncident,
  selectedIncident,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hoveredIncidentRef = useRef<Incident | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene, Camera, Renderer (No fog for maximum clarity & crispness)
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Earth Globe Core (Vivid, rich natural colors matching 2D map)
    const globeRadius = 75;
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const textureLoader = new THREE.TextureLoader();
    const earthMap = textureLoader.load('/earth_texture.jpg');
    const earthNormal = textureLoader.load('/earth_normal.jpg');

    // MeshStandardMaterial preserves the rich deep blue oceans and vibrant continents without glare blowout
    const globeMaterial = new THREE.MeshStandardMaterial({
      map: earthMap,
      normalMap: earthNormal,
      normalScale: new THREE.Vector2(0.5, 0.5),
      roughness: 0.65, // Matte-soft to eliminate washed-out white specular reflections
      metalness: 0.05,
      color: new THREE.Color(0xffffff),
    });

    const globeGeometry = new THREE.SphereGeometry(globeRadius, 64, 64);
    const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
    globeGroup.add(globeMesh);

    // Subtle coordinate grid rings (ultra-lightweight, 2% opacity so it never clouds terrain)
    const gridGeometry = new THREE.SphereGeometry(globeRadius * 1.005, 36, 18);
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.02,
    });
    const gridMesh = new THREE.Mesh(gridGeometry, gridMaterial);
    globeGroup.add(gridMesh);

    // Ultra-soft Atmospheric Edge Glow (very delicate rim only on glancing angles, 100% transparent on continents)
    const atmosphereGeometry = new THREE.SphereGeometry(globeRadius * 1.025, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          // Silhouette rim only: 0 over facing surface, gently rising at edge
          float rim = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
          float intensity = pow(rim, 4.5) * 0.35;
          gl_FragColor = vec4(0.0, 0.75, 1.0, intensity);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      transparent: true,
      depthWrite: false,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globeGroup.add(atmosphereMesh);

    // Convert Lat/Lng to Vector3 on Globe
    function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    }

    // Colors by severity
    const severityColorsHex: Record<string, string> = {
      critical: '#ef4444', // Red
      high: '#f59e0b',     // Orange
      medium: '#a855f7',   // Purple
      low: '#00e5ff',      // Cyan
    };

    // 3. Incident Threat Markers with Smooth Radial Falloff (Sprites)
    const markerObjects: { sprite: THREE.Sprite; ring: THREE.Mesh; incident: Incident }[] = [];
    const markerGroup = new THREE.Group();
    globeGroup.add(markerGroup);

    incidents.forEach((inc) => {
      const pos = latLngToVector3(inc.lat, inc.lng, globeRadius + 1.2);
      const hexColor = severityColorsHex[inc.severity] || '#ef4444';

      // Radial Glowing Sprite: 100% solid category color center, no white, smooth falloff
      const glowTexture = createGlowSpriteTexture(hexColor);
      const spriteMaterial = new THREE.SpriteMaterial({
        map: glowTexture,
        blending: THREE.NormalBlending, // NormalBlending prevents color from washing out to white
        transparent: true,
        depthWrite: false,
      });

      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.copy(pos);
      sprite.scale.set(6.0, 6.0, 1);
      sprite.userData = { incident: inc };
      markerGroup.add(sprite);

      // Radar pulse ring
      const ringGeo = new THREE.RingGeometry(1.5, 2.6, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(hexColor),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(pos.clone().multiplyScalar(2));
      markerGroup.add(ringMesh);

      markerObjects.push({ sprite, ring: ringMesh, incident: inc });
    });

    // 4. Attack Arcs / Threat Trajectories
    const arcGroup = new THREE.Group();
    globeGroup.add(arcGroup);

    if (incidents.length >= 2) {
      for (let i = 0; i < Math.min(incidents.length - 1, 6); i++) {
        const start = latLngToVector3(incidents[i].lat, incidents[i].lng, globeRadius);
        const nextIdx = (i + 3) % incidents.length;
        const end = latLngToVector3(incidents[nextIdx].lat, incidents[nextIdx].lng, globeRadius);

        const mid = start.clone().lerp(end, 0.5);
        const altFactor = 1.35 + (start.distanceTo(end) / (globeRadius * 2)) * 0.35;
        mid.normalize().multiplyScalar(globeRadius * altFactor);

        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const points = curve.getPoints(50);
        const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
        const arcMat = new THREE.LineBasicMaterial({
          color: i % 2 === 0 ? 0x00e5ff : 0xff9100,
          transparent: true,
          opacity: 0.5,
          linewidth: 2,
        });
        const arcLine = new THREE.Line(arcGeo, arcMat);
        arcGroup.add(arcLine);
      }
    }

    // 5. Lighting (Rich, natural balance to make earth colors pop)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.15);
    dirLight1.position.set(150, 100, 200);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x0284c7, 0.35);
    dirLight2.position.set(-150, -80, -100);
    scene.add(dirLight2);

    // Initial globe orientation
    globeGroup.rotation.y = 1.8;
    globeGroup.rotation.x = 0.25;

    // 6. Interactive Controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let autoRotate = true;
    let idleTimer: any = null;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      autoRotate = false;
      previousMousePosition = { x: e.clientX, y: e.clientY };
      clearTimeout(idleTimer);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        globeGroup.rotation.y += deltaX * 0.005;
        globeGroup.rotation.x += deltaY * 0.005;
        globeGroup.rotation.x = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, globeGroup.rotation.x));

        previousMousePosition = { x: e.clientX, y: e.clientY };
      } else {
        raycaster.setFromCamera(mouse, camera);
        const sprites = markerObjects.map((m) => m.sprite);
        const intersects = raycaster.intersectObjects(sprites);

        if (intersects.length > 0) {
          const hovered = intersects[0].object.userData.incident as Incident;
          hoveredIncidentRef.current = hovered;
          if (tooltipRef.current) {
            tooltipRef.current.style.display = 'block';
            tooltipRef.current.style.left = `${e.clientX + 16}px`;
            tooltipRef.current.style.top = `${e.clientY - 20}px`;
            tooltipRef.current.innerHTML = `
              <div style="font-size: 11px; text-transform: uppercase; color: #00e5ff; font-weight: 700; margin-bottom: 2px;">
                ${hovered.country} • ${hovered.category}
              </div>
              <div style="font-weight: 600; font-size: 13px; color: #fff; max-width: 260px; line-height: 1.3;">
                ${hovered.title}
              </div>
              <div style="font-size: 11px; color: #94a3b8; margin-top: 6px;">
                ${hovered.deaths_count > 0 ? `<span style="color: #ef4444; font-weight: bold;">⚠️ ${hovered.deaths_count} Fatalities</span> • ` : ''}
                Click to examine
              </div>
            `;
          }
          document.body.style.cursor = 'pointer';
        } else {
          hoveredIncidentRef.current = null;
          if (tooltipRef.current) {
            tooltipRef.current.style.display = 'none';
          }
          document.body.style.cursor = 'default';
        }
      }
    };

    const onMouseUp = () => {
      isDragging = false;
      idleTimer = setTimeout(() => {
        autoRotate = true;
      }, 3500);
    };

    const onClick = () => {
      if (hoveredIncidentRef.current) {
        onSelectIncident(hoveredIncidentRef.current);
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z += e.deltaY * 0.12;
      camera.position.z = Math.max(120, Math.min(360, camera.position.z));
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('click', onClick);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // Focus camera on selected incident if passed
    if (selectedIncident) {
      const targetVec = latLngToVector3(selectedIncident.lat, selectedIncident.lng, 1);
      const targetYRot = -Math.atan2(targetVec.z, targetVec.x) - Math.PI / 2;
      globeGroup.rotation.y = targetYRot;
      globeGroup.rotation.x = Math.asin(targetVec.y);
    }

    // 7. Animation Loop
    let animationFrameId: number;
    let pulseClock = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (autoRotate) {
        globeGroup.rotation.y += 0.0018;
      }

      pulseClock += 0.035;
      const pulseScale = 1 + Math.sin(pulseClock) * 0.45;
      const pulseOpacity = 0.75 - Math.sin(pulseClock) * 0.45;

      markerObjects.forEach(({ ring, sprite }) => {
        ring.scale.set(pulseScale, pulseScale, pulseScale);
        if (ring.material instanceof THREE.MeshBasicMaterial) {
          ring.material.opacity = Math.max(0.1, pulseOpacity);
        }
        // Subtle core pulse
        const s = 6.0 + Math.sin(pulseClock) * 0.8;
        sprite.scale.set(s, s, 1);
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('click', onClick);
      dom.removeEventListener('wheel', onWheel);
      if (container.contains(dom)) {
        container.removeChild(dom);
      }
      renderer.dispose();
    };
  }, [incidents, onSelectIncident, selectedIncident]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }} />
      <div
        ref={tooltipRef}
        className="glass-panel"
        style={{
          position: 'fixed',
          display: 'none',
          padding: '10px 14px',
          zIndex: 9999,
          pointerEvents: 'none',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(0, 229, 255, 0.4)',
          borderRadius: '10px',
        }}
      />
    </div>
  );
};
