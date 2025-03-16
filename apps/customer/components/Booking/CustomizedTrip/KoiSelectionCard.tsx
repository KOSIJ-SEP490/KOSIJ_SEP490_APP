import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { KoiVarietyType } from '@apps/customer/types/Koi/koiVariety.type'
import { useBooking } from '@apps/customer/contexts/BookingContext'

interface KoiSelectionCardProps {
  koi: KoiVarietyType
  isSelected: boolean
  onToggle: () => void
}

const KoiSelectionCard: React.FC<KoiSelectionCardProps> = ({ koi, isSelected, onToggle }) => {
  const { removeKoiVarietyRequest } = useBooking()

  const handlePress = () => {
    if (isSelected) {
      removeKoiVarietyRequest(koi.id)
    }
    onToggle()
  }

  return (
    <View className='flex-row bg-white rounded-lg p-4 border border-gray-200 mb-6 items-center'>
      <Image source={{ uri: koi.imageUrl }} className='w-24 h-40 rounded-lg' />

      <View className='flex-1 mx-4'>
        <Text className='text-base font-bold'>{koi.varietyName}</Text>
        <Text className='text-gray-600 text-sm'>{koi.description}</Text>
      </View>

      <TouchableOpacity onPress={handlePress} className='p-2 border border-blue rounded-lg'>
        <AntDesign name={isSelected ? 'minus' : 'plus'} size={20} color='blue' />
      </TouchableOpacity>
    </View>
  )
}

export default KoiSelectionCard
