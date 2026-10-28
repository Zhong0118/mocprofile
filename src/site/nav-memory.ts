// Remembers which page each history entry was opened from, so a "back to list" link can step
// back in history (restoring filters, scroll position and focus) instead of pushing a fresh page.
const cameFrom = new Map<string, string>();

export function rememberOrigin(key: string, from: string) {
  cameFrom.set(key, from);
}

export function originOf(key: string): string | undefined {
  return cameFrom.get(key);
}

/** Last URL (path + query) of a list page, used as the back link target after a reload. */
export function rememberListUrl(list: 'projects' | 'repositories' | 'publications', url: string) {
  try {
    sessionStorage.setItem(`list:${list}`, url);
  } catch {
    // Storage unavailable: the back link falls back to the unfiltered list.
  }
}

export function lastListUrl(list: 'projects' | 'repositories' | 'publications'): string | undefined {
  try {
    return sessionStorage.getItem(`list:${list}`) ?? undefined;
  } catch {
    return undefined;
  }
}
