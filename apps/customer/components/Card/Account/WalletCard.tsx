import React from 'react'
import { View, Text } from 'react-native'

interface WalletBalanceProps {
  balance: number
}

export default function WalletBalance({ balance }: WalletBalanceProps) {
  const formattedBalance = new Intl.NumberFormat('en-US').format(balance)

  return (
    <View className='bg-blue-light rounded-lg p-5 mb-4 mt-5'>
      <View className='flex-row justify-between items-center'>
        <Text className='text-black text-base'>Wallet Balance:</Text>
        <Text className='text-blue text-base font-medium'>{formattedBalance} VND</Text>
      </View>
    </View>
  )
}
