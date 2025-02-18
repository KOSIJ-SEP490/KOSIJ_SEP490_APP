import React, { useRef, useState } from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const OtpScreen = () => {
  const navigation = useNavigation()
  const [otp, setOtp] = useState(['', '', '', ''])
  const inputRefs = useRef<(TextInput | null)[]>([])

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleBackspace = (index: number) => {
    if (otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    const newOtp = [...otp]
    newOtp[index] = ''
    setOtp(newOtp)
  }

  const handleConfirmCode = () => {
    console.log('Entered OTP:', otp.join(''))
  }

  return (
    <View className='flex-1 bg-white justify-center px-6'>
      <TouchableOpacity onPress={() => navigation.goBack()} className='absolute top-5 left-6'>
        <Text className='text-2xl'>←</Text>
      </TouchableOpacity>

      <Text className='text-xl font-bold text-gray-900 mb-2'>Enter code from SMS</Text>
      <Text className='text-base text-gray-500 mb-4'>
        Enter code sent to your email {'\n'}
        <Text className='text-blue-600 underline'>+84 0325245428</Text>
      </Text>

      <View className='flex-row justify-center space-x-4 mb-6'>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            value={digit}
            onChangeText={(text) => handleOtpChange(text, index)}
            onKeyPress={({ nativeEvent }) => nativeEvent.key === 'Backspace' && handleBackspace(index)}
            keyboardType='numeric'
            maxLength={1}
            className='w-12 h-12 border border-gray-400 rounded-lg text-xl text-center text-black'
          />
        ))}
      </View>
      <TouchableOpacity
        className={`bg-blue py-3 rounded-lg items-center ${otp.includes('') ? 'opacity-50' : ''}`}
        onPress={handleConfirmCode}
        disabled={otp.includes('')}
      >
        <Text className='text-white text-lg font-semibold'>Confirm Code</Text>
      </TouchableOpacity>
    </View>
  )
}

export default OtpScreen
