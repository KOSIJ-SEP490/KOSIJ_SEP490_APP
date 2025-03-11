import { CustomerHomeStackParamList } from '@apps/customer/types/navigationCustomerType'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

export default function CreateTripCard() {
  const navigation = useNavigation<StackNavigationProp<CustomerHomeStackParamList, 'KoiVarietySelection'>>()
  return (
    <View className='p-4'>
      <Text className=' text-base font-bold mb-6 ml-5'>Create your own trip:</Text>

      <View className='bg-white rounded-lg p-6 mb-6 border border-gray-200'>
        <View className='space-y-6'>
          <View className='flex-row'>
            <Text className='text-base'>1. </Text>
            <Text className='text-base'>Select your favorite Koi Varieties</Text>
          </View>

          <View className='flex-row'>
            <Text className='text-base'>2. </Text>
            <Text className='text-base'>Select your favorite Koi Farmings to visit</Text>
          </View>

          <View className='flex-row'>
            <Text className='text-base'>3. </Text>
            <Text className='text-base'>Fill your travel Information</Text>
          </View>

          <View className='flex-row'>
            <Text className='text-base'>4. </Text>
            <Text className='text-base flex-1'>
              You will have to wait for our Sales Staff and Manager to check and approve your Customized Tour before get
              ready
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        className='bg-[#2C52ED] py-4 px-6 rounded-lg items-center justify-end mb-10'
        onPress={() => navigation.navigate('KoiVarietySelection')}
      >
        <Text className='text-white text-base font-semibold'>Create Your Own Trip</Text>
      </TouchableOpacity>
    </View>
  )
}
