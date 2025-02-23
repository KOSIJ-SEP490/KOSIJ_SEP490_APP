'use client'

import { useState, useCallback, useContext } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import type { AuthStackNavigationProp } from '../../types/navigationAuthType'
import AuthContext from '@shared/context/AuthContext'

const SignUpScreen = () => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigation = useNavigation<AuthStackNavigationProp>()
  const authContext = useContext(AuthContext)
  const [loading, setLoading] = useState(false)

  const handleInputChange = useCallback((field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleSignUp = useCallback(async () => {
    try {
      setLoading(true)
      const response = await authContext?.register(
        formData.email,
        formData.password,
        formData.confirmPassword,
        formData.fullName,
        formData.phoneNumber
      )

      if (!response) return

      navigation.navigate('OTP', { email: formData.email })
    } finally {
      setLoading(false)
    }
  }, [formData, authContext?.register, navigation])

  const navigateToLogin = useCallback(() => {
    navigation.navigate('Login')
  }, [navigation])

  const renderSocialButton = useCallback(
    ({ icon, onPress }: { icon: string; onPress: () => void }) => (
      <TouchableOpacity
        className='w-12 h-12 bg-gray-100 rounded-full items-center justify-center'
        onPress={onPress}
        accessibilityRole='button'
      >
        <Image source={{ uri: icon }} className='w-6 h-6' accessibilityLabel='Social login icon' />
      </TouchableOpacity>
    ),
    []
  )

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev)
  }, [])

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword((prev) => !prev)
  }, [])

  return (
    <ScrollView className='flex-1 bg-white px-6 py-12' keyboardShouldPersistTaps='handled'>
      <View className='space-y-6'>
        <Text className='text-center text-[32px] mt-14 text-blue font-bold'>SIGN UP</Text>

        <View className='space-y-4'>
          <TextInput
            className='bg-[#E8EEF9] rounded-xl px-6 py-4'
            placeholder='Email'
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            keyboardType='email-address'
            autoCapitalize='none'
            accessibilityLabel='Email input'
          />

          <TextInput
            className='bg-[#E8EEF9] rounded-xl px-6 py-4'
            placeholder='Full Name'
            value={formData.fullName}
            onChangeText={(value) => handleInputChange('fullName', value)}
            autoCapitalize='words'
            accessibilityLabel='Full name input'
          />

          <TextInput
            className='bg-[#E8EEF9] rounded-xl px-6 py-4'
            placeholder='Phone Number'
            value={formData.phoneNumber}
            onChangeText={(value) => handleInputChange('phoneNumber', value)}
            keyboardType='phone-pad'
            accessibilityLabel='Phone number input'
          />

          <View className='relative'>
            <TextInput
              className='bg-[#E8EEF9] rounded-xl px-6 py-4 pr-12'
              placeholder='Password'
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              secureTextEntry={!showPassword}
              accessibilityLabel='Password input'
            />
            <TouchableOpacity
              className='absolute right-4 top-4'
              onPress={togglePasswordVisibility}
              accessibilityRole='button'
              accessibilityLabel='Toggle password visibility'
            >
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color='#888' />
            </TouchableOpacity>
          </View>

          <View className='relative'>
            <TextInput
              className='bg-[#E8EEF9] rounded-xl px-6 py-4 pr-12 mb-5'
              placeholder='Confirm Password'
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              secureTextEntry={!showConfirmPassword}
              accessibilityLabel='Confirm password input'
            />
            <TouchableOpacity
              className='absolute right-4 top-4'
              onPress={toggleConfirmPasswordVisibility}
              accessibilityRole='button'
              accessibilityLabel='Toggle confirm password visibility'
            >
              <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={24} color='#888' />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          className={`bg-blue rounded-lg py-4 ${loading ? 'opacity-50' : ''}`}
          onPress={handleSignUp}
          disabled={loading}
          accessibilityRole='button'
          accessibilityLabel='Sign up button'
        >
          <Text className='text-white text-center text-lg font-semibold'>{loading ? 'Signing Up...' : 'Sign Up'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className='bg-white rounded-lg py-4 mb-12 shadow-md border border-gray-100'
          onPress={navigateToLogin}
          accessibilityRole='button'
          accessibilityLabel='Navigate to login'
        >
          <Text className='text-gray-900 text-center text-lg'>Already have Account</Text>
        </TouchableOpacity>

        <View className='space-y-4'>
          <Text className='text-center font-semibold'>Or continue with</Text>

          <View className='flex-row justify-center space-x-4'>
            {renderSocialButton({
              icon: 'https://www.google.com/favicon.ico',
              onPress: () => console.log('Google sign up')
            })}
            {renderSocialButton({
              icon: 'https://www.facebook.com/favicon.ico',
              onPress: () => console.log('Facebook sign up')
            })}
            {renderSocialButton({
              icon: 'https://www.apple.com/favicon.ico',
              onPress: () => console.log('Apple sign up')
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default SignUpScreen
