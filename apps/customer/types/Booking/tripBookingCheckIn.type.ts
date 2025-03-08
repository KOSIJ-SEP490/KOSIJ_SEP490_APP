interface DepositAmountDetails {
  description: string
  depositAmount: number
  visaAmount: number
}

interface TripBookingDetails {
  totalTripBookingAmountPreDiscount: number
  discountPercentage: string
  discountAmount: number
}

export interface TripBookingCheckInType {
  tripBookingId: number
  expiredTime: string
  grandTotalAmount: number
  totalDepositAmount: number
  depositAmountDetails: DepositAmountDetails
  tripBookingAmountAfterDiscount: number
  tripBookingDetails: TripBookingDetails
}
