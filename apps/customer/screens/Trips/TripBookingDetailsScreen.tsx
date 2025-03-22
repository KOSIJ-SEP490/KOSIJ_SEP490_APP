import { CustomerInfoPrice } from '@apps/customer/components/Booking/CustomerInfoPrice'
import { PaymentReminder } from '@apps/customer/components/Booking/PaymentReminder'
import TripBookingInfo from '@apps/customer/components/Booking/TripBookingInfo'
import { StaffInfo } from '@apps/customer/components/Card/ConsultingStaff/ConsultingStaffInfo'
import FarmCard from '@apps/customer/components/Card/Farm/FarmCard'
import ItineraryCard from '@apps/customer/components/Card/Tour/ItineraryCard'
import TourPolicyCard from '@apps/customer/components/Card/Tour/TourPolicyCard'
import Divider from '@apps/customer/components/Divider'
import { useFarmsByTripBooking } from '@apps/customer/hooks/useFarm'
import { useTripBookingById } from '@apps/customer/hooks/useTripBooking'
import MainLayout from '@apps/customer/layouts/MainLayout'
import { CustomerTripsStackParamList } from '@apps/customer/types/navigationCustomerType'
import { RouteProp, useRoute } from '@react-navigation/native'
import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'

type TripBookingDetailScreenRouteProp = RouteProp<CustomerTripsStackParamList, 'TripBookingDetails'>

export default function TripBookingDetailsScreen() {
  const route = useRoute<TripBookingDetailScreenRouteProp>()
  const { tripBookingID } = route.params
  const { tripBookingDetail } = useTripBookingById(tripBookingID)
  const { farmList, error: farmError } = useFarmsByTripBooking(tripBookingDetail?.farmIds ?? [])
  const isExpired = tripBookingDetail?.expiredTime
    ? new Date(tripBookingDetail.expiredTime).getTime() < new Date().getTime()
    : false

  const shouldShowCancelButton =
    !isExpired &&
    tripBookingDetail?.tripBookingStatus !== 'Cancelled' &&
    tripBookingDetail?.tripBookingStatus !== 'Completed' &&
    tripBookingDetail?.tripBookingStatus !== 'Refunded'

  return (
    <MainLayout
      title={tripBookingDetail?.tourName || ''}
      backgroundImage={tripBookingDetail?.imageUrl || ''}
      showBackButton={true}
    >
      {tripBookingDetail?.tripBookingStatus !== 'Paid' && (
        <>
          <PaymentReminder
            status={tripBookingDetail?.tripBookingStatus ?? 'Pending'}
            expiredTime={tripBookingDetail?.expiredTime ?? ''}
            paymentPolicy={
              tripBookingDetail?.paymentPolicy?.map((policy, index) => ({
                id: index,
                description: policy.description
              })) ?? []
            }
            cancellationReason={tripBookingDetail?.cancellationReason ?? ''}
            tripBookingID={tripBookingID}
          />
          <Divider />
        </>
      )}

      <TripBookingInfo tripBooking={tripBookingDetail} />

      <Divider />

      <StaffInfo
        staffType='Consulting Staff'
        fullName={tripBookingDetail?.consultStaffInformation.staffName ?? ''}
        phoneNumber={tripBookingDetail?.consultStaffInformation.phoneNumber ?? ''}
        email={tripBookingDetail?.consultStaffInformation.email ?? ''}
      />

      <Divider />

      <CustomerInfoPrice
        totalTripBookingAmount={tripBookingDetail?.totalTripBookingAmount ?? 0}
        bookingDetails={tripBookingDetail?.bookingDetails}
      />

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
        {tripBookingDetail?.tourDetails.map((detail, index) => (
          <ItineraryCard
            key={index}
            detail={{
              ...detail,
              itineraryDetails: detail.itineraryDetails.map((itinerary) => ({
                ...itinerary,
                farmId: itinerary.farmId ?? null
              }))
            }}
          />
        ))}
      </View>

      <Divider />

      <View className='px-4 mb-5'>
        <View className='flex-row justify-between items-center px-4 py-4'>
          <Text className='text-base font-semibold text-blue'>Tour Policies</Text>
        </View>
        <View className='space-y-4'>
          <TourPolicyCard title='Tour Price Includes' policies={tripBookingDetail?.tourPriceInclude ?? []} />
          <TourPolicyCard title='Tour Price Not Includes' policies={tripBookingDetail?.tourPriceNotInclude ?? []} />
          <TourPolicyCard title='Registration' policies={tripBookingDetail?.registrationCondition ?? []} />
          <TourPolicyCard title='Payment' policies={tripBookingDetail?.paymentPolicy ?? []} />
          <TourPolicyCard title='Cancellation' policies={tripBookingDetail?.cancellationPolicy ?? []} />
          <TourPolicyCard title='Children Prices' policies={tripBookingDetail?.childrenPricePolicy ?? []} />
          <TourPolicyCard title='Promotion' policies={tripBookingDetail?.promotionPolicy ?? []} />
        </View>
      </View>

      {shouldShowCancelButton && (
        <View className='p-4 bg-white mb-5'>
          <TouchableOpacity className='bg-red-700 rounded-lg py-3'>
            <Text className='text-white text-center text-lg font-semibold'>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </MainLayout>
  )
}
