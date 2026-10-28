import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { useSite } from '@/site/context';
import { matchRoute } from '@/routing/manifest';
import { getPageMeta } from '@/routing/meta';
import { Footer } from './Footer';
import { Header } from './Header';

// useLayoutEffect warns during server rendering; it only matters in the browser.
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const SCROLL_KEY = 'scroll-positions';
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function loadPositions(): Record<string, { y: number; focus?: string }> {
  try {
    return JSON.parse(sessionStorage.getItem(SCROLL_KEY) ?? '{}');
  } catch {
    return {};
  }
}

/**
 * Scroll and focus rules:
 * - first load / refresh: the static page is already visible; restore a saved position on reload.
 * - PUSH without hash: start at the top and move focus to the new page.
 * - PUSH/REPLACE with hash: go to the target (short smooth scroll within the same page).
 * - POP (back/forward): restore the saved position and the link that was activated.
 */
function useScrollManagement() {
  const location = useLocation();
  const navType = useNavigationType();
  const positions = useRef<Record<string, { y: number; focus?: string }>>({});
  const previous = useRef<{ key: string; pathname: string } | null>(null);
  const lastLink = useRef<string | undefined>(undefined);
  const currentKey = useRef<string | undefined>(undefined);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    positions.current = loadPositions();
    // Record the reading position of the current entry. Scroll events cover normal reading;
    // click and popstate run before the router swaps the page, so scrollY is still accurate.
    const record = () => {
      const key = currentKey.current;
      if (key) positions.current[key] = { ...positions.current[key], y: window.scrollY };
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href]');
      lastLink.current = a?.getAttribute('href') ?? undefined;
      record();
    };
    const persist = () => {
      record();
      try {
        sessionStorage.setItem(SCROLL_KEY, JSON.stringify(positions.current));
      } catch {
        // Storage unavailable: positions only last for this page view.
      }
    };
    document.addEventListener('click', onClick, true);
    window.addEventListener('scroll', record, { passive: true });
    window.addEventListener('popstate', record, true);
    window.addEventListener('pagehide', persist);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('scroll', record);
      window.removeEventListener('popstate', record, true);
      window.removeEventListener('pagehide', persist);
    };
  }, []);

  useIsoLayoutEffect(() => {
    const prev = previous.current;
    previous.current = { key: location.key, pathname: location.pathname };
    currentKey.current = location.key;

    if (prev) {
      // The new page is already in the DOM, so window.scrollY may be clamped; keep the position
      // recorded by the scroll listener and only add the link that started the navigation.
      positions.current[prev.key] = { y: positions.current[prev.key]?.y ?? 0, focus: lastLink.current };
    }

    const hashTarget = () => {
      if (!location.hash) return null;
      try {
        return document.getElementById(decodeURIComponent(location.hash.slice(1)));
      } catch {
        return null;
      }
    };

    if (!prev) {
      // First render after hydration. Hash targets are handled by the browser on load.
      const saved = positions.current[location.key];
      if (navType === 'POP' && saved && !location.hash) window.scrollTo(0, saved.y);
      return;
    }

    if (navType === 'POP') {
      const saved = positions.current[location.key];
      const target = hashTarget();
      if (saved) window.scrollTo(0, saved.y);
      else if (target) target.scrollIntoView();
      else window.scrollTo(0, 0);
      if (saved?.focus) {
        const link = document.querySelector<HTMLElement>(`a[href="${CSS.escape(saved.focus)}"]`);
        link?.focus({ preventScroll: true });
      }
      return;
    }

    const target = hashTarget();
    if (target) {
      const samePage = prev.pathname === location.pathname;
      target.scrollIntoView({ behavior: samePage && !prefersReducedMotion() ? 'smooth' : 'auto' });
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      return;
    }
    window.scrollTo(0, 0);
    if (prev.pathname !== location.pathname) {
      document.getElementById('main')?.focus({ preventScroll: true });
    }
  }, [location.key]);
}

/** Keeps title, description, canonical and html lang in sync after client-side navigation. */
function useDocumentMeta() {
  const { bundle, locale } = useSite();
  const { pathname } = useLocation();
  useEffect(() => {
    const meta = getPageMeta(bundle, matchRoute(bundle, pathname), locale);
    document.documentElement.lang = meta.lang;
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && meta.canonical) canonical.setAttribute('href', meta.canonical);
  }, [bundle, locale, pathname]);
}

/**
 * Remounted per pathname. Plays a short entry shift only for forward navigation to a new page;
 * first load and back/forward are POP, and hash moves keep the same frame, so nothing replays.
 */
function RouteFrame({ children }: { children: ReactNode }) {
  const navType = useNavigationType();
  const [animate] = useState(navType === 'PUSH');
  return <div className={animate ? 'route-enter' : undefined}>{children}</div>;
}

export function Layout({ children }: { children: ReactNode }) {
  const { t } = useSite();
  const { pathname } = useLocation();
  useScrollManagement();
  useDocumentMeta();

  return (
    <>
      <a href="#main" className="skip-link">
        {t.ui.skipToContent}
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <RouteFrame key={pathname}>{children}</RouteFrame>
      </main>
      <Footer />
    </>
  );
}
