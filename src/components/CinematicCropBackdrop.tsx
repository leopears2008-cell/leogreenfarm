import { useEffect, useRef, useState } from 'react';

interface CinematicCropBackdropProps {
  enabled?: boolean;
  opacityLevel?: 'subtle' | 'balanced' | 'deep';
  blendMode?: 'luminosity' | 'overlay' | 'normal';
}

export default function CinematicCropBackdrop({
  enabled = true,
  opacityLevel = 'subtle',
  blendMode = 'luminosity'
}: CinematicCropBackdropProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Compute opacity style
  const opacityClass = {
    subtle: 'opacity-15',
    balanced: 'opacity-25',
    deep: 'opacity-35',
  }[opacityLevel];

  // Procedural canvas animation: swaying crop stalks & floating spores
  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Generate crop stalks
    const stalkCount = Math.floor(width / 32);
    const stalks = Array.from({ length: stalkCount }, (_, i) => ({
      x: (i / stalkCount) * width + (Math.random() * 20 - 10),
      height: height * (0.35 + Math.random() * 0.3),
      width: 2 + Math.random() * 2.5,
      bendOffset: Math.random() * Math.PI * 2,
      bendSpeed: 0.0012 + Math.random() * 0.001,
      swayMagnitude: 28 + Math.random() * 32,
      color: Math.random() > 0.4 ? 'rgba(52, 211, 153, 0.45)' : 'rgba(245, 158, 11, 0.35)',
      leafAngle: (Math.random() - 0.5) * 0.8,
    }));

    // Floating agricultural pollen/spores
    const pollenCount = 35;
    const pollen = Array.from({ length: pollenCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 1 + Math.random() * 2,
      speedX: 0.2 + Math.random() * 0.4,
      speedY: -0.15 + (Math.random() - 0.5) * 0.2,
      alpha: 0.2 + Math.random() * 0.5,
    }));

    let time = 0;

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Render stalks from the bottom edge
      stalks.forEach((stalk) => {
        const sway = Math.sin(time * stalk.bendSpeed + stalk.bendOffset) * stalk.swayMagnitude;
        const startX = stalk.x;
        const startY = height;
        const endX = stalk.x + sway;
        const endY = height - stalk.height;
        const cpX = stalk.x + sway * 0.45;
        const cpY = height - stalk.height * 0.55;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(cpX, cpY, endX, endY);
        ctx.strokeStyle = stalk.color;
        ctx.lineWidth = stalk.width;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Delicate grain ear / seed head at tip
        ctx.beginPath();
        ctx.ellipse(endX, endY, stalk.width * 1.6, stalk.width * 3.8, sway * 0.02, 0, Math.PI * 2);
        ctx.fillStyle = stalk.color;
        ctx.fill();
      });

      // Render floating spores
      pollen.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 158, 11, ${p.alpha * 0.6})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Base agricultural landscape photo covering website */}
      <img
        src="/assets/aistudio/67906878b871ccd8c7db2d2dc66d5780_01546f3d.png"
        alt="Agricultural Aerial Landscape"
        style={{ mixBlendMode: blendMode }}
        className={`absolute inset-0 w-full h-full object-cover scale-[1.22] object-center transition-opacity duration-1000 ${
          opacityLevel === 'subtle' ? 'opacity-20' : opacityLevel === 'balanced' ? 'opacity-35' : 'opacity-50'
        }`}
      />

      {/* Cinematic HTML5 video of swaying crops in the breeze */}
      {!videoError && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => setVideoError(true)}
          style={{ mixBlendMode: blendMode }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${opacityClass} ${
            videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* High-quality royalty-free cinematic loop of agricultural wind in field */}
          <source 
            src="https://assets.mixkit.co/videos/preview/mixkit-wind-blowing-in-a-wheat-field-4155-large.mp4" 
            type="video/mp4" 
          />
        </video>
      )}

      {/* Procedural Canvas swaying field (renders underneath & acts as guaranteed fallback) */}
      <canvas
        ref={canvasRef}
        style={{ mixBlendMode: blendMode }}
        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
          videoLoaded ? 'opacity-30' : opacityClass
        }`}
      />

      {/* Layer 1: Dark Forest Top & Bottom Vignette Overlays for maximum text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070D09]/95 via-[#070D09]/82 to-[#070D09]" />

      {/* Layer 2: Subtle radial depth illumination focused on the center crop stage */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(16,185,129,0.06)_0%,rgba(7,13,9,0.85)_75%)]" />

      {/* Layer 3: Subtle horizontal atmospheric fog */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#070D09] to-transparent opacity-90" />
    </div>
  );
}
