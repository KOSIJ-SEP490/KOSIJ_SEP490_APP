import React, { useState } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { Pencil } from 'lucide-react-native'
import { useBooking } from '@apps/customer/contexts/BookingContext'
import { useTripById } from '@apps/customer/hooks/useTrip'
import CustomerDetailsModal from '@apps/customer/components/Booking/CustomerDetailsModal'
import { CustomerInfo as CustomerInfoType, CustomerDetails } from '@apps/customer/types/Booking/bookingData.type'

const ageGroupLabels: Record<string, string> = {
  Adult: 'Adult',
  Child: 'Child',
  Infant: 'Infant'
}

const CustomerInfo: React.FC = () => {
  const { bookingData, setBookingData } = useBooking()
  const { numberOfCustomers, customerDetails } = bookingData
  const { trip } = useTripById(bookingData.tripID ?? 0)

  const [selectedAgeGroup, setSelectedAgeGroup] = useState<keyof CustomerDetails | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [modalVisible, setModalVisible] = useState(false)

  if (!trip || !trip.tripPrice) {
    return <Text className='text-center text-gray-500'>Loading trip details...</Text>
  }

  const handleSave = (ageGroup: keyof CustomerDetails, index: number, details: CustomerInfoType) => {
    setBookingData((prev) => {
      const updatedDetails = { ...prev.customerDetails }
      updatedDetails[ageGroup][index] = details
      return { ...prev, customerDetails: updatedDetails }
    })
    setModalVisible(false)
  }

  return (
    <View className='p-4 px-6 mb-3'>
      <Text className='text-base font-semibold mb-2'>Customer Details</Text>

      {trip.tripPrice.map((price) => {
        const ageGroupKey = price.ageGroup.toLowerCase() as keyof typeof numberOfCustomers

        if (numberOfCustomers[ageGroupKey] > 0) {
          return (
            <View key={price.ageGroup} className='mt-4'>
              <Text className='text-base text-blue font-medium'>
                {ageGroupLabels[price.ageGroup] ?? price.ageGroup}{' '}
                <Text className='text-gray-500 text-sm'>({price.description})</Text>
              </Text>

              {Array.from({ length: numberOfCustomers[ageGroupKey] }).map((_, index) => {
                const customer = customerDetails[ageGroupKey]?.[index]

                return (
                  <TouchableOpacity
                    key={`${price.ageGroup}-${index}`}
                    onPress={() => {
                      setSelectedAgeGroup(ageGroupKey)
                      setSelectedIndex(index)
                      setModalVisible(true)
                    }}
                  >
                    <View className='flex-row items-center justify-between border p-4 rounded-lg mt-5 bg-white shadow-sm'>
                      <Text className='text-sm text-gray-500'>
                        {customer?.fullName
                          ? customer.fullName
                          : `${ageGroupLabels[price.ageGroup] ?? price.ageGroup} ${index + 1}`}
                        {price.ageGroup === 'Adult' && index === 0 && (
                          <Text className='text-red-500 text-sm'> (Representative Person)</Text>
                        )}
                        <Text className='text-red-500 text-sm'>{' *'}</Text>
                      </Text>
                      <Pencil size={20} color='#6b7280' />
                    </View>
                  </TouchableOpacity>
                )
              })}
            </View>
          )
        }
        return null
      })}

      {selectedAgeGroup !== null && selectedIndex !== null && (
        <CustomerDetailsModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={(ageGroup, index, details) => handleSave(ageGroup, index, details)}
          ageGroup={selectedAgeGroup}
          index={selectedIndex}
          initialCustomer={customerDetails[selectedAgeGroup]?.[selectedIndex] || {}}
        />
      )}
    </View>
  )
}

export default CustomerInfo
