import React from 'react'
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useTourById } from '@apps/customer/hooks/useTour'
import MainLayout from '@shared/layouts/MainLayout'
import TourDetailCard from '@apps/customer/components/Card/Tour/TourDetailCard'
import { TourPrice } from '@apps/customer/types/Tour/tour.type'
import Divider from '@shared/components/Divider'
import ItineraryCard from '@apps/customer/components/Card/Tour/ItineraryCard'
import TourPolicyCard from '@apps/customer/components/Card/Tour/TourPolicyCard'
import { useFarmsByTour } from '@apps/customer/hooks/useFarm'
import FarmCard from '@apps/customer/components/Card/Farm/FarmCard'
import { useBooking } from '@apps/customer/contexts/BookingContext'
import {
  CustomerHomeStackNavigationProp,
  CustomerHomeStackParamList
} from '@apps/customer/types/navigationCustomerType'

type ScheduledTourDetailScreenRouteProp = RouteProp<CustomerHomeStackParamList, 'ScheduledTourDetail'>

export default function ScheduledTourDetailScreen() {
  const route = useRoute<ScheduledTourDetailScreenRouteProp>()
  const navigation = useNavigation<CustomerHomeStackNavigationProp>()
  const { tourID } = route.params
  const { tour, error } = useTourById(tourID)
  const { setBookingData } = useBooking()

  const setTour = (tourID: number) => {
    setBookingData((prev) => ({
      ...prev,
      tourID,
      pricing: {
        ...prev.pricing,
        visaPrice: tour?.visaFee || 0
      }
    }))
  }
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

  const handleNavigateToTripDetail = () => {
    setTour(tourID)
    navigation.navigate('TripDetail', { tourID: tourID })
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
          style={{ height: 370 }}
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
          <TourPolicyCard title='Children Prices' policies={tour.tourPrices} />
          <TourPolicyCard title='Promotions' policies={tour.promotionPolicy} />
        </View>
      </View>

      <View className='p-4 bg-white mb-5'>
        <TouchableOpacity className='bg-blue rounded-lg py-3' onPress={handleNavigateToTripDetail}>
          <Text className='text-white text-center text-lg font-semibold'>Select Tour</Text>
        </TouchableOpacity>
      </View>
    </MainLayout>
  )
}
