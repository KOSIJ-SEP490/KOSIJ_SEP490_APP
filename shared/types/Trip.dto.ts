import { TourType } from '@apps/customer/types/Tour/tour.type'
import { StaffDto } from './Staff.dto'

export type TripDto = {
  tripId: number
  tripType: string
  departureDate: Date
  returnDate: Date
  groupSize: number
  pricingRate: number
  tripStatus: string
  createdTime: Date
  createdBy: string
  lastUpdatedTime: Date
  lastUpdatedBy: string
  isDeleted: boolean
  tourId: TourType
  salesId: StaffDto[]
  consultantId: StaffDto[]
}
