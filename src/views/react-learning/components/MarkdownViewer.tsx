import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownViewerProps {
  content: string
}

const markdownComponents: Components = {
  h1: ({ children }) => <h2 className="mt-0 text-2xl font-bold text-slate-900">{children}</h2>,
  h2: ({ children }) => <h3 className="mb-3 mt-8 border-l-4 border-teal-600 pl-3 text-xl font-bold text-slate-900 first:mt-0">{children}</h3>,
  h3: ({ children }) => <h4 className="mb-2 mt-6 text-lg font-bold text-slate-800">{children}</h4>,
  p: ({ children }) => <p className="my-3 max-w-[75ch] break-words leading-7 text-slate-700">{children}</p>,
  ul: ({ children }) => <ul className="my-3 list-disc space-y-2 pl-6 leading-7 text-slate-700">{children}</ul>,
  ol: ({ children }) => <ol className="my-3 list-decimal space-y-2 pl-6 leading-7 text-slate-700">{children}</ol>,
  blockquote: ({ children }) => <blockquote className="my-4 border-l-4 border-amber-500 bg-amber-50 px-4 py-2 text-slate-700">{children}</blockquote>,
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full min-w-[620px] border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 font-bold text-slate-800">{children}</th>,
  td: ({ children }) => <td className="border-b border-slate-100 px-4 py-3 align-top leading-6 text-slate-700">{children}</td>,
  a: ({ children, href }) => <a className="font-semibold text-teal-700 underline decoration-teal-300 underline-offset-4 hover:text-teal-900" href={href} target="_blank" rel="noreferrer">{children}</a>,
  code: ({ children, className }) => className
    ? <code className={`${className} block overflow-x-auto rounded-xl bg-[#102a2d] p-4 text-[13px] leading-6 text-[#d7f7ef]`}>{children}</code>
    : <code className="break-all rounded bg-teal-50 px-1.5 py-0.5 font-mono text-[0.9em] text-teal-800">{children}</code>,
}

/**
 * 安全渲染 React 知识点页面的 Markdown 教程。
 *
 * 默认不启用原始 HTML，避免教程内容注入可执行标签；GFM 插件只补充表格、
 * 删除线和任务列表等常用 Markdown 语法。
 *
 * @param props Markdown 原文。
 * @returns 格式化后的教程内容。
 */
export function MarkdownViewer({ content }: MarkdownViewerProps) {
  return (
    <article className="react-learning-markdown min-w-0 max-w-full overflow-x-hidden text-base">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{content}</ReactMarkdown>
    </article>
  )
}
