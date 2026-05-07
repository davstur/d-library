import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DText } from "./DText";

interface MarkdownProps {
  children: string;
}

/**
 * DMarkdown — sanitized markdown renderer with GFM support.
 *
 * Layout (paragraph spacing, list indentation, table layout) lives in
 * `themes/prose.css`. Theme-specific component styling (Studio's blockquote
 * and table treatment) lives in `themes/studio.css`. DMarkdown itself adds
 * the `dmarkdown-prose` class on its wrapper so those rules can target it.
 *
 * Typography of rendered text goes through DText with the appropriate role.
 */
export function DMarkdown({ children }: MarkdownProps) {
  return (
    <div className="dmarkdown-prose">
      <ReactMarkdown
        skipHtml={true}
        unwrapDisallowed={true}
        remarkPlugins={[remarkGfm]}
        allowedElements={[
          "p",
          "ul",
          "ol",
          "li",
          "strong",
          "em",
          "del",
          "code",
          "pre",
          "h1",
          "h2",
          "h3",
          "blockquote",
          "table",
          "thead",
          "tbody",
          "tr",
          "th",
          "td",
          "a",
        ]}
        components={{
          // Paragraph + heading typography goes through DText roles.
          // Margin/spacing comes from `themes/prose.css` via the
          // `dmarkdown-prose` wrapper.
          p: ({ children }) => <DText as="body">{children}</DText>,
          h1: ({ children }) => <DText as="h1">{children}</DText>,
          h2: ({ children }) => <DText as="h2">{children}</DText>,
          h3: ({ children }) => <DText as="h3">{children}</DText>,
          // Lists keep semantic elements; spacing in prose.css.
          ul: ({ children }) => <ul>{children}</ul>,
          ol: ({ children }) => <ol>{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
          // Inline emphasis — preserve semantic HTML; styling via classes is
          // structural (line-through, italic, bold) not typographic role.
          strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          del: ({ children }) => <del className="line-through">{children}</del>,
          // Code/pre keep their utility classes — they're UI affordances
          // (background tint, border-radius), not typographic roles.
          code: ({ children }) => (
            <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-muted p-2 rounded overflow-x-auto font-mono text-sm">
              {children}
            </pre>
          ),
          // Blockquote: no inline styling — themes apply via CSS rules
          // scoped to `[data-theme="..."] .dmarkdown-prose blockquote`.
          // Default theme inherits browser/Tailwind preflight rendering.
          blockquote: ({ children }) => <blockquote>{children}</blockquote>,
          // GFM tables. Default-theme styling preserves the original
          // hardcoded look (subtle borders, no zebra). Studio theme adds
          // zebra + sage-header via `themes/studio.css`.
          table: ({ children }) => (
            <div className="dmarkdown-table overflow-x-auto">
              <table className="w-full border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b">{children}</thead>
          ),
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => (
            <tr className="border-b last:border-b-0">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-2 py-1 text-left font-semibold align-top">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-2 py-1 align-top">{children}</td>
          ),
          // GFM autolinks. `target=_blank` + `rel=noopener` because content
          // can come from authored YAML / LLM and we don't trust it to be
          // intra-app.
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              {children}
            </a>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
