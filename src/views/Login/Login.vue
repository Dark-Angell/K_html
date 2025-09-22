<template>
  <div
    :class="prefixCls"
    class="relative h-[100%] w-full overflow-hidden"
  >
    <!-- 科技感背景 -->
    <div class="security-login-bg absolute inset-0"></div>

    <!-- 右上角的主题、语言选择 -->
    <div class="absolute top-4 right-4 flex items-center space-x-2 z-10">
      <ThemeSwitch />
      <LocaleDropdown />
    </div>

    <!-- 中央登录区域 -->
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="login-container relative">
          <!-- 账号登录 -->
          <LoginForm class="w-full" />
          <!-- 手机登录 -->
          <MobileForm class="w-full" />
          <!-- 二维码登录 -->
          <QrCodeForm class="w-full" />
          <!-- 注册 -->
          <RegisterForm class="w-full" />
          <!-- 三方登录 -->
          <SSOLoginVue class="w-full" />
          <!-- 忘记密码 -->
          <ForgetPasswordForm class="w-full" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { underlineToHump } from '@/utils'

import { useDesign } from '@/hooks/web/useDesign'
import { useAppStore } from '@/store/modules/app'
import { ThemeSwitch } from '@/layout/components/ThemeSwitch'
import { LocaleDropdown } from '@/layout/components/LocaleDropdown'

import { LoginForm, MobileForm, QrCodeForm, RegisterForm, SSOLoginVue, ForgetPasswordForm } from './components'

defineOptions({ name: 'Login' })

const { t } = useI18n()
const appStore = useAppStore()
const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('login')
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-login;

.#{$prefix-cls} {
  overflow: hidden;
}

// 科技感背景样式
.security-login-bg {
  background: url('@/assets/imgs/安全综合防御效能展现系统.jpg') no-repeat;
  background-size: 100% 100%;
  background-position: center center;
  width: 100%;
  height: 100vh;
  min-height: 100vh;
}

// 登录容器
.login-container {
  position: relative;
  width: 400px;
  max-width: 90vw;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateX(-20px);
}
</style>

<style lang="scss">
.dark .login-form {
  .el-divider__text {
    background-color: var(--login-bg-color);
  }

  .el-card {
    background-color: var(--login-bg-color);
  }
}
</style>
