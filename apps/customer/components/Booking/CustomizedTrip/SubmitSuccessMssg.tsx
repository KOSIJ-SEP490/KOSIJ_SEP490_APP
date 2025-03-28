import { View, Text, TouchableOpacity, Modal } from 'react-native'
import { CheckCircle } from 'react-native-feather'
import { TripRequestResponseType } from '@apps/customer/types/Booking/tripRequestResponse.type'
import { CustomerTripsStackParamList } from '@apps/customer/types/navigationCustomerType'
import { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import { useBooking } from '@apps/customer/contexts/BookingContext'

interface SubmitSuccessMssgProps {
  visible: boolean
  onClose: () => void
  tripRequestResponse: TripRequestResponseType | null
}

export default function SubmitSuccessMssg({ visible, onClose, tripRequestResponse }: SubmitSuccessMssgProps) {
  const navigation = useNavigation<StackNavigationProp<CustomerTripsStackParamList, 'Trips'>>()
  const { resetBookingRequest } = useBooking()

  return (
    <Modal animationType='fade' transparent={true} visible={visible} onRequestClose={onClose}>
      <View className='flex-1 justify-center items-center bg-black/50'>
        <View className='bg-white w-11/12 max-w-md rounded-2xl p-6'>
          <View className='items-center mb-4'>
            <View className='w-16 h-16 rounded-full bg-blue items-center justify-center mb-4'>
              <CheckCircle width={26} height={26} stroke='#ffffff' strokeWidth={3} />
            </View>
            <Text className='text-lg text-gray-700 font-medium'>Customized Request Submitted!</Text>
          </View>

          <View className='h-px bg-gray-200 my-6' />

          {tripRequestResponse && (
            <View className='space-y-6'>
              <View className='flex-row justify-between'>
                <Text className='text-base text-gray-600'>Trip Request ID</Text>
                <Text className='text-base text-gray-800'>{tripRequestResponse.id || 'N/A'}</Text>
              </View>

              <View className='flex-row justify-between'>
                <Text className='text-base text-gray-600'>Created Time</Text>
                <Text className='text-base text-gray-800'>{new Date().toLocaleString()}</Text>
              </View>

              <View className='flex-row justify-between'>
                <Text className='text-base text-gray-600'>Sender Name</Text>
                <Text className='text-base text-gray-800'>{tripRequestResponse.nameContact || 'N/A'}</Text>
              </View>
            </View>
          )}

          <View className='flex-row items-center py-6'>
            {Array(27)
              .fill(0)
              .map((_, index) => (
                <View key={index} className='w-1 h-1 bg-gray-300 rounded-full mx-1' />
              ))}
          </View>

          <Text className='text-gray-500 text-sm mt-4'>
            Please wait for us to finalize your trip request as soon as possible.
          </Text>

          <TouchableOpacity
            onPress={() => {
              resetBookingRequest()
              onClose()
              navigation.reset({
                index: 0,
                routes: [{ name: 'Trips', params: { initialTab: 'Request' } as CustomerTripsStackParamList['Trips'] }]
              })
            }}
            className='bg-blue py-3 rounded-lg mt-8'
          >
            <Text className='text-white text-center text-lg font-medium'>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}
