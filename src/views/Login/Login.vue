<template>
  <div
    :class="prefixCls"
    class="relative h-[100%] w-full overflow-hidden"
  >
    <!-- 科技感背景 -->
    <div class="security-login-bg absolute inset-0"></div>

    <!-- 顶部标题 -->
    <div class="absolute top-0 left-0 right-0 flex justify-center pt-8 z-10">
      <div class="text-white text-2xl font-bold tracking-wider">
        安全防护综合业务平台
      </div>
    </div>

    <!-- 右上角的主题、语言选择 -->
    <div class="absolute top-4 right-4 flex items-center space-x-2 z-10">
      <ThemeSwitch />
      <LocaleDropdown />
    </div>

    <!-- 中央六边形登录区域 -->
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="hexagon-container relative">
        <!-- 六边形边框 -->
        <div class="hexagon-border"></div>

        <!-- 登录表单容器 -->
        <div class="hexagon-content">
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
  background: url('@/assets/imgs/安全综合防御效能展现系统.jpg') center/cover no-repeat;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  width: 100%;
  height: 100%;
}

// 六边形容器
.hexagon-container {
  position: relative;
  width: 500px;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

// 六边形边框 - 使用CSS clip-path实现六边形
.hexagon-border {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 450px;
  background: rgba(64, 158, 255, 0.1);
  border: 2px solid rgba(64, 158, 255, 0.5);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  backdrop-filter: blur(10px);
  z-index: 1;
}

// 六边形内容区域
.hexagon-content {
  position: relative;
  width: 400px;
  height: 400px;
  background: rgba(15, 40, 75, 0.8);
  border-radius: 20px;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(64, 158, 255, 0.3);
  z-index: 2;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

// 六边形辉光效果
.hexagon-border::before {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  background: linear-gradient(45deg,
    rgba(64, 158, 255, 0.3),
    rgba(0, 188, 255, 0.3),
    rgba(64, 158, 255, 0.3)
  );
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  z-index: -1;
  animation: hexagon-glow 3s ease-in-out infinite alternate;
}

// 六边形发光动画
@keyframes hexagon-glow {
  0% {
    opacity: 0.3;
    filter: blur(2px);
  }
  100% {
    opacity: 0.8;
    filter: blur(4px);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .hexagon-container {
    width: 350px;
    height: 350px;
  }

  .hexagon-border {
    width: 320px;
    height: 320px;
  }

  .hexagon-content {
    width: 280px;
    height: 280px;
    padding: 20px;
  }
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
