import React from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

interface LayoutProps {
  children: React.ReactNode
  title: string
  showBackButton?: boolean
}

export default function SubLayout({ children, title, showBackButton = false }: LayoutProps) {
  const navigation = useNavigation()

  return (
    <View className='flex-1 bg-white'>
      <View className='bg-blue py-5 px-4 pt-14 flex-row items-center'>
        {showBackButton && (
          <TouchableOpacity onPress={() => navigation.goBack()} className='mr-3'>
            <Ionicons name='arrow-back' size={24} color='white' />
          </TouchableOpacity>
        )}
        <Text className='text-white text-lg font-semibold flex-1 text-center pr-5'>{title}</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        overScrollMode='never'
        bounces={false}
      >
        <View className='flex-1 bg-white py-2 rounded-t-[40px] -mt-5 shadow-lg'>{children}</View>
      </ScrollView>
    </View>
  )
}
