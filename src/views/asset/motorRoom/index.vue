<template>
  <div>
    <!-- 机房资产列表页面 -->
    <div v-show="!showAddForm && !showDetailForm">
      <el-card shadow="never" class="mb-20px">
        <el-form :model="queryParams" label-width="80px" inline>
          <el-form-item label="机房名称">
            <el-input v-model="queryParams.name" placeholder="请输入机房名称" clearable style="width: 200px;" />
          </el-form-item>
          <el-form-item label="所属单位">
            <el-select
              v-model="queryParams.unit"
              placeholder="请选择所属单位"
              clearable
              style="width: 200px"
            >
              <el-option label="信息技术部" value="IT" />
              <el-option label="人力资源部" value="HR" />
              <el-option label="财务部" value="Finance" />
            </el-select>
          </el-form-item>
          <el-form-item label="机房类型">
            <el-select
              v-model="queryParams.roomType"
              placeholder="请选择机房类型"
              clearable
              style="width: 200px"
            >
              <el-option label="主机房" value="main" />
              <el-option label="分配机房" value="distribution" />
              <el-option label="辅助机房" value="auxiliary" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleQuery"
              ><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button
            >
            <el-button @click="resetQuery"
              ><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button
            >
          </el-form-item>
        </el-form>
      </el-card>

      <el-card shadow="never">
        <template #header>
          <div class="flex justify-between items-center">
            <span>
              <el-button type="primary" plain @click="showAddForm = true">
                <Icon icon="ep:plus" class="mr-5px" /> 新增
              </el-button>
              <el-button size="default" @click="exportJson" type="success" plain>
                <Icon icon="ep:download" /> 导出
              </el-button>
            </span>
            <div>
              <el-button type="primary" @click="openColumnConfig">
                <el-icon style="transform: translateX(-5px)"><Setting /></el-icon>
                表头配置
              </el-button>
            </div>
          </div>
        </template>

        <el-table
          :data="systemList"
          style="width: 100%; margin-top: -10px"
          v-loading="tableLoading"
        >
          <el-table-column
            v-for="column in visibleColumns"
            :key="column.prop"
            :prop="column.prop"
            :label="column.label"
            :min-width="column.minWidth"
            :formatter="column.formatter"
          />
          <el-table-column label="操作" :min-width="150" fixed="right">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="viewSystem(scope.row)">
                查看
              </el-button>
              <el-button link type="primary" size="small" @click="editSystem(scope.row)">
                编辑
              </el-button>
              <el-button link type="danger" size="small" @click="deleteSystem(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="flex justify-end mt-20px">
          <el-pagination
            v-model:current-page="pagination.pageNo"
            v-model:page-size="pagination.pageSize"
            :total="pagination.total"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>

      <!-- 字段配置弹窗 -->
      <el-dialog v-model="columnConfigVisible" title="表头配置" width="800px">
        <el-row :gutter="10">
          <el-col :span="11">
            <div class="font-bold mb-10px">
              <!-- 修改: 显示可选字段中被选中的数量/可选字段总数 -->
              可选字段 ({{ checkedAvailableColumns.length }}/{{
                availableColumns.filter((c) => !tempSelectedColumns.includes(c.prop)).length
              }})
            </div>
            <el-card shadow="never" class="h-400px overflow-auto">
              <div class="mb-10px">
                <el-checkbox
                  :indeterminate="isIndeterminate"
                  v-model="checkAllAvailable"
                  @change="handleCheckAllAvailable"
                >
                  全选
                </el-checkbox>
              </div>
              <el-checkbox-group v-model="checkedAvailableColumns" class="w-full">
                <div
                  v-for="column in availableColumns.filter(
                    (c) => !tempSelectedColumns.includes(c.prop)
                  )"
                  :key="column.prop"
                  class="flex items-center py-5px"
                >
                  <el-checkbox :label="column.prop" class="mr-10px">
                    {{ column.label }}
                  </el-checkbox>
                </div>
              </el-checkbox-group>
            </el-card>
          </el-col>
          <el-col :span="2" class="flex flex-col justify-center items-center">
            <el-button
              size="large"
              type="primary"
              plain
              circle
              class="mb-10px"
              @click="addToSelected"
            >
              <el-icon size="20"><DArrowRight /></el-icon>
            </el-button>
            <el-button
              size="large"
              type="primary"
              plain
              circle
              @click="removeFromSelected"
              style="transform: translateX(-5px)"
            >
              <el-icon size="20"><DArrowLeft /></el-icon>
            </el-button>
          </el-col>
          <el-col :span="11">
            <div class="font-bold mb-10px">
              <!-- 修改: 显示已选字段中被选中的数量/已选字段总数 -->
              已选字段 ({{ checkedSelectedColumns.length }}/{{ tempSelectedColumns.length }})
            </div>
            <el-card shadow="never" class="h-400px overflow-auto">
              <div class="mb-10px">
                <el-checkbox
                  :indeterminate="isIndeterminateSelected"
                  v-model="checkAllSelected"
                  @change="handleCheckAllSelected"
                >
                  全选
                </el-checkbox>
              </div>
              <el-checkbox-group v-model="checkedSelectedColumns" class="w-full">
                <draggable v-model="tempSelectedColumns" item-key="prop" tag="div" class="w-full">
                  <template #item="{ element }">
                    <div class="flex items-center py-5px">
                      <i-ep-rank class="mr-5px text-gray-400 cursor-move" />
                      <el-checkbox :label="element" class="mr-10px">
                        {{ getColumnLabel(element) }}
                      </el-checkbox>
                    </div>
                  </template>
                </draggable>
              </el-checkbox-group>
            </el-card>
          </el-col>
        </el-row>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="columnConfigVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveColumnConfig">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>

    <!-- 添加机房资产表单 (与列表同级) -->
    <div v-show="showAddForm || showDetailForm" class="system_add">
      <el-card shadow="never" class="mb-20px">
        <!-- 顶部操作按钮 -->
        <div style="display: flex; justify-content: space-between; cursor: pointer">
          <span @click="cancelAdd">
            <el-icon style="transform: translate(-4px, 5px)" size="20"><Back /></el-icon>
            <span style="font-size: 0.9rem">返回</span>
          </span>
          <div>
            <el-button v-if="formMode !== 'view'" type="primary" @click="submitAddForm"
              >保存</el-button
            >
            <el-button v-if="formMode !== 'view'" @click="cancelAdd">取消</el-button>
          </div>
        </div>
      </el-card>
      <el-form
        ref="addFormRef"
        :model="addFormData"
        :rules="addFormRules"
        label-width="120px"
        :disabled="formMode === 'view'"
      >
        <!-- 基础信息区块 -->
        <el-card shadow="never" class="mb-20px">
          <template #header>
            <div class="font-bold">基础信息</div>
          </template>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="机房名称" prop="name">
                <el-input
                  v-model="addFormData.name"
                  placeholder="请输入机房名称"
                  maxlength="128"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所属单位" prop="unit">
                <el-select v-model="addFormData.unit" placeholder="请选择所属单位" clearable>
                  <el-option label="信息技术部" value="IT" />
                  <el-option label="人力资源部" value="HR" />
                  <el-option label="财务部" value="Finance" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="机房类型" prop="roomType">
                <el-select v-model="addFormData.roomType" placeholder="请选择机房类型" clearable>
                  <el-option label="主机房" value="main" />
                  <el-option label="分配机房" value="distribution" />
                  <el-option label="辅助机房" value="auxiliary" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="上级机房" prop="parentRoom">
                <el-select v-model="addFormData.parentRoom" placeholder="请选择上级机房" clearable>
                  <el-option label="A机房" value="roomA" />
                  <el-option label="B机房" value="roomB" />
                  <el-option label="C机房" value="roomC" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否关机" prop="isCritical">
                <el-select v-model="addFormData.isCritical" placeholder="请选择是否关机" clearable>
                  <el-option label="是" value="1" />
                  <el-option label="否" value="0" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="机房标签" prop="roomTags">
                <el-input v-model="addFormData.roomTags" placeholder="请输入机房标签" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所在区域" prop="area">
                <el-select v-model="addFormData.area" placeholder="请选择所在区域" clearable>
                  <el-option label="北京" value="beijing" />
                  <el-option label="上海" value="shanghai" />
                  <el-option label="广州" value="guangzhou" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="详细地址" prop="address">
                <el-input
                  v-model="addFormData.address"
                  placeholder="请输入详细地址"
                  maxlength="128"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="经度" prop="longitude">
                <el-input
                  v-model="addFormData.longitude"
                  placeholder="请输入经度"
                  maxlength="128"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="纬度" prop="latitude">
                <el-input
                  v-model="addFormData.latitude"
                  placeholder="请输入纬度"
                  maxlength="128"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="重要性" prop="importance">
                <el-select v-model="addFormData.importance" placeholder="请选择重要性" clearable>
                  <el-option label="重要" value="important" />
                  <el-option label="一般" value="normal" />
                  <el-option label="次要" value="minor" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="机房描述" prop="description">
                <el-input
                  v-model="addFormData.description"
                  type="textarea"
                  placeholder="请输入机房描述"
                  maxlength="128"
                  show-word-limit
                  :rows="5"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, nextTick } from 'vue'
