import React from 'react'
import { View, Text, Switch, TouchableOpacity } from 'react-native'
import { Bell, Moon, FileText, Lock, ChevronRight } from 'react-native-feather'

interface SettingCardProps {
  notificationsEnabled: boolean
  setNotificationsEnabled: (value: boolean) => void
  darkModeEnabled: boolean
  setDarkModeEnabled: (value: boolean) => void
  onTermsPress: () => void
  onChangePasswordPress: () => void
}

export default function SettingCard({
  notificationsEnabled,
  setNotificationsEnabled,
  darkModeEnabled,
  setDarkModeEnabled,
  onTermsPress,
  onChangePasswordPress
}: SettingCardProps) {
  return (
    <View className='bg-white rounded-lg overflow-hidden border mt-5 border-gray-200 mb-4'>
      <View className='flex-row items-center justify-between p-4 border-b border-gray-200'>
        <View className='flex-row items-center'>
          <Bell width={24} height={24} stroke='#333' />
          <Text className='ml-4 text-base'>Notifications</Text>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
          thumbColor='#FFFFFF'
        />
      </View>

      <View className='flex-row items-center justify-between p-4 border-b border-gray-200'>
        <View className='flex-row items-center'>
          <Moon width={24} height={24} stroke='#333' />
          <Text className='ml-4 text-base'>Dark Mode</Text>
        </View>
        <Switch
          value={darkModeEnabled}
          onValueChange={setDarkModeEnabled}
          trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
          thumbColor='#FFFFFF'
        />
      </View>

      <TouchableOpacity
        className='flex-row items-center justify-between p-4 border-b border-gray-200'
        onPress={onTermsPress}
      >
        <View className='flex-row items-center'>
          <FileText width={24} height={24} stroke='#333' />
          <Text className='ml-4 text-base'>Terms and Policies</Text>
        </View>
        <ChevronRight width={24} height={24} stroke='#333' />
      </TouchableOpacity>

      <TouchableOpacity className='flex-row items-center justify-between p-4' onPress={onChangePasswordPress}>
        <View className='flex-row items-center'>
          <Lock width={24} height={24} stroke='#333' />
          <Text className='ml-4 text-base'>Change Password</Text>
        </View>
        <ChevronRight width={24} height={24} stroke='#333' />
      </TouchableOpacity>
    </View>
  )
}
