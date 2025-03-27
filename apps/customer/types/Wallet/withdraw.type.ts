export interface WithDrawResponseType {
  id: number
  walletId: number
  amount: number
  bankName: string
  bankNumber: string
  holderName: string
  withdrawStatus: string
  deniedReason: string | null
}
