import { AccountDto } from './Account.dto'

export type StaffDto = {
  staffId: number
  fullName: string
  sex: string
  phoneNumber: string
  area: string
  certificateUrl: string
  createdTime: Date
  createdBy: string
  lastUpdatedTime: Date
  lastUpdatedBy: string
  isDeleted: boolean
  accountId: AccountDto
}
