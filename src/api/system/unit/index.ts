import request from '@/config/axios'

export interface UnitVO {
  id: number
}

// 查询用户管理列表
export const getUnitInfo = (id: number) => {
  console.log('id', id)
  return request.get({ url: '/system/user/get?id=' + id })
}