<template>
  <div class="system_add">
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
            <el-form-item label="单位名称" prop="name">
              <el-input
                v-model="addFormData.name"
                placeholder="请输入单位名称"
                maxlength="128"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单位简称" prop="shortName">
              <el-input
                v-model="addFormData.shortName"
                placeholder="请输入单位简称"
                maxlength="128"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="上级单位" prop="parentId">
              <el-input
                v-model="addFormData.parentId"
                placeholder="请输入上级单位"
                maxlength="128"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单位状态" prop="importance">
              <el-select v-model="addFormData.status" placeholder="请选择单位状态" clearable>
                <el-option label="重要" value="important" />
                <el-option label="一般" value="normal" />
                <el-option label="次要" value="minor" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单位类型" prop="unitType">
              <el-select v-model="addFormData.unitType" placeholder="请选择单位类型" clearable>
                <el-option label="重要" value="important" />
                <el-option label="一般" value="normal" />
                <el-option label="次要" value="minor" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单位标签" prop="label">
              <el-input v-model="addFormData.label" placeholder="请输入单位标签" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主管单位" prop="supervisingUnit">
              <el-input v-model="addFormData.supervisingUnit" placeholder="请输入主管单位" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="运营单位" prop="operatingUnit">
              <el-input v-model="addFormData.operatingUnit" placeholder="请输入运营单位" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="行业类别" prop="industryCategory">
              <el-select
                v-model="addFormData.industryCategory"
                placeholder="请选择行业类别"
                clearable
              >
                <el-option label="行业类别1" value="type1" />
                <el-option label="行业类别2" value="type2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="网站URL" prop="websiteUrl">
              <el-input v-model="addFormData.websiteUrl" placeholder="请输入网站URL" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="工作网络" prop="workNetwork">
              <el-select v-model="addFormData.workNetwork" placeholder="请选择工作网络" clearable>
                <el-option label="工作网络1" value="type1" />
                <el-option label="工作网络2" value="type2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单位地址" prop="address">
              <el-input v-model="addFormData.address" placeholder="请输入单位地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="统一社会信用代码"
              prop="unifiedSocialCreditCode"
              class="long-label-item"
            >
              <el-input
                v-model="addFormData.unifiedSocialCreditCode"
                placeholder="请输入统一社会信用代码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="单位描述" prop="description">
              <el-input
                v-model="addFormData.description"
                placeholder="请输入单位描述"
                type="textarea"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import * as UnitApi from '@/api/system/unit'
import { Back } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

// 表单模式：add-新增, view-查看, edit-编辑
const formMode = ref<'add' | 'view' | 'edit'>('add')

// 表单引用
const addFormRef = ref<FormInstance>()
const addFormRules = reactive<FormRules>({
  name: [{ required: true, message: '单位名称不能为空', trigger: 'blur' }]
})

// 添加表单数据
const addFormData = ref({
  name: '',
  shortName: '',
  parentId: '',
  status: '',
  unitType: '',
  label: '',
  supervisingUnit: '',
  operatingUnit: '',
  industryCategory: '',
  websiteUrl: '',
  workNetwork: '',
  address: '',
  unifiedSocialCreditCode: '',
  description: ''
})

/** 初始化 */
const open = async (type: 'add' | 'view' | 'edit', id?: number) => {
  formMode.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    try {
      addFormData.value = await UnitApi.getUnitInfo(id)
    } finally {
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const emit = defineEmits(['cancel-add', 'submit-success'])

/** 关闭表单 */
const cancelAdd = () => {
  emit('cancel-add')
}

/** 提交表单 */
const submitAddForm = async () => {
  // 1. 表单验证
  if (!addFormRef.value) return
  const valid = await addFormRef.value.validate()
  if (!valid) return

  try {
    const data = addFormData.value as unknown as UnitApi.UnitVO
    if (formMode.value === 'add') {
      await UnitApi.createUnit(data)
      message.success(t('common.createSuccess'))
    } else {
      await UnitApi.updateUnit(data)
      message.success(t('common.updateSuccess'))
    }
    resetForm()
    emit('submit-success')
  } finally {
  }
}

/** 重置表单 */
const resetForm = () => {
  addFormData.value = {
    name: '',
    shortName: '',
    parentId: '',
    status: '',
    unitType: '',
    label: '',
    supervisingUnit: '',
    operatingUnit: '',
    industryCategory: '',
    websiteUrl: '',
    workNetwork: '',
    address: '',
    unifiedSocialCreditCode: '',
    description: ''
  }
  addFormRef.value?.resetFields()
}
</script>

<style lang="scss" scoped>
.long-label-item {
  :deep(.el-form-item__label) {
    width: 140px !important;
  }
}
</style>