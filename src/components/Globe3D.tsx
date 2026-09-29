import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { Incident } from '../types';

interface Globe3DProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
  selectedIncident: Incident | null;
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

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070c, 0.0018);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Earth Globe Core
    const globeRadius = 75;
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // High-Resolution Photorealistic Earth Texture & Bump Maps
    const textureLoader = new THREE.TextureLoader();
    const earthMap = textureLoader.load('/earth_texture.jpg');
    const earthNormal = textureLoader.load('/earth_normal.jpg');
    const earthSpecular = textureLoader.load('/earth_specular.jpg');

    const globeMaterial = new THREE.MeshPhongMaterial({
      map: earthMap,
      normalMap: earthNormal,
      specularMap: earthSpecular,
      normalScale: new THREE.Vector2(1.2, 1.2),
      specular: new THREE.Color(0x224488),
      shininess: 25,
      color: new THREE.Color(0x99ccff),
      emissive: new THREE.Color(0x0a1224),
      emissiveIntensity: 0.8,
    });

    const globeGeometry = new THREE.SphereGeometry(globeRadius, 64, 64);
    const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
    globeGroup.add(globeMesh);

    // Topological Wireframe & Coordinate Rings (Matching reference design)
    const gridGeometry = new THREE.SphereGeometry(globeRadius * 1.01, 36, 18);
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.06,
    });
    const gridMesh = new THREE.Mesh(gridGeometry, gridMaterial);
    globeGroup.add(gridMesh);

    // Glowing Atmosphere Shell (Outer Rim)
    const atmosphereGeometry = new THREE.SphereGeometry(globeRadius * 1.08, 64, 64);
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
          float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.4);
          gl_FragColor = vec4(0.0, 0.9, 1.0, 1.0) * intensity * 0.95;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globeGroup.add(atmosphereMesh);

    // Subtle Outer Cloud / Aura Ring
    const auraGeo = new THREE.RingGeometry(globeRadius * 1.25, globeRadius * 1.27, 64);
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.12,
    });
    const auraMesh = new THREE.Mesh(auraGeo, auraMat);
    auraMesh.rotation.x = Math.PI / 2.3;
    globeGroup.add(auraMesh);

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
    const severityColors: Record<string, number> = {
      critical: 0xff1744, // Red
      high: 0xff9100,     // Orange
      medium: 0xd500f9,   // Purple
      low: 0x00e5ff,      // Cyan
    };

    // 3. Incident Threat Markers & Pulsing Rings
    const markerObjects: { mesh: THREE.Mesh; ring: THREE.Mesh; incident: Incident }[] = [];
    const markerGroup = new THREE.Group();
    globeGroup.add(markerGroup);

    incidents.forEach((inc) => {
      const pos = latLngToVector3(inc.lat, inc.lng, globeRadius + 1.2);
      const color = severityColors[inc.severity] || 0xff1744;

      // Pin core sphere
      const pinGeo = new THREE.SphereGeometry(1.6, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);
      pinMesh.userData = { incident: inc };
      markerGroup.add(pinMesh);

      // Pulsing radar ring
      const ringGeo = new THREE.RingGeometry(1.8, 3.2, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(pos.clone().multiplyScalar(2));
      markerGroup.add(ringMesh);

      markerObjects.push({ mesh: pinMesh, ring: ringMesh, incident: inc });
    });

    // 4. Attack Arcs / Threat Trajectories
    // Draw glowing bezier arcs between selected pairs of points (like in the reference!)
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
          opacity: 0.45,
          linewidth: 2,
        });
        const arcLine = new THREE.Line(arcGeo, arcMat);
        arcGroup.add(arcLine);
      }
    }

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00e5ff, 1.6);
    dirLight1.position.set(150, 100, 180);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x1e3a8a, 1.2);
    dirLight2.position.set(-150, -80, -100);
    scene.add(dirLight2);

    // Initial globe orientation to show Americas / Atlantic
    globeGroup.rotation.y = 1.8;
    globeGroup.rotation.x = 0.25;

    // 6. Interactive Controls (Mouse Drag & Raycasting)
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
        // Raycasting for marker hover
        raycaster.setFromCamera(mouse, camera);
        const pins = markerObjects.map((m) => m.mesh);
        const intersects = raycaster.intersectObjects(pins);

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
                ${hovered.deaths_count > 0 ? `<span style="color: #ef4444; font-weight: bold;">⚠️ ${hovered.deaths_count} Morte(s)</span> • ` : ''}
                Clique para examinar
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
      const pulseOpacity = 0.8 - Math.sin(pulseClock) * 0.45;

      markerObjects.forEach(({ ring }) => {
        ring.scale.set(pulseScale, pulseScale, pulseScale);
        if (ring.material instanceof THREE.MeshBasicMaterial) {
          ring.material.opacity = Math.max(0.1, pulseOpacity);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
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
