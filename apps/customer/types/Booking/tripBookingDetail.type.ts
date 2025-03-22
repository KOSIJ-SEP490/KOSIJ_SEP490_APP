export interface TripBookingDetailType {
  expiredTime: string
  tourName: string
  imageUrl: string
  bookingTime: string
  customerInfo: CustomerInfo
  tripId: number
  tripType: string
  departureDate: string
  returnDate: string
  tripBookingStatus: string
  additionalInformation: AdditionalInformation
  consultStaffInformation: ConsultStaffInformation
  totalTripBookingAmount: number
  bookingDetails: BookingDetails
  farmIds: FarmId[]
  tourDetails: TourDetail[]
  tourPriceInclude: string
  tourPriceNotInclude: string
  registrationCondition: string
  cancellationPolicy: Policy[]
  paymentPolicy: Policy[]
  childrenPricePolicy: Policy[]
  promotionPolicy: Policy[]
  outboundTicketUrl?: string | null
  inboundTicketUrl?: string | null
  paidAmount?: number | null
  remaining?: number | null
  totalAmount: number
  cancellationReason?: string | null
}

export interface CustomerInfo {
  customerName: string
  phoneNumber: string
  email: string
}

export interface AdditionalInformation {
  airline: string
  hotelService: string
  departurePoint: string
  destinationPoint: string
  days: number
  nights: number
  totalFarmToVisit: number
}

export interface ConsultStaffInformation {
  staffName: string
  phoneNumber: string
  email: string
}

export interface BookingDetails {
  passengerDetails: PassengerDetail[]
  visa: Visa
}

export interface PassengerDetail {
  ageGroup: string
  description: string
  unitPrice: number
  quantity: number
}

export interface Visa {
  quantity: number
  unitPrice: number
}

export interface FarmId {
  id: number
}

export interface TourDetail {
  day: number
  itineraryName: string
  itineraryDetails: ItineraryDetail[]
}

export interface ItineraryDetail {
  time: string
  description: string
  farmId?: number | null
  name?: string | null
}

export interface Policy {
  description: string
}
