<template>
  <div>
    <!-- 系统资产列表页面 -->
    <div v-show="!showAddForm && !showDetailForm">
      <el-card shadow="never" class="mb-20px">
        <el-form :model="queryParams" label-width="80px" inline>
          <el-form-item label="设备IP">
            <el-input v-model="queryParams.name" placeholder="请输入设备IP" clearable />
          </el-form-item>
          <el-form-item label="设备名称">
            <el-input v-model="queryParams.name" placeholder="请输入设备名称" clearable />
          </el-form-item>
          <el-form-item label="所属单位">
            <el-select
              v-model="queryParams.businessType"
              placeholder="请选择所属单位"
              clearable
              style="width: 200px"
            >
              <el-option label="1" value="1" />
              <el-option label="2" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="重要性">
            <el-select
              v-model="queryParams.importance"
              placeholder="请选择重要性"
              clearable
              style="width: 200px"
            >
              <el-option label="重要" value="important" />
              <el-option label="一般" value="normal" />
              <el-option label="次要" value="minor" />
            </el-select>
          </el-form-item>
          <el-form-item label="设备类型">
            <el-select
              v-model="queryParams.importance"
              placeholder="请选择设备类型"
              clearable
              style="width: 200px"
            >
              <el-option label="1" value="important" />
              <el-option label="2" value="normal" />
              <el-option label="3" value="minor" />
            </el-select>
          </el-form-item>
          <el-form-item label="设备标签">
            <el-select
              v-model="queryParams.importance"
              placeholder="请选择设备标签"
              clearable
              style="width: 200px"
            >
              <el-option label="1" value="important" />
              <el-option label="2" value="normal" />
              <el-option label="3" value="minor" />
            </el-select>
          </el-form-item>
          <el-form-item label="所属节点">
            <el-select
              v-model="queryParams.importance"
              placeholder="请选择所属节点"
              clearable
              style="width: 200px"
            >
              <el-option label="1" value="important" />
              <el-option label="2" value="normal" />
              <el-option label="3" value="minor" />
            </el-select>
          </el-form-item>
          <el-form-item label="最近一次更新时间">
            <el-date-picker
              v-model="queryParams.importance"
              value-format="YYYY-MM-DD HH:mm:ss"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
              class="!w-240px"
            />
          </el-form-item>
          <el-form-item label="网络节点出口">
            <el-select
              v-model="queryParams.importance"
              placeholder="请选择网络节点出口"
              clearable
              style="width: 200px"
            >
              <el-option label="1" value="important" />
              <el-option label="2" value="normal" />
              <el-option label="3" value="minor" />
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
              <el-button
                type="danger"
                plain
                :disabled="checkedIds.length === 0"
                @click="handleDeleteBatch"
              >
                <Icon icon="ep:delete" class="mr-5px" /> 批量导入
              </el-button>
              <el-button
                type="danger"
                plain
                :disabled="checkedIds.length === 0"
                @click="handleDeleteBatch"
              >
                <Icon icon="ep:delete" class="mr-5px" /> 批量删除
              </el-button>
              <el-button
                type="danger"
                plain
                :disabled="checkedIds.length === 0"
                @click="handleDeleteBatch"
              >
                <Icon icon="ep:delete" class="mr-5px" /> 批量标签
              </el-button>
            </span>
            <div>
              <el-button size="default" @click="exportJson" type="success" plain>
                <Icon icon="ep:download" /> 导出
              </el-button>
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
          @selection-change="handleRowCheckboxChange"
        >
          <el-table-column type="selection" width="55" />
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

    <!-- 添加系统资产表单 (与列表同级) -->
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
              <el-form-item label="系统名称" prop="name">
                <el-input
                  v-model="addFormData.name"
                  placeholder="请输入系统名称"
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
            <el-col :span="8">
              <el-form-item label="业务类型" prop="businessType">
                <el-select
                  v-model="addFormData.businessType"
                  placeholder="请选择业务类型"
                  clearable
                >
                  <el-option label="业务类型1" value="type1" />
                  <el-option label="业务类型2" value="type2" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所属单位" prop="unit">
                <el-input v-model="addFormData.unit" placeholder="请输入所属单位" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="系统类型" prop="systemType">
                <el-select v-model="addFormData.systemType" placeholder="请选择系统类型" clearable>
                  <el-option label="业务系统" value="business" />
                  <el-option label="管理系统" value="management" />
                  <el-option label="支撑系统" value="support" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="系统版本" prop="version">
                <el-input
                  v-model="addFormData.version"
                  placeholder="请输入系统版本"
                  maxlength="128"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="上线时间" prop="onlineTime">
                <el-date-picker
                  v-model="addFormData.onlineTime"
                  type="date"
                  placeholder="请选择上线时间"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="服务对象" prop="serviceObject">
                <el-select
                  v-model="addFormData.serviceObject"
                  placeholder="请选择服务对象"
                  clearable
                >
                  <el-option label="内部员工" value="internal" />
                  <el-option label="外部客户" value="external" />
                  <el-option label="公众用户" value="public" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="用户规模" prop="userScale">
                <el-select v-model="addFormData.userScale" placeholder="请选择用户规模" clearable>
                  <el-option label="1-100人" value="small" />
                  <el-option label="100-1000人" value="medium" />
                  <el-option label="1000人以上" value="large" />
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
              <el-form-item label="是否网站类系统" prop="isWebsite">
                <el-select
                  v-model="addFormData.isWebsite"
                  placeholder="请选择是否网站类系统"
                  clearable
                >
                  <el-option label="是" value="1" />
                  <el-option label="否" value="0" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否互联网暴露" prop="isExposed">
                <el-select
                  v-model="addFormData.isExposed"
                  placeholder="请选择是否互联网暴露"
                  clearable
                >
                  <el-option label="是" value="1" />
                  <el-option label="否" value="0" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="等保级别" prop="securityLevel">
                <el-select
                  v-model="addFormData.securityLevel"
                  placeholder="请选择等保级别"
                  clearable
                >
                  <el-option label="一级" value="1" />
                  <el-option label="二级" value="2" />
                  <el-option label="三级" value="3" />
                  <el-option label="四级" value="4" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="系统标签" prop="tags">
                <el-input
                  v-model="addFormData.tags"
                  placeholder="请输入系统标签，不超过128字符"
                  maxlength="128"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="IP端口列表" prop="ipPorts">
                <el-input
                  v-model="addFormData.ipPorts"
                  placeholder="请输入IP端口列表，不超过128字符"
                  maxlength="128"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="系统截图" prop="screenshot">
                <UploadImg />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="系统描述" prop="description">
                <el-input
                  v-model="addFormData.description"
                  type="textarea"
                  placeholder="请输入系统描述，不超过128字符"
                  maxlength="128"
                  show-word-limit
                  :rows="3"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>

        <!-- 位置信息区块 -->
        <el-card shadow="never">
          <template #header>
            <div class="font-bold">位置信息</div>
          </template>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="机房位置" prop="roomLocation">
                <el-input v-model="addFormData.roomLocation" placeholder="请输入机房位置" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="机柜位置" prop="rackLocation">
                <el-input v-model="addFormData.rackLocation" placeholder="请输入机柜位置" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="U位信息" prop="uPosition">
                <el-input v-model="addFormData.uPosition" placeholder="请输入U位信息" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="网络区域" prop="networkArea">
                <el-select v-model="addFormData.networkArea" placeholder="请选择网络区域" clearable>
                  <el-option label="内网" value="internal" />
                  <el-option label="外网" value="external" />
                  <el-option label="DMZ" value="dmz" />
                </el-select>
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
import { UploadImg } from '@/components/UploadFile'
// 控制是否显示添加表单
const showAddForm = ref(false)
// 控制是否显示详情表单（查看/编辑）
const showDetailForm = ref(false)
// 表单模式：add-新增, view-查看, edit-编辑
const formMode = ref<'add' | 'view' | 'edit'>('add')

