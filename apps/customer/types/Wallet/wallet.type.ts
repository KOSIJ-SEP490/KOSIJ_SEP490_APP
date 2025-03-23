export interface WalletType {
  balance: number
  currency: string
  isLocked: boolean
}

export interface PaymentData {
  orderId: number
  paymentTime: string
  paymentMethod: string
  senderName: string
  totalAmount: number
  depositAmount: number
  remainingAmount: number
}
