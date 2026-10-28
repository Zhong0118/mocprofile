import type { ReactNode } from 'react';
import { LazyMotion, MotionConfig } from 'motion/react';

const loadFeatures = () => import('./features').then((r) => r.default);

export const EASE = [0.22, 1, 0.36, 1] as const;
/** Durations (seconds) per interaction type; see docs/content-guide.md#motion. */
export const DUR = { press: 0.12, hover: 0.16, feedback: 0.18, panel: 0.26, layout: 0.32, shared: 0.38, exit: 0.14 } as const;
export const layoutTransition = { duration: DUR.layout, ease: EASE };
export const indicatorTransition = { type: 'spring', bounce: 0.12, duration: DUR.panel } as const;
/** Stagger for entering items: 25ms apart, never more than 180ms in total. */
export const stagger = (i: number) => Math.min(i * 0.025, 0.18);

/**
 * Motion setup. reducedMotion="user" turns transform and layout animation into instant changes
 * (opacity fades remain), following prefers-reduced-motion.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user" transition={{ duration: DUR.feedback, ease: EASE }}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
