export interface TripCheckOutType {
  tripBookingId: number
  paymentTime: string
  paymentMethod: string
  senderName: string
  totalAmount: number
  depositAmount: number
  remainingAmount: number
}
