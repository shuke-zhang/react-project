import {
  SandpackCodeEditor,
  SandpackConsole,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  useSandpack,
} from '@codesandbox/sandpack-react'
import { LockOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import '@/views/react-learning/components/onlinePlayground.css'

interface OnlinePlaygroundProps {
  source: string
  cssSource: string
  dependencies?: Record<string, string>
}

const APP_SOURCE = `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Demo } from './CaseDemo'
import './caseDemo.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main style={{ padding: 20 }}>
      <Demo />
    </main>
  </StrictMode>,
)
`

interface SandpackRuntimeCompatibility {
  supported: boolean
  localhostUrl?: string
}

/**
 * 检查当前浏览器是否具备 Sandpack 生成稳定沙箱标识所需的 Web Crypto 能力。
 *
 * `crypto.subtle` 只会在 HTTPS、localhost 等安全上下文中提供。局域网 HTTP 地址
 * 缺少该能力时，Sandpack 2.20 会在初始化阶段读取 `digest` 并抛出异常。
 *
 * @returns 是否可以启动 Sandpack，以及可用时指向同一页面的 localhost 地址。
 */
function getSandpackRuntimeCompatibility(): SandpackRuntimeCompatibility {
  const supported = globalThis.isSecureContext === true
    && typeof globalThis.crypto?.subtle?.digest === 'function'

  if (supported)
    return { supported: true }

  if (typeof window === 'undefined' || !/^\d{1,3}(?:\.\d{1,3}){3}$/.test(window.location.hostname))
    return { supported: false }

  const localhostUrl = new URL(window.location.href)
  localhostUrl.hostname = 'localhost'

  return { supported: false, localhostUrl: localhostUrl.toString() }
}

/**
 * 在不安全 HTTP 上下文中提供明确降级界面，避免第三方沙箱异常导致右侧空白。
 *
 * @param props 需要保留展示的 TSX 源码与可选 localhost 地址。
 * @returns 只读源码和安全地址说明。
 */
function SandpackCompatibilityNotice({ source, localhostUrl }: { source: string, localhostUrl?: string }) {
  return (
    <div className="grid min-w-0 max-w-full overflow-hidden rounded-xl border border-amber-300 bg-white lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]" data-testid="sandpack-compatibility-notice">
      <div className="min-w-0 border-b border-amber-200 bg-slate-950 lg:border-b-0 lg:border-r">
        <div className="border-b border-slate-700 px-4 py-3 text-sm font-semibold text-slate-200">只读 TSX 源码</div>
        <pre className="m-0 max-h-[520px] overflow-auto p-4 text-[13px] leading-6 text-slate-100"><code>{source}</code></pre>
      </div>
      <aside className="flex min-w-0 flex-col justify-center p-6 text-slate-700" role="alert">
        <span aria-hidden="true" className="mb-4 grid size-11 place-items-center rounded-xl bg-amber-100 text-xl text-amber-800"><LockOutlined /></span>
        <h4 className="m-0 text-lg font-bold text-slate-950">在线预览需要安全地址</h4>
        <p className="mb-0 mt-3 break-words leading-7">
          当前地址没有提供 <code className="break-all rounded bg-amber-100 px-1.5 py-0.5">crypto.subtle</code>，Sandpack 无法生成运行标识。
        </p>
        <p className="mb-0 mt-3 leading-7">页面现在会保留源码和修复方式，不会再显示空白预览。请使用 localhost 或为局域网部署配置 HTTPS。</p>
        {localhostUrl && (
          <Button className="mt-5 self-start" href={localhostUrl} type="primary">使用 localhost 重新打开</Button>
        )}
      </aside>
    </div>
  )
}

/**
 * 恢复 Sandpack 内的全部默认文件。
 *
 * @returns 恢复默认代码按钮。
 */
function ResetPlaygroundButton() {
  const { sandpack } = useSandpack()

  return (
    <Button icon={<ReloadOutlined aria-hidden="true" />} onClick={() => sandpack.resetAllFiles()}>
      恢复默认代码
    </Button>
  )
}

/**
 * 提供隔离的 TSX 编辑、编译、预览与错误控制台。
 *
 * 案例在 Sandpack iframe 中执行，不使用 `eval`，也不访问当前项目的登录会话、
 * API 封装或运行时状态。默认文件来自页面实际渲染的同一个 TSX 源文件。
 *
 * @param props 案例 TSX 与配套 CSS 原文。
 * @returns 在线练习区。
 */
export function OnlinePlayground({ source, cssSource, dependencies = {} }: OnlinePlaygroundProps) {
  const sandboxSource = source.replace(/export function Case\w+Demo/, 'export function Demo')
  const compatibility = getSandpackRuntimeCompatibility()

  if (!compatibility.supported)
    return <SandpackCompatibilityNotice source={sandboxSource} localhostUrl={compatibility.localhostUrl} />

  return (
    <div className="react-learning-playground min-w-0 max-w-full overflow-x-hidden" data-testid="online-playground">
      <SandpackProvider
      template="react-ts"
      theme="dark"
      files={{
        '/App.tsx': { code: APP_SOURCE, hidden: true },
        '/CaseDemo.tsx': { code: sandboxSource, active: true },
        '/caseDemo.css': { code: cssSource },
      }}
      customSetup={{
        entry: '/App.tsx',
        dependencies: {
          react: '^19.2.0',
          'react-dom': '^19.2.0',
          ...dependencies,
        },
      }}
      options={{ activeFile: '/CaseDemo.tsx', visibleFiles: ['/CaseDemo.tsx', '/caseDemo.css'] }}
      >
        <div className="mb-3 flex min-w-0 flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100">
          <div className="min-w-0 break-words">
            <strong className="block text-sm">浏览器隔离沙箱</strong>
            <span className="text-xs text-slate-400">修改 TSX 后自动编译；错误会显示在下方控制台。</span>
          </div>
          <ResetPlaygroundButton />
        </div>
        <SandpackLayout>
          <SandpackCodeEditor showTabs showLineNumbers wrapContent closableTabs={false} style={{ minHeight: 520 }} />
          <SandpackPreview showNavigator showRefreshButton showOpenInCodeSandbox={false} style={{ minHeight: 520 }} />
        </SandpackLayout>
        <div className="mt-3 min-w-0 max-w-full overflow-hidden rounded-xl border border-slate-700">
          <SandpackConsole standalone showHeader />
        </div>
      </SandpackProvider>
    </div>
  )
}
