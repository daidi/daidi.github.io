import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface ProfileData {
  name: string;
  title: string;
  bio: string;
  headline: string;
  techStack: string[];
  socialLinks: { label: string; icon: string; url: string }[];
}

export type { ProfileData };

export function ProfileCard({ data }: { data: ProfileData }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const myConfetti = confetti.create(canvasRef.current, { resize: true });
    const colors = ['#a78bfa', '#38bdf8', '#fbbf24', '#e2e8f0', '#f472b6'];
    const timer = setTimeout(() => {
      myConfetti({ particleCount: 80, angle: 60,  spread: 70, origin: { x: 0, y: 1 }, colors, gravity: 0.4, scalar: 0.6, ticks: 800, disableForReducedMotion: true });
      myConfetti({ particleCount: 80, angle: 120, spread: 70, origin: { x: 1, y: 1 }, colors, gravity: 0.4, scalar: 0.6, ticks: 800, disableForReducedMotion: true });
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="border border-border rounded-xl p-5 bg-card relative overflow-hidden max-w-md mt-4"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />

      {/* Header dots + social icons */}
      <div className="flex items-center justify-between mb-5 relative z-20">
        <div className="flex items-center gap-1.5">
          <span className="w-8 h-2.5 rounded-full bg-foreground/20 animate-pulse" />
          <span className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
          <span className="w-2.5 h-2.5 rounded-full bg-foreground/5" />
        </div>
        <div className="flex gap-2">
          {data.socialLinks.map((link, i) => (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
               className="text-muted-foreground hover:text-foreground transition-colors text-xs font-medium">
              {link.icon}
            </a>
          ))}
        </div>
      </div>

      {/* Avatar + Name */}
      <div className="flex items-center gap-3 mb-6 relative z-20">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-sky-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
          {data.name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-bold leading-none">{data.name}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{data.title}</p>
        </div>
      </div>

      {/* Headline */}
      <h3 className="text-lg font-extrabold leading-tight tracking-tight whitespace-pre-line text-center relative z-20 bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent">
        {data.headline}
      </h3>

      {/* Bio */}
      <p className="text-xs mt-2.5 leading-relaxed relative z-20 bg-gradient-to-r from-foreground/60 to-foreground/25 bg-clip-text text-transparent">
        {data.bio}
      </p>

      {/* Tech stack */}
      <div className="flex flex-wrap gap-1 mt-8 relative z-20">
        {data.techStack.map(tech => (
          <span key={tech} className="px-2 py-0.5 rounded-md bg-input/60 text-[10px] text-muted-foreground font-mono">
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
