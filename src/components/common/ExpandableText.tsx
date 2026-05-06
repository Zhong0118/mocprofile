import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ExpandableTextProps {
  text: string;
  maxLines?: number;
  expandLabel: string;
  collapseLabel: string;
}

export function ExpandableText({
  text,
  maxLines = 3,
  expandLabel,
  collapseLabel,
}: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <p
        className={`text-sm leading-relaxed text-gray-600 dark:text-gray-400 ${
          !expanded ? `line-clamp-${maxLines}` : ''
        }`}
        style={!expanded ? { WebkitLineClamp: maxLines, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' } : undefined}
      >
        {text}
      </p>
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-sky-600 transition-colors hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
      >
        {expanded ? (
          <>
            {collapseLabel}
            <ChevronUp className="h-3 w-3" />
          </>
        ) : (
          <>
            {expandLabel}
            <ChevronDown className="h-3 w-3" />
          </>
        )}
      </button>
    </div>
  );
}
