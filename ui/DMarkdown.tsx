import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownProps {
  children: string;
}

export function DMarkdown({ children }: MarkdownProps) {
  return (
    <div>
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
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc pl-4 mb-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-4 mb-2">{children}</ol>
          ),
          li: ({ children }) => <li className="mb-1">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          del: ({ children }) => <del className="line-through">{children}</del>,
          code: ({ children }) => (
            <code className="bg-muted px-1 py-0.5 rounded text-sm">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-muted p-2 rounded mb-2 overflow-x-auto">
              {children}
            </pre>
          ),
          // GFM tables. Wrapped in an overflow-x-auto so wide tables don't
          // push the page layout when there are too many columns. The border
          // styling is intentionally subtle — DText/DCard set the visual
          // hierarchy elsewhere on the page.
          table: ({ children }) => (
            <div className="overflow-x-auto mb-2">
              <table className="w-full border-collapse text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b">{children}</thead>
          ),
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => <tr className="border-b last:border-b-0">{children}</tr>,
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
