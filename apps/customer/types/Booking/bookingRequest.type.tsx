interface KoiVarietyRequest {
  id: number
}

export interface BookingRequestType {
  numberOfPassengers: number
  nights: number
  departureDate: string
  departurePoint: string
  affordableBudget: number
  nameContact: string
  emailContact: string
  phoneContact: string
  note: string
  koiVarietyRequests: KoiVarietyRequest[]
}
