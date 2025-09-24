import request from '@/config/axios'

export interface UnitVO {
  id: number,
  name: string,
  shortName: string,
  unitType: string
}

/** 获取单位总数 */
export const getUnitCount = async () => {
  return await request.get({ url: '/system/unit/count'})
}

/** 获取单位信息 */
export const getUnitInfo = async (id: number) => {
  return await request.get({ url: '/system/unit/get?id=' + id })
}

/** 获取单位树 */
export const getUnitTree = async (): Promise<UnitVO[]> => {
  return await request.get({ url: '/system/unit/tree' })
}

/** 新增单位 */
export const createUnit = async (data) => {
  return await request.post({ url: '/system/unit/create' , data})
}

/** 修改单位 */
export const updateUnit = async (data: UnitVO) => {
  return await request.put({ url: '/system/unit/update' , data})
}

/** 获取单位列表 */
export const getUnitPage = async (params: PageParam) => {
  return await request.get({ url: '/system/unit/page' , params})
}

/** 删除单位 */
export const deleteUnit = async (id: number) => {
  return await request.delete({ url: '/system/unit/delete?id=' + id})
}

/** 批量删除单位 */
export const deleteUnitList = async (ids: number[]) => {
  return await request.delete({ url: '/system/unit/delete-list' , params: { ids: ids.join(',') } })
}