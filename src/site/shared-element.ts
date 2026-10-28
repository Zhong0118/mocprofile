// Card ↔ detail continuity. A click on a project card records the card's box; after the next
// route change has settled its scroll position, Layout calls playSharedTransition(), which animates
// the matching element ([data-shared-id]) from that box to its own (FLIP with the Web Animations API).
// Leaving a case study records its header's box, so the card settles back into its place.

interface Pending {
  id: string;
  rect: DOMRect;
  at: number;
}

let pending: Pending | null = null;
const MAX_AGE = 1200;
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export function captureShared(id: string, el: Element | null) {
  if (!el?.isConnected) return;
  pending = { id, rect: el.getBoundingClientRect(), at: performance.now() };
}

export function playSharedTransition(reduceMotion: boolean) {
  const p = pending;
  pending = null;
  if (!p || performance.now() - p.at > MAX_AGE) return;
  const target = document.querySelector<HTMLElement>(`[data-shared-id="${CSS.escape(p.id)}"]:not([data-shared-skip])`);
  if (!target || typeof target.animate !== 'function') return;
  const to = target.getBoundingClientRect();
  if (to.width === 0 || to.bottom < 0 || to.top > window.innerHeight) return;
  if (reduceMotion) {
    target.animate([{ opacity: 0.6 }, { opacity: 1 }], { duration: 100, easing: 'linear' });
    return;
  }
  const scale = p.rect.width / to.width;
  const dx = p.rect.left - to.left;
  const dy = p.rect.top - to.top;
  // Skip tiny or absurd moves; they read as jitter rather than continuity.
  if (Math.abs(dx) + Math.abs(dy) < 8 || scale < 0.3 || scale > 3) return;
  target.animate(
    [
      { transformOrigin: 'top left', transform: `translate(${dx}px, ${dy}px) scale(${scale})`, opacity: 0.85 },
      { transformOrigin: 'top left', transform: 'none', opacity: 1 },
    ],
    { duration: 380, easing: EASE },
  );
}
