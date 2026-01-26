
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { HOTSPOTS } from '../constants';
import { Hotspot } from '../types';
import { Info, X, Map as MapIcon, Layers, ChevronUp, ChevronDown } from 'lucide-react';
import GlassCard from './GlassCard';

const FLOOR_DATA = {
  '1F': {
    texture: 'https://images.unsplash.com/photo-1590483734724-38fa19744990?q=80&w=2000&auto=format&fit=crop',
    label: '一层 · 溯源峥嵘',
  },
  '2F': {
    texture: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop',
    label: '二层 · 华章成果',
  }
};

const PanoramaViewer: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [currentFloor, setCurrentFloor] = useState<'1F' | '2F'>('1F');
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [rotation, setRotation] = useState(0);
  const [isChangingFloor, setIsChangingFloor] = useState(false);
  
  const sceneRef = useRef<THREE.Scene | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);
  const hotspotGroupRef = useRef<THREE.Group | null>(null);

  // 初始化场景
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    // Fix: Using a separate Vector3 instead of assigning a custom property to the camera object
    const cameraTarget = new THREE.Vector3(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);
    
    const textureLoader = new THREE.TextureLoader();
    const material = new THREE.MeshBasicMaterial({ 
      transparent: true, 
      opacity: 1 
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphereRef.current = sphere;
    scene.add(sphere);

    const hotspotGroup = new THREE.Group();
    hotspotGroupRef.current = hotspotGroup;
    scene.add(hotspotGroup);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let lon = 0, lat = 0;
    let phi = 0, theta = 0;
    let isUserInteracting = false;
    let onPointerDownPointerX = 0, onPointerDownPointerY = 0;
    let onPointerDownLon = 0, onPointerDownLat = 0;

    const onPointerDown = (event: PointerEvent) => {
      isUserInteracting = true;
      onPointerDownPointerX = event.clientX;
      onPointerDownPointerY = event.clientY;
      onPointerDownLon = lon;
      onPointerDownLat = lat;

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(hotspotGroup.children);
      if (intersects.length > 0) {
        // Find the sphere part of the hotspot
        const clickedDot = intersects.find(intersect => intersect.object instanceof THREE.Mesh && intersect.object.userData.id);
        if (clickedDot) {
          setSelectedHotspot(clickedDot.object.userData as Hotspot);
        }
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (isUserInteracting) {
        lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
        lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;
        lat = Math.max(-85, Math.min(85, lat));
        setRotation(lon);
      }
    };

    const onPointerUp = () => { isUserInteracting = false; };

    mountRef.current.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    const animate = () => {
      requestAnimationFrame(animate);
      phi = THREE.MathUtils.degToRad(90 - lat);
      theta = THREE.MathUtils.degToRad(lon);
      // Fix: Update coordinates on the local cameraTarget Vector3
      cameraTarget.x = 500 * Math.sin(phi) * Math.cos(theta);
      cameraTarget.y = 500 * Math.cos(phi);
      cameraTarget.z = 500 * Math.sin(phi) * Math.sin(theta);
      camera.lookAt(cameraTarget);
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const w = mountRef.current?.clientWidth || window.innerWidth;
      const h = mountRef.current?.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      mountRef.current?.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // 楼层内容更新逻辑
  useEffect(() => {
    if (!sphereRef.current || !hotspotGroupRef.current) return;

    const updateContent = async () => {
      setIsChangingFloor(true);
      
      const textureLoader = new THREE.TextureLoader();
      const newTexture = await textureLoader.loadAsync(FLOOR_DATA[currentFloor].texture);
      
      // Clear hotspots
      while(hotspotGroupRef.current!.children.length > 0) {
        hotspotGroupRef.current!.remove(hotspotGroupRef.current!.children[0]);
      }

      // Add new hotspots
      HOTSPOTS[currentFloor].forEach(hs => {
        const dotGeo = new THREE.SphereGeometry(15, 32, 32);
        const dotMat = new THREE.MeshBasicMaterial({ color: 0xb22222, transparent: true, opacity: 0.8 });
        const dot = new THREE.Mesh(dotGeo, dotMat);
        dot.position.set(hs.position.x, hs.position.y, hs.position.z);
        dot.userData = hs;
        hotspotGroupRef.current!.add(dot);

        const ringGeo = new THREE.RingGeometry(18, 22, 32);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.copy(dot.position);
        ring.lookAt(0, 0, 0);
        hotspotGroupRef.current!.add(ring);
      });

      // Update texture with a brief fade
      (sphereRef.current!.material as THREE.MeshBasicMaterial).map = newTexture;
      (sphereRef.current!.material as THREE.MeshBasicMaterial).needsUpdate = true;
      
      setTimeout(() => setIsChangingFloor(false), 500);
    };

    updateContent();
  }, [currentFloor]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      <div ref={mountRef} className={`w-full h-full cursor-grab active:cursor-grabbing transition-opacity duration-500 ${isChangingFloor ? 'opacity-30 scale-95' : 'opacity-100 scale-100'}`} />

      {/* 2D 小地图 */}
      <div className="absolute bottom-40 right-8 w-32 h-32 glass-morphism rounded-full border-2 border-jadeBlue/20 overflow-hidden flex items-center justify-center shadow-2xl">
         <div className="relative w-full h-full flex items-center justify-center opacity-20">
            <MapIcon className="text-jadeBlue" size={56} />
         </div>
         <div 
           className="absolute w-4 h-4 bg-sxuRed rounded-full shadow-[0_0_15px_#b22222] border-2 border-white transition-transform duration-300"
           style={{ transform: `rotate(${-rotation}deg) translateY(-20px)` }}
         >
           <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-0.5 h-5 bg-sxuRed"></div>
         </div>
      </div>

      {/* 优化后的楼层切换 */}
      <div className="absolute bottom-40 left-8 flex flex-col gap-3">
         <button 
           onClick={() => setCurrentFloor('2F')}
           className={`w-14 h-14 rounded-2xl shadow-xl flex flex-col items-center justify-center border-2 transition-all ${
             currentFloor === '2F' 
              ? 'bg-jadeBlue text-white border-white/40 scale-110' 
              : 'bg-white/20 text-white border-white/10 backdrop-blur-md active:scale-90'
           }`}
         >
            <ChevronUp size={16} className={currentFloor === '2F' ? 'animate-bounce' : ''}/>
            <span className="font-serif font-bold text-sm">2F</span>
         </button>
         <button 
           onClick={() => setCurrentFloor('1F')}
           className={`w-14 h-14 rounded-2xl shadow-xl flex flex-col items-center justify-center border-2 transition-all ${
             currentFloor === '1F' 
              ? 'bg-jadeBlue text-white border-white/40 scale-110' 
              : 'bg-white/20 text-white border-white/10 backdrop-blur-md active:scale-90'
           }`}
         >
            <span className="font-serif font-bold text-sm">1F</span>
            <ChevronDown size={16} className={currentFloor === '1F' ? 'animate-bounce' : ''}/>
         </button>
      </div>

      {/* 详情浮窗 */}
      {selectedHotspot && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-lg animate-in fade-in duration-300">
          <GlassCard className="max-w-md w-full animate-in zoom-in-95 duration-500 bg-white/95 border-none">
            <div className="flex justify-between items-start mb-5">
              <div className="flex flex-col">
                <h3 className="text-2xl font-serif text-jadeBlue font-bold">{selectedHotspot.title}</h3>
                <div className="w-8 h-1 bg-sxuRed mt-1 rounded-full" />
              </div>
              <button onClick={() => setSelectedHotspot(null)} className="p-2 rounded-full hover:bg-jadeBlue/10 transition-colors">
                <X size={20} className="text-inkBlack" />
              </button>
            </div>
            <div className="aspect-[16/10] mb-5 rounded-2xl overflow-hidden shadow-lg border border-jadeBlue/5">
              <img src={selectedHotspot.images[0]} alt={selectedHotspot.title} className="w-full h-full object-cover" />
            </div>
            <p className="text-inkBlack/70 font-serif text-base leading-relaxed mb-8">
              {selectedHotspot.description}
            </p>
            <div className="flex gap-4">
              <button className="flex-1 bg-jadeBlue text-white py-4 rounded-2xl text-sm font-bold font-serif shadow-xl hover:bg-jadeBlue/90 active:scale-95 transition-all">
                展品导览
              </button>
              <button className="flex-1 border-2 border-jadeBlue/20 text-jadeBlue py-4 rounded-2xl text-sm font-bold font-serif hover:bg-jadeBlue/5 active:scale-95 transition-all">
                空间透视
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* 楼层/位置指示 */}
      <div className="absolute top-32 left-6 flex flex-col gap-2">
        <GlassCard className="py-2.5 px-5 flex items-center gap-3 bg-white/80 border-none shadow-xl rounded-2xl backdrop-blur-md">
          <Layers size={16} className="text-sxuRed" />
          <span className="text-xs font-bold tracking-widest text-jadeBlue font-serif">
            {FLOOR_DATA[currentFloor].label}
          </span>
        </GlassCard>
        {isChangingFloor && (
          <div className="text-[10px] text-white/60 font-serif tracking-[0.3em] pl-4 uppercase animate-pulse">
            正在载入空间维度...
          </div>
        )}
      </div>
    </div>
  );
};

export default PanoramaViewer;
