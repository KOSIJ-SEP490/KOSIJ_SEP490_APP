/* eslint-disable @typescript-eslint/no-explicit-any */
export interface KoiVariety {
  id: number
  koiName: string
}

export interface TripRequestResponseType {
  id: number
  numberOfPassengers: number
  days: number
  nights: number
  departureDate: string
  returnDate: string
  departurePoint: string
  affordableBudget: number
  nameContact: string
  phoneContact: string
  emailContact: string
  note: string
  modifiedNote: string | null
  feedback: string | null
  salesStaffId: number | null
  salesStaffName: string | null
  salesStaffPhone: string | null
  requestStatus: string
  tripBookingId: number | null
  tripRequestVariety: KoiVariety[]
  passengersDetailsResponses: any[]
  customizedTripResponse: any | null
  quotationResponse: any | null
}
