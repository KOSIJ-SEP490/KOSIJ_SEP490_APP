import { useState, useContext, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Constants from 'expo-constants'
import { Ionicons } from '@expo/vector-icons'
import type { AuthStackNavigationProp } from '../../types/navigationAuthType'
import AuthContext from '@shared/context/AuthContext'

const appRole = Constants.expoConfig?.extra?.appRole || 'customer'

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation<AuthStackNavigationProp>()
  const authContext = useContext(AuthContext)

  useEffect(() => {
    if (authContext?.user) {
      if (authContext.user.role === 'Customer') {
        navigation.replace('CustomerNavigator')
      } else if (authContext.user.role === 'ConsultingStaff') {
        navigation.replace('ConsultingNavigator')
      } else if (authContext.user.role === 'DeliveryStaff') {
        navigation.replace('DeliveryNavigator')
      }
    }
  }, [authContext?.user, navigation])

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please enter email and password')
      return
    }

    setLoading(true)
    try {
      await authContext?.login(email, password)
    } finally {
      setLoading(false)
    }
  }

  const dismissKeyboard = () => {
    Keyboard.dismiss()
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View className='flex-1 bg-white p-6'>
        <View className='flex-1 justify-center'>
          <Text className='text-center text-xl font-medium mb-2'>Your Journey to Japan's Finest</Text>
          <Text className='text-center text-xl font-medium mb-12'>Koi Starts Here!</Text>

          <Text className='text-center text-blue text-[32px] font-bold mb-8'>LOGIN</Text>

          <TextInput
            className='bg-[#E8EEF9] rounded-lg px-6 py-4 mb-4'
            placeholder='Email'
            value={email}
            onChangeText={setEmail}
            autoCapitalize='none'
          />

          <View className='relative'>
            <TextInput
              className='bg-[#E8EEF9] rounded-lg px-6 py-4 mb-2 pr-12'
              placeholder='Password'
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity className='absolute right-4 top-4' onPress={togglePasswordVisibility}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color='#888' />
            </TouchableOpacity>
          </View>

          <TouchableOpacity className='mb-8 mt-5'>
            <Text className='text-blue text-right'>Forgot your password?</Text>
          </TouchableOpacity>

          {loading ? (
            <ActivityIndicator size='large' className='my-4' color='#2563EB' />
          ) : (
            <>
              <TouchableOpacity className='bg-blue rounded-lg py-4 mb-4' onPress={handleLogin}>
                <Text className='text-white text-center text-lg font-semibold'>Sign In</Text>
              </TouchableOpacity>

              {appRole === 'customer' && (
                <TouchableOpacity
                  className='bg-white rounded-lg py-4 mb-12 shadow-md border border-gray-100'
                  onPress={() => navigation.navigate('Register')}
                >
                  <Text className='text-gray-900 text-center text-lg'>Create new Account</Text>
                </TouchableOpacity>
              )}

              <Text className='text-center mb-6 font-semibold'>Or continue with</Text>

              <View className='flex-row justify-center space-x-6'>
                <TouchableOpacity className='bg-gray-100 p-4 rounded-xl'>
                  <Image source={{ uri: 'https://www.google.com/favicon.ico' }} className='w-6 h-6' />
                </TouchableOpacity>
                <TouchableOpacity className='bg-gray-100 p-4 rounded-xl'>
                  <Image source={{ uri: 'https://www.facebook.com/favicon.ico' }} className='w-6 h-6' />
                </TouchableOpacity>
                <TouchableOpacity className='bg-gray-100 p-4 rounded-xl'>
                  <Image source={{ uri: 'https://www.apple.com/favicon.ico' }} className='w-6 h-6' />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default LoginScreen
