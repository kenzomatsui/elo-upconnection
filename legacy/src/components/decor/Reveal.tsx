import type { ReactNode } from 'react';
import { InView } from '@/components/motion-primitives/in-view';

export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <InView
      as="div"
      once
      viewOptions={{ margin: '0px 0px -120px 0px', amount: 0.15 }}
      variants={{
        hidden: { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className={className}>{children}</div>
    </InView>
  );
}
