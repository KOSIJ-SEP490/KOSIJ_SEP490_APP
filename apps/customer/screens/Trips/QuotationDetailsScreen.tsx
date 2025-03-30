import CustomerConfirmation from '@apps/customer/components/Booking/CustomizedTrip/CustomerConfirmation'
import CustomerInfoRequest from '@apps/customer/components/Booking/CustomizedTrip/CustomerInfoRequest'
import TripBookingInfoCard from '@apps/customer/components/Booking/CustomizedTrip/TripBookingInfoCard'
import { PaymentReminder } from '@apps/customer/components/Booking/PaymentReminder'
import { StaffInfo } from '@apps/customer/components/Card/ConsultingStaff/ConsultingStaffInfo'
import ItineraryCard from '@apps/customer/components/Card/Tour/ItineraryCard'
import TourPolicyCard from '@apps/customer/components/Card/Tour/TourPolicyCard'
import Divider from '@shared/components/Divider'
import { useTripBookingById } from '@apps/customer/hooks/useTripBooking'
import { useTripRequestById } from '@apps/customer/hooks/useTripRequest'
import SubLayout from '@shared/layouts/SubLayout'
import { CustomerTripsStackParamList } from '@apps/customer/types/navigationCustomerType'
import { RouteProp, useRoute } from '@react-navigation/native'
import { styled } from 'nativewind'
import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useFarmsByTripBooking } from '@apps/customer/hooks/useFarm'
import FarmCard from '@apps/customer/components/Card/Farm/FarmCard'

type QuotationDetailScreenRouteProp = RouteProp<CustomerTripsStackParamList, 'QuotationDetails'>

const StyledView = styled(View)
const StyledText = styled(Text)

export default function QuotationDetailsScreen() {
  const route = useRoute<QuotationDetailScreenRouteProp>()
  const { tripRequestID } = route.params
  const { tripRequestDetails } = useTripRequestById(tripRequestID)
  const { tripBookingDetail } = useTripBookingById(tripRequestDetails?.tripBookingId ?? 0)
  const { farmList, error: farmError } = useFarmsByTripBooking(tripRequestDetails?.customizedTripResponse?.farms ?? [])
  return (
    <SubLayout title='Quotation' showBackButton={true}>
      {tripRequestDetails?.requestStatus === 'Confirmed' && (
        <View className='pt-8'>
          <PaymentReminder
            status={tripBookingDetail?.tripBookingStatus ?? 'Pending'}
            expiredTime={tripBookingDetail?.expiredTime ?? ''}
            paymentPolicy={
              tripBookingDetail?.paymentPolicy?.map((policy, index) => ({
                id: index,
                description: policy.description
              })) ?? []
            }
            cancellationReason={tripBookingDetail?.cancelTripBookingDetails?.cancellationReason ?? ''}
            tripBookingID={tripRequestDetails?.tripBookingId ?? 0}
          />
          <Divider />
        </View>
      )}

      <TripBookingInfoCard tripRequest={tripRequestDetails ?? null} />

      <Divider />

      <StaffInfo
        staffType='Sales Staff'
        fullName={tripRequestDetails?.salesStaffName ?? ''}
        phoneNumber={tripRequestDetails?.salesStaffPhone ?? ''}
        email={tripRequestDetails?.salesStaffEmail ?? ''}
      />

      <View className='px-5'>
        <StyledView className='bg-yellow-100 rounded-lg p-4 mb-6 px-5'>
          <StyledText className='text-gray-700 text-sm leading-6'>
            If you want to edit trip request, please contact our Sales Staff to exchange
          </StyledText>
        </StyledView>
      </View>

      <Divider />

      <View className='px-4'>
        <View className='flex-row justify-between items-center px-4 py-4'>
          <Text className='text-base font-semibold text-blue'>Farms to Visit</Text>
        </View>

        <View pointerEvents='none'>
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
      </View>

      <Divider />

      <CustomerInfoRequest tripRequest={tripRequestDetails} />

      <Divider />

      <View className='px-4 mb-5'>
        <View className='flex-row justify-between items-center px-4 py-4'>
          <Text className='text-base font-semibold text-blue'>Itinerary</Text>
        </View>
        {tripRequestDetails?.customizedTripResponse?.tourDetailsResponse.map((detail, index) => (
          <ItineraryCard key={index} detail={detail} />
        ))}
      </View>

      <Divider />

      <View className='px-4 mb-5'>
        <View className='flex-row justify-between items-center px-4 py-4'>
          <Text className='text-base font-semibold text-blue'>Tour Policies</Text>
        </View>
        <View className='space-y-4'>
          <TourPolicyCard
            title='Tour Price Includes'
            policies={tripRequestDetails?.customizedTripResponse?.tourPriceInclude ?? []}
          />
          <TourPolicyCard
            title='Tour Price Not Includes'
            policies={tripRequestDetails?.customizedTripResponse?.tourPriceNotInclude ?? []}
          />
          <TourPolicyCard
            title='Registration'
            policies={tripRequestDetails?.customizedTripResponse?.registrationConditions ?? []}
          />
          <TourPolicyCard
            title='Payment'
            policies={tripRequestDetails?.customizedTripResponse?.tourPaymentResponse ?? []}
          />
          <TourPolicyCard
            title='Cancellation'
            policies={tripRequestDetails?.customizedTripResponse?.tourCancellationResponse ?? []}
          />
          <TourPolicyCard
            title='Children Prices'
            policies={tripRequestDetails?.customizedTripResponse?.tourPriceResponse ?? []}
          />
          <TourPolicyCard
            title='Promotion'
            policies={tripRequestDetails?.customizedTripResponse?.tourPromotionResponse ?? []}
          />
        </View>
      </View>

      {!(
        tripRequestDetails?.requestStatus === 'Confirmed' ||
        tripRequestDetails?.requestStatus === 'ModificationRequested'
      ) && (
        <>
          <Divider />
          <CustomerConfirmation tripRequestId={tripRequestID} />
        </>
      )}
    </SubLayout>
  )
}
