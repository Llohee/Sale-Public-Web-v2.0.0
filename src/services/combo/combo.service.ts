import axiosClient from '@/libs/axiosClient'
import type { GetAllCombosResponse, GetComboByIdResponse } from './combo.schema'

const comboApi = {
  getAllCombos(): Promise<GetAllCombosResponse> {
    const url = '/combos'
    return axiosClient.get(url)
  },
  getComboById(id: string): Promise<GetComboByIdResponse> {
    const url = `/combos/${id}`
    return axiosClient.get(url)
  },
}

export default comboApi
