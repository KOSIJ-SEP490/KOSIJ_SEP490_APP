export type AccountDto = {
  accountId: string
  email: string
  passwordHash: string
  avatarUrl: string
  role: string
  createdTime: Date
  createdBy: string
  lastUpdatedTime: Date
  lastUpdatedBy: string
  isDeleted: boolean
}
