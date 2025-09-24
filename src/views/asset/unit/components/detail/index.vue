<template>
  <!-- 列表 -->
  <ContentWrap>
    <div class="detail-page">
      <div class="detail-header">
        <h2>设备详情</h2>
      </div>

      <div class="detail-content">
        <el-form :model="queryParams" label-width="120px" class="detail-form" disabled>
          <el-card shadow="never" class="form-section">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="单位名称：" class="detail-item">
                  <span class="detail-value">{{ queryParams.name }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备名称：" class="detail-item">
                  <span class="detail-value">{{ queryParams.teacher }}</span>
                </el-form-item>
              </el-col>
              
            </el-row>
          </el-card>
        </el-form>
      </div>
    </div>
  </ContentWrap>
</template>
<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import { isEmpty } from '@/utils/is'

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
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  // if (!props.studentId) {
  //   message.error('请选择一个学生')
  //   return
  // }
  // formRef.value.open(type, id, props.studentId)

  router.push({
    name: 'BpmProcessInstanceDetail',
    query: {
      id: row.processInstanceId
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

<style scoped lang="scss">
.detail-page {
  padding: 20px;
  min-height: 100vh;
}
.detail-header {
  margin-bottom: 20px;
  text-align: center;
}
.detail-header h2 {
  color: #303133;
  margin: 0;
}
.detail-content {
  max-width: 1000px;
  margin: 0 auto;
}
.detail-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.form-section {
  border: none;
}
.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}
.detail-item {
  margin-bottom: 20px;
}
.detail-value {
  color: #606266;
  font-size: 14px;
}
</style>
