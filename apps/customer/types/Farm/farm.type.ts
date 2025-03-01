export interface VarietyType {
  id: number
  varietyName: string
  description: string
  imageUrl: string
}

export interface FarmType {
  id: number
  farmName: string
  description: string
  breederId: number
  breederName: string
  location: string
  imageUrl: string
  openingHours: string
  farmPhoneNumber: string
  farmEmail: string
  averageRating: number
  status: boolean
  varieties: VarietyType[]
}
