"use client";

export default function SafeHtml({ html }: { html: string }) {
  return <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
}
