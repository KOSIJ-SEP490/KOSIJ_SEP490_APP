import { FarmType } from './farm.type'

export interface KoiVarietyType {
  id: number
  varietyName: string
  description: string
  imageUrl: string
  farms: FarmType[]
}
