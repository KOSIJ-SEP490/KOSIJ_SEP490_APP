import { PassengerDetail } from '@apps/customer/types/Passenger/Passenger.type'
import React from 'react'
import { View, Text } from 'react-native'

interface PassengerDetailsCardProps {
  passenger: PassengerDetail
  index: number
}

const PassengerDetailsCard: React.FC<PassengerDetailsCardProps> = ({ passenger, index }) => {
  return (
    <View className='mb-6 mt-5 bg-white rounded-lg shadow-sm overflow-hidden border-gray-400'>
      <View className='py-2 px-4'>
        <Text className='text-blue font-bold text-base'>Passenger {index + 1}</Text>
      </View>

      <View className='divide-y divide-gray-100 border-gray-400 border rounded-lg'>
        <View className='p-4'>
          <Text className='text-sm font-semibold text-gray-700 mb-2'>PERSONAL INFORMATION</Text>
          <View className='space-y-3'>
            <View className='flex-row'>
              <Text className='w-32 text-gray-600 font-medium'>Full Name</Text>
              <Text className='flex-1 text-gray-800'>{passenger.fullName}</Text>
            </View>
            <View className='flex-row'>
              <Text className='w-32 text-gray-600 font-medium'>Date of Birth</Text>
              <Text className='flex-1 text-gray-800'>{passenger.dateOfBirth}</Text>
            </View>
            <View className='flex-row'>
              <Text className='w-32 text-gray-600 font-medium'>Gender</Text>
              <Text className='flex-1 text-gray-800'>{passenger.sex}</Text>
            </View>
            <View className='flex-row'>
              <Text className='w-32 text-gray-600 font-medium'>Nationality</Text>
              <Text className='flex-1 text-gray-800'>{passenger.nationality}</Text>
            </View>
            <View className='flex-row'>
              <Text className='w-32 text-gray-600 font-medium'>Age Group</Text>
              <Text className='flex-1 text-gray-800'>{passenger.ageGroup}</Text>
            </View>
          </View>
        </View>

        <View className='p-4'>
          <Text className='text-sm font-semibold text-gray-700 mb-2'>CONTACT INFORMATION</Text>
          <View className='space-y-3'>
            <View className='flex-row'>
              <Text className='w-32 text-gray-600 font-medium'>Email</Text>
              <Text className='flex-1 text-gray-800'>{passenger.email}</Text>
            </View>
            <View className='flex-row'>
              <Text className='w-32 text-gray-600 font-medium'>Phone</Text>
              <Text className='flex-1 text-gray-800'>{passenger.phoneNumber}</Text>
            </View>
          </View>
        </View>

        <View className='p-4'>
          <Text className='text-sm font-semibold text-gray-700 mb-2'>TRAVEL DOCUMENTS</Text>
          <View className='space-y-3'>
            <View className='flex-row'>
              <Text className='w-32 text-gray-600 font-medium'>Passport</Text>
              <Text className='flex-1 text-gray-800'>{passenger.passport || 'N/A'}</Text>
            </View>
            <View className='flex-row'>
              <Text className='w-32 text-gray-600 font-medium'>Visa</Text>
              <Text className='flex-1 text-gray-800'>{passenger.hasVisa ? 'Yes' : 'No'}</Text>
            </View>
          </View>
        </View>

        <View className='p-4'>
          <Text className='text-sm font-semibold text-gray-700 mb-2'>STATUS</Text>
          <View className='space-y-3'>
            <View className='flex-row'>
              <Text className='w-32 text-gray-600 font-medium'>Check In</Text>
              <Text className={`flex-1 ${passenger.isCheckIn ? 'text-green-600' : 'text-red-600'}`}>
                {passenger.isCheckIn === null ? 'Not Yet' : passenger.isCheckIn ? 'Yes' : 'No'}
              </Text>
            </View>
            <View className='flex-row'>
              <Text className='w-32 text-gray-600 font-medium'>Check Out</Text>
              <Text className={`flex-1 ${passenger.isCheckOut ? 'text-green-600' : 'text-red-600'}`}>
                {passenger.isCheckOut === null ? 'Not Yet' : passenger.isCheckOut ? 'Yes' : 'No'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default PassengerDetailsCard
