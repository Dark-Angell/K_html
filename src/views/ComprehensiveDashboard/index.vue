<template>
  <div class="dashboard-container">
    <div class="iframe-wrapper" ref="wrapperRef">
      <iframe
        :src="iframeSrc"
        frameborder="0"
        scrolling="no"
        @load="onIframeLoad"
        :style="iframeStyle"
      ></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'

defineOptions({ name: 'ComprehensiveDashboard' })

const iframeSrc = ref('/dashboards/综合态势.html')
const loading = ref(true)
const wrapperRef = ref<HTMLElement>()
const scale = ref(1)

// 大屏设计尺寸
const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080

const onIframeLoad = () => {
  loading.value = false
  nextTick(() => {
    calculateScale()
  })
}

const calculateScale = () => {
  if (!wrapperRef.value) return

  const wrapper = wrapperRef.value
  const containerWidth = wrapper.clientWidth
  const containerHeight = wrapper.clientHeight

  // 计算缩放比例，保持宽高比
  const scaleX = containerWidth / DESIGN_WIDTH
  const scaleY = containerHeight / DESIGN_HEIGHT
  scale.value = Math.min(scaleX, scaleY)
}

const iframeStyle = computed(() => ({
  width: `${DESIGN_WIDTH}px`,
  height: `${DESIGN_HEIGHT}px`,
  transform: `scale(${scale.value})`,
  transformOrigin: 'top left'
}))

onMounted(() => {
  nextTick(() => {
    calculateScale()
  })

  // 监听窗口大小变化
  window.addEventListener('resize', calculateScale)
})

// 组件卸载时移除事件监听
import { onUnmounted } from 'vue'
onUnmounted(() => {
  window.removeEventListener('resize', calculateScale)
})
</script>

<style scoped>
.dashboard-container {
  width: 100%;
  height: calc(100vh - 84px);
  overflow: hidden;
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.iframe-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

iframe {
  border: none;
  background-color: transparent;
  position: absolute;
  top: 0;
  left: 0;
}
</style>