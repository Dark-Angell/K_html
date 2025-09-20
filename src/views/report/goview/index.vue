<template>
  <ContentWrap :bodyStyle="{ padding: '0px' }" class="!mb-0">
    <iframe :src="src" width="100%" height="800px" frameborder="0"></iframe>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { getAccessToken, getRefreshToken } from '@/utils/auth'

defineOptions({ name: 'GoView' })

const src = ref(
  `${import.meta.env.VITE_GOVIEW_URL}?accessToken=${getAccessToken()}&refreshToken=${getRefreshToken()}`
)
</script>
