import { render, screen } from '@testing-library/react'
import { OnlinePlayground } from '@/views/react-learning/components/OnlinePlayground'

describe('在线练习区运行环境兼容性', () => {
  it('缺少安全上下文时显示明确说明而不是空白预览', () => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'isSecureContext')
    Object.defineProperty(globalThis, 'isSecureContext', { configurable: true, value: false })

    try {
      render(<OnlinePlayground source="export function Demo() { return <p>示例</p> }" cssSource="" />)

      expect(screen.getByRole('heading', { name: '在线预览需要安全地址' })).toBeInTheDocument()
      expect(screen.getByText(/crypto\.subtle/)).toBeInTheDocument()
      expect(screen.getByText(/不会再显示空白预览/)).toBeInTheDocument()
    }
    finally {
      if (originalDescriptor)
        Object.defineProperty(globalThis, 'isSecureContext', originalDescriptor)
      else
        Reflect.deleteProperty(globalThis, 'isSecureContext')
    }
  })
})
