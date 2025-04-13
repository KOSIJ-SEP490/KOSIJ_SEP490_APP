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

export interface AccountType {
  accountId: string
  fullName: string
  role: string
  email: string
  sex: string
  phoneNumber: string
  address: string | null
  urlAvatar: string | null
}