import draggable from 'vuedraggable'
import type { FormInstance, FormRules } from 'element-plus'
import { Setting, DArrowRight, DArrowLeft, Back, Plus } from '@element-plus/icons-vue'
// 控制是否显示添加表单
const showAddForm = ref(false)
// 控制是否显示详情表单（查看/编辑）
const showDetailForm = ref(false)
// 表单模式：add-新增, view-查看, edit-编辑
const formMode = ref<'add' | 'view' | 'edit'>('add')

// 查询参数
const queryParams = reactive({
  name: '',
  unit: '',
  roomType: ''
})

// 分页参数
const pagination = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0
})

// 机房列表数据
const systemList = ref<any[]>([
  {
    id: 1,
    name: '主数据中心机房',
    unit: '信息技术部',
    roomType: '主机房',
    isCritical: '是',
    area: '北京',
    updateTime: '2023-10-15 14:30:00'
  },
  {
    id: 2,
    name: '备份机房',
    unit: '信息技术部',
    roomType: '辅助机房',
    isCritical: '否',
    area: '上海',
    updateTime: '2023-10-18 09:15:00'
  }
])

// 默认显示字段
const defaultVisibleColumns = ['name', 'unit', 'roomType', 'isCritical', 'area', 'updateTime']

// 当前显示的字段
const visibleColumns = ref<any[]>([])

