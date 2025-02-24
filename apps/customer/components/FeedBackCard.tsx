import React from 'react'
import { View, Text } from 'react-native'
import { Star } from 'lucide-react-native'
import { FeedbackType } from '../types/feedback.type'

const FeedbackCard: React.FC<{ feedback: FeedbackType }> = ({ feedback }) => {
  return (
    <View className='overflow-hidden rounded-lg bg-white border border-gray-300 w-full mx-auto my-2 p-4'>
      <View className='flex-row justify-between items-center'>
        <Text className='text-sm font-bold'>{feedback.customerName}</Text>

        <View className='flex-row'>
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              size={16}
              color={index < feedback.rating ? '#FACC15' : '#E5E7EB'}
              fill={index < feedback.rating ? '#FACC15' : 'none'}
            />
          ))}
        </View>
      </View>

      <Text className='text-gray-500 text-sm mt-2'>{feedback.review}</Text>
    </View>
  )
}

export default FeedbackCard
