import NotesInput from '@apps/customer/components/Booking/NotesInput'
import TravelInfoCard from '@apps/customer/components/Booking/TravelInforCard'
import Divider from '@apps/customer/components/Divider'
import SubLayout from '@apps/customer/layouts/SubLayout'
import { TouchableOpacity, View, Text } from 'react-native'

export default function TravelInformationScreen() {
  return (
    <SubLayout title='Travel Information' showBackButton={true}>
      <View className='flex-1 py-4'>
        <TravelInfoCard />
        <Divider />
        <NotesInput />
        <View className='mx-5'>
          <TouchableOpacity className='bg-blue py-3 mb-7 rounded-lg items-center mt-4 w-full shadow-md'>
            <Text className='text-white text-lg font-semibold'>Submit Request</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SubLayout>
  )
}
