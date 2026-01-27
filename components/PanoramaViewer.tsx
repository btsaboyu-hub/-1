import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SCENES } from '../scenesConfig';
import { Volume2, VolumeX, Move, Info, ArrowLeft, MapPin } from 'lucide-react';

interface PanoramaViewerProps {
  initialSceneId?: string;
  onExit?: () => void;
}

const PanoramaViewer: React.FC<PanoramaViewerProps> = ({ 
  initialSceneId = 'hall-1', 
  onExit 
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Safe cast to ensure the key exists, defaulting to hall-1 if invalid
  const validInitialId = Object.keys(SCENES).includes(initialSceneId) 
    ? (initialSceneId as keyof typeof SCENES) 
    : 'hall-1';

  const [currentSceneKey, setCurrentSceneKey] = useState<keyof typeof SCENES>(validInitialId);
  const [rotation, setRotation] = useState(0);
  const [isChangingScene, setIsChangingScene] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  
  const sceneRef = useRef<THREE.Scene | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);
  const hotspotGroupRef = useRef<THREE.Group | null>(null);

  const currentScene = SCENES[currentSceneKey];

  // Initialize Three.js
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1100);
    const cameraTarget = new THREE.Vector3(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(500, 64, 48);
    // 关键修正：通过负缩放翻转几何体以朝向内部。
    geometry.scale(-1, 1, 1);
    
    // 初始化材质：设置底色
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x126e82, // 设置主题色为底色
      map: null
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
      setIsDragging(true);
      setAutoRotate(false);
      onPointerDownPointerX = event.clientX;
      onPointerDownPointerY = event.clientY;
      onPointerDownLon = lon;
      onPointerDownLat = lat;

      // Raycast for hotspots
      const rect = mountRef.current!.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(hotspotGroup.children, true);
      
      if (intersects.length > 0) {
        let clickedObj = intersects[0].object;
        let target = clickedObj.userData.target;
        let parent = clickedObj.parent;
        while (!target && parent && parent !== hotspotGroup) {
          target = parent.userData.target;
          parent = parent.parent;
        }
        if (target) setCurrentSceneKey(target as keyof typeof SCENES);
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

    const onPointerUp = () => { 
      isUserInteracting = false; 
      setIsDragging(false);
    };
    
    const onWheel = (event: WheelEvent) => {
      camera.fov = THREE.MathUtils.clamp(camera.fov + event.deltaY * 0.05, 30, 90);
      camera.updateProjectionMatrix();
    };

    mountRef.current.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    mountRef.current.addEventListener('wheel', onWheel);

    const animate = () => {
      requestAnimationFrame(animate);
      if (autoRotate && !isUserInteracting) {
        lon += 0.04;
        setRotation(lon);
      }
      phi = THREE.MathUtils.degToRad(90 - lat);
      theta = THREE.MathUtils.degToRad(lon);
      cameraTarget.x = 500 * Math.sin(phi) * Math.cos(theta);
      cameraTarget.y = 500 * Math.cos(phi);
      cameraTarget.z = 500 * Math.sin(phi) * Math.sin(theta);
      camera.lookAt(cameraTarget);
      renderer.render(scene, camera);
      
      hotspotGroup.children.forEach(child => {
        if (child.name === 'pulse-ring') {
          const s = 1 + Math.sin(Date.now() * 0.003) * 0.2;
          child.scale.set(s, s, 1);
        }
      });
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      mountRef.current?.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      mountRef.current?.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      if (sphereRef.current) {
        if (Array.isArray(sphereRef.current.material)) {
          sphereRef.current.material.forEach(m => m.dispose());
        } else {
          sphereRef.current.material.dispose();
        }
      }
    };
  }, [autoRotate]);

  // Load Scene Texture and Hotspots
  useEffect(() => {
    if (!sphereRef.current || !hotspotGroupRef.current) return;

    const loadScene = async () => {
      setIsChangingScene(true);
      const textureLoader = new THREE.TextureLoader();
      
      try {
        console.log(`Loading texture for: ${currentScene.name}`);
        const newTexture = await textureLoader.loadAsync(currentScene.image);
        newTexture.colorSpace = THREE.SRGBColorSpace;
        newTexture.minFilter = THREE.LinearFilter;
        newTexture.magFilter = THREE.LinearFilter;
        
        const mat = sphereRef.current!.material as THREE.MeshBasicMaterial;
        if (mat.map) mat.map.dispose();
        mat.map = newTexture;
        mat.color.setHex(0xffffff); 
        mat.needsUpdate = true;
      } catch (err) {
        console.error("Scene texture load failed.", err);
        const mat = sphereRef.current!.material as THREE.MeshBasicMaterial;
        mat.map = null;
        mat.color.setHex(0x126e82);
        mat.needsUpdate = true;
      }
      
      // Cleanup hotspots
      while(hotspotGroupRef.current!.children.length > 0) {
        const obj = hotspotGroupRef.current!.children[0];
        hotspotGroupRef.current!.remove(obj);
      }

      currentScene.hotspots.forEach(hs => {
        const group = new THREE.Group();
        group.userData = { target: hs.target };
        const pos = new THREE.Vector3(...hs.position).normalize().multiplyScalar(450);
        
        const dot = new THREE.Mesh(new THREE.SphereGeometry(12, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 }));
        group.add(dot);

        const ring = new THREE.Mesh(new THREE.RingGeometry(15, 25, 32), new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.4 }));
        ring.name = 'pulse-ring';
        ring.lookAt(0, 0, 0);
        group.add(ring);

        group.position.copy(pos);
        hotspotGroupRef.current!.add(group);
      });

      setTimeout(() => setIsChangingScene(false), 600);
    };

    loadScene();
  }, [currentSceneKey]);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black overflow-hidden select-none z-[100] touch-none">
      <audio ref={audioRef} loop src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" />
      
      {/* 3D Canvas Container */}
      <div 
        ref={mountRef} 
        className={`w-full h-full transition-all duration-1000 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        } ${
          isChangingScene ? 'opacity-0 scale-105 blur-2xl' : 'opacity-100 scale-100 blur-0'
        }`} 
      />

      {/* Top Left: Exit Button */}
      {onExit && (
        <button 
          onClick={onExit}
          className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-sxuRed hover:border-sxuRed transition-all group animate-in slide-in-from-top-4"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-serif font-bold tracking-widest">退出漫游</span>
        </button>
      )}

      {/* Top Left: Scene Info (Moved down slightly) */}
      <div className="absolute top-24 left-6 z-40 pointer-events-none">
         <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 shadow-2xl animate-in slide-in-from-left duration-700">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-sxuRed rounded-full shadow-[0_0_10px_rgba(178,34,34,0.5)]" />
               <h2 className="text-xl font-serif font-bold text-white tracking-widest drop-shadow-md">{currentScene.name}</h2>
            </div>
            <div className="flex items-center gap-2 mt-1.5 opacity-60">
              <Info size={10} className="text-white" />
              <p className="text-[9px] text-white uppercase tracking-[0.2em] font-sans font-bold">Centennial SXU · 360° VR</p>
            </div>
         </div>
      </div>

      {/* Top Right: Only Speaker Icon, Centered */}
      <div className="absolute top-6 right-6 z-50">
        <button 
          onClick={() => { setIsMuted(!isMuted); if (isMuted) audioRef.current?.play(); else audioRef.current?.pause(); }} 
          className="w-12 h-12 bg-black/30 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-jadeBlue hover:border-jadeBlue transition-all group active:scale-90"
        >
           {isMuted ? <VolumeX size={20}/> : <Volume2 size={20}/>}
        </button>
      </div>

      {/* Bottom Center: Guide Tooltip */}
      <div className="absolute bottom-12 inset-x-0 z-40 flex justify-center pointer-events-none">
         <div className="bg-black/20 backdrop-blur-sm text-white px-6 py-3 rounded-full text-xs font-serif flex items-center gap-2 animate-pulse shadow-2xl border border-white/10">
            <Move size={14} />
            <span className="font-medium tracking-wider">点击切换场景，拖拽旋转视角</span>
         </div>
      </div>

      {/* Bottom Left: Scene Switcher Navigation */}
      <div className="absolute bottom-8 left-6 z-50 flex gap-3 animate-in slide-in-from-bottom duration-700">
         {Object.entries(SCENES).map(([key, scene]) => {
           const isActive = key === currentSceneKey;
           return (
             <button
               key={key}
               onClick={() => setCurrentSceneKey(key as keyof typeof SCENES)}
               className={`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md transition-all border ${
                 isActive 
                   ? 'bg-sxuRed/80 border-sxuRed text-white shadow-lg scale-105' 
                   : 'bg-black/30 border-white/10 text-white/70 hover:bg-black/50 hover:text-white'
               }`}
             >
                <MapPin size={12} className={isActive ? 'fill-white' : ''} />
                <span className="text-[10px] font-bold font-serif">{scene.name}</span>
             </button>
           );
         })}
      </div>

      {/* Background Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
};

export default PanoramaViewer;