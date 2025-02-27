import React from 'react'
import { View, Text, ActivityIndicator, ScrollView } from 'react-native'
import { RouteProp, useRoute } from '@react-navigation/native'
import { useTourById } from '@apps/customer/hooks/useTour'
import { CustomerStackParamList } from '@apps/customer/types/navigationCustomerType'
import MainLayout from '@apps/customer/layouts/MainLayout'
import TourDetailCard from '@apps/customer/components/Card/Tour/TourDetailCard'
import { TourPrice } from '@apps/customer/types/tour.type'
import Divider from '@apps/customer/components/Divider'
import ItineraryCard from '@apps/customer/components/Card/Tour/ItineraryCard'
import TourPolicyCard from '@apps/customer/components/Card/Tour/TourPolicyCard'
import { useFarmsByTour } from '@apps/customer/hooks/useFarm'
import FarmCard from '@apps/customer/components/Card/Farm/FarmCard'

type ScheduledTourDetailScreenRouteProp = RouteProp<CustomerStackParamList, 'ScheduledTourDetail'>

export default function ScheduledTourDetailScreen() {
  const route = useRoute<ScheduledTourDetailScreenRouteProp>()
  const { tourID } = route.params
  const { tour, error } = useTourById(tourID)
  const { farmList, error: farmError } = useFarmsByTour(tour?.farms ?? [])

  const getAdultPrice = (tourPrices: TourPrice[]): number => {
    return tourPrices.find((price) => price.ageGroup === 'Adult')?.price ?? 0
  }

  if (!tour) {
    return (
      <View className='flex-1 justify-center items-center'>
        {error ? <Text className='text-red-600'>{error}</Text> : <ActivityIndicator size='large' color='#6B7280' />}
      </View>
    )
  }

  return (
    <MainLayout title='' backgroundImage={tour.imageUrl} showBackButton={true}>
      <View className='p-4'>
        <View className='flex-row justify-center items-center px-4 pb-4'>
          <Text className='text-lg font-semibold'>{tour.tourName}</Text>
        </View>
        <View className='flex-row justify-between items-center px-4 py-4'>
          <Text className='text-base font-semibold text-blue'>Tour Details</Text>
        </View>
        <TourDetailCard
          departurePoint={tour.departurePoint}
          destinationPoint={tour.destinationPoint}
          days={tour.days}
          nights={tour.nights}
          farmsCount={tour.totalFarmVisit}
          standardPrice={getAdultPrice(tour.tourPrices)}
          visaPrice={tour.visaFee}
        />
      </View>

      <Divider />

      <View className='px-4'>
        <View className='flex-row justify-between items-center px-4 py-4'>
          <Text className='text-base font-semibold text-blue'>Farms to Visit</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
          style={{ height: 550 }}
        >
          {farmError ? (
            <Text className='text-center text-red-500'>{farmError}</Text>
          ) : farmList.length > 0 ? (
            farmList.map((farm) => (
              <View key={farm.id} className='mb-4'>
                <FarmCard farm={farm} />
              </View>
            ))
          ) : (
            <Text className='text-center text-gray-500'>Loading...</Text>
          )}
        </ScrollView>
      </View>

      <Divider />

      <View className='px-4 mb-5'>
        <View className='flex-row justify-between items-center px-4 py-4'>
          <Text className='text-base font-semibold text-blue'>Itinerary</Text>
        </View>
        {tour.tourDetails.map((detail, index) => (
          <ItineraryCard key={index} detail={detail} />
        ))}
      </View>

      <Divider />

      <View className='px-4 mb-5'>
        <View className='flex-row justify-between items-center px-4 py-4'>
          <Text className='text-base font-semibold text-blue'>Tour Policies</Text>
        </View>
        <View className='space-y-4'>
          <TourPolicyCard title='Tour Price Includes' policies={tour.tourPriceInclude} />
          <TourPolicyCard title='Tour Price Not Includes' policies={tour.tourPriceNotInclude} />
          <TourPolicyCard title='Registration' policies={tour.registrationConditions} />
          <TourPolicyCard title='Payment' policies={tour.paymentPolicy} />
          <TourPolicyCard title='Cancellation' policies={tour.cancellationPolicy} />
        </View>
      </View>
    </MainLayout>
  )
}
