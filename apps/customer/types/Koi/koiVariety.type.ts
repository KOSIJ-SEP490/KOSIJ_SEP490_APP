import { FarmType } from '../Farm/farm.type'

export interface KoiVarietyType {
  id: number
  varietyName: string
  description: string
  imageUrl: string
  farms: FarmType[]
}
