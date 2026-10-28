import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { navVisibility } from '@/content/selectors';
import { useSite } from '@/site/context';
import { cvPath, homePath, stripLocale, switchLocalePath } from '@/routing/paths';
import { ThemeToggle } from './ThemeToggle';

const SECTION_IDS = ['about', 'publications', 'projects', 'experience'] as const;

/** Tracks which homepage section the reader is in (for the active nav item and language switch). */
function useActiveSection(enabled: boolean): string | undefined {
  const [active, setActive] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (!enabled) {
      setActive(undefined);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) + 24;
      let current: string | undefined;
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - offset <= 0) current = id;
      }
      // At the very bottom a short last section can never reach the top; treat it as current.
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) {
        const last = [...SECTION_IDS].reverse().find((id) => document.getElementById(id));
        if (last) current = last;
      }
      setActive(current ?? 'about');
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [enabled]);
  return active;
}

export function Header() {
  const { bundle, locale, t } = useSite();
  const ui = t.ui;
  const { pathname } = useLocation();
  const isHome = stripLocale(pathname) === '/';
  const isCv = stripLocale(pathname).startsWith('/cv');
  const visible = navVisibility(bundle);
  const active = useActiveSection(isHome);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const home = homePath(locale);
  const other = locale === 'zh' ? 'en' : 'zh';
  const sectionHash = isHome && active && active !== 'about' ? `#${active}` : '';
  const languageHref = switchLocalePath(pathname, other) + sectionHash;

  // Close on route change, Escape and outside clicks. Not a modal: no focus trap.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  const items = [
    { key: 'about', label: ui.nav.about, to: `${home}#about`, current: isHome && active === 'about' },
    visible.publications && {
      key: 'publications',
      label: ui.nav.publications,
      to: `${home}#publications`,
      current: isHome && active === 'publications',
    },
    visible.projects && {
      key: 'projects',
      label: ui.nav.projects,
      to: `${home}#projects`,
      current: isHome && active === 'projects',
    },
    visible.cv && { key: 'cv', label: ui.nav.cv, to: cvPath(locale), current: isCv, page: true },
  ].filter(Boolean) as { key: string; label: string; to: string; current: boolean; page?: boolean }[];

  const renderItems = (onSelect?: () => void, mobile = false) => (
    <>
      {items.map((item) => (
        <li key={item.key}>
          <Link
            to={item.to}
            className={mobile ? 'nav-link block py-2.5' : 'nav-link'}
            aria-current={item.current ? (item.page ? 'page' : 'true') : undefined}
            onClick={onSelect}
          >
            {item.label}
          </Link>
        </li>
      ))}
      {visible.blog && (
        <li>
          <a href={bundle.person.links.blog} className={mobile ? 'nav-link block py-2.5' : 'nav-link'} onClick={onSelect}>
            {ui.nav.blog}
          </a>
        </li>
      )}
    </>
  );

  return (
    <header ref={headerRef} className="site-header">
      <div className="shell header-bar flex items-center justify-between gap-3">
        <Link to={home} className="text-[17px] font-semibold leading-none text-fg">
          {bundle.person.displayName}
        </Link>
        <div className="flex items-center gap-2 lg:gap-6">
          <nav aria-label={ui.nav.label} className="hidden lg:block">
            <ul className="flex items-center gap-6">{renderItems()}</ul>
          </nav>
          <div className="flex items-center">
            <Link
              to={languageHref}
              className="nav-link inline-flex h-11 min-w-11 items-center justify-center px-2 text-[15px]"
              hrefLang={other === 'zh' ? 'zh-CN' : 'en'}
              lang={other === 'zh' ? 'zh-CN' : 'en'}
              aria-label={ui.languageSwitch.label}
            >
              {ui.languageSwitch.target}
            </Link>
            <ThemeToggle />
            <span className="flex lg:hidden">
            <button
              ref={buttonRef}
              type="button"
              className="icon-button js-only inline-flex"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? ui.nav.menuClose : ui.nav.menuOpen}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="press">
                {open ? (
                  <X size={20} strokeWidth={1.75} aria-hidden="true" />
                ) : (
                  <Menu size={20} strokeWidth={1.75} aria-hidden="true" />
                )}
              </span>
            </button>
            </span>
          </div>
        </div>
      </div>
      <div id="mobile-nav" className="menu-panel" data-open={open}>
        <div>
          <nav aria-label={ui.nav.label}>
            <ul className="shell pb-3 pt-1">{renderItems(() => setOpen(false), true)}</ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
