export interface TripRequestDetailsType {
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
  note?: string
  modifiedNote?: string | null
  feedback?: string | null
  salesStaffId?: number | null
  salesStaffName?: string | null
  salesStaffEmail?: string | null
  salesStaffPhone?: string | null
  requestStatus: string
  tripBookingId?: number | null
  tripRequestVariety: TripRequestVariety[]
  passengersDetailsResponses: PassengerDetail[]
  customizedTripResponse?: CustomizedTrip | null
  quotationResponse?: QuotationResponse | null
}

export interface TripRequestVariety {
  id: number
  koiName: string
  description: string
  imageUrl: string
}

interface PassengerDetail {
  id: number
  fullName: string
  dateOfBirth: string
  sex: string
  nationality: string
  email?: string | null
  phoneNumber?: string | null
  passport: string
  ageGroup: string
  isRepresentative: boolean
  hasVisa: boolean
  cancellationReason?: string | null
}

interface CustomizedTrip {
  id: number
  tourName: string
  imageUrl: string
  nights: number
  days: number
  departurePoint: string
  destinationPoint: string
  departureDate: string
  returnDate: string
  tourPriceInclude: string
  tourPriceNotInclude: string
  registrationDaysBefore: number
  registrationConditions: string
  tourDetailsResponse: TourDetail[]
  standardPrice: number
  visaFee: number
  pricingRate: number
  tripPriceResponse: TripPrice[]
  tourPaymentResponse: Policy[]
  tourCancellationResponse: Policy[]
  tourPromotionResponse: Policy[]
  tourPriceResponse: Policy[]
}

interface TourDetail {
  id: number
  day: number
  itineraryName: string
  itineraryDetails: ItineraryDetail[]
}

interface ItineraryDetail {
  id: number
  time: string
  description: string
  farmId?: number | null
  name?: string | null
}

interface TripPrice {
  ageGroup: string
  description: string
  price: number
}

interface Policy {
  id: number
  description: string
}

interface QuotationResponse {
  quotationDetail: QuotationDetail[]
  totalAmountPreDiscount: number
  discountPercentage: string
  discountAmount: number
  totalAmountAfterDiscount: number
  visaDetail: VisaDetail
  grandTotalAmount: number
}

interface QuotationDetail {
  ageGroup: string
  quantity: number
  unitPrice: number
  totalAmount: number
}

interface VisaDetail {
  quantity: number
  unitPrice: number
}
