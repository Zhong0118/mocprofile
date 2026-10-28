import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { m } from 'motion/react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { isModuleEnabled } from '@/content/selectors';
import type { ModuleId } from '@/content/types';
import { useSite } from '@/site/context';
import {
  aboutPath,
  cvPath,
  homePath,
  projectsPath,
  publicationsPath,
  repositoriesPath,
  stripLocale,
  switchLocalePath,
} from '@/routing/paths';
import { indicatorTransition } from '@/motion';
import { ThemeToggle } from './ThemeToggle';

/** Id of the section the reader is in, from elements marked data-section. Used by the language switch. */
function useActiveSection(pathname: string): string | undefined {
  const [active, setActive] = useState<string | undefined>(undefined);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) + 24;
      const sections = [...document.querySelectorAll<HTMLElement>('main [data-section]')];
      let current: string | undefined;
      for (const el of sections) if (el.getBoundingClientRect().top - offset <= 0) current = el.id;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom && sections.length && window.scrollY > 0) current = sections[sections.length - 1].id;
      setActive(current);
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
  }, [pathname]);
  return active;
}

interface NavItem {
  key: ModuleId;
  label: string;
  to: string;
  /** Path prefix (without locale) that marks this item as current. */
  match: string;
}

export function Header() {
  const { bundle, locale, t } = useSite();
  const ui = t.ui;
  const { pathname, search, hash } = useLocation();
  const rest = stripLocale(pathname);
  const active = useActiveSection(pathname);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const other = locale === 'zh' ? 'en' : 'zh';
  // Same entity, same filters, same place on the page.
  const anchor = active ? `#${active}` : hash;
  const languageHref = switchLocalePath(pathname, other, search, anchor);

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

  const items = (
    [
      { key: 'about', label: ui.nav.about, to: aboutPath(locale), match: '/about/' },
      { key: 'projects', label: ui.nav.projects, to: projectsPath(locale), match: '/projects/' },
      { key: 'publications', label: ui.nav.publications, to: publicationsPath(locale), match: '/publications/' },
      { key: 'repositories', label: ui.nav.repositories, to: repositoriesPath(locale), match: '/repositories/' },
      { key: 'cv', label: ui.nav.cv, to: cvPath(locale), match: '/cv/' },
    ] satisfies NavItem[]
  ).filter((i) => isModuleEnabled(bundle, i.key));
  const currentKey = items.find((i) => rest.startsWith(i.match) || (i.key === 'publications' && rest.startsWith('/papers/')))?.key;

  const renderItems = (mobile: boolean) =>
    items.map((item) => {
      const current = item.key === currentKey;
      return (
        <li key={item.key}>
          <Link
            to={item.to}
            className="nav-item"
            aria-current={current ? (rest === item.match ? 'page' : 'true') : undefined}
            onClick={mobile ? () => setOpen(false) : undefined}
          >
            {current && (
              <m.span
                layoutId={mobile ? 'nav-indicator-mobile' : 'nav-indicator'}
                className="nav-indicator"
                transition={indicatorTransition}
              />
            )}
            <span className="nav-label">{item.label}</span>
          </Link>
        </li>
      );
    });

  const blog = bundle.person.links.blog;

  return (
    <header ref={headerRef} className="site-header">
      <div className="page-wrap header-bar flex items-center justify-between gap-3">
        <Link to={homePath(locale)} className="brand">
          {bundle.person.displayName}
        </Link>
        <div className="flex items-center gap-1 lg:gap-4">
          <nav aria-label={ui.nav.label} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {renderItems(false)}
              {blog && (
                <li>
                  <a href={blog} className="nav-item">
                    <span className="nav-label">
                      {ui.nav.blog}
                      <ArrowUpRight size={15} strokeWidth={1.85} aria-hidden="true" />
                      <span className="sr-only">{ui.nav.external}</span>
                    </span>
                  </a>
                </li>
              )}
            </ul>
          </nav>
          <div className="flex items-center" role="group" aria-label={ui.nav.tools}>
            <Link
              to={languageHref}
              className="icon-button lang-link"
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
                {open ? (
                  <X size={20} strokeWidth={1.85} aria-hidden="true" />
                ) : (
                  <Menu size={20} strokeWidth={1.85} aria-hidden="true" />
                )}
              </button>
            </span>
          </div>
        </div>
      </div>
      <div id="mobile-nav" className="menu-panel" data-open={open}>
        <div>
          <nav aria-label={ui.nav.label}>
            <ul className="page-wrap grid gap-1 pb-4 pt-1">
              {renderItems(true)}
              {blog && (
                <li>
                  <a href={blog} className="nav-item" onClick={() => setOpen(false)}>
                    <span className="nav-label">
                      {ui.nav.blog}
                      <ArrowUpRight size={16} strokeWidth={1.85} aria-hidden="true" />
                      <span className="sr-only">{ui.nav.external}</span>
                    </span>
                  </a>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
