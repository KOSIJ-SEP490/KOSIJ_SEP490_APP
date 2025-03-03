export interface CustomerInfo {
  ageGroup: string
  fullName: string
  dateOfBirth: {
    year: number
    month: number
    day: number
    dayOfWeek: 'Sunday'
  }
  sex: string
  nationality: string
  email: string
  phoneNumber: string
  passport?: string
  isRepresentative: boolean
}

export interface NumberOfCustomers {
  adult: number
  child: number
  infant: number
}

export interface CustomerDetails {
  adult: CustomerInfo[]
  child: CustomerInfo[]
  infant: CustomerInfo[]
}

export interface Pricing {
  totalPrice: number
  adultPrice: number
  childPrice: number
  infantPrice: number
  visaPrice: number
  numberOfVisas: number
}

export interface BookingDataType {
  tourID?: number
  tripID?: number
  numberOfCustomers: NumberOfCustomers
  customerDetails: CustomerDetails
  pricing: Pricing
  notes: string
}
