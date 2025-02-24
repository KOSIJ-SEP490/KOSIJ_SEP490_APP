import { View, Text, Pressable } from 'react-native'
import { ChevronDown } from 'lucide-react-native'
import { useState } from 'react'
import { TourDetail } from '../types/tour.type'

interface ItineraryCardProps {
  detail: TourDetail
}

export default function ItineraryCard({ detail }: ItineraryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <View className='mb-4'>
      <Pressable
        onPress={() => setIsExpanded(!isExpanded)}
        className={`p-4 rounded-xl ${isExpanded ? 'bg-blue-light' : 'bg-white'} border border-gray-300`}
      >
        <View className='flex-row justify-between items-start'>
          <View className='flex-1 pr-4'>
            <Text className='text-sm font-semibold'>
              Day {detail.day}: <Text className='font-normal'>{detail.itineraryName}</Text>
            </Text>
          </View>
          <ChevronDown
            size={24}
            color='#000'
            style={{
              transform: [{ rotate: isExpanded ? '180deg' : '0deg' }]
            }}
          />
        </View>

        {isExpanded && (
          <View className='mt-4 bg-white rounded-xl p-4 space-y-4'>
            {detail.itineraryDetails.map((item, index) => (
              <View key={index} className='space-y-1'>
                <Text className='font-semibold text-sm'>{item.time}:</Text>
                <Text className='text-gray-600 text-sm'>{item.description}</Text>
              </View>
            ))}
          </View>
        )}
      </Pressable>
    </View>
  )
}
