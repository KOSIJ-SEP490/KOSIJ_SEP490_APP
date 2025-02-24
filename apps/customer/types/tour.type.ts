export interface TourType {
  id: number
  tourName: string
  standardPrice: number
  numberOfTrips: number
  tripsList: Trip[]
  tourPrices: TourPrice[]
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
}

export interface Trip {
  id: number
  departureDate: string
}

export interface TourPrice {
  ageGroup: string
  description: string
  price: number
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
}

export interface Policy {
  description: string
}
