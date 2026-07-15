import { REACT_LEARNING_TOPICS } from '@/views/react-learning/data/topicCatalog'
import { getReactLearningTopicTutorial } from '@/views/react-learning/data/topicTutorials'

export interface ReactLearningTopicGuide {
  summary: string
  basic: string[]
  advanced: string[]
  vue: string[]
  mistakes: string[]
  recommendations: string[]
  source: string
  tutorial: string
  dependencies: Record<string, string>
}

interface TopicKnowledge {
  purpose: string
  signature: string
  scenario: string
  vue: string
  advanced: string
  pitfall: string
}

const TOPIC_KNOWLEDGE: Record<string, TopicKnowledge> = {
  'jsx-tsx': { purpose: '使用 JavaScript 表达式声明界面结构，并由 TypeScript 检查元素与属性。', signature: 'const view = <Button disabled={loading}>保存</Button>', scenario: '根据业务数据组合标签、属性、文本和子组件。', vue: 'Vue SFC template 与 JSX 都描述 UI；JSX 直接使用 JavaScript 表达式而不是模板指令。', advanced: '把复杂表达式提取为变量或组件，并让 JSX 保持接近业务结构。', pitfall: '把 JSX 当成 HTML 字符串，或在 JSX 中堆积多层三元表达式。' },
  'function-components-props': { purpose: '使用纯函数和类型化 Props 建立可复用组件契约。', signature: 'function UserCard({ user, onSelect }: UserCardProps)', scenario: '父组件向展示组件传入数据和业务回调。', vue: '对应 Vue 的 defineProps；React Props 是函数参数且只读。', advanced: '使用判别联合表达互斥 Props，让非法组合在编译期失败。', pitfall: '在子组件中修改 Props，或使用 any 逃避组件契约。' },
  'children-composition': { purpose: '通过 children 和具名组件 Props 组合可替换的界面区域。', signature: 'function Panel({ children }: { children: ReactNode })', scenario: '构建卡片、弹窗、权限壳和布局组件。', vue: '对应 Vue 默认 slot；具名 slot 通常映射为 ReactNode Props。', advanced: '优先组合而非大量布尔配置，并区分 ReactNode、ReactElement 与 JSX.Element。', pitfall: '使用 cloneElement 隐式修改未知子节点，导致契约难以追踪。' },
  'event-handling': { purpose: '通过函数处理用户事件，并把业务意图转换为状态更新。', signature: 'function handleSubmit(event: FormEvent<HTMLFormElement>)', scenario: '处理点击、输入、提交、键盘和焦点事件。', vue: '对应 Vue 的 @click、@submit 和 emit；React 直接传递函数 Props。', advanced: '事件处理器只表达用户意图，复杂规则下沉到 Reducer 或领域函数。', pitfall: '在 JSX 中直接调用处理器，或把复杂异步逻辑全部写进匿名函数。' },
  'conditional-rendering': { purpose: '根据状态选择渲染、隐藏或替换 React 节点。', signature: 'return loading ? <Skeleton /> : <Content />', scenario: '展示加载、空数据、错误、权限和功能开关状态。', vue: '对应 v-if / v-else；React 使用 if、三元表达式和逻辑与。', advanced: '为复杂状态使用判别联合，确保每个状态都有明确 UI 分支。', pitfall: '使用 count && <Badge /> 时意外渲染数字 0。' },
  'list-key': { purpose: '使用 map 渲染集合，并用稳定 key 维护节点身份。', signature: 'items.map(item => <Row key={item.id} item={item} />)', scenario: '渲染可排序、可增删和可筛选的业务列表。', vue: '对应 v-for 与 :key；两者都需要稳定业务标识。', advanced: '把列表项拆成组件，并结合 memo、虚拟列表和分页控制大数据量。', pitfall: '动态列表优先使用数组索引作为 key，导致局部状态错位。' },
  'controlled-forms': { purpose: '让 React state 成为输入值的唯一可信来源。', signature: '<input value={name} onChange={e => setName(e.target.value)} />', scenario: '实现校验、联动、提交和恢复默认值的表单。', vue: '对应 v-model；React 显式组合 value 与 onChange。', advanced: '复杂表单按字段边界拆分，并区分本地草稿与服务器提交状态。', pitfall: '输入在受控和非受控模式间切换，或只有 placeholder 没有 label。' },
  'component-communication': { purpose: '使用 Props、回调、Context 和组合建立明确的数据流。', signature: '<Child value={value} onChange={handleChange} />', scenario: '父子、兄弟、跨层级组件之间传递数据和业务事件。', vue: 'Props/emit/slot/provide 对应 Props/回调/children/Context。', advanced: '优先局部单向数据流，只有真正跨层的稳定依赖才使用 Context。', pitfall: '用全局 Context 传递高频变化数据，导致边界模糊和广泛重渲染。' },
  'lifting-state': { purpose: '把共享状态移动到最近公共父组件以保持单一数据源。', signature: 'const [selectedId, setSelectedId] = useState<string | null>(null)', scenario: '同步两个筛选组件、手风琴或主从详情选择。', vue: '对应把 ref 提升到父组件，再通过 props 与 emit 同步。', advanced: '判断状态所有权，避免无条件提升到页面或全局。', pitfall: '同一业务值在多个子组件各存一份，产生同步 Effect。' },
  'immutable-updates': { purpose: '通过新对象和新数组表达状态变化，保留可预测引用。', signature: 'setItems(items => items.map(item => item.id === id ? { ...item, done: true } : item))', scenario: '更新对象字段、列表项、嵌套表单和缓存快照。', vue: 'Vue reactive 允许代理对象原地写入；React 依赖 setter 和新引用。', advanced: '通过领域事件和 Reducer 集中复杂不可变更新。', pitfall: '直接 push、splice 或改写旧对象后继续使用同一引用。' },
  'state-snapshot-batching': { purpose: '理解每次渲染读取固定状态快照，以及 React 如何批处理更新。', signature: 'setCount(count => count + 1)', scenario: '连续更新计数、异步事件和并发渲染。', vue: 'Vue 将响应式变更放入更新队列；React setter 将更新加入下一次渲染队列。', advanced: '依赖旧值时使用 updater，并用事件边界组织一组原子更新。', pitfall: '调用 setter 后立刻读取旧变量，误以为它已同步改变。' },
  'react-typescript-types': { purpose: '为组件、Props、事件、children 和状态建立精确类型。', signature: 'interface ButtonProps { children: ReactNode; onClick: MouseEventHandler<HTMLButtonElement> }', scenario: '构建可重构、可补全并能表达业务不变量的组件。', vue: '对应 defineProps<T>、defineEmits<T> 和 Ref<T> 泛型。', advanced: '使用判别联合、ComponentProps 和泛型组件复用原生属性。', pitfall: '滥用 any、React.FC 或把所有字段都声明为可选。' },
  'use-state': { purpose: '保存会影响界面的局部状态，并通过 setter 调度新渲染。', signature: 'const [state, setState] = useState<T>(initialState)', scenario: '管理输入值、选中项、开关和本地草稿。', vue: '对应 ref；React 返回状态快照和 setter，Vue 返回可变响应式容器。', advanced: '使用惰性初始化、函数式更新和最小状态原则。', pitfall: '直接修改状态，或把可计算值重复保存为 state。' },
  'use-reducer': { purpose: '使用领域事件集中管理复杂状态转换。', signature: 'const [state, dispatch] = useReducer(reducer, initialState)', scenario: '表单向导、需求看板和具有明确状态迁移的交互。', vue: 'Vue 常用 reactive + action；Reducer 强制根据事件返回下一状态。', advanced: '使用判别联合定义 Action，并让 Reducer 保持纯函数和穷尽检查。', pitfall: '把副作用放进 Reducer，或为两个简单字段过早使用 Reducer。' },
  'use-context': { purpose: '读取并订阅最近一层 Context Provider 的值。', signature: 'const theme = useContext(ThemeContext)', scenario: '读取主题、认证会话、国际化和稳定服务依赖。', vue: '对应 inject；createContext/Provider 对应 provide。', advanced: '拆分状态与操作 Context，并通过自定义 Hook 处理 Provider 缺失。', pitfall: '把 Context 当全局状态库，传入每次渲染都新建的巨大对象。' },
  'use-ref': { purpose: '保存不参与渲染的可变值或引用 DOM 节点。', signature: 'const inputRef = useRef<HTMLInputElement>(null)', scenario: '聚焦输入、保存定时器 ID、缓存上一次值。', vue: '模板 ref 可引用 DOM；普通 ref 变化会响应式更新，React ref.current 不触发渲染。', advanced: '惰性创建昂贵对象，并只在事件或 Effect 中读写 DOM ref。', pitfall: '把需要显示的数据放进 ref，或在渲染期间随意改写 current。' },
  'use-imperative-handle': { purpose: '限制父组件通过 ref 能调用的命令式能力。', signature: 'useImperativeHandle(ref, () => ({ focus, reset }), [])', scenario: '封装输入、播放器或第三方控件的少量命令。', vue: '对应 defineExpose；都应只暴露稳定且必要的命令。', advanced: 'React 19 可把 ref 作为 Props 接收，并暴露最小句柄接口。', pitfall: '用命令式句柄替代 Props 数据流，暴露整个内部 DOM。' },
  'use-effect': { purpose: '让组件与网络、订阅、DOM 或第三方控件等外部系统同步。', signature: 'useEffect(setup, dependencies)', scenario: '建立连接、监听浏览器事件和同步非 React 控件。', vue: '对应 watchEffect/onMounted/onUnmounted 的组合，但依赖模型不同。', advanced: '让 setup 与 cleanup 对称，处理请求竞态，并先判断是否根本不需要 Effect。', pitfall: '用 Effect 计算派生状态、遗漏依赖，或通过禁用 lint 隐藏闭包问题。' },
  'use-effect-event': { purpose: '从 Effect 中提取读取最新值但不应触发重新同步的事件逻辑。', signature: 'const onConnected = useEffectEvent(callback)', scenario: '连接成功通知、定时器回调和外部事件监听器。', vue: 'Vue 闭包通常读取响应式 ref 最新值；React 19.2 用 Effect Event 区分响应式与非响应式逻辑。', advanced: '只在同一组件的 Effect 内调用，并保留真正响应式依赖。', pitfall: '用它逃避依赖数组，或从事件处理器和渲染期间调用。' },
  'use-layout-effect': { purpose: '在浏览器绘制前读取布局并同步修正 DOM。', signature: 'useLayoutEffect(setup, dependencies)', scenario: '测量浮层位置、避免首次绘制闪动。', vue: '更接近 onMounted 后配合 nextTick 的同步布局测量。', advanced: '把测量与写入限制在最小范围，并优先尝试 CSS 布局。', pitfall: '把普通请求和订阅放入 useLayoutEffect，阻塞浏览器绘制。' },
  'use-insertion-effect': { purpose: '让 CSS-in-JS 库在布局 Effect 前插入动态样式。', signature: 'useInsertionEffect(setup, dependencies)', scenario: '仅用于样式库作者管理运行时样式标签。', vue: 'Vue 业务组件通常不需要对应 API，样式由 SFC 编译链处理。', advanced: '封装在样式基础设施内部，并保持无状态更新、无 DOM ref 读取。', pitfall: '普通业务代码用它替代 useEffect 或 useLayoutEffect。' },
  'use-memo': { purpose: '在依赖不变时复用昂贵计算结果。', signature: 'const value = useMemo(calculateValue, dependencies)', scenario: '过滤大列表、昂贵数据转换和保持传给 memo 子组件的对象引用。', vue: '对应 computed，但 useMemo 是性能提示而非业务正确性依赖。', advanced: '先用 Profiler 测量，再缓存真正昂贵且依赖稳定的纯计算。', pitfall: '缓存廉价表达式，或依赖每次渲染都新建的对象。' },
  'use-callback': { purpose: '在依赖不变时复用函数引用。', signature: 'const handleSelect = useCallback((id: string) => {}, [dependency])', scenario: '向 memo 子组件传回调或作为其他 Hook 的稳定依赖。', vue: 'Vue setup 函数通常只执行一次；React 组件每次渲染都会重新创建局部函数。', advanced: '只在引用稳定确实影响 memo、订阅或依赖关系时使用。', pitfall: '给所有处理器套 useCallback，增加依赖维护成本却没有收益。' },
  'use-transition': { purpose: '把非紧急状态更新标记为可中断 Transition。', signature: 'const [isPending, startTransition] = useTransition()', scenario: '输入保持即时响应，同时更新昂贵列表或切换 Suspense 内容。', vue: 'Vue 没有完全对应 Hook，通常用异步组件、调度队列和加载状态组合。', advanced: '用 isPending 提供反馈，并让输入 state 保持同步更新。', pitfall: '在 Transition 中控制文本输入，或用它延迟网络请求本身。' },
  'use-deferred-value': { purpose: '延后非关键派生界面使用的值，让紧急交互先完成。', signature: 'const deferredQuery = useDeferredValue(query)', scenario: '搜索输入驱动昂贵结果列表时保持输入顺滑。', vue: '可类比把派生更新放到较低优先级任务，但没有一一对应 API。', advanced: '配合 memo 和 Suspense，并用视觉状态提示结果仍是旧值。', pitfall: '把它当 debounce；它不提供固定延迟，也不会减少网络请求。' },
  'use-id': { purpose: '生成跨服务端与客户端稳定的无障碍关联 ID。', signature: 'const id = useId()', scenario: '关联 label/input、帮助文本和错误提示。', vue: 'Vue 组件通常手工生成或由组件库管理 ID。', advanced: '用同一前缀派生一组字段 ID，不要用于列表 key。', pitfall: '把 useId 当业务标识或动态列表 key。' },
  'use-sync-external-store': { purpose: '以并发安全方式订阅 React 外部状态源。', signature: 'useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)', scenario: '封装浏览器存储、在线状态或第三方 store。', vue: 'Vue 外部数据通常包装为 ref/customRef；该 Hook 定义 React 的订阅快照契约。', advanced: '缓存 getSnapshot 返回值，并为 SSR 明确定义一致快照。', pitfall: '每次 getSnapshot 都返回新对象，造成无限重新渲染。' },
  'use-debug-value': { purpose: '在 React DevTools 中为自定义 Hook 显示可读标签。', signature: 'useDebugValue(value, format?)', scenario: '调试共享库中的连接、缓存或权限 Hook。', vue: 'Vue Devtools 通常直接展示 ref/computed；没有完全对应的组件 API。', advanced: '仅为复用广泛且状态难理解的 Hook 增加延迟格式化。', pitfall: '在普通业务组件中大量调用，或把它当日志系统。' },
  'use-action-state': { purpose: '管理 Action 的返回状态、提交函数和 pending 状态。', signature: 'const [state, formAction, isPending] = useActionState(action, initialState)', scenario: 'React 19 表单提交、校验反馈和异步 mutation。', vue: 'Vue 常用 ref 保存 pending/error/result 并在 submit 中更新。', advanced: '返回类型化结果，区分字段错误与系统错误，并结合表单 Action。', pitfall: '在 Action 中吞掉异常，或同时维护重复的 pending state。' },
  'use-optimistic': { purpose: '在 Action 完成前临时展示用户预期结果。', signature: 'const [optimisticState, addOptimistic] = useOptimistic(state, reducer)', scenario: '点赞、评论、列表新增和可恢复删除。', vue: 'Vue 通常手工保存旧值并立即改写 ref，失败后回滚。', advanced: '用稳定临时 ID、pending 标记和错误恢复处理并发 mutation。', pitfall: '在 Action/Transition 外调用 setter，或没有失败恢复路径。' },
  'use-form-status': { purpose: '让表单内部子组件读取最近表单的提交状态。', signature: 'const { pending, data, method, action } = useFormStatus()', scenario: '提交按钮禁用、显示进度和读取本次 FormData。', vue: 'Vue 表单通常通过 provide/inject 或 Props 传递 pending。', advanced: '将提交按钮封装为可复用组件，并提供可访问加载文案。', pitfall: '在 form 外调用并期待状态，或不禁用重复提交。' },
  'custom-hooks': { purpose: '组合内置 Hooks，复用有状态逻辑而不是复用 UI。', signature: 'function useOnlineStatus(): boolean', scenario: '封装订阅、请求策略、表单字段和浏览器能力。', vue: '直接对应 Composition API composable，命名和依赖边界相似。', advanced: '返回最小稳定契约，隐藏 Effect 清理，并用 useDebugValue 改善库级调试。', pitfall: '把无状态工具函数命名为 use，或在 Hook 中隐藏不可控全局副作用。' },
  'create-context': { purpose: '创建跨组件树传递值的 Context 对象。', signature: 'const ThemeContext = createContext<ThemeContextValue | null>(null)', scenario: '定义主题、会话、语言和稳定服务的 Provider 边界。', vue: '对应 InjectionKey 配合 provide/inject。', advanced: '使用 null 默认值和守卫 Hook，避免静默使用伪默认值。', pitfall: '把动态默认对象写进 createContext，掩盖 Provider 缺失。' },
  'memo': { purpose: '在 Props 浅比较相等时跳过组件重新渲染。', signature: 'const Row = memo(RowView)', scenario: '大型列表中渲染昂贵且 Props 稳定的行组件。', vue: 'Vue 细粒度依赖追踪通常自动缩小更新范围；React memo 显式跳过函数组件渲染。', advanced: '配合稳定 Props、useMemo/useCallback 和 Profiler 测量。', pitfall: 'Props 每次都是新对象，或编写昂贵深比较函数。' },
  'lazy': { purpose: '把组件代码拆成按需加载的独立 chunk。', signature: 'const SettingsPage = lazy(() => import("./SettingsPage"))', scenario: '路由页面、低频弹窗和大型编辑器延迟加载。', vue: '对应 defineAsyncComponent 和路由动态 import。', advanced: '在稳定模块顶层声明，并结合路由级 Suspense 与错误恢复。', pitfall: '在组件渲染内部调用 lazy，导致组件类型反复创建。' },
  'suspense': { purpose: '在子树等待代码或兼容资源时展示 fallback。', signature: '<Suspense fallback={<Skeleton />}><LazyPage /></Suspense>', scenario: '懒加载路由、异步资源和 Transition 导航。', vue: '对应 Vue Suspense，但生态支持和错误边界组合方式不同。', advanced: '按用户感知区域设置边界，避免一个全屏 spinner 阻塞整个应用。', pitfall: '认为任意 useEffect fetch 都会自动触发 Suspense。' },
  'activity': { purpose: '在保留子树状态的同时控制其可见性和更新优先级。', signature: '<Activity mode={visible ? "visible" : "hidden"}>...</Activity>', scenario: '保留标签页草稿或预渲染即将显示的界面。', vue: '概念接近 KeepAlive 与 v-show 的组合，但调度语义不同。', advanced: '只用于状态保留确有价值的子树，并测量隐藏内容的资源成本。', pitfall: '用 Activity 隐藏敏感内容，或无边界保留大量页面。' },
  'fragment': { purpose: '在不增加额外 DOM 节点的情况下组合多个子节点。', signature: '<Fragment key={item.id}>...</Fragment>', scenario: '返回多个兄弟节点或为列表片段提供 key。', vue: 'Vue 3 组件原生支持多根节点；React 使用 Fragment 表达。', advanced: '列表片段需要 key 时使用显式 Fragment，而不是短语法。', pitfall: '为了布局滥用无语义 div，或给短 Fragment 写 key。' },
  'strict-mode': { purpose: '在开发环境执行额外检查以暴露不纯渲染和 Effect 清理问题。', signature: '<StrictMode><App /></StrictMode>', scenario: '应用根节点或新功能子树的开发质量检查。', vue: 'Vue 没有完全对应的双执行检查模式。', advanced: '把重复 Effect 当成缺少对称清理的信号，而不是关闭 StrictMode。', pitfall: '把开发期双调用误认为生产行为，或通过全局标记绕过检查。' },
  'profiler': { purpose: '以编程方式测量 React 子树的渲染耗时。', signature: '<Profiler id="SearchResults" onRender={handleRender}>...</Profiler>', scenario: '定位输入卡顿、列表重渲染和优化前后差异。', vue: 'Vue Devtools 也提供性能时间线，但组件 API 不完全对应。', advanced: '结合浏览器 Performance 和真实交互数据，记录阶段、耗时与提交时间。', pitfall: '没有基准就添加 memo，或在生产中无采样地上报全部渲染。' },
  'use-api': { purpose: '在渲染期间读取 Promise 或 Context 资源，并与 Suspense 协作。', signature: 'const data = use(dataPromise)', scenario: '读取框架或兼容数据层提供的稳定 Promise。', vue: 'Vue async setup/Suspense 可等待资源，但调用规则不同。', advanced: 'Promise 必须由框架或缓存层稳定创建，并配置 Suspense 与 Error Boundary。', pitfall: '在客户端组件每次渲染时创建新 Promise。' },
  'start-transition': { purpose: '在 Hook 外把状态更新标记为非紧急 Transition。', signature: 'startTransition(() => setPage(nextPage))', scenario: '数据层或普通函数触发可中断导航和大范围更新。', vue: 'Vue 没有直接优先级 API，通常依赖调度器和异步组件。', advanced: '需要 pending 状态时优先 useTransition；库代码可使用 startTransition。', pitfall: '把异步请求包进去就期待请求被延迟或取消。' },
  'create-portal': { purpose: '把 React 子节点渲染到当前 DOM 层级之外，同时保留 React 事件树。', signature: 'createPortal(children, domNode)', scenario: '模态框、Tooltip、Toast 和全局浮层。', vue: '直接对应 Teleport。', advanced: '管理焦点、Escape、滚动锁定和 aria-modal，而不只移动 DOM。', pitfall: '忽略事件仍按 React 树冒泡，或未处理焦点返回。' },
  'flush-sync': { purpose: '极少数情况下强制 React 同步提交更新。', signature: 'flushSync(() => setState(nextState))', scenario: '必须在第三方浏览器 API 下一行读取最新 DOM。', vue: '可类比 await nextTick 后读取 DOM，但 flushSync 会同步阻塞。', advanced: '把调用限制在兼容适配层并记录必要原因。', pitfall: '用于修复普通异步认知问题，破坏批处理和性能。' },
  'error-boundary': { purpose: '捕获子树渲染错误并展示可恢复后备界面。', signature: 'class ErrorBoundary extends Component<Props, State>', scenario: '路由、微前端、图表和第三方组件隔离故障。', vue: '对应 onErrorCaptured 和 app.config.errorHandler 的组合。', advanced: '按恢复边界拆分，记录 componentStack，并通过 reset key 支持重试。', pitfall: '用 try/catch 包 JSX，或期待捕获事件处理器中的异步错误。' },
  'react-router': { purpose: '使用 URL 组织页面状态、深链接和导航生命周期。', signature: 'createBrowserRouter(routes)', scenario: '工作台页面、参数详情、权限路由和懒加载。', vue: '对应 Vue Router；useNavigate/useParams 对应 useRouter/useRoute。', advanced: '集中路由元数据，使用 loader/action 或 Query 管理数据，并保持刷新可恢复。', pitfall: '用组件内部条件判断模拟路由，或复制 URL 参数到本地 state。' },
  'tanstack-query': { purpose: '管理服务器状态的请求、缓存、失效、重试和并发。', signature: 'useQuery({ queryKey, queryFn })', scenario: '列表查询、详情缓存、mutation 和乐观更新。', vue: '对应 @tanstack/vue-query；核心缓存模型一致，响应式适配不同。', advanced: '建立查询键工厂、统一错误策略和精确失效边界。', pitfall: '把服务器数据再复制到 useState，或使用不稳定对象作为 queryKey。' },
  'axios': { purpose: '集中处理 HTTP 客户端、认证头、取消、错误归一化和刷新令牌。', signature: 'const client = axios.create({ baseURL, timeout })', scenario: '企业 API 请求、文件传输和统一错误模型。', vue: 'React 与 Vue 使用 Axios 本身没有差异，区别在调用它的数据层。', advanced: '请求层只处理传输，业务缓存交给 TanStack Query，并支持 AbortSignal。', pitfall: '在每个组件重复创建拦截器，或吞掉后端错误结构。' },
  'zod': { purpose: '在运行时校验未知数据，并把校验结果收窄为可信 TypeScript 类型。', signature: 'const result = schema.safeParse(input)', scenario: '接口响应、表单提交、URL 参数和本地存储边界。', vue: 'React/Vue 均可使用 Zod；区别只在表单和响应式集成。', advanced: '在系统边界解析 unknown，使用 transform 与 discriminatedUnion 表达领域模型。', pitfall: '只写 TypeScript 接口就相信外部数据，或在 UI 深处重复解析。' },
  'vitest-testing-library': { purpose: '通过用户可观察行为验证组件和 Hook 契约。', signature: 'render(<Form />); await user.click(screen.getByRole("button"))', scenario: '表单、路由、异步状态和回归测试。', vue: '对应 Vitest + Vue Testing Library；查询语义和用户事件原则相同。', advanced: '测试公共 seam、使用 MSW 或边界 mock，并避免实现耦合。', pitfall: '断言私有状态、Tailwind 类名或大量脆弱快照。' },
}

