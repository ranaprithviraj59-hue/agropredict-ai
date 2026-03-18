import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const PARTICLES = [
  { emoji: '🌿', count: 4 },
  { emoji: '🍃', count: 4 },
  { emoji: '🌾', count: 3 },
  { emoji: '🌱', count: 3 },
  { emoji: '☘️', count: 2 },
  { emoji: '🌸', count: 2 },
  { emoji: '🐝', count: 1 },
  { emoji: '🦋', count: 1 },
];

const allEmojis = PARTICLES.flatMap(({ emoji, count }) => Array(count).fill(emoji));

export default function FloatingParticles() {
  const [particles] = useState(() =>
    allEmojis.map((emoji, i) => ({
      id: i,
      emoji,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 12 + Math.random() * 22,
      duration: 10 + Math.random() * 15,
      delay: Math.random() * 8,
      xRange: (Math.random() - 0.5) * 40,
      yRange: -(20 + Math.random() * 40),
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Gradient orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-[0.07] bg-primary"
        style={{ top: '10%', left: '5%', filter: 'blur(80px)' }}
        animate={{ scale: [1, 1.3, 1], x: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-80 h-80 rounded-full opacity-[0.07] bg-secondary"
        style={{ bottom: '15%', right: '10%', filter: 'blur(80px)' }}
        animate={{ scale: [1, 1.2, 1], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />
      <motion.div
        className="absolute w-64 h-64 rounded-full opacity-[0.05] bg-chart-2"
        style={{ top: '50%', right: '30%', filter: 'blur(60px)' }}
        animate={{ scale: [1, 1.4, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />

      {/* Floating emojis */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{ left: `${p.x}%`, top: `${p.y}%`, fontSize: p.size }}
          animate={{
            y: [0, p.yRange, 0],
            x: [0, p.xRange, 0],
            rotate: [0, 20, -15, 0],
            opacity: [0.1, 0.3, 0.12, 0.25, 0.1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        >
          {p.emoji}
        </motion.div>
      ))}

      {/* Animated wave at bottom */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full opacity-[0.04]"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        style={{ height: 120 }}
      >
        <motion.path
          d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z"
          fill="hsl(var(--primary))"
          animate={{ d: [
            "M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z",
            "M0,40 C240,20 480,100 720,40 C960,20 1200,100 1440,40 L1440,120 L0,120 Z",
            "M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z",
          ]}}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  );
}