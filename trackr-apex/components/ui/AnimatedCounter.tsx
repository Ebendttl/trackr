'use client';
import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

/**
 * Fluid count-up spring animated counter.
 */
export default function AnimatedCounter({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);
  const spring = useSpring(value, { stiffness: 60, damping: 15 });

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    return spring.on('change', (latest) => {
      setDisplayValue(
        Number.isInteger(value) ? Math.round(latest) : parseFloat(latest.toFixed(1))
      );
    });
  }, [spring, value]);

  return <motion.span>{displayValue}</motion.span>;
}