// 所有可选字段
const availableColumns = ref([
  { prop: 'name', label: '机房名称', minWidth: '120px' },
  { prop: 'unit', label: '所属单位', minWidth: '120px' },
  { prop: 'roomType', label: '机房类型', minWidth: '100px' },
  { prop: 'parentRoom', label: '上级机房', minWidth: '100px' },
  { prop: 'isCritical', label: '是否关机', minWidth: '100px' },
  { prop: 'roomTags', label: '机房标签', minWidth: '120px' },
  { prop: 'area', label: '所在区域', minWidth: '100px' },
  { prop: 'address', label: '详细地址', minWidth: '150px' },
  { prop: 'longitude', label: '经度', minWidth: '100px' },
  { prop: 'latitude', label: '纬度', minWidth: '100px' },
  { prop: 'importance', label: '重要性', minWidth: '100px' },
  { prop: 'description', label: '机房描述', minWidth: '200px' },
  { prop: 'updateTime', label: '最近一次更新时间', minWidth: '180px' }
])

// 字段配置弹窗显示状态
const columnConfigVisible = ref(false)

// 临时选中的字段（用于配置弹窗）
const tempSelectedColumns = ref<string[]>([])

// 添加表单引用
const addFormRef = ref<FormInstance>()

// 添加表单数据
const addFormData = reactive({
  name: '', // 机房名称
  unit: '', // 所属单位
  roomType: '', // 机房类型
  parentRoom: '', // 上级机房
  isCritical: '', // 是否关机
  roomTags: '', // 机房标签
  area: '', // 所在区域
  address: '', // 详细地址
  longitude: '', // 经度
  latitude: '', // 纬度
  importance: '', // 重要性
  description: '' // 机房描述
})

