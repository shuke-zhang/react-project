import * as ts from 'typescript'
import { REACT_LEARNING_TOPICS } from '@/views/react-learning/data/topicCatalog'
import { getReactLearningTopicGuide } from '@/views/react-learning/data/topicGuides'
import { REACT_LEARNING_TUTORIAL_IDS, getReactLearningTopicTutorial } from '@/views/react-learning/data/topicTutorials'

describe('React 知识点内容目录', () => {
  it('为 50 个知识点提供独立、详细且可运行的学习材料', () => {
    const guides = REACT_LEARNING_TOPICS.map(topic => getReactLearningTopicGuide(topic.id))

    expect(REACT_LEARNING_TUTORIAL_IDS).toHaveLength(50)
    expect(new Set(REACT_LEARNING_TUTORIAL_IDS).size).toBe(50)
    expect(new Set(guides.map(guide => guide.summary)).size).toBe(50)

    for (const [index, guide] of guides.entries()) {
      const tutorial = getReactLearningTopicTutorial(REACT_LEARNING_TOPICS[index].id)

      expect(guide.basic.length).toBeGreaterThanOrEqual(3)
      expect(guide.advanced.length).toBeGreaterThanOrEqual(3)
      expect(guide.vue.length).toBeGreaterThanOrEqual(3)
      expect(guide.mistakes.length).toBeGreaterThanOrEqual(3)
      expect(guide.recommendations.length).toBeGreaterThanOrEqual(3)
      expect(guide.tutorial).toContain('## Vue 3 对照')
      expect(guide.tutorial).toContain('## 常见错误')
      expect(guide.tutorial).toContain('## 推荐写法')
      expect(guide.tutorial).toContain('## 完整 TSX 示例')
      expect(guide.tutorial).toContain('## 企业级扩展')
      expect(guide.source).toContain('export function Demo')
      expect(guide.tutorial).toBe(tutorial)
      expect(guide.tutorial).not.toContain('说明会与页面示例同步维护')
    }
  })

  it('Hook、React API 与企业工程源码实际使用对应能力', () => {
    const enterpriseTokens: Record<string, string> = {
      'react-router': 'react-router-dom',
      'tanstack-query': '@tanstack/react-query',
      axios: 'axios',
      zod: 'zod',
      'vitest-testing-library': '测试组件',
    }
    const componentTokens: Record<string, string> = {
      'use-ref': 'useRef<',
      suspense: '<Suspense',
      activity: '<Activity',
      fragment: '<Fragment',
      'strict-mode': '<StrictMode',
      profiler: '<Profiler',
      'error-boundary': 'ErrorBoundary',
    }

    for (const topic of REACT_LEARNING_TOPICS) {
      if (topic.category === 'foundation')
        continue

      const guide = getReactLearningTopicGuide(topic.id)
      const expectedToken = topic.id === 'custom-hooks'
        ? 'useToggle'
        : enterpriseTokens[topic.id]
          ?? componentTokens[topic.id]
          ?? `${topic.title}(`

      expect(guide.source, `${topic.title} 源码应包含 ${expectedToken}`).toContain(expectedToken)
    }
  })

  it('为企业工程沙箱声明源码实际导入的依赖', () => {
    const expectedDependencies: Record<string, string> = {
      'react-router': 'react-router-dom',
      'tanstack-query': '@tanstack/react-query',
      axios: 'axios',
      zod: 'zod',
    }

    for (const [topicId, packageName] of Object.entries(expectedDependencies)) {
      expect(getReactLearningTopicGuide(topicId).dependencies).toHaveProperty(packageName)
    }
  })

  it('基础能力源码实际演示对应语法和组件模式', () => {
    const expectedTokens: Record<string, string> = {
      'jsx-tsx': 'className=',
      'function-components-props': 'interface UserCardProps',
      'children-composition': 'ReactNode',
      'event-handling': 'FormEvent',
      'conditional-rendering': '? <',
      'list-key': '.map(',
      'controlled-forms': 'value={',
      'component-communication': 'onChange:',
      'lifting-state': 'TemperatureInput',
      'immutable-updates': 'previousItems.map',
      'state-snapshot-batching': 'setCount(previous',
      'react-typescript-types': 'MouseEventHandler',
    }

    for (const [topicId, expectedToken] of Object.entries(expectedTokens)) {
      expect(getReactLearningTopicGuide(topicId).source).toContain(expectedToken)
    }
  })

  it('副作用与性能示例不会通过回调更新自身造成重复同步', () => {
    const profilerSource = getReactLearningTopicGuide('profiler').source
    const effectEventSource = getReactLearningTopicGuide('use-effect-event').source

    expect(profilerSource).not.toContain('setTimeout(() => setDuration')
    expect(effectEventSource).toContain('setInterval(onTick')
    expect(effectEventSource).toContain('}, [])')
  })

  it('全部在线示例都能通过 TSX 语法转换', () => {
    for (const topic of REACT_LEARNING_TOPICS) {
      const source = getReactLearningTopicGuide(topic.id).source
      const result = ts.transpileModule(source, {
        compilerOptions: {
          jsx: ts.JsxEmit.ReactJSX,
          module: ts.ModuleKind.ESNext,
          target: ts.ScriptTarget.ES2022,
        },
        fileName: `${topic.id}.tsx`,
        reportDiagnostics: true,
      })
      const syntaxErrors = result.diagnostics?.filter(diagnostic => diagnostic.category === ts.DiagnosticCategory.Error) ?? []

      expect(
        syntaxErrors.map(diagnostic => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')),
        `${topic.title} 的 TSX 示例存在语法错误`,
      ).toEqual([])
    }
  })
})