// 查询参数
const queryParams = reactive({
  name: '',
  businessType: '',
  importance: ''
})

// 分页参数
const pagination = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0
})

// 系统列表数据
const systemList = ref<any[]>([
  {
    id: 1,
    name: '人力资源系统',
    businessType: '人事管理',
    unit: '人力资源部',
    systemType: '业务系统',
    version: 'v2.1.0',
    tags: ['核心', '人事'],
    updateTime: '2023-10-15 14:30:00'
  },
  {
    id: 2,
    name: '财务管理系统',
    businessType: '财务管理',
    unit: '财务部',
    systemType: '业务系统',
    version: 'v3.0.5',
    tags: ['核心', '财务'],
    updateTime: '2023-10-18 09:15:00'
  }
])

// 默认显示字段
const defaultVisibleColumns = [
  'name',
  'importance',
  'unit',
  'systemType',
  'version',
  'tags',
  'updateTime'
]

// 当前显示的字段
const visibleColumns = ref<any[]>([])

// 所有可选字段
const availableColumns = ref([
  { prop: 'name', label: '设备名称', minWidth: '120px' },
  { prop: 'importance', label: '重要性', minWidth: '100px' },
  { prop: 'unit', label: '所属单位', minWidth: '120px' },
  { prop: 'systemType', label: '设备IP', minWidth: '120px' },
  { prop: 'version', label: '设备类型', minWidth: '100px' },
  { prop: 'version', label: '操作系统名称', minWidth: '100px' },
  {
    prop: 'tags',
    label: '设备标签',
    formatter: (row: any) => row.tags.join(', '),
    minWidth: '150px'
  },
  { prop: 'updateTime', label: '最近一次更新时间', minWidth: '180px' },
  { prop: 'importance', label: '数据来源', minWidth: '100px' },
  { prop: 'importance', label: '设备厂商', minWidth: '100px' },
  { prop: 'importance', label: '设备描述', minWidth: '100px' },
  { prop: 'importance', label: '启用状态', minWidth: '100px' },
  { prop: 'onlineTime', label: '网卡信息-网卡名称', minWidth: '120px' },
  { prop: 'serviceObject', label: '网卡信息-IPV4', minWidth: '120px' },
  { prop: 'userScale', label: '网卡信息-IPV6', minWidth: '120px' },
  { prop: 'isCritical', label: '网卡信息-IP类型', minWidth: '100px' },
  { prop: 'isWebsite', label: '设备编号', minWidth: '150px' },
  { prop: 'status', label: '设备状态', minWidth: '150px' }
])

