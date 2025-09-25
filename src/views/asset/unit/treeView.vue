<template>
  <el-row :gutter="20" v-show="!showAddForm">
    <!-- 注释：左侧部门树 -->
    <el-col :span="4" :xs="24">
      <ContentWrap class="h-1/1">
        <DeptTree @node-click="handleDeptNodeClick" />
      </ContentWrap>
    </el-col>

    <el-col :span="20" :xs="24">
      <!-- 注释：基础信息 -->
      <ContentWrap>
        <el-form
          class="-mb-15px"
          :model="unitInfo"
          ref="queryFormRef"
          :inline="true"
          label-width="100px"
        >
          <el-row>
            <el-col :span="20" :xs="24">
              <el-row>
                <el-col :span="12" :xs="24">
                  <el-form-item label="单位名称：" prop="username">
                    {{ unitInfo.name }}
                  </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                  <el-form-item label="单位简称：" prop="mobile">
                    {{ unitInfo.shortName }}
                  </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                  <el-form-item label="上级单位：" prop="mobile">
                    {{ unitInfo.parentId }}
                  </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                  <el-form-item label="单位类型：" prop="mobile">
                    {{ unitInfo.unitType }}
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>

            <el-col :span="4" :xs="24">
              <el-form-item>
                <el-button @click="handleDetail('view', unitInfo.id)">查看单位详情</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </ContentWrap>

      <!-- 注释：列表 -->
      <ContentWrap>
        <el-tabs model-value="unit">
          <el-tab-pane label="设备" name="unit">
            <UnitList />
          </el-tab-pane>
          <el-tab-pane label="系统" name="SystemList">
            <SystemList />
          </el-tab-pane>
          <el-tab-pane label="网络" name="NetworkList">
            <NetworkList />
          </el-tab-pane>
          <el-tab-pane label="机房" name="MotorRoomList">
            <MotorRoomList />
          </el-tab-pane>
        </el-tabs>
      </ContentWrap>
    </el-col>
  </el-row>

  <ListDetail ref="formRef" v-show="showAddForm" @cancel-add="handleCancelAdd" />
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import * as UserApi from '@/api/system/user'
import * as UnitApi from '@/api/system/unit'

import DeptTree from './components/DeptTree.vue'
import UnitList from './components/unitList.vue' // 注释：设备
import SystemList from './components/systemList.vue'
import NetworkList from './components/networkList.vue'
import MotorRoomList from './components/motorRoomList.vue'

// 控制是否显示添加表单
const showAddForm = ref(false)
import ListDetail from './components/listDetail.vue'

defineOptions({ name: 'AssetUnitTreeView' })

const { wsCache } = useCache()
const queryFormRef = ref() // 搜索的表单
const unitInfo = ref({
  id: '',
  name: '',
  parentId: '',
  shortName: '',
  unitType: ''
})


/** 详情操作 */
const formRef = ref()
const emit = defineEmits(['form-status-change'])
const handleDetail = (type, id) => {
  formRef.value.open(type, id)
  showAddForm.value = true
  emit('form-status-change', true)
}

/** 关闭表单 */
const handleCancelAdd = () => {
  showAddForm.value = false
  emit('form-status-change', false)
}

/** 获取用户信息 */
const getUserInfo = () => {
  return wsCache.get(CACHE_KEY.USER) || null
}

/** 获取单位信息 */
const getUnitInfo = async (id?: string | number) => {
  if (!id) {
    const userInfo = getUserInfo()
    id = userInfo?.user.id
  }

  try {
    const data = await UnitApi.getUnitInfo(id as number)
    unitInfo.value = data
  } catch (error) {
    console.log('获取信息失败', error)
  }
}

/** 点击单位切换单位信息 */
const handleDeptNodeClick = (row: any) => {
  getUnitInfo(row.id)
}

/** 初始化 */
onMounted(() => {
  getUnitInfo()
})
</script>

<style scoped lang="scss">
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
  border-color: #409eff;
}

.view-item.active {
  background-color: red;
  color: white;
  border-color: red;
}
</style>
