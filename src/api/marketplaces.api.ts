import api from "./axios"

export type Marketplace = {
  id: number
  marketplace_id?: number
  name: string
  url: string
  description: string
  status: number | boolean
  created_at?: string
  updated_at?: string
  [key: string]: any
}

export const createMarketplaceApi = (payload: Partial<Marketplace>) => {
  return api.post("/entity/marketplace", payload)
}

export const updateMarketplaceApi = (id: number, payload: Partial<Marketplace>) => {
  return api.post(`/entity/marketplace`, { ...payload, marketplace_id: id })
}

export const toggleMarketplaceStatusApi = (id: number) => {
  return api.patch(`/entity/marketplace/${id}/status`)
}

export const deleteMarketplaceApi = (id: number) => {
  return api.delete(`/entity/marketplace/${id}`)
}
