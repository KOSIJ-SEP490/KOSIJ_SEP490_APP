import React, { useContext, useRef, useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { AuthStackNavigationProp, AuthStackParamList } from '@shared/types/navigationAuthType'
import AuthContext from '@shared/context/AuthContext'
import Toast from 'react-native-toast-message'

type OtpScreenRouteProp = RouteProp<AuthStackParamList, 'OTP'>

const OtpScreen = () => {
  const navigation = useNavigation<AuthStackNavigationProp>()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef<(TextInput | null)[]>([])
  const route = useRoute<OtpScreenRouteProp>()
  const email = route.params?.email

  const authContext = useContext(AuthContext)

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
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

  const handleConfirmCode = async () => {
    const enteredOTP = otp.join('')

    if (!authContext?.verifyOTP) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'OTP verification function is not available'
      })
      return
    }

    try {
      await authContext.verifyOTP(email, enteredOTP)

      if (authContext.user) {
        switch (authContext.user.role) {
          case 'Customer':
            navigation.replace('CustomerNavigator')
            break
          case 'ConsultingStaff':
            navigation.replace('ConsultingNavigator')
            break
          case 'DeliveryStaff':
            navigation.replace('DeliveryNavigator')
            break
          default:
            navigation.replace('CustomerNavigator')
        }
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'OTP Verification Failed',
        text2: 'Invalid OTP. Please try again.'
      })
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className='flex-1 bg-white justify-center px-6'>
        <TouchableOpacity onPress={() => navigation.goBack()} className='absolute top-16 left-6'>
          <Text className='text-3xl'>←</Text>
        </TouchableOpacity>

        <Text className='text-xl font-bold text-gray-900 mb-2'>Enter code from SMS</Text>
        <Text className='text-base text-gray-500 mb-4'>
          Enter code sent to your Gmail{'\n'}
          <Text className='text-blue-600 underline'>{email}</Text>
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
    </TouchableWithoutFeedback>
  )
}

export default OtpScreen
