
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { HOTSPOTS } from '../constants';
import { Hotspot } from '../types';
import { Info, X, Map as MapIcon, Layers, ChevronUp, ChevronDown, Move } from 'lucide-react';
import GlassCard from './GlassCard';

const FLOOR_DATA = {
  '1F': {
    texture: 'https://images.unsplash.com/photo-1590483734724-38fa19744990?q=80&w=2000&auto=format&fit=crop',
    label: '一层 · 溯源峥嵘',
    desc: '追溯山西大学堂创立初期的辉煌历程'
  },
  '2F': {
    texture: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop',
    label: '二层 · 华章成果',
    desc: '展现新时代背景下的教学与科研盛果'
  }
};

const PanoramaViewer: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [currentFloor, setCurrentFloor] = useState<'1F' | '2F'>('1F');
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [rotation, setRotation] = useState(0);
  const [isChangingFloor, setIsChangingFloor] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
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
    const cameraTarget = new THREE.Vector3(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);
    
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

  // 楼层切换与纹理加载
  useEffect(() => {
    if (!sphereRef.current || !hotspotGroupRef.current) return;

    const updateContent = async () => {
      setIsChangingFloor(true);
      setIsTransitioning(true);
      
      const textureLoader = new THREE.TextureLoader();
      const newTexture = await textureLoader.loadAsync(FLOOR_DATA[currentFloor].texture);
      
      // 清空旧热点
      while(hotspotGroupRef.current!.children.length > 0) {
        hotspotGroupRef.current!.remove(hotspotGroupRef.current!.children[0]);
      }

      // 添加新楼层热点
      HOTSPOTS[currentFloor].forEach(hs => {
        const dotGeo = new THREE.SphereGeometry(15, 32, 32);
        const dotMat = new THREE.MeshBasicMaterial({ color: 0xb22222, transparent: true, opacity: 0.9 });
        const dot = new THREE.Mesh(dotGeo, dotMat);
        dot.position.set(hs.position.x, hs.position.y, hs.position.z);
        dot.userData = hs;
        hotspotGroupRef.current!.add(dot);

        const ringGeo = new THREE.RingGeometry(18, 22, 32);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.copy(dot.position);
        ring.lookAt(0, 0, 0);
        hotspotGroupRef.current!.add(ring);
      });

      // 更新纹理
      (sphereRef.current!.material as THREE.MeshBasicMaterial).map = newTexture;
      (sphereRef.current!.material as THREE.MeshBasicMaterial).needsUpdate = true;
      
      // 延迟结束动画，确保平滑
      setTimeout(() => {
        setIsChangingFloor(false);
        setTimeout(() => setIsTransitioning(false), 300);
      }, 600);
    };

    updateContent();
  }, [currentFloor]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* 全景渲染容器 */}
      <div 
        ref={mountRef} 
        className={`w-full h-full cursor-grab active:cursor-grabbing transition-all duration-700 ease-in-out ${
          isChangingFloor ? 'opacity-0 scale-105 blur-lg' : 'opacity-100 scale-100 blur-0'
        }`} 
      />

      {/* 楼层切换覆盖层 (动画中显示) */}
      {isTransitioning && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md z-10 transition-opacity">
           <div className="w-20 h-20 relative mb-6">
              <div className="absolute inset-0 border-4 border-white/20 rounded-full" />
              <div className="absolute inset-0 border-t-4 border-sxuRed rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-white font-serif font-bold text-2xl">{currentFloor}</span>
              </div>
           </div>
           <h4 className="text-white font-serif text-lg tracking-[0.3em] font-bold animate-pulse">正在穿梭至{currentFloor}展区</h4>
           <p className="text-white/40 text-[10px] mt-2 uppercase tracking-widest">{FLOOR_DATA[currentFloor].label}</p>
        </div>
      )}

      {/* 交互控件: 小地图 */}
      <div className="absolute bottom-40 right-8 w-32 h-32 glass-morphism rounded-full border-2 border-white/20 overflow-hidden flex items-center justify-center shadow-2xl z-20">
         <div className="relative w-full h-full flex items-center justify-center opacity-20">
            <MapIcon className="text-jadeBlue" size={48} />
         </div>
         <div 
           className="absolute w-4 h-4 bg-sxuRed rounded-full shadow-[0_0_15px_#b22222] border-2 border-white transition-transform duration-300"
           style={{ transform: `rotate(${-rotation}deg) translateY(-20px)` }}
         >
           <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-0.5 h-5 bg-sxuRed"></div>
         </div>
         <div className="absolute top-2 text-[8px] font-bold text-jadeBlue/60 font-serif">ORIENTATION</div>
      </div>

      {/* 楼层选择器 (优化视觉) */}
      <div className="absolute bottom-40 left-8 flex flex-col gap-4 z-20">
         <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-1.5 flex flex-col gap-1.5 shadow-2xl">
            <button 
              onClick={() => setCurrentFloor('2F')}
              className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all ${
                currentFloor === '2F' 
                 ? 'bg-jadeBlue text-white shadow-lg scale-110 ring-4 ring-jadeBlue/20' 
                 : 'text-white/60 hover:bg-white/10 active:scale-90'
              }`}
            >
               <ChevronUp size={14} className={currentFloor === '2F' ? 'animate-bounce' : ''}/>
               <span className="font-serif font-bold text-sm">2F</span>
            </button>
            <div className="w-full h-px bg-white/10" />
            <button 
              onClick={() => setCurrentFloor('1F')}
              className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all ${
                currentFloor === '1F' 
                 ? 'bg-jadeBlue text-white shadow-lg scale-110 ring-4 ring-jadeBlue/20' 
                 : 'text-white/60 hover:bg-white/10 active:scale-90'
              }`}
            >
               <span className="font-serif font-bold text-sm">1F</span>
               <ChevronDown size={14} className={currentFloor === '1F' ? 'animate-bounce' : ''}/>
            </button>
         </div>
         <div className="px-2">
            <p className="text-[10px] text-white/40 font-bold tracking-widest uppercase">Select Level</p>
         </div>
      </div>

      {/* 详情浮窗 */}
      {selectedHotspot && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-lg animate-in fade-in duration-300">
          <GlassCard className="max-w-md w-full animate-in zoom-in-95 duration-500 bg-white border-none shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-start mb-5">
              <div className="flex flex-col">
                <h3 className="text-2xl font-serif text-jadeBlue font-bold">{selectedHotspot.title}</h3>
                <div className="w-10 h-1 bg-sxuRed mt-2 rounded-full" />
              </div>
              <button onClick={() => setSelectedHotspot(null)} className="p-2 rounded-full hover:bg-jadeBlue/5 text-jadeBlue/40 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="aspect-[16/10] mb-6 rounded-3xl overflow-hidden shadow-2xl border border-jadeBlue/5">
              <img src={selectedHotspot.images[0]} alt={selectedHotspot.title} className="w-full h-full object-cover" />
            </div>
            <p className="text-inkBlack/70 font-serif text-base leading-relaxed mb-10">
              {selectedHotspot.description}
            </p>
            <div className="flex gap-4">
              <button className="flex-1 bg-jadeBlue text-white py-4 rounded-2xl text-sm font-bold font-serif shadow-xl hover:shadow-jadeBlue/20 active:scale-95 transition-all">
                开启语音导览
              </button>
              <button className="flex-1 border-2 border-jadeBlue/10 text-jadeBlue py-4 rounded-2xl text-sm font-bold font-serif hover:bg-jadeBlue/5 active:scale-95 transition-all">
                空间透视
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* 当前楼层标识 */}
      <div className="absolute top-32 left-6 flex flex-col gap-2 z-20">
        <GlassCard className="py-2.5 px-5 flex items-center gap-3 bg-white/80 border-none shadow-xl rounded-2xl backdrop-blur-md">
          <Layers size={16} className="text-sxuRed" />
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-widest text-jadeBlue font-serif">
              {FLOOR_DATA[currentFloor].label}
            </span>
            <span className="text-[8px] text-jadeBlue/40 font-bold uppercase">{FLOOR_DATA[currentFloor].desc}</span>
          </div>
        </GlassCard>
        <button className="flex items-center gap-2 py-2 px-4 bg-white/40 backdrop-blur-md rounded-full text-[10px] text-white font-bold tracking-widest uppercase hover:bg-white/60 transition-all">
           <Move size={12}/> 点击或拖动探索空间
        </button>
      </div>
    </div>
  );
};

export default PanoramaViewer;
