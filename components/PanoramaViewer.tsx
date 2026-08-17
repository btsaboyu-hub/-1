import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SCENES } from '../scenesConfig';
import { ArrowLeft, Info, LoaderCircle, MapPin, Move, RotateCcw } from 'lucide-react';

interface PanoramaViewerProps {
  initialSceneId?: string;
  onExit?: () => void;
}

const PanoramaViewer: React.FC<PanoramaViewerProps> = ({ initialSceneId = 'hall-1', onExit }) => {
  const validInitialId = Object.keys(SCENES).includes(initialSceneId)
    ? initialSceneId as keyof typeof SCENES
    : 'hall-1';
  const [currentSceneKey, setCurrentSceneKey] = useState<keyof typeof SCENES>(validInitialId);
  const [isChangingScene, setIsChangingScene] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const mountRef = useRef<HTMLDivElement>(null);
  const sphereRef = useRef<THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial> | null>(null);
  const hotspotGroupRef = useRef<THREE.Group | null>(null);
  const autoRotateRef = useRef(true);
  const currentScene = SCENES[currentSceneKey];

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(72, mount.clientWidth / mount.clientHeight, 1, 1100);
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(500, 64, 48);
    geometry.scale(-1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x071b20 });
    const sphere = new THREE.Mesh(geometry, material);
    sphereRef.current = sphere;
    scene.add(sphere);

    const hotspotGroup = new THREE.Group();
    hotspotGroupRef.current = hotspotGroup;
    scene.add(hotspotGroup);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const target = new THREE.Vector3();
    let longitude = 0;
    let latitude = 0;
    let pointerDownX = 0;
    let pointerDownY = 0;
    let pointerDownLongitude = 0;
    let pointerDownLatitude = 0;
    let isInteracting = false;
    let moved = false;
    let animationFrame = 0;

    const onPointerDown = (event: PointerEvent) => {
      isInteracting = true;
      moved = false;
      autoRotateRef.current = false;
      setIsDragging(true);
      pointerDownX = event.clientX;
      pointerDownY = event.clientY;
      pointerDownLongitude = longitude;
      pointerDownLatitude = latitude;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!isInteracting) return;
      const distance = Math.abs(event.clientX - pointerDownX) + Math.abs(event.clientY - pointerDownY);
      if (distance > 4) moved = true;
      longitude = (pointerDownX - event.clientX) * 0.1 + pointerDownLongitude;
      latitude = THREE.MathUtils.clamp((event.clientY - pointerDownY) * 0.1 + pointerDownLatitude, -85, 85);
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!isInteracting) return;
      isInteracting = false;
      setIsDragging(false);
      if (moved) return;

      const rect = mount.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const intersection = raycaster.intersectObjects(hotspotGroup.children, true)[0];
      let object: THREE.Object3D | null = intersection?.object || null;
      while (object && object !== hotspotGroup) {
        const nextScene = object.userData.target as keyof typeof SCENES | undefined;
        if (nextScene && SCENES[nextScene]) {
          setCurrentSceneKey(nextScene);
          return;
        }
        object = object.parent;
      }
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      camera.fov = THREE.MathUtils.clamp(camera.fov + event.deltaY * 0.04, 35, 88);
      camera.updateProjectionMatrix();
    };

    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      if (autoRotateRef.current && !isInteracting) longitude += 0.025;
      const phi = THREE.MathUtils.degToRad(90 - latitude);
      const theta = THREE.MathUtils.degToRad(longitude);
      target.set(500 * Math.sin(phi) * Math.cos(theta), 500 * Math.cos(phi), 500 * Math.sin(phi) * Math.sin(theta));
      camera.lookAt(target);
      hotspotGroup.traverse((object) => {
        if (object.name === 'pulse-ring') {
          const scale = 1 + Math.sin(Date.now() * 0.003) * 0.18;
          object.scale.set(scale, scale, 1);
        }
      });
      renderer.render(scene, camera);
    };

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    mount.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    mount.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', onResize);
    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      mount.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      mount.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      sphere.material.map?.dispose();
      material.dispose();
      geometry.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      sphereRef.current = null;
      hotspotGroupRef.current = null;
    };
  }, []);

  useEffect(() => {
    const sphere = sphereRef.current;
    const hotspotGroup = hotspotGroupRef.current;
    if (!sphere || !hotspotGroup) return;
    let cancelled = false;
    setIsChangingScene(true);
    setLoadError(false);

    new THREE.TextureLoader().load(
      currentScene.image,
      (texture) => {
        if (cancelled) { texture.dispose(); return; }
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        sphere.material.map?.dispose();
        sphere.material.map = texture;
        sphere.material.color.setHex(0xffffff);
        sphere.material.needsUpdate = true;
        setIsChangingScene(false);
      },
      undefined,
      () => {
        if (cancelled) return;
        sphere.material.map = null;
        sphere.material.color.setHex(0x071b20);
        sphere.material.needsUpdate = true;
        setLoadError(true);
        setIsChangingScene(false);
      },
    );

    hotspotGroup.clear();
    currentScene.hotspots.forEach((hotspot) => {
      const group = new THREE.Group();
      group.userData = { target: hotspot.target };
      group.position.copy(new THREE.Vector3(...hotspot.position).normalize().multiplyScalar(450));
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(11, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 }),
      );
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(15, 25, 32),
        new THREE.MeshBasicMaterial({ color: 0xb22222, side: THREE.DoubleSide, transparent: true, opacity: 0.8 }),
      );
      ring.name = 'pulse-ring';
      ring.lookAt(0, 0, 0);
      group.add(dot, ring);
      hotspotGroup.add(group);
    });

    return () => { cancelled = true; };
  }, [currentSceneKey, currentScene.image, currentScene.hotspots]);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#071b20] overflow-hidden select-none z-[100] touch-none">
      <div ref={mountRef} className={`w-full h-full transition-opacity duration-500 ${isChangingScene ? 'opacity-30' : 'opacity-100'} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}/>

      {isChangingScene && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white pointer-events-none">
          <LoaderCircle className="animate-spin mb-3" size={34}/>
          <span className="font-serif tracking-widest text-sm">正在载入全景</span>
        </div>
      )}
      {loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-8 text-center bg-[#071b20]/90">
          <RotateCcw size={34} className="mb-4 text-sxuRed"/>
          <h3 className="font-serif text-xl font-bold mb-2">全景素材加载失败</h3>
          <p className="text-sm text-white/60">请检查网络后重新进入该场景。</p>
        </div>
      )}

      {onExit && <button aria-label="退出全景漫游" onClick={onExit} className="absolute top-6 left-5 z-50 flex items-center gap-2 px-4 py-2.5 bg-black/35 backdrop-blur-md border border-white/20 rounded-full text-white"><ArrowLeft size={18}/><span className="text-xs font-serif font-bold">退出漫游</span></button>}

      <div className="absolute top-20 left-5 z-40 pointer-events-none">
        <div className="bg-black/35 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-3 shadow-2xl">
          <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2"><span className="w-1 h-5 bg-sxuRed rounded-full"/>{currentScene.name}</h2>
          <p className="mt-1 text-[9px] text-white/55 tracking-[0.2em] font-bold flex items-center gap-1"><Info size={10}/> 360° DIGITAL EXHIBITION</p>
        </div>
      </div>

      <div className="absolute bottom-28 inset-x-0 z-40 flex justify-center pointer-events-none px-6">
        <div className="bg-black/30 backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-[11px] font-serif flex items-center gap-2 border border-white/10"><Move size={13}/><span>拖拽旋转视角 · 点击红色热点前往下一站</span></div>
      </div>

      <div className="absolute bottom-7 inset-x-0 z-50 flex gap-2 overflow-x-auto px-5 pb-1 no-scrollbar">
        {Object.entries(SCENES).map(([key, scene]) => {
          const isActive = key === currentSceneKey;
          return <button key={key} onClick={() => setCurrentSceneKey(key as keyof typeof SCENES)} className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur-md border ${isActive ? 'bg-sxuRed/90 border-sxuRed text-white shadow-lg' : 'bg-black/35 border-white/15 text-white/75'}`}><MapPin size={12}/><span className="text-[11px] font-bold font-serif">{scene.name}</span></button>;
        })}
      </div>

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_52%,rgba(0,0,0,0.35)_100%)]"/>
    </div>
  );
};

export default PanoramaViewer;
