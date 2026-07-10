import { Button, Form, Input, Typography, message } from 'antd'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { login } from '@/api/session'

interface LoginFormValues {
  username: string
  password: string
}

/**
 * 从路由状态中读取登录成功后的回跳路径。
 *
 * @param state React Router location state。
 * @returns 合法的站内回跳路径；缺失或非法时回到首页。
 */
function getRedirectPath(state: unknown): string {
  const maybeState = state as { from?: string } | null
  return maybeState?.from && maybeState.from.startsWith('/') ? maybeState.from : '/home'
}

/**
 * 渲染具备明亮青蓝液态玻璃质感的工作台登录页。
 *
 * @returns 登录表单和纯视觉玻璃背景组成的页面节点。
 */
export function LoginView() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  /**
   * 提交登录表单并在成功后跳转到目标页面。
   *
   * @param values 登录表单值。
   */
  async function handleFinish(values: LoginFormValues) {
    setLoading(true)

    try {
      await login(values.username, values.password)
      navigate(getRedirectPath(location.state), { replace: true })
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : '登录失败，请稍后重试'
      void message.error(errorMessage)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative isolate h-dvh min-h-[620px] overflow-hidden bg-[radial-gradient(circle_at_13%_17%,rgb(165_243_224_/_42%),transparent_32%),radial-gradient(circle_at_80%_20%,rgb(142_211_238_/_40%),transparent_36%),linear-gradient(132deg,#f1fbfa_0%,#b8e9e5_34%,#7bc4cf_68%,#d5eded_100%)] text-[#eef7f6] max-[920px]:min-h-[560px] max-[560px]:min-h-[540px]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(255_255_255_/_17%)_1px,transparent_1px),linear-gradient(rgb(255_255_255_/_14%)_1px,transparent_1px)] bg-[size:74px_74px] opacity-80 [mask-image:linear-gradient(125deg,rgb(0_0_0_/_70%),transparent_78%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-[16%] top-[10%] -z-10 h-[390px] w-[760px] -skew-x-12 -rotate-[17deg] rounded-[48px] border border-white/45 bg-[linear-gradient(135deg,rgb(255_255_255_/_38%),rgb(255_255_255_/_10%)_58%,rgb(83_155_170_/_18%))] shadow-[inset_0_1px_0_rgb(255_255_255_/_72%),inset_0_-1px_0_rgb(255_255_255_/_18%),0_36px_90px_rgb(20_66_78_/_25%)] backdrop-blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-[34%] left-[18%] -z-10 h-[470px] w-[90%] -rotate-[7deg] bg-[linear-gradient(90deg,rgb(85_169_188_/_0%),rgb(103_188_204_/_28%),rgb(113_208_184_/_27%),rgb(255_255_255_/_0%))] blur-[54px]" aria-hidden="true" />

      <header className="mx-auto flex h-[74px] w-[min(1180px,calc(100%-56px))] items-center max-[920px]:h-[68px] max-[920px]:w-[min(calc(100%-32px),560px)] max-[560px]:h-[62px] max-[560px]:w-[min(calc(100%-24px),520px)]" aria-label="企业级 React 模板">
        <span className="relative grid size-[46px] place-items-center rounded-[16px_20px_15px_22px] border border-white/55 bg-white/20 bg-[linear-gradient(135deg,rgb(255_255_255_/_57%),rgb(122_201_190_/_21%))] shadow-[inset_0_1px_0_rgb(255_255_255_/_88%),0_16px_36px_rgb(20_64_74_/_22%)] backdrop-blur-xl max-[560px]:size-[42px]" aria-hidden="true">
          <span className="absolute h-1.5 w-5 -translate-x-1.5 -translate-y-[7px] -rotate-[35deg] rounded-full bg-[linear-gradient(135deg,#f4fffd,#61b7aa)] shadow-[0_0_20px_rgb(92_181_169_/_30%)]" />
          <span className="absolute h-1.5 w-6 translate-x-1 translate-y-px -rotate-[35deg] rounded-full bg-[linear-gradient(135deg,#eaf7fa,#5f91aa)] shadow-[0_0_20px_rgb(92_181_169_/_30%)]" />
          <span className="absolute h-1.5 w-[15px] -translate-x-px translate-y-2.5 -rotate-[35deg] rounded-full bg-[linear-gradient(135deg,#fff,#9dd6cb)] shadow-[0_0_20px_rgb(92_181_169_/_30%)]" />
        </span>
      </header>

      <section className="mx-auto grid h-[calc(100dvh-74px)] min-h-[546px] w-[min(1180px,calc(100%-56px))] grid-cols-[minmax(320px,1fr)_minmax(380px,438px)] items-center gap-[74px] pb-[34px] max-[920px]:h-[calc(100dvh-68px)] max-[920px]:min-h-[492px] max-[920px]:w-[min(calc(100%-32px),560px)] max-[920px]:grid-cols-1 max-[920px]:pb-6 max-[560px]:h-[calc(100dvh-62px)] max-[560px]:min-h-[478px] max-[560px]:w-[min(calc(100%-24px),520px)] max-[560px]:pb-[18px]" aria-label="工作台登录">
        <div className="relative h-[min(520px,calc(100dvh-146px))] min-h-[420px] max-[920px]:hidden" aria-hidden="true">
          <span className="absolute left-[10%] top-[74px] h-[320px] w-[min(470px,76%)] -rotate-[8deg] overflow-hidden rounded-[48%_52%_44%_56%/54%_42%_58%_46%] border border-white/60 bg-[radial-gradient(circle_at_22%_18%,rgb(255_255_255_/_68%),transparent_28%),linear-gradient(145deg,rgb(255_255_255_/_46%),rgb(255_255_255_/_12%)_52%,rgb(91_187_199_/_20%))] shadow-[inset_0_1px_0_rgb(255_255_255_/_88%),inset_-26px_-30px_64px_rgb(53_151_174_/_14%),0_38px_90px_rgb(39_109_124_/_18%)] backdrop-blur-3xl">
            <span className="absolute left-[13%] top-[12%] h-16 w-[42%] -rotate-12 rounded-full bg-white/35 blur-xl" />
            <span className="absolute bottom-[16%] right-[13%] size-[128px] rounded-full border-[18px] border-white/20 border-b-[#71cdb7]/25 border-r-[#6fb9d0]/30 shadow-[inset_0_0_28px_rgb(255_255_255_/_22%)]" />
          </span>
          <span className="absolute bottom-[58px] left-[24%] h-[116px] w-[300px] rotate-[5deg] rounded-[50%] border border-white/40 bg-white/10 shadow-[inset_0_1px_0_rgb(255_255_255_/_55%),0_24px_64px_rgb(42_124_139_/_12%)] backdrop-blur-2xl" />
        </div>

        <section
          className={[
            'relative overflow-hidden rounded-[34px_26px_32px_28px] border border-white/75 bg-white/25 bg-[radial-gradient(circle_at_12%_8%,rgb(255_255_255_/_76%),transparent_36%),linear-gradient(150deg,rgb(255_255_255_/_62%),rgb(255_255_255_/_26%)_52%,rgb(112_201_211_/_20%))] p-8 shadow-[inset_0_1px_0_rgb(255_255_255_/_96%),inset_18px_18px_42px_rgb(255_255_255_/_16%),inset_-24px_-28px_54px_rgb(34_137_162_/_12%),inset_0_-1px_0_rgb(255_255_255_/_28%),0_34px_92px_rgb(20_80_92_/_22%)] backdrop-blur-3xl max-[920px]:px-6 max-[920px]:py-7 max-[560px]:rounded-[20px] max-[560px]:px-5 max-[560px]:py-6',
            '[&_.ant-form-item]:!mb-5 [&_.ant-form-item-label>label]:!text-[13px] [&_.ant-form-item-label>label]:!font-extrabold [&_.ant-form-item-label>label]:!text-[#264b55]',
            '[&_.ant-input]:!min-h-12 [&_.ant-input]:!rounded-[17px_14px_18px_15px] [&_.ant-input]:!border-white/65 [&_.ant-input]:!bg-white/25 [&_.ant-input]:!bg-[linear-gradient(135deg,rgb(255_255_255_/_48%),rgb(255_255_255_/_22%))] [&_.ant-input]:!text-[#18323c] [&_.ant-input]:!shadow-[inset_0_1px_0_rgb(255_255_255_/_86%),inset_0_-1px_0_rgb(255_255_255_/_22%),0_8px_22px_rgb(25_75_88_/_10%)] [&_.ant-input::placeholder]:!text-[#78939b]',
            '[&_.ant-input-password]:!min-h-12 [&_.ant-input-password]:!rounded-[17px_14px_18px_15px] [&_.ant-input-password]:!border-white/65 [&_.ant-input-password]:!bg-white/25 [&_.ant-input-password]:!bg-[linear-gradient(135deg,rgb(255_255_255_/_48%),rgb(255_255_255_/_22%))] [&_.ant-input-password]:!shadow-[inset_0_1px_0_rgb(255_255_255_/_86%),inset_0_-1px_0_rgb(255_255_255_/_22%),0_8px_22px_rgb(25_75_88_/_10%)]',
            '[&_.ant-input-password_.ant-input]:!min-h-0 [&_.ant-input-password_.ant-input]:!rounded-none [&_.ant-input-password_.ant-input]:!border-0 [&_.ant-input-password_.ant-input]:!bg-transparent [&_.ant-input-password_.ant-input]:!bg-none [&_.ant-input-password_.ant-input]:!shadow-none [&_.ant-input-password-icon]:!text-[#5b7880] [&_.ant-form-item-explain-error]:!text-[#b42318]',
            '[&_.ant-btn-primary]:!relative [&_.ant-btn-primary]:!z-10 [&_.ant-btn-primary]:!mt-1 [&_.ant-btn-primary]:!h-[50px] [&_.ant-btn-primary]:!rounded-[14px] [&_.ant-btn-primary]:!border-0 [&_.ant-btn-primary]:!bg-transparent [&_.ant-btn-primary]:!bg-[radial-gradient(circle_at_20%_14%,rgb(255_255_255_/_76%),transparent_28%),linear-gradient(135deg,#9debdc,#83c9e5_58%,#f2fffe)] [&_.ant-btn-primary]:!text-[15px] [&_.ant-btn-primary]:!font-extrabold [&_.ant-btn-primary]:!text-[#12313b] [&_.ant-btn-primary]:!shadow-[0_18px_42px_rgb(32_136_158_/_28%),inset_-14px_-12px_24px_rgb(33_156_178_/_12%),inset_0_1px_0_rgb(255_255_255_/_78%)]',
          ].join(' ')}
          aria-labelledby="login-title"
        >
          <div className="pointer-events-none absolute inset-x-7 top-0 h-px bg-[linear-gradient(90deg,transparent,rgb(255_255_255_/_96%),transparent)]" aria-hidden="true" />
          <div className="relative z-10 mb-[26px] max-[560px]:mb-[22px]">
            <span className="mb-2.5 block text-[11px] font-extrabold tracking-[0.16em] text-[#14717b]">SECURE ACCESS</span>
            <Typography.Title className="!mb-2 !mt-0 !text-[32px] !font-extrabold !leading-tight !text-[#183540] max-[560px]:!text-[28px]" id="login-title" level={2}>欢迎回来</Typography.Title>
            <Typography.Text className="!text-sm !text-[#4c6870]">使用已配置账号登录企业控制台。</Typography.Text>
          </div>

          <Form<LoginFormValues>
            className="relative z-10"
            layout="vertical"
            initialValues={{ username: 'shuke', password: 'zhang123456' }}
            onFinish={handleFinish}
          >
            <Form.Item label="账号" name="username" rules={[{ required: true, message: '请输入账号' }]}>
              <Input autoComplete="username" placeholder="请输入账号" size="large" />
            </Form.Item>
            <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
              <Input.Password autoComplete="current-password" placeholder="请输入密码" size="large" />
            </Form.Item>
            <Button block htmlType="submit" loading={loading} size="large" type="primary">
              {loading ? '正在登录...' : '登录工作台'}
            </Button>
          </Form>
        </section>
      </section>
    </main>
  )
}
