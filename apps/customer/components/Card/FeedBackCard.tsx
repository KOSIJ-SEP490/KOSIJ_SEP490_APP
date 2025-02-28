import React from 'react'
import { View, Text, Image } from 'react-native'
import { Star } from 'lucide-react-native'
import { FeedbackType } from '../../types/feedback.type'

const FeedbackCard: React.FC<{ feedback: FeedbackType }> = ({ feedback }) => {
  const rating = Math.max(0, Math.min(5, feedback.rating || 0))

  return (
    <View className='overflow-hidden rounded-lg bg-white border border-gray-300 w-full mx-auto my-2 p-4'>
      <View className='flex-row justify-between items-center'>
        <View className='flex-row items-center'>
          <Image
            source={{
              uri:
                feedback.customerAvatar ||
                'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png'
            }}
            className='w-8 h-8 rounded-lg mr-2'
          />
          <Text className='text-sm font-bold'>{feedback.customerName}</Text>
        </View>

        <View className='flex-row'>
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              size={16}
              color={index < rating ? '#FACC15' : '#E5E7EB'}
              fill={index < rating ? '#FACC15' : 'none'}
            />
          ))}
        </View>
      </View>

      <Text className='text-gray-500 text-sm mt-2'>{feedback.review || 'No review provided.'}</Text>
    </View>
  )
}

export default FeedbackCard
