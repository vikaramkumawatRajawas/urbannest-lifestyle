import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export const Hero3DCanvas = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xd6b77a, 2.5); // Champagne Gold Light
    mainLight.position.set(5, 5, 5);
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0x7fffd4, 2.0); // Electric Mint Rim Light
    rimLight.position.set(-5, -3, -2);
    scene.add(rimLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.5, 10);
    pointLight.position.set(0, 2, 2);
    scene.add(pointLight);

    // 5. 3D Object: Luxury Minimalist Ceramic Vase Group
    const vaseGroup = new THREE.Group();

    // Vase Body Geometry (Lathe curve for ceramic vase)
    const points = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      // Curved silhouette: narrow base, wide middle belly, slender neck, subtle flared lip
      const radius = 0.5 + Math.sin(t * Math.PI) * 0.7 - Math.pow(t - 0.7, 2) * 0.4;
      const y = (t - 0.5) * 3.2;
      points.push(new THREE.Vector2(Math.max(0.2, radius), y));
    }
    const vaseGeo = new THREE.LatheGeometry(points, 64);
    
    // Luxury Matte Cream Ceramic Material
    const ceramicMat = new THREE.MeshStandardMaterial({
      color: 0xf4efe6,
      roughness: 0.35,
      metalness: 0.1,
      bumpScale: 0.05
    });
    const vaseMesh = new THREE.Mesh(vaseGeo, ceramicMat);
    vaseGroup.add(vaseMesh);

    // Gold Lip Rim Accent Ring
    const ringGeo = new THREE.TorusGeometry(0.52, 0.04, 32, 64);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd6b77a,
      roughness: 0.15,
      metalness: 0.9
    });
    const ringMesh = new THREE.Mesh(ringGeo, goldMat);
    ringMesh.position.y = 1.6;
    ringMesh.rotation.x = Math.PI / 2;
    vaseGroup.add(ringMesh);

    // Orbiting Floating Metallic Spheres (Satellites)
    const sphereGroup = new THREE.Group();
    const sphereCount = 3;
    const spheres = [];

    const mintMat = new THREE.MeshStandardMaterial({
      color: 0x7fffd4,
      roughness: 0.2,
      metalness: 0.7
    });

    for (let i = 0; i < sphereCount; i++) {
      const size = 0.15 + i * 0.08;
      const sphereGeo = new THREE.SphereGeometry(size, 32, 32);
      const mesh = new THREE.Mesh(sphereGeo, i % 2 === 0 ? goldMat : mintMat);
      
      const angle = (i / sphereCount) * Math.PI * 2;
      const radius = 1.8 + i * 0.3;
      mesh.position.set(Math.cos(angle) * radius, (i - 1) * 0.8, Math.sin(angle) * radius);
      
      spheres.push({ mesh, angle, radius, speed: 0.008 + i * 0.004, yBase: (i - 1) * 0.8 });
      sphereGroup.add(mesh);
    }
    scene.add(sphereGroup);

    // Subtle Floating Ambient Dust Particles
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    
    const particleMat = new THREE.PointsMaterial({
      size: 0.03,
      color: 0xd6b77a,
      transparent: true,
      opacity: 0.6
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    scene.add(vaseGroup);

    // 6. Mouse Interaction & Tilt State
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseX = (x / (rect.width / 2)) * 0.5;
      mouseY = (y / (rect.height / 2)) * 0.5;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 7. High-Precision Deprecation-Free Animation Loop
    const startTime = performance.now();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Smooth mouse damping
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Rotate 3D Objects
      vaseGroup.rotation.y = elapsedTime * 0.3 + targetX * 0.8;
      vaseGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.1 - targetY * 0.5;
      vaseGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.15;

      // Orbit Spheres
      spheres.forEach((s) => {
        s.angle += s.speed;
        s.mesh.position.x = Math.cos(s.angle) * s.radius;
        s.mesh.position.z = Math.sin(s.angle) * s.radius;
        s.mesh.position.y = s.yBase + Math.sin(elapsedTime * 2 + s.radius) * 0.2;
      });

      // Slowly rotate background particles
      particleSystem.rotation.y = elapsedTime * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[550px] flex items-center justify-center">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Decorative Ambient Stage Ring */}
      <div className="absolute inset-x-12 bottom-4 h-8 bg-gradient-to-r from-transparent via-[#D6B77A]/20 to-transparent blur-xl pointer-events-none" />
    </div>
  );
};
