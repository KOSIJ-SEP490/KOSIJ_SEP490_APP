import React from 'react'
import { View, Text, ImageBackground, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

interface LayoutProps {
  children: React.ReactNode
  title: string
  backgroundImage?: string
  showBackButton?: boolean
}

export default function MainLayout({
  children,
  title,
  backgroundImage = 'https://images.unsplash.com/photo-1653401286363-c254f6149317?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  showBackButton = false
}: LayoutProps) {
  const navigation = useNavigation()

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
      overScrollMode='never'
      bounces={false}
    >
      <View className='flex-1 bg-white'>
        <ImageBackground source={{ uri: backgroundImage }} className='h-[250px] justify-center items-center relative'>
          {showBackButton && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className='absolute left-5 top-10 bg-black/30 p-2 rounded-full'
            >
              <Ionicons name='arrow-back' size={24} color='white' />
            </TouchableOpacity>
          )}

          <Text className='text-white text-lg font-semibold text-center px-5'>{title}</Text>
        </ImageBackground>
        <View className='flex-1 bg-white py-2 rounded-t-[40px] -mt-10 shadow-lg'>{children}</View>
      </View>
    </ScrollView>
  )
}
