<template>
  <el-row :gutter="20">

    <!-- 树形视图 -->
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
          :model="queryParams"
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
                <el-button @click="handleDetail">查看详情</el-button>
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

</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import download from '@/utils/download'
import { CommonStatusEnum } from '@/utils/constants'
import * as UserApi from '@/api/system/user'
import * as UnitApi from '@/api/system/unit'


import DeptTree from './components/DeptTree.vue'
import UnitList from './components/unitList.vue' // 注释：设备
import SystemList from './components/systemList.vue'
import NetworkList from './components/networkList.vue'
import MotorRoomList from './components/motorRoomList.vue'

defineOptions({ name: 'AssetUnitTreeView' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const router = useRouter() // 路由
const { wsCache } = useCache()

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  username: undefined,
  mobile: undefined,
  status: undefined,
  deptId: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const unitInfo = ref({
  name: '',
  parentId: '',
  shortName: '',
  unitType: '',
})


/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await UserApi.getUserPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 详情操作 */
const handleDetail = () => {
  router.push({
    name: 'UnitDetail',
  })
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
  } catch (error){
    console.log('获取信息失败', error)
  }
}

/** 点击单位切换单位信息 */
const handleDeptNodeClick = (row) => {
  getUnitInfo(row.id)
}

/** 初始化 */
onMounted(() => {
  getList()
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
