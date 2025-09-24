<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="80px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="单位名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入单位名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位简称" prop="shortName">
            <el-input v-model="formData.shortName" placeholder="请输入单位简称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上级单位" prop="parentId">
            <el-input v-model="formData.parentId" placeholder="请输入上级单位" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位状态">
            <el-select v-model="formData.status" placeholder="请选择">
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位类型">
            <el-select v-model="formData.unitType" placeholder="请选择">
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位标签" prop="label">
            <el-input v-model="formData.label" placeholder="请输入单位标签" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主管单位" prop="supervisingUnit">
            <el-input v-model="formData.supervisingUnit" placeholder="请输入主管单位" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="运营单位" prop="operatingUnit">
            <el-input v-model="formData.operatingUnit" placeholder="请输入运营单位" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="行业类别">
            <el-select v-model="formData.industryCategory" placeholder="请选择">
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="网站URL" prop="websiteUrl">
            <el-input v-model="formData.websiteUrl" placeholder="请输入网站URL" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工作网络">
            <el-select v-model="formData.workNetwork" placeholder="请选择">
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位地址" prop="address">
            <el-input v-model="formData.address" placeholder="请输入单位地址" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="统一社会信用代码"
            prop="unifiedSocialCreditCode"
            class="long-label-item"
          >
            <el-input
              v-model="formData.unifiedSocialCreditCode"
              placeholder="请输入统一社会信用代码"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="单位描述" prop="description">
            <el-input v-model="formData.description" placeholder="请输入单位描述" type="textarea" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { CommonStatusEnum } from '@/utils/constants'
import { defaultProps, handleTree } from '@/utils/tree'
import * as UserApi from '@/api/system/user'
import * as UnitApi from '@/api/system/unit'

import { FormRules } from 'element-plus'

defineOptions({ name: 'SystemUserForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
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
const formRules = reactive<FormRules>({
  username: [{ required: true, message: '单位名称不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref
const deptList = ref<Tree[]>([]) // 树形结构

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await UnitApi.getUnitInfo(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as UnitApi.UnitVO
    console.log('参数', data)
    if (formType.value === 'create') {
      await UnitApi.createUnit(data)
      message.success(t('common.createSuccess'))
    } else {
      await UnitApi.updateUnit(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
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
  formRef.value?.resetFields()
}
</script>

<style lang="scss" scoped>
.long-label-item {
  :deep(.el-form-item__label) {
    width: 140px !important;
  }
}
</style>
