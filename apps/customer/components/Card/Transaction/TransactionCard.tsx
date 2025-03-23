import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { TransactionType } from '@apps/customer/types/Wallet/transaction.type'

interface TransactionCardProps {
  transaction?: TransactionType | null
  onPress?: () => void
}

const formatDateTime = (dateString?: string) => {
  if (!dateString) return ''

  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date)
}

const getTransactionIcon = (transactionType?: string) => {
  switch (transactionType) {
    case 'OrderDeposit':
      return <MaterialCommunityIcons name='shopping-outline' size={24} color='white' />
    case 'TripBookingFinalPayment':
      return <MaterialCommunityIcons name='airplane-check' size={24} color='white' />
    case 'TripBookingDeposit':
      return <MaterialCommunityIcons name='airplane' size={24} color='white' />
    case 'WalletTopUp':
      return <MaterialCommunityIcons name='wallet-plus-outline' size={24} color='white' />
    default:
      return <MaterialCommunityIcons name='credit-card-outline' size={24} color='white' />
  }
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, onPress }) => {
  const formattedAmount = transaction?.amount.toLocaleString('vi-VN')
  const formattedDate = formatDateTime(transaction?.createdTime)

  return (
    <TouchableOpacity onPress={onPress} className='border border-gray-200 rounded-lg p-4 mb-4 flex-row items-center'>
      <View className='bg-blue w-16 h-16 rounded-lg items-center justify-center mr-4'>
        {getTransactionIcon(transaction?.transactionType)}
      </View>

      <View className='flex-1'>
        <View className='flex-row justify-between items-start'>
          <Text className='text-base font-semibold'>{transaction?.transactionType}</Text>
        </View>

        <View className='mt-1 flex-1'>
          <View className='flex-row'>
            <Text className='text-gray-900 font-medium'>Amount: </Text>
            <Text className='text-blue'>{formattedAmount} VND</Text>
          </View>
          <View className='flex-row'>
            <Text className='text-gray-900 font-medium'>Transaction ID: </Text>
            <Text className='text-gray-500'>{transaction?.id}</Text>
          </View>
        </View>

        <View className='flex-row justify-between items-center mt-1'>
          <Text className='text-gray-500'>{formattedDate}</Text>
          <View
            className={`px-3 py-1 rounded-full ${
              transaction?.transactionStatus === 'Incomplete'
                ? 'bg-yellow-100'
                : transaction?.transactionStatus === 'Success'
                  ? 'bg-green-100'
                  : 'bg-red-100'
            }`}
          >
            <Text
              className={`text-xs ${
                transaction?.transactionStatus === 'Incomplete'
                  ? 'text-yellow-500'
                  : transaction?.transactionStatus === 'Success'
                    ? 'text-green-500'
                    : 'text-red-500'
              }`}
            >
              {transaction?.transactionStatus}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default TransactionCard