const CATEGORY_GUIDANCE = {
  foundation: '把语法放进小组件中练习，并通过明确 Props 和事件类型保持边界。',
  hook: '遵守 Hooks 顶层调用规则，把自定义 Hook 当作复用状态逻辑的公共接口。',
  api: '优先使用声明式数据流，只在文档明确的边界使用逃生舱 API。',
  enterprise: '将第三方库封装在项目既有基础设施中，避免页面直接重复配置。',
} as const

const TOPIC_SANDBOX_DEPENDENCIES: Record<string, Record<string, string>> = {
  'react-router': { 'react-router-dom': '^7.18.1' },
  'tanstack-query': { '@tanstack/react-query': '^5.101.2' },
  axios: { axios: '^1.18.1' },
  zod: { zod: '^4.4.3' },
}

/**
 * 从 Markdown 的完整 TSX 示例区提取可运行源码。
 *
 * @param tutorial Markdown 教程原文。
 * @returns 第一个 TSX 代码块中的源码。
 * @throws 当教程缺少 TSX 代码块时抛出错误。
 */
export function extractTopicSource(tutorial: string): string {
  const match = tutorial.match(/```tsx\n([\s\S]*?)\n```/)

  if (!match)
    throw new Error('React 知识点教程缺少 TSX 代码块。')

  return match[1]
}

