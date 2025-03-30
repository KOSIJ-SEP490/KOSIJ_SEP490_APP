import { CustomerSettingsStackNavigationProp } from '@apps/customer/types/navigationCustomerType'
import { WithDrawResponseType } from '@apps/customer/types/Wallet/withdraw.type'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'

type WithdrawRequestCardProps = {
  withdrawRequest: WithDrawResponseType
}

const WithdrawRequestCard: React.FC<WithdrawRequestCardProps> = ({ withdrawRequest }) => {
  const navigation = useNavigation<CustomerSettingsStackNavigationProp>()

  const handlePress = () => {
    navigation.navigate('WithdrawDetails', { withdrawID: withdrawRequest.id })
  }

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <View className='flex-row items-center border border-gray-300 p-4 bg-white rounded-lg mt-5'>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2331/2331966.png' }}
          className='w-12 h-12 rounded-lg mr-4'
        />

        <View className='flex-1'>
          <Text className='text-base font-bold'>Request ID: {withdrawRequest.id}</Text>
          <Text className='text-sm text-gray-600'>Amount: {formatCurrency(withdrawRequest.amount)} VND</Text>
          <Text className='text-sm text-gray-600'>Bank: {withdrawRequest.bankName}</Text>
        </View>

        <View className={`px-3 py-1 rounded-lg ${getStatusStyle(withdrawRequest.withdrawStatus)}`}>
          <Text className={`text-sm font-bold ${getStatusTextColor(withdrawRequest.withdrawStatus)}`}>
            {withdrawRequest.withdrawStatus}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN').format(amount)
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Pending':
      return 'bg-orange-100'
    case 'Success':
      return 'bg-green-100'
    case 'Canceled':
      return 'bg-red-100'
    case 'Failed':
      return 'bg-rose-100'
    default:
      return ''
  }
}

const getStatusTextColor = (status: string) => {
  switch (status) {
    case 'Pending':
      return 'text-orange-500'
    case 'Success':
      return 'text-green-500'
    case 'Canceled':
      return 'text-red-500'
    case 'Failed':
      return 'text-rose-500'
    default:
      return ''
  }
}

export default WithdrawRequestCard
