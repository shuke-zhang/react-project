const TUTORIAL_MODULES = import.meta.glob<string>(
  '../../../../docs/react-learning/topics/*.md',
  {
    eager: true,
    import: 'default',
    query: '?raw',
  },
)

const TUTORIALS_BY_ID = new Map(
  Object.entries(TUTORIAL_MODULES).map(([path, tutorial]) => {
    const topicId = path.match(/\/([^/]+)\.md$/)?.[1]

    if (!topicId)
      throw new Error(`无法从 Markdown 路径解析知识点 ID：${path}`)

    return [topicId, tutorial] as const
  }),
)

/**
 * 仓库中已有 Markdown 教程的稳定知识点 ID。
 */
export const REACT_LEARNING_TUTORIAL_IDS = [...TUTORIALS_BY_ID.keys()]

/**
 * 读取指定知识点的 Markdown 教程原文。
 *
 * @param topicId 知识点稳定标识。
 * @returns 与页面和在线源码同源的 Markdown 原文。
 * @throws 当知识点缺少 Markdown 文件时抛出错误。
 */
export function getReactLearningTopicTutorial(topicId: string): string {
  const tutorial = TUTORIALS_BY_ID.get(topicId)

  if (!tutorial)
    throw new Error(`未找到 React 知识点 Markdown：${topicId}`)

  return tutorial
}

