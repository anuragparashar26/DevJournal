"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github.css";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className }) => {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
        components={{
          h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-xl font-semibold mt-4 mb-2" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-lg font-semibold mt-4 mb-2" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-6 my-2" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-6 my-2" {...props} />,
          li: ({node, ...props}) => <li className="mb-1" {...props} />,
          blockquote: ({node, ...props}) => (
            <blockquote className="border-l-4 border-gray-400 dark:border-gray-600 pl-4 italic text-gray-700 dark:text-gray-300 my-4" {...props} />
          ),
          code(props: any) {
            const {inline, className: codeClassName, children, ...rest} = props;
            return !inline ? (
              <pre className="bg-gray-100 dark:bg-gray-800 rounded p-3 overflow-x-auto my-4">
                <code className={codeClassName} {...rest}>{children}</code>
              </pre>
            ) : (
              <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-sm" {...rest}>{children}</code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;