export interface NotificationType {
  id: number
  message: string
  markAsRead: boolean
  refId: number
  referenceType: string
  actionType: string
  createdTime: string
}
