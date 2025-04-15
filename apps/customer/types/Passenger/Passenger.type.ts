export interface PassengerDetail {
  id: number
  fullName: string
  dateOfBirth: string
  sex: string
  nationality: string
  email: string
  phoneNumber: string
  passport: string
  ageGroup: string
  isRepresentative: boolean
  hasVisa: boolean
  isCheckIn: boolean
  isCheckOut: boolean
  isAttendance: boolean | null
}
