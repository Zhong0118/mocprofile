import { useEffect, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useSite } from '@/site/context';

type CopyState = 'idle' | 'copied' | 'failed';

/** BibTeX in a native disclosure. The text is always selectable; copying is a JS enhancement. */
export function BibtexBlock({ bibtex, defaultOpen = false }: { bibtex: string; defaultOpen?: boolean }) {
  const { t } = useSite();
  const ui = t.ui.publication;
  const [state, setState] = useState<CopyState>('idle');
  const preRef = useRef<HTMLPreElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    window.clearTimeout(timer.current);
    setState('idle');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(bibtex);
      setState('copied');
      timer.current = window.setTimeout(() => setState('idle'), 2000);
    } catch {
      setState('failed');
      const pre = preRef.current;
      const selection = window.getSelection();
      if (pre && selection) {
        const range = document.createRange();
        range.selectNodeContents(pre);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  return (
    <details className="disclosure t-meta" open={defaultOpen || undefined}>
      <summary>
        <ChevronRight className="chevron" size={16} strokeWidth={1.75} aria-hidden="true" />
        {t.ui.resources.bibtex}
      </summary>
      <pre ref={preRef} className="code-block mt-1" lang="en">
        {bibtex}
      </pre>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
        <button type="button" className="btn-quiet js-only inline-flex" onClick={copy}>
          {ui.copyBibtex}
        </button>
        <span aria-live="polite" className="text-muted">
          {state === 'copied' ? ui.copied : state === 'failed' ? ui.copyFailed : ''}
        </span>
      </div>
    </details>
  );
}
