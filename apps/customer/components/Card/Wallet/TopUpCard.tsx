import { useTopUpWallet } from '@apps/customer/hooks/useWallet'
import { CustomerSettingsStackNavigationProp } from '@apps/customer/types/navigationCustomerType'
import { useNavigation } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native'

interface TopUpCardProps {
  initialAmount?: number
}

const TopUpCard: React.FC<TopUpCardProps> = ({ initialAmount = 0 }) => {
  const [amount, setAmount] = useState(initialAmount)
  const [inputValue, setInputValue] = useState('')
  const { topUpUrl, loading, topUpWallet } = useTopUpWallet()
  const navigation = useNavigation<CustomerSettingsStackNavigationProp>()

  const amountOptions = [50000, 100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000, 50000000]

  const formatAmount = (value: number): string => value.toLocaleString('vi-VN')

  useEffect(() => {
    setInputValue(formatAmount(amount))
  }, [amount])

  useEffect(() => {
    if (topUpUrl) {
      navigation.navigate('TopUpWeb', { url: topUpUrl })
    }
  }, [topUpUrl])

  const handleInputChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '')
    if (numericValue) {
      const newAmount = parseInt(numericValue, 10)
      setAmount(newAmount)
      setInputValue(formatAmount(newAmount))
    } else {
      setAmount(0)
      setInputValue('')
    }
  }

  const handleAmountSelect = (value: number) => {
    setAmount(value)
  }

  const handleSubmit = () => {
    if (amount < 50000) {
      Alert.alert('Error', 'Minimum top-up amount is 50,000 VND')
      return
    }
    topUpWallet(amount)
  }

  return (
    <View className='p-4 px-5 mt-7'>
      <Text className='text-base font-bold mb-4'>Top up to</Text>

      <TouchableOpacity className='bg-blue rounded-lg p-4 flex-row items-center mb-6'>
        <View className='rounded-full p-1 mr-3'>
          <Image source={require('../../../../../assets/images/LogoKoi.png')} className='w-10 h-10 mr-3' />
        </View>
        <Text className='text-white text-base font-semibold'>KOSIJ Wallet</Text>
      </TouchableOpacity>

      <Text className='text-base font-bold mb-2'>Enter the amount</Text>
      <TextInput
        className='border border-gray-300 rounded-lg p-4 text-base mb-6'
        value={inputValue}
        onChangeText={handleInputChange}
        keyboardType='numeric'
      />

      <View className='border border-gray-300 rounded-lg p-4 mb-6'>
        <View className='flex-row flex-wrap justify-between'>
          {amountOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              className={`w-[30%] border border-gray-300 rounded-lg p-3 mb-3 items-center ${
                amount === option ? 'bg-blue' : 'bg-gray-100'
              }`}
              onPress={() => handleAmountSelect(option)}
            >
              <Text className={`${amount === option ? 'text-white text-xs' : 'text-black text-xs'}`}>
                {formatAmount(option)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size='large' color='#0000ff' />
      ) : (
        <TouchableOpacity className='bg-blue rounded-lg p-4 items-center' onPress={handleSubmit}>
          <Text className='text-white text-base font-semibold'>Submit</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

export default TopUpCard
