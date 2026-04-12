import ReactMarkdown from "react-markdown";

interface MarkdownProps {
  children: string;
}

export function DMarkdown({ children }: MarkdownProps) {
  return (
    <div>
      <ReactMarkdown
        skipHtml={true}
        unwrapDisallowed={true}
        allowedElements={[
          "p",
          "ul",
          "ol",
          "li",
          "strong",
          "em",
          "code",
          "pre",
          "h1",
          "h2",
          "h3",
          "blockquote",
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
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
