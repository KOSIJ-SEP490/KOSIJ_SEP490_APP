import { View, Text, TouchableOpacity, Modal } from 'react-native'
import { CheckCircle } from 'react-native-feather'
import { CustomerTripsStackParamList } from '@apps/customer/types/navigationCustomerType'
import { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import { useBooking } from '@apps/customer/contexts/BookingContext'

interface QuotationConfirmSuccessProps {
  visible: boolean
  response: string
  onClose: () => void
}

export default function QuotationConfirmSuccess({ visible, response, onClose }: QuotationConfirmSuccessProps) {
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
            <Text className='text-lg text-gray-700 font-medium'>Submit Trip Request Successfully</Text>
          </View>

          <View className='h-px bg-gray-200 my-6' />

          <Text className='text-gray-500 text-sm mt-4'>{response}</Text>

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
