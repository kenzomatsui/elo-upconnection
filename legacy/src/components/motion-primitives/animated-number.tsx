'use client';
import { cn } from '@/lib/utils';
import { motion, useSpring, useTransform } from 'motion/react';
import type { SpringOptions } from 'motion/react';
import { useEffect } from 'react';

export type AnimatedNumberProps = {
  value: number;
  className?: string;
  springOptions?: SpringOptions;
  as?: React.ElementType;
  decimals?: number;
  locale?: string;
};

export function AnimatedNumber({
  value,
  className,
  springOptions,
  as = 'span',
  decimals = 0,
  locale = 'pt-BR',
}: AnimatedNumberProps) {
  const MotionComponent = motion.create(as as keyof JSX.IntrinsicElements);

  const spring = useSpring(value, springOptions);
  const display = useTransform(spring, (current) =>
    current.toLocaleString(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    <MotionComponent className={cn('tabular-nums', className)}>
      {display}
    </MotionComponent>
  );
}
