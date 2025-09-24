<template>
  <el-row :gutter="20">
    <div class="view-switch-container">
      <div class="view-switch">
        <div
          class="view-item"
          :class="{ active: activeView === 'tree' }"
          @click="switchView('tree')"
        >
          树形视图
        </div>
        <div
          class="view-item"
          :class="{ active: activeView === 'list' }"
          @click="switchView('list')"
        >
          列表视图
        </div>
      </div>
    </div>

    <template v-if="activeView === 'tree'">
      <TreeView />
    </template>

    <template v-if="activeView === 'list'">
      <listView />
    </template>
  </el-row>
</template>

<script lang="ts" setup>
import * as UserApi from '@/api/system/user'
import TreeView from './treeView.vue' // 注释：树形视图
import listView from './listView.vue' // 注释：列表视图

defineOptions({ name: 'AssetUnit' })

/** 切换视图 */
const activeView = ref('tree') // 默认树形视图
const switchView = (viewType) => {
  activeView.value = viewType
}

</script>

<style scoped lang="scss">
.view-switch-container {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-bottom: 20px;
}
.view-switch {
  display: flex;
  border: 1px solid #dcdfe6;
}

.view-item {
  padding: 8px 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  flex: 1;
}

.view-item:hover {
  border-color: var(--el-color-primary);
}

.view-item.active {
  background-color: var(--el-color-primary);
  color: white;
}
</style>
