export type Orders = {
  orderId: number
  fullName: string
  phoneNumber: string
  deliveryAddress: string
  paidAmount: number
  remaining: number
  totalAmount: number
  note: string
  expectedDeliveryDate: Date
  orderStatus: string
  farmId: number
  farmName: string
  tripBookingId: number
  createdTime: Date
  deliveryStaffId: number
  deliveryStaffName: string
  cancellationReason: string
  confirmedUrl: string
  orderDetails?: OrderDetail[]
}

export interface OrderDetail {
  id: number
  variety: string
  koiType: string
  quantity: number
  length: number
  weight: number
  koiPrice: number
  deposit?: number
  note: string
  orderDetailImages: OrderDetailImages[]
}

export interface OrderDetailImages {
  id: number
  imageUrl: string
}
