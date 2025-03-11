import React, { createContext, useContext, useState } from 'react'
import { BookingDataType } from '../types/Booking/bookingData.type'
import { BookingRequestType } from '../types/Booking/bookingRequest.type'

interface BookingContextType {
  bookingData: BookingDataType
  setBookingData: React.Dispatch<React.SetStateAction<BookingDataType>>
  resetBookingData: () => void
  bookingRequest: BookingRequestType
  setBookingRequest: React.Dispatch<React.SetStateAction<BookingRequestType>>
  addKoiVarietyRequest: (id: number) => void
  removeKoiVarietyRequest: (id: number) => void
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialBookingData: BookingDataType = {
    numberOfCustomers: { adult: 0, child: 0, infant: 0 },
    customerDetails: { adult: [], child: [], infant: [] },
    pricing: { totalPrice: 0, adultPrice: 0, childPrice: 0, infantPrice: 0, visaPrice: 0, numberOfVisas: 0 },
    notes: ''
  }

  const [bookingData, setBookingData] = useState<BookingDataType>(initialBookingData)

  const resetBookingData = () => {
    setBookingData(initialBookingData)
  }

  const [bookingRequest, setBookingRequest] = useState<BookingRequestType>({
    numberOfPassengers: 0,
    nights: 0,
    departureDate: new Date().toISOString(),
    departurePoint: '',
    affordableBudget: 0,
    nameContact: '',
    emailContact: '',
    phoneContact: '',
    note: '',
    koiVarietyRequests: []
  })

  const addKoiVarietyRequest = (id: number) => {
    setBookingRequest((prev) => ({
      ...prev,
      koiVarietyRequests: prev.koiVarietyRequests.some((koi) => koi.id === id)
        ? prev.koiVarietyRequests
        : [...prev.koiVarietyRequests, { id }]
    }))
  }

  const removeKoiVarietyRequest = (id: number) => {
    setBookingRequest((prev) => ({
      ...prev,
      koiVarietyRequests: prev.koiVarietyRequests.filter((koi) => koi.id !== id)
    }))
  }

  return (
    <BookingContext.Provider
      value={{
        bookingData,
        setBookingData,
        resetBookingData,
        bookingRequest,
        setBookingRequest,
        addKoiVarietyRequest,
        removeKoiVarietyRequest
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export const useBooking = () => {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  return context
}
