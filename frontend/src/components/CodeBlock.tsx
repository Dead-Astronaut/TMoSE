interface CodeBlockProps {
  code: string
}

export function CodeBlock({ code }: CodeBlockProps) {
  return (
    <div className="relative mt-3 mb-1 rounded-gemini overflow-hidden border border-border bg-panel">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border-subtle">
        <div className="w-2 h-2 rounded-full bg-incorrect/70" />
        <div className="w-2 h-2 rounded-full bg-amber/70" />
        <div className="w-2 h-2 rounded-full bg-correct/70" />
        <span className="ml-2 text-xs text-muted font-mono">python</span>
      </div>
      <pre className="p-4 text-[13px] leading-relaxed overflow-x-auto text-gemini-text-secondary bg-panel font-mono">
        <code>{code}</code>
      </pre>
    </div>
  )
}
