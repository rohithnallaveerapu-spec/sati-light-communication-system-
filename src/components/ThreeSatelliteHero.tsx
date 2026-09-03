import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Props {
  nodeCode?: string;
  className?: string;
  interactive?: boolean;
}

export function ThreeSatelliteHero({ nodeCode = 'ORB-092', className = '', interactive = true }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 300;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 4.2;
    camera.position.y = 0.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Root Group
    const satelliteGroup = new THREE.Group();

    // 1. Central Body (Main Bus)
    const bodyGeom = new THREE.BoxGeometry(0.7, 0.7, 1.1);
    const bodyMat = new THREE.MeshPhongMaterial({
      color: 0x00dbe7,
      emissive: 0x00363a,
      specular: 0x74f5ff,
      shininess: 100,
    });
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    satelliteGroup.add(body);

    // High tech detail ridges on main body
    const detailGeom = new THREE.BoxGeometry(0.72, 0.72, 0.3);
    const detailMat = new THREE.MeshPhongMaterial({
      color: 0x1b1f2c,
      emissive: 0x0a0e1a,
    });
    const detailBand = new THREE.Mesh(detailGeom, detailMat);
    satelliteGroup.add(detailBand);

    // Dish antenna on top
    const dishStemGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.4, 16);
    const dishStemMat = new THREE.MeshPhongMaterial({ color: 0x849495 });
    const dishStem = new THREE.Mesh(dishStemGeom, dishStemMat);
    dishStem.position.set(0, 0.55, 0.2);
    satelliteGroup.add(dishStem);

    const dishGeom = new THREE.SphereGeometry(0.3, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2.5);
    const dishMat = new THREE.MeshPhongMaterial({
      color: 0xe1fdff,
      emissive: 0x004f54,
      side: THREE.DoubleSide,
    });
    const dish = new THREE.Mesh(dishGeom, dishMat);
    dish.position.set(0, 0.75, 0.2);
    dish.rotation.x = -Math.PI / 3;
    satelliteGroup.add(dish);

    // Dish focal receiver
    const focalGeom = new THREE.ConeGeometry(0.08, 0.2, 8);
    const focalMat = new THREE.MeshBasicMaterial({ color: 0x00f2ff });
    const focal = new THREE.Mesh(focalGeom, focalMat);
    focal.position.set(0, 0.85, 0.35);
    focal.rotation.x = Math.PI / 3;
    satelliteGroup.add(focal);

    // 2. Solar Panels (Left and Right)
    const panelGeom = new THREE.BoxGeometry(1.6, 0.6, 0.04);
    const panelMat = new THREE.MeshPhongMaterial({
      color: 0x8f03ff,
      emissive: 0x2b0053,
      specular: 0xdab9ff,
      shininess: 90,
    });

    // Panel grid texture simulator lines
    const panelArmGeom = new THREE.CylinderGeometry(0.03, 0.03, 0.6, 8);
    const panelArmMat = new THREE.MeshPhongMaterial({ color: 0x3a494b });

    // Left Arm & Panel
    const leftArm = new THREE.Mesh(panelArmGeom, panelArmMat);
    leftArm.rotation.z = Math.PI / 2;
    leftArm.position.set(-0.55, 0, 0);
    satelliteGroup.add(leftArm);

    const panel1 = new THREE.Mesh(panelGeom, panelMat);
    panel1.position.set(-1.45, 0, 0);
    panel1.rotation.y = 0.15;
    satelliteGroup.add(panel1);

    // Right Arm & Panel
    const rightArm = new THREE.Mesh(panelArmGeom, panelArmMat);
    rightArm.rotation.z = Math.PI / 2;
    rightArm.position.set(0.55, 0, 0);
    satelliteGroup.add(rightArm);

    const panel2 = new THREE.Mesh(panelGeom, panelMat);
    panel2.position.set(1.45, 0, 0);
    panel2.rotation.y = -0.15;
    satelliteGroup.add(panel2);

    // 3. Pulsing Data Emission Ring
    const ringGeom = new THREE.RingGeometry(1.8, 1.85, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f2ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.rotation.x = Math.PI / 2.5;
    satelliteGroup.add(ring);

    const ring2Geom = new THREE.RingGeometry(2.3, 2.34, 48);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x8f03ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
    });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.x = -Math.PI / 3;
    satelliteGroup.add(ring2);

    // Add satellite group to scene
    scene.add(satelliteGroup);

    // 4. Lights
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const cyanLight = new THREE.PointLight(0x00dbe7, 3, 10);
    cyanLight.position.set(-3, -2, 3);
    scene.add(cyanLight);

    const violetLight = new THREE.PointLight(0x8f03ff, 2.5, 10);
    violetLight.position.set(3, 2, -2);
    scene.add(violetLight);

    scene.add(new THREE.AmbientLight(0x1a2130, 1.2));

    // Interactive mouse parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0.2;
    let targetRotationY = -0.3;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x * 0.6;
      mouseY = y * 0.4;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Continuous slow orbital rotation
      targetRotationY += 0.008;
      satelliteGroup.rotation.y = THREE.MathUtils.lerp(satelliteGroup.rotation.y, targetRotationY + mouseX, 0.08);
      satelliteGroup.rotation.x = THREE.MathUtils.lerp(satelliteGroup.rotation.x, targetRotationX + mouseY, 0.08);

      // Subtle bobbing motion
      satelliteGroup.position.y = Math.sin(time * 1.5) * 0.08;

      // Pulse ring emission
      ring.rotation.z += 0.01;
      ring2.rotation.z -= 0.008;
      ringMat.opacity = 0.25 + Math.sin(time * 3) * 0.15;
      ring2Mat.opacity = 0.2 + Math.cos(time * 2.5) * 0.1;

      renderer.render(scene, camera);
    }

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 300;
      const h = container.clientHeight || 250;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [interactive, nodeCode]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
