import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import { useBooking } from '@apps/customer/contexts/BookingContext'
import { TripPrice } from '@apps/customer/types/Trip/trip.type'
import { debounce } from 'lodash'

interface NumberOfCustomerProps {
  tripPrices: TripPrice[]
}

const NumberOfCustomer: React.FC<NumberOfCustomerProps> = ({ tripPrices }) => {
  const { bookingData, setBookingData } = useBooking()

  const initialCustomerCount = tripPrices.reduce(
    (acc, { ageGroup }) => {
      acc[ageGroup.toLowerCase() as 'adult' | 'child' | 'infant'] =
        bookingData.numberOfCustomers[ageGroup.toLowerCase() as 'adult' | 'child' | 'infant'] || 0
      return acc
    },
    {} as Record<'adult' | 'child' | 'infant', number>
  )

  const [customerCount, setCustomerCount] = useState(initialCustomerCount)

  const calculateTotalPrice = () => {
    let totalAdultPrice = 0
    let totalChildPrice = 0
    let totalInfantPrice = 0
    let totalPrice = 0

    tripPrices.forEach(({ ageGroup, price }) => {
      const groupLower = ageGroup.toLowerCase() as 'adult' | 'child' | 'infant'
      const quantity = customerCount[groupLower] || 0
      const groupTotalPrice = price * quantity

      if (ageGroup === 'Adult') totalAdultPrice = groupTotalPrice
      if (ageGroup === 'Child') totalChildPrice = groupTotalPrice
      if (ageGroup === 'Infant') totalInfantPrice = groupTotalPrice

      totalPrice += groupTotalPrice
    })

    setBookingData((prevData) => ({
      ...prevData,
      pricing: {
        ...prevData.pricing,
        totalPrice,
        adultPrice: totalAdultPrice,
        childPrice: totalChildPrice,
        infantPrice: totalInfantPrice
      }
    }))
  }

  const handleIncrease = useCallback(
    debounce((ageGroup: 'adult' | 'child' | 'infant') => {
      setCustomerCount((prev) => {
        const updatedCount = { ...prev, [ageGroup]: prev[ageGroup] + 1 }
        setBookingData((prevData) => ({
          ...prevData,
          numberOfCustomers: updatedCount
        }))
        calculateTotalPrice()
        return updatedCount
      })
    }, 200),
    []
  )

  const handleDecrease = (ageGroup: 'adult' | 'child' | 'infant') => {
    setCustomerCount((prev) => {
      const updatedCount = { ...prev, [ageGroup]: Math.max(0, prev[ageGroup] - 1) }
      setBookingData((prevData) => ({
        ...prevData,
        numberOfCustomers: updatedCount
      }))
      calculateTotalPrice()
      return updatedCount
    })
  }

  useEffect(() => {
    setBookingData((prevData) => ({
      ...prevData,
      numberOfCustomers: customerCount
    }))
  }, [customerCount, setBookingData])

  useEffect(() => {
    calculateTotalPrice()
  }, [customerCount, tripPrices])

  return (
    <View className='my-10 mb-14'>
      <Text className='text-base font-semibold ml-2'>Number of Customers</Text>
      <View className='p-4 rounded-lg border border-gray-300 mt-3'>
        {tripPrices.map(({ ageGroup, price }) => {
          const ageGroupLower = ageGroup.toLowerCase() as 'adult' | 'child' | 'infant'
          const quantity = customerCount[ageGroupLower] || 0
          const totalPrice = price * quantity
          const priceColor = quantity === 0 ? 'text-gray-400' : 'text-red-500'

          return (
            <View key={ageGroup} className='flex-row justify-between items-center py-2'>
              <Text className='w-1/5 text-sm font-semibold text-left'>{ageGroup}</Text>
              <Text className={`w-2/5 text-sm font-medium text-center ${priceColor}`}>
                {quantity === 0 ? price.toLocaleString() : totalPrice.toLocaleString()} VND
              </Text>

              <View className='w-2/5 flex-row items-center justify-center'>
                <TouchableOpacity
                  onPress={() => handleDecrease(ageGroupLower)}
                  className='px-3 rounded-full border border-red-500'
                >
                  <Text className='text-red-500 text-sm'>-</Text>
                </TouchableOpacity>

                <TextInput
                  value={quantity.toString()}
                  editable={false}
                  className='mx-2 p-2 text-center border border-gray-400 rounded-md w-12'
                />

                <TouchableOpacity
                  onPress={() => handleIncrease(ageGroupLower)}
                  className='px-3 rounded-full border border-blue'
                >
                  <Text className='text-blue text-sm'>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        })}
      </View>
    </View>
  )
}

export default NumberOfCustomer
