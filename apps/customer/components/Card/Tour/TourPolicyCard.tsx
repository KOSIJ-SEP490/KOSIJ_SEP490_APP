import { View, Text, Pressable } from 'react-native'
import { ChevronDown } from 'lucide-react-native'
import { useState } from 'react'
import { Policy } from '../../../types/Tour/tour.type'

interface TourPolicyCardProps {
  title: string
  policies: Policy[] | string
}

export default function TourPolicyCard({ title, policies }: TourPolicyCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getPolicyItems = () => {
    if (typeof policies === 'string') {
      return policies.split(',').map((item) => item.trim())
    }
    return policies.map((policy) => policy.description)
  }

  return (
    <View className='mb-4'>
      <Pressable
        onPress={() => setIsExpanded(!isExpanded)}
        className={`p-4 rounded-xl ${isExpanded ? 'bg-blue-light' : 'bg-white'} border border-gray-300`}
      >
        <View className='flex-row justify-between items-center'>
          <Text className='text-sm font-semibold'>{title}</Text>
          <ChevronDown
            size={24}
            color='#000'
            style={{
              transform: [{ rotate: isExpanded ? '180deg' : '0deg' }]
            }}
          />
        </View>

        {isExpanded && (
          <View className='mt-4 bg-white rounded-xl p-4'>
            {getPolicyItems().map((item, index) => (
              <View key={index} className='flex-row mb-3 last:mb-0'>
                <Text className='text-gray-700 text-sm'>• {item}</Text>
              </View>
            ))}
          </View>
        )}
      </Pressable>
    </View>
  )
}
