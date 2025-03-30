import React from 'react'
import { View, Text, ActivityIndicator, ScrollView } from 'react-native'
import { RouteProp, useRoute } from '@react-navigation/native'
import MainLayout from '@shared/layouts/MainLayout'
import { useFarmById } from '@apps/customer/hooks/useFarm'
import { Star } from 'lucide-react-native'
import Divider from '@shared/components/Divider'
import { useKoiVarietyListByFarmId } from '@apps/customer/hooks/useKoi'

import { useFeedbackByFarmId } from '@apps/customer/hooks/useFeedback'
import FeedbackCard from '@apps/customer/components/Card/FeedBackCard'
import KoiCard from '@apps/customer/components/Card/Koi/KoiCard'
import { CustomerHomeStackParamList } from '@apps/customer/types/navigationCustomerType'

type FarmDetailScreenRouteProp = RouteProp<CustomerHomeStackParamList, 'FarmDetail'>

export default function FarmDetailScreen() {
  const route = useRoute<FarmDetailScreenRouteProp>()
  const { farmID } = route.params
  const { farm, error } = useFarmById(farmID)
  const { koiVariety } = useKoiVarietyListByFarmId(farmID)
  const { feedbacks } = useFeedbackByFarmId(farmID)

  if (!farm) {
    return (
      <View className='flex-1 justify-center items-center'>
        {error ? <Text className='text-red-600'>{error}</Text> : <ActivityIndicator size='large' color='#6B7280' />}
      </View>
    )
  }

  return (
    <MainLayout title='' backgroundImage={farm.imageUrl || ''} showBackButton={true}>
      <View className='p-4'>
        <View className='flex-row justify-center items-center px-4'>
          <Text className='text-lg font-semibold'>{farm.farmName}</Text>
        </View>
      </View>

      <View className='pr-10'>
        <View className='flex-row justify-end'>
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              size={20}
              color={index < farm.averageRating ? '#FACC15' : '#E5E7EB'}
              fill={index < farm.averageRating ? '#FACC15' : 'none'}
            />
          ))}
        </View>
      </View>

      <View className='px-5 mt-10'>
        <View>
          <View className='flex-row border-gray-300 p-3'>
            <Text className='w-1/3 font-semibold'>Location:</Text>
            <Text className='w-2/3'>{farm.location}</Text>
          </View>

          <View className='flex-row border-gray-300 p-3'>
            <Text className='w-1/3 font-semibold'>Phone:</Text>
            <Text className='w-2/3'>{farm.farmPhoneNumber}</Text>
          </View>

          <View className='flex-row border-gray-300 p-3'>
            <Text className='w-1/3 font-semibold'>Open Time:</Text>
            <Text className='w-2/3'>{farm.openingHours}</Text>
          </View>

          <View className='flex-row p-3'>
            <Text className='w-1/3 font-semibold'>Email:</Text>
            <Text className='w-2/3'>{farm.farmEmail}</Text>
          </View>
        </View>

        <View className='mt-6 p-3 mb-5'>
          <Text className='text-lg font-semibold'>About the Farm:</Text>
          <Text className='mt-2'>{farm.description}</Text>
        </View>
      </View>

      <Divider />

      <View className='px-4 mb-5'>
        <View className='flex-row justify-between items-center px-4 py-4'>
          <Text className='text-base font-semibold'>Available Koi Variety</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
          style={{ height: 490 }}
        >
          {koiVariety === null ? (
            <Text className='text-center text-red-500'>Failed to load koi varieties.</Text>
          ) : koiVariety.length > 0 ? (
            koiVariety.map((koi, index) => (
              <View key={index} className='mb-4'>
                <KoiCard koi={koi} />
              </View>
            ))
          ) : (
            <Text className='text-center text-gray-500'>No koi varieties available.</Text>
          )}
        </ScrollView>
      </View>

      <Divider />

      <View className='px-4 mb-5'>
        <View className='flex-row justify-between items-center px-4 py-4'>
          <Text className='text-base font-semibold'>Feedbacks</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
          style={{ height: 390 }}
        >
          {feedbacks && feedbacks.length > 0 ? (
            feedbacks.map((feedback) => (
              <View key={feedback.id} className='mb-4'>
                <FeedbackCard feedback={feedback} />
              </View>
            ))
          ) : (
            <Text className='text-center text-gray-500'>No Feedbacks</Text>
          )}
        </ScrollView>
      </View>
    </MainLayout>
  )
}