// 添加表单验证规则
const addFormRules: FormRules = {
  name: [{ required: true, message: '请输入机房名称', trigger: 'blur' }],
  unit: [{ required: true, message: '请选择所属单位', trigger: 'blur' }]
}

// 控制字段配置的全选状态
const checkAllAvailable = ref(false)
const checkedAvailableColumns = ref<string[]>([])
const isIndeterminate = ref(false)

const checkAllSelected = ref(false)
const checkedSelectedColumns = ref<string[]>([])
const isIndeterminateSelected = ref(false)

// 修改: 添加监听勾选状态变化
watch(checkedAvailableColumns, (newVal) => {
  const availableCount = availableColumns.value.filter(
    (c) => !tempSelectedColumns.value.includes(c.prop)
  ).length
  checkAllAvailable.value = newVal.length === availableCount && availableCount > 0
  isIndeterminate.value = newVal.length > 0 && newVal.length < availableCount
})

watch(checkedSelectedColumns, (newVal) => {
  const selectedCount = tempSelectedColumns.value.length
  checkAllSelected.value = newVal.length === selectedCount && selectedCount > 0
  isIndeterminateSelected.value = newVal.length > 0 && newVal.length < selectedCount
})

// 获取字段标签
const getColumnLabel = (prop: string) => {
  const column = availableColumns.value.find((col) => col.prop === prop)
  return column ? column.label : prop
}

// 修改: 添加全选/取消全选功能
const handleCheckAllAvailable = (val: boolean) => {
  checkedAvailableColumns.value = val
    ? availableColumns.value
        .filter((c) => !tempSelectedColumns.value.includes(c.prop))
        .map((c) => c.prop)
    : []
  isIndeterminate.value = false
}

const handleCheckAllSelected = (val: boolean) => {
  checkedSelectedColumns.value = val ? [...tempSelectedColumns.value] : []
  isIndeterminateSelected.value = false
}

// 修改: 更新添加到已选字段的方法
const addToSelected = () => {
  if (checkedAvailableColumns.value.length > 0) {
    tempSelectedColumns.value.push(...checkedAvailableColumns.value)
    checkedAvailableColumns.value = []
    checkAllAvailable.value = false
    isIndeterminate.value = false
  }
}

// 修改: 更新从已选字段移除的方法
const removeFromSelected = () => {
  if (checkedSelectedColumns.value.length > 0) {
    tempSelectedColumns.value = tempSelectedColumns.value.filter(
      (prop) => !checkedSelectedColumns.value.includes(prop)
    )
    checkedSelectedColumns.value = []
    checkAllSelected.value = false
    isIndeterminateSelected.value = false
  }
}

// 修改: 打开字段配置弹窗时初始化勾选状态
const openColumnConfig = () => {
  tempSelectedColumns.value = visibleColumns.value.map((col) => col.prop)
  columnConfigVisible.value = true
  // 清空勾选状态
  checkedAvailableColumns.value = []
  checkedSelectedColumns.value = []
  checkAllAvailable.value = false
  checkAllSelected.value = false
  isIndeterminate.value = false
  isIndeterminateSelected.value = false

  // 初始化全选状态
  nextTick(() => {
    const availableCount = availableColumns.value.filter(
      (c) => !tempSelectedColumns.value.includes(c.prop)
    ).length
    const selectedCount = tempSelectedColumns.value.length

    checkAllAvailable.value =
      checkedAvailableColumns.value.length === availableCount && availableCount > 0
    checkAllSelected.value =
      checkedSelectedColumns.value.length === selectedCount && selectedCount > 0
    isIndeterminate.value =
      checkedAvailableColumns.value.length > 0 &&
      checkedAvailableColumns.value.length < availableCount
    isIndeterminateSelected.value =
      checkedSelectedColumns.value.length > 0 && checkedSelectedColumns.value.length < selectedCount
  })
}

// 保存字段配置
const saveColumnConfig = () => {
  visibleColumns.value = availableColumns.value.filter((col) =>
    tempSelectedColumns.value.includes(col.prop)
  )
  columnConfigVisible.value = false
}

// 添加表格loading状态
const tableLoading = ref(false)
// 添加导出loading状态
const exportLoading = ref(false)

