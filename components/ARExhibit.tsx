
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
// Added ChevronRight to fix the missing import error
import { Camera, RefreshCcw, Info, ScanLine, ChevronRight } from 'lucide-react';
import GlassCard from './GlassCard';

const ARExhibit: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [permission, setPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const initAR = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setPermission('granted');
        }
      } catch (err) {
        console.error("Camera access denied", err);
        setPermission('denied');
      }
    };

    initAR();

    if (canvasRef.current && permission === 'granted') {
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
      renderer.setSize(width, height);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      const artifactGroup = new THREE.Group();
      // 模拟一个山大校徽立柱
      const baseGeo = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
      const jadeMat = new THREE.MeshStandardMaterial({ 
        color: 0x126e82, 
        roughness: 0.2, 
        metalness: 0.1,
        transparent: true,
        opacity: scanning ? 0 : 0.9
      });
      const base = new THREE.Mesh(baseGeo, jadeMat);
      artifactGroup.add(base);

      const topGeo = new THREE.TorusGeometry(0.4, 0.05, 16, 100);
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xd2b116, metalness: 0.9, roughness: 0.1 });
      const top = new THREE.Mesh(topGeo, goldMat);
      top.position.y = 1.2;
      top.rotation.x = Math.PI / 2;
      artifactGroup.add(top);

      scene.add(artifactGroup);
      camera.position.z = 5;

      const animate = () => {
        requestAnimationFrame(animate);
        if (!scanning) {
          artifactGroup.rotation.y += 0.01;
          artifactGroup.position.y = Math.sin(Date.now() * 0.002) * 0.2;
        }
        renderer.render(scene, camera);
      };
      animate();

      const timer = setTimeout(() => {
        setScanning(false);
        jadeMat.opacity = 0.9;
      }, 3000);

      return () => {
        clearTimeout(timer);
        const stream = videoRef.current?.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
      };
    }
  }, [permission, scanning]);

  if (permission === 'denied') {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-paperWhite p-10 text-center">
        <Camera size={64} className="text-jadeBlue mb-6 opacity-30" />
        <h2 className="text-2xl font-serif text-jadeBlue mb-3 font-bold">需开启相机权限</h2>
        <p className="text-inkBlack/60 mb-10 leading-relaxed">为了开启灵境寻古之旅，请在设置中允许访问您的相机。</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-sxuRed text-white px-10 py-4 rounded-full font-serif flex items-center gap-3 shadow-xl"
        >
          <RefreshCcw size={20} /> 重新授权
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black">
      <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover grayscale-[30%] opacity-80" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10" />

      {scanning && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/20">
          <div className="relative w-72 h-72 border-[1px] border-dashed border-white/50 rounded-3xl flex items-center justify-center overflow-hidden">
             <div className="absolute top-0 w-full h-1 bg-sxuRed shadow-[0_0_25px_#b22222] animate-[scan_2.5s_infinite]" />
             <div className="w-16 h-16 border-2 border-white/20 rounded-full animate-ping" />
          </div>
          <p className="mt-10 text-white font-serif tracking-[0.4em] text-lg font-bold animate-pulse">正在识别校史景观...</p>
        </div>
      )}

      {!scanning && (
        <div className="absolute bottom-32 inset-x-6 z-30 pointer-events-none">
          <GlassCard className="pointer-events-auto animate-in slide-in-from-bottom-8 duration-700 bg-white/90">
            <div className="flex items-center gap-5 mb-4">
               <div className="w-14 h-14 rounded-full bg-sxuRed/10 flex items-center justify-center text-sxuRed">
                 <Info size={24} />
               </div>
               <div>
                 <h4 className="text-xl font-serif text-jadeBlue font-bold">山大精神石刻 (虚拟修复)</h4>
                 <p className="text-[10px] text-jadeBlue/50 uppercase tracking-[0.2em] font-bold">SXU SPIRIT · VIRTUAL ARTIFACT</p>
               </div>
            </div>
            <p className="text-inkBlack/70 text-sm leading-relaxed font-serif mb-6">
              您已触发隐藏校史交互。此碑刻展示了“中西合璧，求真至善”的校训内涵。采用Draco高精度模型压缩技术，完美还原石材纹理。
            </p>
            <div className="flex justify-between items-center border-t border-jadeBlue/5 pt-4">
               <span className="text-[11px] text-inkBlack/40 font-serif">模型采样率: 4K PBR</span>
               <button className="text-sxuRed text-sm font-bold font-serif flex items-center gap-2 hover:translate-x-1 transition-transform">
                 探索历史渊源 <ChevronRight size={14}/>
               </button>
            </div>
          </GlassCard>
        </div>
      )}

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0.5; }
          50% { top: 100%; opacity: 1; }
          100% { top: 0%; opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default ARExhibit;
