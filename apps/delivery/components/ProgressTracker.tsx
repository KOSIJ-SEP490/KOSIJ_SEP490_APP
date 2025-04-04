/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'
import { View, Text } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'

interface ProgressTrackerProps {
  orderStatus?: string
  cancelledReason?: string | null
}

const statuses = [
  { key: 'Deposited', icon: 'clipboard-list', label: 'Deposited' },
  { key: 'Packaged', icon: 'box', label: 'Packaged' },
  { key: 'Delivering', icon: 'truck', label: 'Delivering' },
  { key: 'Delivered', icon: 'home', label: 'Delivered' },
  { key: 'CancelledByCustomer', icon: 'ban', label: 'Cancelled' },
  { key: 'CancelledByCompany', icon: 'ban', label: 'Cancelled' },
  { key: 'PendingRefund', icon: 'clock', label: 'Pending Refund' },
  { key: 'Refunded', icon: 'money-check-alt', label: 'Refunded' }
]

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ orderStatus, cancelledReason }) => {
  const currentIndex = statuses.findIndex((s) => s.key === orderStatus)
  const isCancelled = orderStatus === 'CancelledByCustomer' || orderStatus === 'CancelledByCompany'
  const getModifiedStatuses = () => {
    if (isCancelled || orderStatus === 'Refunded' || orderStatus === 'PendingRefund') {
      return [
        statuses.find((s) => s.key === 'Deposited')!,
        statuses.find((s) => s.key === 'Packaged')!,
        statuses.find((s) => s.key === 'Delivering')!,
        statuses.find((s) => s.key === orderStatus)!
      ]
    }
    return statuses.slice(0, 4)
  }

  const modifiedStatuses = getModifiedStatuses()

  if (isCancelled || orderStatus === 'Refunded') {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    modifiedStatuses[3] = statuses.find((s) => s.key === orderStatus)!
  }

  return (
    <View className='pt-6 px-6 mt-3 bg-white rounded-lg'>
      <View className='flex-row justify-between items-center mb-8'>
        {modifiedStatuses.map((status, index) => {
          const isActive = index <= currentIndex
          const isCurrent = index === currentIndex
          const isCancelledStatus = status.key === 'CancelledByCustomer' || status.key === 'CancelledByCompany'

          return (
            <View key={status.key} className='items-center relative'>
              {index < 3 && (
                <View
                  className={`absolute h-1 top-4 left-6 right-0 -mr-7 rounded-full ${
                    index < currentIndex
                      ? isCancelledStatus
                        ? 'bg-red-500'
                        : 'bg-blue'
                      : isCurrent
                        ? isCancelledStatus
                          ? 'bg-gradient-to-r from-red-500 to-gray-200'
                          : 'bg-gradient-to-r from-blue to-gray-200'
                        : 'bg-gray-200'
                  }`}
                />
              )}
              <View
                className={`w-10 h-10 rounded-full items-center justify-center z-10 ${
                  isActive ? (isCancelledStatus ? 'bg-red-500' : 'bg-blue') : 'bg-gray-200'
                }`}
              >
                <FontAwesome5 name={status.icon} size={18} color={isActive ? 'white' : '#9CA3AF'} />
              </View>

              <Text
                className={`text-xs mt-2 font-medium ${
                  isActive ? (isCancelledStatus ? 'text-red-500' : 'text-blue') : 'text-gray-400'
                }`}
              >
                {status.label}
              </Text>
            </View>
          )
        })}
      </View>

      <View className='p-4 rounded-lg border border-gray-300'>
        <Text className='text-center text-gray-700 font-medium leading-5'>
          {orderStatus === 'Deposited'
            ? 'Customer Order is submitted successfully. Please wait for the farm to prepare the package'
            : orderStatus === 'Packaged'
              ? 'Order has been packed. Click Start to deliver order'
              : orderStatus === 'Delivering'
                ? 'Order is on the way!'
                : orderStatus === 'Delivered'
                  ? 'Order has been delivered successfully'
                  : orderStatus === 'PendingRefund'
                    ? 'Waiting for manager to approve refund'
                    : isCancelled
                      ? `Order is cancelled. ${cancelledReason}`
                      : 'Order is refunded'}
        </Text>
      </View>
    </View>
  )
}

export default ProgressTracker
