<template>
  <el-form
    v-show="getShow"
    ref="formLogin"
    :model="loginData.loginForm"
    :rules="LoginRules"
    class="login-form security-login-form"
    label-position="top"
    label-width="120px"
    size="large"
  >
    <div class="simple-form-content">
      <!-- 标题：账号登录 -->
      <div class="form-title">
        <div class="title-line"></div>
        <span>账号登录</span>
        <div class="title-line"></div>
      </div>

      <!-- 账号输入框 -->
      <el-form-item prop="username" class="form-item">
        <el-input
          v-model="loginData.loginForm.username"
          placeholder="账号："
          :prefix-icon="iconAvatar"
          class="transparent-input"
        />
      </el-form-item>

      <!-- 密码输入框 -->
      <el-form-item prop="password" class="form-item">
        <el-input
          v-model="loginData.loginForm.password"
          placeholder="密码："
          :prefix-icon="iconLock"
          show-password
          type="password"
          class="transparent-input"
          @keyup.enter="getCode()"
        />
      </el-form-item>

      <!-- 隐藏的滑动验证码 -->
      <Verify
        v-if="loginData.captchaEnable === 'true'"
        ref="verify"
        :captchaType="captchaType"
        :imgSize="{ width: '400px', height: '200px' }"
        mode="pop"
        @success="handleLogin"
      />

      <!-- 登录按钮 -->
      <el-form-item class="form-item">
        <XButton
          :loading="loginLoading"
          title="登 录"
          class="login-btn"
          type="primary"
          @click="getCode()"
        />
      </el-form-item>
    </div>
  </el-form>
</template>
<script lang="ts" setup>
import { ElLoading } from 'element-plus'
import LoginFormTitle from './LoginFormTitle.vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

import { useIcon } from '@/hooks/web/useIcon'

import * as authUtil from '@/utils/auth'
import { usePermissionStore } from '@/store/modules/permission'
import * as LoginApi from '@/api/login'
import { LoginStateEnum, useFormValid, useLoginState } from './useLogin'

defineOptions({ name: 'LoginForm' })

const { t } = useI18n()
const message = useMessage()
const iconAvatar = useIcon({ icon: 'ep:avatar' })
const iconLock = useIcon({ icon: 'ep:lock' })
const formLogin = ref()
const { validForm } = useFormValid(formLogin)
const { setLoginState, getLoginState } = useLoginState()
const { currentRoute, push } = useRouter()
const permissionStore = usePermissionStore()
const redirect = ref<string>('')
const loginLoading = ref(false)
const verify = ref()
const captchaType = ref('blockPuzzle') // blockPuzzle 滑块 clickWord 点击文字 pictureWord 文字验证码

const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN)

const LoginRules = {
  username: [required],
  password: [required]
}
const loginData = reactive({
  isShowPassword: false,
  captchaEnable: import.meta.env.VITE_APP_CAPTCHA_ENABLE,
  loginForm: {
    username: import.meta.env.VITE_APP_DEFAULT_LOGIN_USERNAME || '',
    password: import.meta.env.VITE_APP_DEFAULT_LOGIN_PASSWORD || '',
    captchaVerification: '',
    rememberMe: true // 默认记录我。如果不需要，可手动修改
  }
})

const socialList = [
  { icon: 'ant-design:wechat-filled', type: 30 },
  { icon: 'ant-design:dingtalk-circle-filled', type: 20 },
  { icon: 'ant-design:github-filled', type: 0 },
  { icon: 'ant-design:alipay-circle-filled', type: 0 }
]