/**
 * 读取指定 React 知识点的完整学习指南。
 *
 * @param topicId 知识点稳定标识。
 * @returns 页面和在线练习共同使用的学习指南。
 * @throws 当知识点未注册或缺少专属内容时抛出错误。
 */
export function getReactLearningTopicGuide(topicId: string): ReactLearningTopicGuide {
  const topic = REACT_LEARNING_TOPICS.find(item => item.id === topicId)
  const knowledge = TOPIC_KNOWLEDGE[topicId]

  if (!topic || !knowledge)
    throw new Error(`未找到 React 知识点指南：${topicId}`)

  const tutorial = getReactLearningTopicTutorial(topicId)

  return {
    summary: `${topic.title}：${knowledge.purpose}`,
    basic: [knowledge.purpose, `核心语法：${knowledge.signature}`, `典型场景：${knowledge.scenario}`],
    advanced: [knowledge.advanced, CATEGORY_GUIDANCE[topic.category], '为关键交互编写基于角色、标签和可见结果的公开行为测试。'],
    vue: [knowledge.vue, 'Vue 追踪响应式值的读写；React 通过状态快照和重新执行组件产生下一棵 UI。', '迁移时先对齐状态所有权和副作用边界，再转换具体语法。'],
    mistakes: [knowledge.pitfall, '使用 any、直接修改状态或忽略 Hook 依赖来绕过类型和规则检查。', '在 JSX 中堆积复杂表达式，或为了抽象而抽象。'],
    recommendations: [knowledge.advanced, '保持组件与 Hook 纯净，使用明确 TypeScript 类型和稳定业务标识。', '先保证正确性与可读性，再根据 Profiler 和真实指标优化。'],
    source: extractTopicSource(tutorial),
    tutorial,
    dependencies: TOPIC_SANDBOX_DEPENDENCIES[topicId] ?? {},
  }
}
