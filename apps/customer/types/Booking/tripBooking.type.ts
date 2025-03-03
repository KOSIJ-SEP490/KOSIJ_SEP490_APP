import { CustomerInfo } from './bookingData.type'

export interface TripBookingType {
  id: number
  tourImgUrl: string
  tourName: string
  tripType: string
  departureDate: string
  expiredTime: string
  tripBookingStatus: string
}

export interface TripBookingRequestType {
  tripId: number
  note: string
  passengerDetailsRequests: CustomerInfo[]
}
