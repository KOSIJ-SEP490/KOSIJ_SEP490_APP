import React, { createContext, useContext, useState } from 'react'
import { BookingDataType } from '../types/Booking/bookingData.type'

interface BookingContextType {
  bookingData: BookingDataType
  setBookingData: React.Dispatch<React.SetStateAction<BookingDataType>>
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookingData, setBookingData] = useState<BookingDataType>({
    numberOfCustomers: { adult: 0, child: 0, infant: 0 },
    customerDetails: { adult: [], child: [], infant: [] },
    pricing: { totalPrice: 0, adultPrice: 0, childPrice: 0, infantPrice: 0, visaPrice: 0, numberOfVisas: 0 },
    notes: ''
  })

  return <BookingContext.Provider value={{ bookingData, setBookingData }}>{children}</BookingContext.Provider>
}

export const useBooking = () => {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  return context
}
