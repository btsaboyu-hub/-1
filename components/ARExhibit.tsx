import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Camera, Info, RefreshCcw, ShieldCheck } from 'lucide-react';
import GlassCard from './GlassCard';

const ARExhibit: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [permission, setPermission] = useState<'prompt' | 'requesting' | 'granted' | 'denied'>('prompt');
  const [loadingModel, setLoadingModel] = useState(true);

  const requestCamera = async () => {
    setPermission('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      setPermission('granted');
    } catch {
      setPermission('denied');
    }
  };

  useEffect(() => {
    if (permission !== 'granted' || !canvasRef.current || !videoRef.current || !streamRef.current) return;
    videoRef.current.srcObject = streamRef.current;
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    scene.add(new THREE.AmbientLight(0xffffff, 1.4));
    const light = new THREE.DirectionalLight(0xffffff, 1.2);
    light.position.set(3, 5, 4);
    scene.add(light);

    const artifact = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 1.8, 40), new THREE.MeshStandardMaterial({ color: 0x126e82, roughness: 0.35, metalness: 0.1 }));
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.06, 18, 80), new THREE.MeshStandardMaterial({ color: 0xd2b116, metalness: 0.75, roughness: 0.2 }));
    ring.position.y = 1.05;
    ring.rotation.x = Math.PI / 2;
    artifact.add(base, ring);
    scene.add(artifact);
    camera.position.z = 4.6;

    const timer = window.setTimeout(() => setLoadingModel(false), 1200);
    let animationFrame = 0;
    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      artifact.rotation.y += 0.008;
      artifact.position.y = Math.sin(Date.now() * 0.0018) * 0.12;
      renderer.render(scene, camera);
    };
    animate();
    const onResize = () => {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [permission]);

  if (permission === 'prompt' || permission === 'requesting') {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-paperWhite p-8 text-center">
        <div className="w-24 h-24 rounded-[2rem] bg-jadeBlue/5 text-jadeBlue flex items-center justify-center mb-7"><Camera size={48}/></div>
        <h2 className="text-2xl font-serif text-jadeBlue mb-3 font-bold">虚拟展品体验</h2>
        <p className="text-inkBlack/55 mb-4 leading-relaxed">开启相机后，系统会在相机画面上叠加一个可旋转的虚拟展品模型。</p>
        <div className="flex items-center gap-2 text-xs text-jadeBlue/55 mb-8 bg-jadeBlue/5 px-4 py-3 rounded-xl"><ShieldCheck size={15}/>画面仅在本机展示，不会上传或保存</div>
        <button disabled={permission === 'requesting'} onClick={requestCamera} className="bg-sxuRed text-white px-10 py-4 rounded-full font-serif flex items-center gap-3 shadow-xl disabled:opacity-50"><Camera size={19}/>{permission === 'requesting' ? '等待授权...' : '开启相机体验'}</button>
        <p className="mt-6 text-[11px] text-inkBlack/35">概念验证：该功能仅演示相机画面与3D模型叠加。</p>
      </div>
    );
  }

  if (permission === 'denied') {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-paperWhite p-10 text-center">
        <Camera size={60} className="text-jadeBlue mb-6 opacity-25"/><h2 className="text-2xl font-serif text-jadeBlue mb-3 font-bold">相机权限未开启</h2><p className="text-inkBlack/55 mb-8 leading-relaxed">你仍可使用全景漫游和AI校史讲解；如需体验虚拟展品，请在浏览器设置中允许相机权限。</p><button onClick={requestCamera} className="bg-jadeBlue text-white px-8 py-3.5 rounded-full font-serif flex items-center gap-2"><RefreshCcw size={18}/>重新尝试</button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black">
      <video ref={videoRef} autoPlay muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-85"/>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10"/>
      {loadingModel && <div className="absolute inset-0 z-20 flex items-center justify-center text-white font-serif tracking-widest bg-black/20">正在加载虚拟展品...</div>}
      {!loadingModel && <div className="absolute bottom-32 inset-x-5 z-30 pointer-events-none"><GlassCard className="pointer-events-auto bg-white/92"><div className="flex items-center gap-4 mb-3"><div className="w-12 h-12 rounded-full bg-sxuRed/10 flex items-center justify-center text-sxuRed"><Info size={22}/></div><div><h4 className="text-lg font-serif text-jadeBlue font-bold">山大精神主题虚拟展品</h4><p className="text-[9px] text-jadeBlue/45 tracking-widest font-bold">3D OVERLAY · CONCEPT PROTOTYPE</p></div></div><p className="text-inkBlack/65 text-sm leading-relaxed font-serif">该模块用于验证“实景画面叠加数字展品”的交互方式，帮助访客在移动端理解展品信息。</p></GlassCard></div>}
    </div>
  );
};

export default ARExhibit;