// 获取验证码
const getCode = async () => {
  // 情况一，未开启：则直接登录
  if (loginData.captchaEnable === 'false') {
    await handleLogin({})
  } else {
    // 情况二，已开启：则展示验证码；只有完成验证码的情况，才进行登录
    // 弹出验证码
    verify.value.show()
  }
}
// 记住我
const getLoginFormCache = () => {
  const loginForm = authUtil.getLoginForm()
  if (loginForm) {
    loginData.loginForm = {
      ...loginData.loginForm,
      username: loginForm.username ? loginForm.username : loginData.loginForm.username,
      password: loginForm.password ? loginForm.password : loginData.loginForm.password,
      rememberMe: loginForm.rememberMe
    }
  }
}
const loading = ref() // ElLoading.service 返回的实例
// 登录
const handleLogin = async (params: any) => {
  loginLoading.value = true
  try {
    const data = await validForm()
    if (!data) {
      return
    }
    const loginDataLoginForm = { ...loginData.loginForm }
    loginDataLoginForm.captchaVerification = params.captchaVerification
    const res = await LoginApi.login(loginDataLoginForm)
    if (!res) {
      return
    }
    loading.value = ElLoading.service({
      lock: true,
      text: '正在加载系统中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    if (loginDataLoginForm.rememberMe) {
      authUtil.setLoginForm(loginDataLoginForm)
    } else {
      authUtil.removeLoginForm()
    }
    authUtil.setToken(res)
    if (!redirect.value) {
      redirect.value = '/'
    }
    // 判断是否为SSO登录
    if (redirect.value.indexOf('sso') !== -1) {
      window.location.href = window.location.href.replace('/login?redirect=', '')
    } else {
      await push({ path: redirect.value || permissionStore.addRouters[0].path })
    }
  } finally {
    loginLoading.value = false
    loading.value.close()
  }
}

// 社交登录
const doSocialLogin = async (type: number) => {
  if (type === 0) {
    message.error('此方式未配置')
  } else {
    loginLoading.value = true
    // 计算 redirectUri
    // 注意: type、redirect 需要先 encode 一次，否则钉钉回调会丢失。
    // 配合 social-login.vue#getUrlValue() 使用
    const redirectUri =
      location.origin +
      '/social-login?' +
      encodeURIComponent(`type=${type}&redirect=${redirect.value || '/'}`)

    // 进行跳转
    window.location.href = await LoginApi.socialAuthRedirect(type, encodeURIComponent(redirectUri))
  }
}
watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true
  }
)
onMounted(() => {
  getLoginFormCache()
})
</script>

<style lang="scss" scoped>
.security-login-form {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.simple-form-content {
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

// 标题样式
.form-title {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  color: #00d4ff;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 2px;

  span {
    margin: 0 15px;
  }

  .title-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, transparent, #00d4ff, transparent);
  }
}

// 表单项样式
.form-item {
  margin-bottom: 20px;

  :deep(.el-form-item__content) {
    margin-left: 0 !important;
  }
}

// 透明输入框样式
.transparent-input {
  :deep(.el-input__wrapper) {
    background: rgba(64, 158, 255, 0.1);
    border: 1px solid rgba(64, 158, 255, 0.3);
    border-radius: 8px;
    box-shadow: none;
    backdrop-filter: blur(5px);
    transition: all 0.3s ease;

    &:hover {
      border-color: rgba(64, 158, 255, 0.6);
      box-shadow: 0 0 10px rgba(64, 158, 255, 0.3);
    }

    &.is-focus {
      border-color: #00d4ff;
      box-shadow: 0 0 15px rgba(0, 212, 255, 0.4);
    }
  }

  :deep(.el-input__inner) {
    color: #ffffff;
    background: transparent;
    font-size: 14px;

    &::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }
  }

  :deep(.el-input__prefix) {
    .el-icon {
      color: rgba(255, 255, 255, 0.8);
    }
  }

  :deep(.el-input__suffix) {
    .el-icon {
      color: rgba(255, 255, 255, 0.8);
    }
  }
}

// 登录按钮样式
.login-btn {
  width: 100%;
  height: 45px;
  background: linear-gradient(45deg, #409eff, #00d4ff);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 2px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(64, 158, 255, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(64, 158, 255, 0.5);
  }

  &:active {
    transform: translateY(0);
  }

  :deep(.el-button) {
    background: transparent !important;
    border: none !important;
    color: white !important;
    width: 100%;
    height: 100%;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .simple-form-content {
    max-width: 280px;
    gap: 15px;
    padding: 15px;
  }

  .form-title {
    font-size: 14px;
    margin-bottom: 20px;
  }

  .login-btn {
    height: 40px;
    font-size: 14px;
  }
}

:deep(.anticon) {
  &:hover {
    color: var(--el-color-primary) !important;
  }
}
</style>
