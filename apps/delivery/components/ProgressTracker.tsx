import React from 'react'
import { View, Text } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'

interface ProgressTrackerProps {
  orderStatus?: string
}

const statuses = [
  { key: 'Deposited', icon: 'clipboard-list', label: 'Deposited' },
  { key: 'Packaged', icon: 'box', label: 'Packaged' },
  { key: 'Delivering', icon: 'truck', label: 'Delivering' },
  { key: 'Delivered', icon: 'home', label: 'Delivered' }
]

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ orderStatus }) => {
  const currentIndex = statuses.findIndex((s) => s.key === orderStatus)

  return (
    <View className='pt-6 px-6 mt-3 bg-white rounded-lg'>
      <View className='flex-row justify-between items-center mb-8'>
        {statuses.map((status, index) => (
          <View key={status.key} className='items-center relative'>
            {index < statuses.length - 1 && (
              <View
                className={`absolute h-1 top-4 left-6 right-0 -mr-7 rounded-full ${
                  index < currentIndex
                    ? 'bg-blue'
                    : index === currentIndex
                      ? 'bg-gradient-to-r from-blue to-gray-200'
                      : 'bg-gray-200'
                }`}
              />
            )}
            <View
              className={`w-10 h-10 rounded-full items-center justify-center z-10 ${
                index < currentIndex ? 'bg-blue' : index === currentIndex ? 'bg-blue' : 'bg-gray-200'
              }`}
            >
              <FontAwesome5 name={status.icon} size={18} color={index <= currentIndex ? 'white' : '#9CA3AF'} />
            </View>

            <Text className={`text-xs mt-2 font-medium ${index <= currentIndex ? 'text-blue' : 'text-gray-400'}`}>
              {status.label}
            </Text>

            {index === currentIndex && <View className='absolute -bottom-1 w-2 h-2 rounded-full bg-blue' />}
          </View>
        ))}
      </View>

      <View className=' p-4 rounded-lg border border-gray-300'>
        <Text className='text-center text-gray-700 font-medium leading-5'>
          {orderStatus === 'Deposited'
            ? 'Customer Order is submitted successfully. Please wait for the farm to prepare the package.'
            : orderStatus === 'Packaged'
              ? 'Your order has been packed and is ready for shipping.'
              : orderStatus === 'Delivering'
                ? 'Order is on the way!'
                : 'Order has been delivered'}
        </Text>
      </View>
    </View>
  )
}

export default ProgressTracker