// 字段配置弹窗显示状态
const columnConfigVisible = ref(false)

// 临时选中的字段（用于配置弹窗）
const tempSelectedColumns = ref<string[]>([])

// 添加表单引用
const addFormRef = ref<FormInstance>()

// 添加表单数据
const addFormData = reactive({
  name: '', // 系统名称
  importance: '', // 重要性
  businessType: '', // 业务类型
  unit: '', // 所属单位
  systemType: '', // 系统类型
  version: '', // 系统版本
  onlineTime: '', // 上线时间
  serviceObject: '', // 服务对象
  userScale: '', // 用户规模
  isCritical: '', // 是否关机
  isWebsite: '', // 是否网站类系统
  isExposed: '', // 是否互联网暴露
  securityLevel: '', // 等保级别
  tags: '', // 系统标签
  ipPorts: '', // IP端口列表
  screenshot: '', // 系统截图
  description: '', // 系统描述
  roomLocation: '', // 机房位置
  rackLocation: '', // 机柜位置
  uPosition: '', // U位信息
  networkArea: '' // 网络区域
})

// 添加表单验证规则
const addFormRules: FormRules = {
  name: [{ required: true, message: '请输入系统名称', trigger: 'blur' }],
  unit: [{ required: true, message: '请输入所属单位', trigger: 'blur' }]
}

// 查看/编辑弹窗相关
const detailDialogVisible = ref(false)
const dialogMode = ref<'view' | 'edit'>('view')
const dialogTitle = ref('查看系统资产')
const detailFormRef = ref<FormInstance>()

// 查看/编辑表单数据
const detailFormData = reactive({
  id: 0,
  name: '', // 系统名称
  importance: '', // 重要性
  businessType: '', // 业务类型
  unit: '', // 所属单位
  systemType: '', // 系统类型
  version: '', // 系统版本
  onlineTime: '', // 上线时间
  serviceObject: '', // 服务对象
  userScale: '', // 用户规模
  isCritical: '', // 是否关机
  isWebsite: '', // 是否网站类系统
  isExposed: '', // 是否互联网暴露
  securityLevel: '', // 等保级别
  tags: '', // 系统标签
  ipPorts: '', // IP端口列表
  screenshot: '', // 系统截图
  description: '', // 系统描述
  roomLocation: '', // 机房位置
  rackLocation: '', // 机柜位置
  uPosition: '', // U位信息
  networkArea: '' // 网络区域
})

// 查看/编辑表单验证规则
const detailFormRules: FormRules = {
  name: [{ required: true, message: '请输入系统名称', trigger: 'blur' }],
  unit: [{ required: true, message: '请输入所属单位', trigger: 'blur' }]
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
  queryParams.businessType = ''
  queryParams.importance = '' // 添加重置重要性筛选条件
  handleQuery()
}

// 查看系统资产
const viewSystem = (row: any) => {
  formMode.value = 'view'
  showDetailForm.value = true
  Object.assign(addFormData, row)
}

// 编辑系统资产
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
      ElMessageBox.confirm('确定要保存该系统资产信息吗？', '确认保存', {
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

// 删除系统资产
const deleteSystem = (row: any) => {
  ElMessageBox.confirm('确定要删除该系统资产吗？', '确认删除', {
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

/** 批量删除按钮操作 */
const checkedIds = ref<number[]>([])
const handleRowCheckboxChange = (rows) => {
  checkedIds.value = rows.map((row) => row.id)
}

const handleDeleteBatch = async () => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起批量删除
    await FileApi.deleteFileList(checkedIds.value)
    checkedIds.value = []
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
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