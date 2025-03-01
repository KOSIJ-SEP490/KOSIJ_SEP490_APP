export interface TripType {
  id: number
  tripType: string
  departureDate: string
  returnDate: string
  maxGroupSize: number
  minGroupSize: number
  availableSlot: string
  daysRemaining: number
  pricingRate: number
  tripPrice: TripPrice[]
  tripStatus: string
  tourResponse: TourResponse
  salesStaffId: string
  consultingStaffId: string
}

export interface TripPrice {
  ageGroup: string
  description: string
  price: number
}

export interface TourResponse {
  tourName: string
  numberOfTrips: number
  tourDetails: TourDetail[]
  visaFee: number
  imageUrl: string
  departurePoint: string
  destinationPoint: string
  days: number
  nights: number
  tourPriceInclude: string
  tourPriceNotInclude: string
  registrationDaysBefore: number
  registrationConditions: string
  averageRating: number
  totalFarmVisit: number
  tourStatus: string
  cancellationPolicy: Policy[]
  paymentPolicy: Policy[]
  farms: Farm[]
}

export interface TourDetail {
  day: number
  itineraryName: string
  itineraryDetails: ItineraryDetail[]
}

export interface ItineraryDetail {
  time: string
  description: string
  farmId: number | null
  name: string | null
}

export interface Policy {
  description: string
}

export interface Farm {
  id: number
}
