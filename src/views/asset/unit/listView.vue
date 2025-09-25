<template>
  <el-row :gutter="20" v-show="!showAddForm">

    <!-- 列表视图 -->
    <el-col :span="24" :xs="24">
      <!-- 搜索 -->
      <ContentWrap>
        <el-form
          class="-mb-15px"
          :model="queryParams"
          ref="queryFormRef"
          :inline="true"
          label-width="68px"
        >
          <el-form-item label="单位名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入单位名称"
              clearable
              @keyup.enter="handleQuery"
              class="!w-240px"
            />
          </el-form-item>
          <el-form-item label="上级单位" prop="parentId">
            <el-input
              v-model="queryParams.parentId"
              placeholder="请输入上级单位"
              clearable
              @keyup.enter="handleQuery"
              class="!w-240px"
            />
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input
              v-model="queryParams.address"
              placeholder="请输入地址"
              clearable
              @keyup.enter="handleQuery"
              class="!w-240px"
            />
          </el-form-item>
          <el-form-item>
            <el-button @click="handleQuery"><Icon icon="ep:search" />搜索</el-button>
            <el-button @click="resetQuery"><Icon icon="ep:refresh" />重置</el-button>
            <el-button
              type="primary"
              plain
              @click="addUnitForm('add')"
              v-hasPermi="['system:user:create']"
            >
              <Icon icon="ep:plus" /> 新增
            </el-button>
            <el-button
              type="danger"
              plain
              :disabled="checkedIds.length === 0"
              @click="handleDeleteBatch"
              v-hasPermi="['system:user:delete']"
            >
              <Icon icon="ep:delete" />批量删除
            </el-button>
          </el-form-item>
        </el-form>
      </ContentWrap>


      <ContentWrap>
        <el-table v-loading="loading" :data="list" @selection-change="handleRowCheckboxChange">
          <el-table-column type="selection" width="55" />
          <el-table-column
            label="单位名称"
            align="center"
            prop="name"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="单位简称"
            align="center"
            prop="shortName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="设备数量"
            align="center"
            key="id"
            prop="id"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="系统数量"
            align="center"
            key="id"
            prop="id"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="机房数量"
            align="center"
            key="id"
            prop="id"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="操作" align="center" width="180">
            <template #default="scope">
              <div class="flex items-center justify-center">
                <el-button
                  type="primary"
                  link
                  @click="viewUnitForm('view', scope.row.id)"
                >
                  <Icon icon="ep:view" />详情
                </el-button>

                <el-button
                  type="primary"
                  link
                  @click="editUnitForm('edit', scope.row.id)"
                  v-hasPermi="['system:user:update']"
                >
                  <Icon icon="ep:edit" />修改
                </el-button>

                <el-button
                  type="primary"
                  link
                  @click="handleDelete(scope.row.id)"
                  v-hasPermi="['system:user:delete']"
                >
                  <Icon icon="ep:delete" />删除
                </el-button>

              </div>
            </template>
          </el-table-column>
        </el-table>
        <Pagination
          :total="total"
          v-model:page="queryParams.pageNo"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
        />
      </ContentWrap>
    </el-col>
  </el-row>

  <ListDetail 
    ref="formRef" 
    v-show="showAddForm" 
    @cancel-add="handleCancelAdd"
    @submit-success="handleSubmitSuccess" 
  />

</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { checkPermi } from '@/utils/permission'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { CommonStatusEnum } from '@/utils/constants'
import ListDetail from './components/listDetail.vue'
import * as UnitApi from '@/api/system/unit'

defineOptions({ name: 'AssetUnitListView' })

const showAddForm = ref(false) // 控制是否显示添加表单
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: '',
  parentId: '',
  address: '',
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await UnitApi.getUnitPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields()
  handleQuery()
}

/** 添加 */
const formRef = ref()
const emit = defineEmits(['form-status-change'])
const addUnitForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
  showAddForm.value = true
  emit('form-status-change', true)
}

/** 编辑 */
const editUnitForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
  showAddForm.value = true
  emit('form-status-change', true)
}

/** 查看 */
const viewUnitForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
  showAddForm.value = true
  emit('form-status-change', true)
}

const handleCancelAdd = () => {
  showAddForm.value = false
  emit('form-status-change', false)
}

/** 处理提交成功 */
const handleSubmitSuccess = async () => {
  showAddForm.value = false
  emit('form-status-change', false)
  await getList()
}


/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await UnitApi.deleteUnit(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 批量删除按钮操作 */
const checkedIds = ref<number[]>([])
const handleRowCheckboxChange = (rows: UnitApi.UnitVO[]) => {
  checkedIds.value = rows.map((row) => row.id)
}

const handleDeleteBatch = async () => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起批量删除
    await UnitApi.deleteUnitList(checkedIds.value)
    checkedIds.value = []
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 初始化 */
onMounted(() => {
  getList()
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
