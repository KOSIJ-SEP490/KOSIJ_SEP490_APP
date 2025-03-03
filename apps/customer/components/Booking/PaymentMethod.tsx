import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { RadioButton } from 'react-native-paper'

const PaymentMethod = () => {
  const [selectedPayment, setSelectedPayment] = useState('kosij_wallet')
  const [isPolicyAccepted, setIsPolicyAccepted] = useState(false)

  return (
    <View>
      <View className='mx-5 my-3 mt-10'>
        <Text className='text-base font-semibold mb-2 ml-2'>Payment Method:</Text>

        <TouchableOpacity
          className='flex-row items-center p-4 border border-gray-300 rounded-xl'
          onPress={() => setSelectedPayment('kosij_wallet')}
          activeOpacity={0.7}
        >
          <Image source={require('../../../../assets/images/LogoKoi.png')} className='w-10 h-10 mr-3' />

          <Text className='flex-1 text-base'>KOSIJ Wallet</Text>

          <RadioButton.Android
            value='kosij_wallet'
            status={selectedPayment === 'kosij_wallet' ? 'checked' : 'unchecked'}
            onPress={() => setSelectedPayment('kosij_wallet')}
            color='blue'
          />
        </TouchableOpacity>
      </View>

      <View className='mx-5 my-3 mt-10 mb-20'>
        <Text className='text-base font-semibold mb-2 ml-2'>Policy:</Text>

        <TouchableOpacity
          className={`flex-row items-center p-4 border border-gray-300 rounded-xl ${
            isPolicyAccepted ? 'bg-blue-100 border-blue-500' : ''
          }`}
          onPress={() => setIsPolicyAccepted(!isPolicyAccepted)}
          activeOpacity={0.7}
        >
          <Text className='flex-1 text-base'>
            By booking, you confirm that you agree to the terms and policies of KOSIJ.
          </Text>

          <RadioButton.Android
            value='policy_agreement'
            status={isPolicyAccepted ? 'checked' : 'unchecked'}
            onPress={() => setIsPolicyAccepted(!isPolicyAccepted)}
            color='blue'
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default PaymentMethod
