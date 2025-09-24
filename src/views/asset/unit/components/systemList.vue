<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="系统名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="系统类型">
        <el-select v-model="queryParams.sex" placeholder="请选择" class="!w-240px">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_USER_SEX)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="handleQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="list">
      <el-table-column
        label="系统名称"
        align="center"
        prop="username"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="系统类型"
        align="center"
        prop="nickname"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="系统版本"
        align="center"
        key="deptName"
        prop="deptName"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="业务类型" align="center" prop="mobile" width="120" />
      <el-table-column label="系统标签" align="center" prop="mobile" width="120" />
      <el-table-column label="操作" align="center" width="160">
        <template #default="scope">
          <div class="flex items-center justify-center">
            <el-button
              type="primary"
              link
              @click="handleDetail('update', scope.row.id)"
              v-hasPermi="['system:user:update']"
            >
              <Icon icon="ep:edit" />详情
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>
  <!-- 表单弹窗：添加/修改 -->
  <DetailForm ref="formRef" @success="getList" />
</template>
<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import { isEmpty } from '@/utils/is'
import { Demo03Course, Demo03StudentApi } from '@/api/infra/demo/demo03/erp'
import DetailForm from './detail/detail.vue'


const router = useRouter() // 路由
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  studentId?: number // 学生编号（主表的关联字段）
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  studentId: undefined as unknown
})

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.studentId,
  (val: number) => {
    if (!val) {
      return
    }
    queryParams.studentId = val
    handleQuery()
  },
  { immediate: true, deep: true }
)

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    // const data = await Demo03StudentApi.getDemo03CoursePage(queryParams)
    // data.list = [
    //   {
    //     username: '222',
    //     age: 2222
    //   }
    // ]
    // list.value = data.list
    // total.value = data.total

    list.value = [
      {
        username: '222',
        age: 2222
      }
    ]

  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 详情操作 */
const handleDetail = (row) => {
  router.push({
    name: 'UnitDetail',
    query: {
      id: row.id
    }
  })
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await Demo03StudentApi.deleteDemo03Course(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 批量删除学生课程 */
const handleDeleteBatch = async () => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    await Demo03StudentApi.deleteDemo03CourseList(checkedIds.value)
    checkedIds.value = []
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

const checkedIds = ref<number[]>([])
const handleRowCheckboxChange = (records: Demo03Course[]) => {
  checkedIds.value = records.map((item) => item.id)
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>
