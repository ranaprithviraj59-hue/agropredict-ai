import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LEAF_EMOJIS = ['🌿', '🍃', '🌾', '🌱', '☘️', '🍂'];

export default function FloatingParticles() {
  const [particles] = useState(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      emoji: LEAF_EMOJIS[i % LEAF_EMOJIS.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 14 + Math.random() * 18,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 5,
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: p.size,
          }}
          animate={{
            y: [0, -30, 0, 20, 0],
            x: [0, 15, -10, 5, 0],
            rotate: [0, 15, -10, 5, 0],
            opacity: [0.15, 0.35, 0.2, 0.3, 0.15],
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
    </div>
  );
}