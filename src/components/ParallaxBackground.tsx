import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export function ParallaxBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const { clientX, clientY } = e;
      const { width, height } = containerRef.current.getBoundingClientRect();
      
      const moveX = (clientX - width / 2) * 0.01;
      const moveY = (clientY - height / 2) * 0.01;
      
      containerRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <motion.div
        ref={containerRef}
        className="absolute inset-0"
        style={{ y: springY }}
      >
        <div className="cyber-grid" />
        <div className="absolute inset-0 bg-gradient-to-b from-cyber-900/50 to-cyber-800/50" />
      </motion.div>
    </div>
  );
}