"use client"; // (Next.js 13+ with app dir)

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    
    // Cartoon Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf7f9fa);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 8);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Toon Material Helper
    const toonMaterial = (color: number) => new THREE.MeshToonMaterial({ color, gradientMap: null });

    // Cartoon Shapes
    // Box
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 1.5, 1.5),
      toonMaterial(0x1e88e5)
    );
    box.position.set(-1.5, 0, 0);
    scene.add(box);
    // Sphere
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.9, 32, 32),
      toonMaterial(0xffb300)
    );
    sphere.position.set(1.5, 0.7, 0);
    scene.add(sphere);
    // Torus
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(0.7, 0.25, 16, 100),
      toonMaterial(0x43e97b)
    );
    torus.position.set(0, -1.2, 0);
    scene.add(torus);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      box.rotation.x += 0.015;
      box.rotation.y += 0.018;
      sphere.rotation.y += 0.02;
      torus.rotation.z += 0.025;
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on unmount
    return () => {
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-[100px] h-[100px]" />;
}
