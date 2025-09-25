<template>
  <p class="mb-10px">共 {{UnitCount}} 个单位</p>
  <div class="head-container">
    <el-input v-model="deptName" class="mb-20px" clearable placeholder="请输入">
      <template #prefix>
        <Icon icon="ep:search" />
      </template>
    </el-input>
  </div>
  <div class="head-container">
    <div class="tree-container">
      <el-tree
        ref="treeRef"
        :data="deptList"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        :props="defaultProps"
        default-expand-all
        highlight-current
        node-key="id"
        @node-click="handleNodeClick"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElTree } from 'element-plus'
import * as UnitApi from '@/api/system/unit'
import { defaultProps, handleTree3 } from '@/utils/tree'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'

defineOptions({ name: 'SystemUserDeptTree' })

const deptName = ref('')
const deptList = ref<Tree[]>([]) // 树形结构
const treeRef = ref<InstanceType<typeof ElTree>>()
const { wsCache } = useCache()
const UnitCount = ref(0) // 单位总数

/** 获得单位树 */
const getTree = async () => {
  const res = await UnitApi.getUnitTree()
  deptList.value = []
  deptList.value.push(...handleTree3(res))
}

/** 基于名字过滤 */
const filterNode = (name: string, data: Tree) => {
  if (!name) return true
  return data.name.includes(name)
}

/** 处理单位被点击 */
let currentNode: any = {}
const handleNodeClick = async (row: { [key: string]: any }, treeNode: any) => {
  // 判断选中状态
  if (currentNode && currentNode.name === row.name) {
    treeNode.checked = !treeNode.checked
  } else {
    treeNode.checked = true
  }
  if (treeNode.checked) {
    // 选中
    currentNode = row
    emits('node-click', row)
  } else {
    // 取消选中
    treeRef.value!.setCurrentKey(undefined)
    emits('node-click', undefined)
    currentNode = null
  }
}
const emits = defineEmits(['node-click'])

/** 监听deptName */
watch(deptName, (val) => {
  treeRef.value!.filter(val)
})

/** 获取单位总数 */
const getUnitCount = async () => {
  try {
    const data = await UnitApi.getUnitCount()
    UnitCount.value = data
  } catch {
    console.log('error')
  }
}

/** 初始化 */
onMounted(async () => {
  await getTree()
  await getUnitCount()
})
</script>

<style lang="scss" scoped>
.tree-container {
  width: 100%;
  height: 60vh;
  max-height: 800px; 
  overflow-x: auto;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--el-fill-color-lighter);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--el-border-color-darker);
    border-radius: 3px;
    transition: background 0.3s;
    
    &:hover {
      background: var(--el-color-primary);
    }
  }
  
  /* Firefox 滚动条样式 */
  scrollbar-width: thin;
  scrollbar-color: var(--el-border-color-darker) var(--el-fill-color-lighter);
  
  :deep(.el-tree) {
    min-width: 180px;
    width: auto;
    display: inline-block;
    text-align: center;
  }
  
  :deep(.el-tree-node__content) {
    min-width: max-content;
  }
}
</style>
