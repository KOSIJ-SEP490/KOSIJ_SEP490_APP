import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

interface WalletSectionProps {
  balance: number
  onRecharge?: () => void
  onWithdraw?: () => void
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const WalletSection: React.FC<WalletSectionProps> = ({ balance = 0, onRecharge = () => {}, onWithdraw = () => {} }) => {
  const formattedBalance = balance.toLocaleString('vi-VN')

  return (
    <View className='w-full mt-10 px-5 mb-7'>
      <View className='flex-row justify-start mb-5 px-3'>
        <TouchableOpacity onPress={onRecharge} className='items-center mr-10'>
          <View className='w-12 h-12 items-center justify-center mb-2'>
            <MaterialCommunityIcons name='wallet-plus-outline' size={30} color='#264ECA' />
          </View>
          <Text className='text-blue font-medium'>Recharge</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onWithdraw} className='items-center'>
          <View className='w-12 h-12 items-center justify-center mb-2'>
            <MaterialCommunityIcons name='cash-refund' size={30} color='#264ECA' />
          </View>
          <Text className='text-blue font-medium'>Withdraw</Text>
        </TouchableOpacity>
      </View>

      <View className='w-full bg-blue-light rounded-xl p-5 mt-5 flex-row justify-between items-center'>
        <Text className='text-black text-base font-medium'>Wallet Balance:</Text>
        <Text className='text-blue text-base font-bold'>{formattedBalance} VND</Text>
      </View>
    </View>
  )
}

export default WalletSection