// 查询
const handleQuery = () => {
  pagination.pageNo = 1
  // 这里应该调用API获取数据
  console.log('查询参数:', queryParams)
  tableLoading.value = true
  setTimeout(() => {
    tableLoading.value = false
  }, 500) // 模拟请求延迟
}

// 重置查询
const resetQuery = () => {
  queryParams.name = ''
  queryParams.unit = ''
  queryParams.roomType = ''
  handleQuery()
}

// 查看机房资产
const viewSystem = (row: any) => {
  formMode.value = 'view'
  showDetailForm.value = true
  Object.assign(addFormData, row)
}

// 编辑机房资产
const editSystem = (row: any) => {
  formMode.value = 'edit'
  showDetailForm.value = true
  Object.assign(addFormData, row)
}

// 取消添加/编辑/查看
const cancelAdd = () => {
  showAddForm.value = false
  showDetailForm.value = false
  formMode.value = 'add'
  resetAddForm()
}

// 重置添加表单
const resetAddForm = () => {
  Object.keys(addFormData).forEach((key) => {
    addFormData[key as keyof typeof addFormData] = ''
  })

  // 清除表单验证
  if (addFormRef.value) {
    addFormRef.value.clearValidate()
  }
}

// 提交添加表单
const submitAddForm = async () => {
  if (!addFormRef.value) return

  await addFormRef.value.validate((valid) => {
    if (valid) {
      // 添加确认框防止误操作
      ElMessageBox.confirm('确定要保存该机房资产信息吗？', '确认保存', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 这里应该调用API保存数据
          console.log('提交数据:', addFormData)

          // 模拟添加成功
          ElMessage.success('保存成功')
          showAddForm.value = false
          showDetailForm.value = false
          formMode.value = 'add'
          resetAddForm()

          // 重新加载数据
          handleQuery()
        })
        .catch(() => {})
    }
  })
}

// 删除机房资产
const deleteSystem = (row: any) => {
  ElMessageBox.confirm('确定要删除该机房资产吗？', '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      tableLoading.value = true
      // 模拟删除操作
      setTimeout(() => {
        ElMessage.success('删除成功')
        // 实际项目中应调用API删除数据，并重新加载列表
        const index = systemList.value.findIndex((item) => item.id === row.id)
        if (index > -1) {
          systemList.value.splice(index, 1)
        }
        tableLoading.value = false
      }, 500)
    })
    .catch(() => {
      // 用户取消删除
    })
}

// 分页相关
const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  pagination.pageNo = 1
  // 重新获取数据
  tableLoading.value = true
  setTimeout(() => {
    tableLoading.value = false
  }, 500) // 模拟请求延迟
}

const handleCurrentChange = (val: number) => {
  pagination.pageNo = val
  // 重新获取数据
  tableLoading.value = true
  setTimeout(() => {
    tableLoading.value = false
  }, 500) // 模拟请求延迟
}

// 初始化显示字段
const initVisibleColumns = () => {
  let columnsToShow: string[] = []

  columnsToShow = defaultVisibleColumns

  visibleColumns.value = availableColumns.value.filter((col) => columnsToShow.includes(col.prop))
}

// 组件挂载时初始化
onMounted(() => {
  initVisibleColumns()
})
</script>

<style scoped>
:deep(.el-checkbox-group) .el-checkbox {
  width: 100%;
  display: flex;
  align-items: center;
  margin-right: 0;
  margin-left: 0;
}

:deep(.el-checkbox-group) .el-checkbox__label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 添加滚动条样式 */
:deep(.h-400px) {
  max-height: 400px;
  overflow-y: auto;
}

/* 自定义滚动条样式，与 Element Plus 保持一致 */
:deep(.h-400px::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
}

:deep(.h-400px::-webkit-scrollbar-thumb) {
  border-radius: 4px;
  background-color: #c1c1c1;
}

:deep(.h-400px::-webkit-scrollbar-track) {
  border-radius: 4px;
  background-color: #f5f5f5;
}

:deep(.h-400px::-webkit-scrollbar-thumb:hover) {
  background-color: #a8a8a8;
}

/* 居中按钮容器 */
:deep(.flex-col.justify-center) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>