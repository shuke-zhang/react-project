export type ReactLearningTopicCategory = 'foundation' | 'hook' | 'api' | 'enterprise'

export interface ReactLearningTopicMetadata {
  id: string
  path: string
  title: string
  category: ReactLearningTopicCategory
}

const TOPIC_DEFINITIONS = [
  ['jsx-tsx', 'JSX 与 TSX', 'foundation'],
  ['function-components-props', '函数组件与 Props', 'foundation'],
  ['children-composition', 'children 与组件组合', 'foundation'],
  ['event-handling', '事件处理', 'foundation'],
  ['conditional-rendering', '条件渲染', 'foundation'],
  ['list-key', '列表渲染与 key', 'foundation'],
  ['controlled-forms', '受控表单', 'foundation'],
  ['component-communication', '组件通信', 'foundation'],
  ['lifting-state', '状态提升', 'foundation'],
  ['immutable-updates', '不可变状态更新', 'foundation'],
  ['state-snapshot-batching', '状态快照与批处理', 'foundation'],
  ['react-typescript-types', 'React TypeScript 类型', 'foundation'],
  ['use-state', 'useState', 'hook'],
  ['use-reducer', 'useReducer', 'hook'],
  ['use-context', 'useContext', 'hook'],
  ['use-ref', 'useRef', 'hook'],
  ['use-imperative-handle', 'useImperativeHandle', 'hook'],
  ['use-effect', 'useEffect', 'hook'],
  ['use-effect-event', 'useEffectEvent', 'hook'],
  ['use-layout-effect', 'useLayoutEffect', 'hook'],
  ['use-insertion-effect', 'useInsertionEffect', 'hook'],
  ['use-memo', 'useMemo', 'hook'],
  ['use-callback', 'useCallback', 'hook'],
  ['use-transition', 'useTransition', 'hook'],
  ['use-deferred-value', 'useDeferredValue', 'hook'],
  ['use-id', 'useId', 'hook'],
  ['use-sync-external-store', 'useSyncExternalStore', 'hook'],
  ['use-debug-value', 'useDebugValue', 'hook'],
  ['use-action-state', 'useActionState', 'hook'],
  ['use-optimistic', 'useOptimistic', 'hook'],
  ['use-form-status', 'useFormStatus', 'hook'],
  ['custom-hooks', '自定义 Hook', 'hook'],
  ['create-context', 'createContext', 'api'],
  ['memo', 'memo', 'api'],
  ['lazy', 'lazy', 'api'],
  ['suspense', 'Suspense', 'api'],
  ['activity', 'Activity', 'api'],
  ['fragment', 'Fragment', 'api'],
  ['strict-mode', 'StrictMode', 'api'],
  ['profiler', 'Profiler', 'api'],
  ['use-api', 'use', 'api'],
  ['start-transition', 'startTransition', 'api'],
  ['create-portal', 'createPortal', 'api'],
  ['flush-sync', 'flushSync', 'api'],
  ['error-boundary', 'Error Boundary', 'api'],
  ['react-router', 'React Router', 'enterprise'],
  ['tanstack-query', 'TanStack Query', 'enterprise'],
  ['axios', 'Axios 请求治理', 'enterprise'],
  ['zod', 'Zod 数据校验', 'enterprise'],
  ['vitest-testing-library', 'Vitest 与 Testing Library', 'enterprise'],
] as const satisfies ReadonlyArray<readonly [string, string, ReactLearningTopicCategory]>

/**
 * React 学习模块的稳定知识点目录。
 *
 * 菜单、路由、面包屑和教程索引都必须从该目录派生，避免多个注册表产生漂移。
 */
export const REACT_LEARNING_TOPICS: ReactLearningTopicMetadata[] = TOPIC_DEFINITIONS.map(
  ([id, title, category]) => ({
    id,
    title,
    category,
    path: `/react-learning/${id}`,
  }),
)

