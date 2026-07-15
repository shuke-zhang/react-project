import { describe, expect, it } from 'vitest'
import {
  HOME_PATH,
  REACT_LEARNING_TOPICS,
  SYSTEM_DICT_PATH,
  closeWorkspaceTab,
  getOpenedWorkspaceTabs,
  getWorkspacePageMetadata,
  getWorkspaceMenuItems,
  getWorkspacePageTitle,
  getWorkspaceRouteObjects,
  openWorkspacePath,
} from '@/layouts/workspaceNavigation'

describe('工作台导航 module', () => {
  it('为系统字典提供标准业务页元数据', () => {
    expect(getWorkspacePageMetadata(SYSTEM_DICT_PATH)).toEqual({
      key: 'systemDict',
      path: SYSTEM_DICT_PATH,
      title: '字典管理',
      breadcrumbs: ['系统管理', '字典管理'],
      pageType: 'standard',
    })
  })

  it('根据路径读取页面标题', () => {
    expect(getWorkspacePageTitle('/users')).toBe('用户管理')
    expect(getWorkspacePageTitle(SYSTEM_DICT_PATH)).toBe('字典管理')
    expect(getWorkspacePageTitle('/unknown')).toBe('首页')
  })

  it('打开已知页面时保留首页并追加标签', () => {
    expect(openWorkspacePath([HOME_PATH], '/users')).toEqual([HOME_PATH, '/users'])
    expect(openWorkspacePath([HOME_PATH], SYSTEM_DICT_PATH)).toEqual([HOME_PATH, SYSTEM_DICT_PATH])
  })

  it('忽略未知页面', () => {
    expect(openWorkspacePath([HOME_PATH], '/unknown')).toEqual([HOME_PATH])
  })

  it('生成带关闭规则的标签页', () => {
    expect(getOpenedWorkspaceTabs([HOME_PATH, '/users', SYSTEM_DICT_PATH])).toEqual([
      { path: HOME_PATH, title: '首页', closable: false },
      { path: '/users', title: '用户管理', closable: true },
      { path: SYSTEM_DICT_PATH, title: '字典管理', closable: true },
    ])
  })

  it('从同一份 registry 生成菜单和路由', () => {
    const menuItems = getWorkspaceMenuItems()
    const routes = getWorkspaceRouteObjects(node => node)

    expect(menuItems.map(item => item?.key)).toEqual([HOME_PATH, '/users', 'react-learning', 'system-management'])
    expect(menuItems[3]).toMatchObject({
      key: 'system-management',
      label: '系统管理',
      children: [
        {
          key: SYSTEM_DICT_PATH,
          label: '字典管理',
        },
      ],
    })
    expect(routes.map(route => route.path)).toEqual([
      'home',
      'users',
      'system/dict',
      ...REACT_LEARNING_TOPICS.map(topic => topic.path.slice(1)),
      'react-learning',
    ])
  })

  it('为 React 学习模块生成 50 个唯一且可深链接的知识点入口', () => {
    const menuItems = getWorkspaceMenuItems()
    const routes = getWorkspaceRouteObjects(node => node)
    const reactLearningMenu = menuItems.find(item => item?.key === 'react-learning')
    const topicPaths = REACT_LEARNING_TOPICS.map(topic => topic.path)

    expect(REACT_LEARNING_TOPICS).toHaveLength(50)
    expect(new Set(topicPaths).size).toBe(50)
    expect(reactLearningMenu).toMatchObject({
      key: 'react-learning',
      label: 'React 学习',
      children: REACT_LEARNING_TOPICS.map(topic => ({
        key: topic.path,
        label: topic.title,
      })),
    })
    expect(routes.map(route => `/${route.path}`)).toEqual(expect.arrayContaining(topicPaths))
    expect(
      routes
        .filter(route => topicPaths.includes(`/${route.path}`))
        .every(route => route.element !== null),
    ).toBe(true)
  })

  it('关闭当前标签时回退到前一个标签', () => {
    expect(closeWorkspaceTab([HOME_PATH, '/users'], '/users', '/users')).toEqual({
      openedPaths: [HOME_PATH],
      nextPath: HOME_PATH,
    })
  })

  it('首页标签不可关闭', () => {
    expect(closeWorkspaceTab([HOME_PATH, '/users'], '/users', HOME_PATH)).toEqual({
      openedPaths: [HOME_PATH, '/users'],
      nextPath: '/users',
    })
  })
})
