import type { ReactNode } from "react";

const emphasisPattern = /\*\*([^*]+)\*\*/g;
const emphasisSyntaxPattern = /\*\*([^*]+)\*\*/g;

export function InlineEmphasis({ children }: { children: string }) {
  return <>{renderInlineEmphasis(children)}</>;
}

export function renderInlineEmphasis(value: string): ReactNode {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  emphasisPattern.lastIndex = 0;
  while ((match = emphasisPattern.exec(value))) {
    if (match.index > lastIndex) {
      parts.push(value.slice(lastIndex, match.index));
    }

    parts.push(
      <span className="reader-emphasis" key={`${match.index}-${match[1]}`}>
        {match[1]}
      </span>,
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < value.length) {
    parts.push(value.slice(lastIndex));
  }

  return parts.length > 0 ? parts : value;
}

export function stripInlineEmphasisSyntax(value: string) {
  return value.replace(emphasisSyntaxPattern, "$1");
}
