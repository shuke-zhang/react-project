import { render, screen } from '@testing-library/react'
import { theme } from 'antd'
import { AppProviders } from '@/app/AppProviders'

/**
 * 读取应用主题 token，验证子树可获得统一后台视觉配置。
 *
 * @returns 用于断言主题 token 的节点。
 */
function ThemeTokenProbe() {
  const { token } = theme.useToken()

  return (
    <output>
      {JSON.stringify({
        colorPrimary: token.colorPrimary,
        colorText: token.colorText,
        colorBgLayout: token.colorBgLayout,
        borderRadius: token.borderRadius,
      })}
    </output>
  )
}

describe('应用级 Provider', () => {
  it('向子页面提供统一的企业后台主题 token', () => {
    render(
      <AppProviders>
        <ThemeTokenProbe />
      </AppProviders>,
    )

    expect(JSON.parse(screen.getByRole('status').textContent ?? '')).toEqual({
      colorPrimary: '#168b78',
      colorText: '#273142',
      colorBgLayout: '#eef1f5',
      borderRadius: 8,
    })
  })
})
