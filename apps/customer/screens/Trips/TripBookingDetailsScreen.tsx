import { CustomerInfoPrice } from '@apps/customer/components/Booking/CustomerInfoPrice'
import { PaymentReminder } from '@apps/customer/components/Booking/PaymentReminder'
import TripBookingInfo from '@apps/customer/components/Booking/TripBookingInfo'
import { StaffInfo } from '@apps/customer/components/Card/ConsultingStaff/ConsultingStaffInfo'
import FarmCard from '@apps/customer/components/Card/Farm/FarmCard'
import ItineraryCard from '@apps/customer/components/Card/Tour/ItineraryCard'
import TourPolicyCard from '@apps/customer/components/Card/Tour/TourPolicyCard'
import Divider from '@shared/components/Divider'
import { useFarmsByTripBooking } from '@apps/customer/hooks/useFarm'
import { useCancelTripBooking, useTripBookingById } from '@apps/customer/hooks/useTripBooking'
import MainLayout from '@shared/layouts/MainLayout'
import { CustomerTripsStackParamList } from '@apps/customer/types/navigationCustomerType'
import { RouteProp, useRoute } from '@react-navigation/native'
import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native'
import CancelSuccessModal from '@apps/customer/components/Booking/CancelSuccessModal'

type TripBookingDetailScreenRouteProp = RouteProp<CustomerTripsStackParamList, 'TripBookingDetails'>

export default function TripBookingDetailsScreen() {
  const route = useRoute<TripBookingDetailScreenRouteProp>()
  const { tripBookingID } = route.params
  const { tripBookingDetail } = useTripBookingById(tripBookingID)
  const { farmList, error: farmError } = useFarmsByTripBooking(tripBookingDetail?.farmIds ?? [])
  const isExpired = tripBookingDetail?.expiredTime
    ? new Date(tripBookingDetail.expiredTime).getTime() < new Date().getTime()
    : false

  const { cancelTrip, loading, canceledTrip } = useCancelTripBooking()
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [cancellationReason, setCancellationReason] = useState('')

  const shouldShowCancelButton =
    !isExpired &&
    tripBookingDetail?.tripBookingStatus !== 'Cancelled' &&
    tripBookingDetail?.tripBookingStatus !== 'Completed' &&
    tripBookingDetail?.tripBookingStatus !== 'Refunded'

  const handleCancelTrip = async () => {
    if (!cancellationReason.trim()) {
      Alert.alert('Error', 'Please provide a cancellation reason')
      return
    }

    try {
      await cancelTrip(tripBookingID, cancellationReason)
      setShowCancelModal(false)
      setShowSuccessModal(true)
    } catch (error) {
      setShowCancelModal(false)
      Alert.alert('Error', 'Failed to Cancel Trip Booking')
    }
  }

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
          <TouchableOpacity className='bg-red-700 rounded-lg py-3' onPress={() => setShowCancelModal(true)}>
            <Text className='text-white text-center text-lg font-semibold'>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        transparent
        visible={showCancelModal}
        animationType='fade'
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View className='flex-1 justify-center items-center bg-black/50'>
          <View className='bg-white p-6 rounded-xl w-11/12 max-w-md'>
            <Text className='text-xl font-bold mb-4'>Cancel Trip</Text>

            <Text className='text-gray-600 mb-2'>Please provide the reason for cancellation:</Text>

            <TextInput
              className='border border-gray-300 rounded-lg p-3 mb-4 h-24 text-gray-800'
              multiline
              placeholder='Enter your reason here...'
              value={cancellationReason}
              onChangeText={setCancellationReason}
            />

            <View className='flex-row justify-between mt-4'>
              <TouchableOpacity
                className='px-6 py-2 border border-gray-300 rounded-lg'
                onPress={() => setShowCancelModal(false)}
              >
                <Text className='text-gray-700 font-medium'>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className='px-6 py-2 bg-red-600 rounded-lg'
                onPress={handleCancelTrip}
                disabled={loading}
              >
                <Text className='text-white font-medium'>{loading ? 'Processing...' : 'Confirm Cancellation'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <CancelSuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        bookingId={tripBookingID}
        canceledTime={new Date().toLocaleString()}
        senderName={canceledTrip?.customerName || ''}
        cancellationReason={cancellationReason}
        refundAmount={canceledTrip?.refundAmount || 0}
      />
    </MainLayout>
  )
}
