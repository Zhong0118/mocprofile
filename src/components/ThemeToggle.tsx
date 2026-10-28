import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useSite } from '@/site/context';

const STORAGE_KEY = 'theme';

function readStored(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function applyTheme(dark: boolean) {
  const root = document.documentElement;
  root.classList.toggle('dark', dark);
  root.classList.toggle('light', !dark);
}

/**
 * The first theme is set by the inline head script before paint. This control keeps a stable
 * label and DOM; icons switch through CSS so server and client markup match.
 */
export function ThemeToggle() {
  const { t } = useSite();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => {
      const stored = readStored();
      if (stored === 'light' || stored === 'dark') return;
      applyTheme(e.matches);
      setDark(e.matches);
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const toggle = () => {
    const next = !document.documentElement.classList.contains('dark');
    applyTheme(next);
    setDark(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
    } catch {
      // Storage unavailable: the choice applies to this page view only.
    }
  };

  return (
    <button type="button" className="icon-button js-only inline-flex" aria-pressed={dark} aria-label={t.ui.theme.label} onClick={toggle}>
      <span className="press">
        <Moon className="theme-icon-light" size={19} strokeWidth={1.75} aria-hidden="true" />
        <Sun className="theme-icon-dark" size={19} strokeWidth={1.75} aria-hidden="true" />
      </span>
    </button>
  );
}
