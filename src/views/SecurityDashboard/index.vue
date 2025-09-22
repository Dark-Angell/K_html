<template>
  <div class="dashboard-container">
    <iframe
      :src="iframeSrc"
      width="100%"
      height="100%"
      frameborder="0"
      scrolling="auto"
      @load="onIframeLoad"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

defineOptions({ name: 'SecurityDashboard' })

const iframeSrc = ref('/dashboards/安全策略态势.html')
const loading = ref(true)

const onIframeLoad = () => {
  loading.value = false
}

onMounted(() => {
  // 可以在这里添加其他初始化逻辑
})
</script>

<style scoped>
.dashboard-container {
  width: 100%;
  height: calc(100vh - 84px);
  overflow: hidden;
}

iframe {
  border: none;
}
</style>