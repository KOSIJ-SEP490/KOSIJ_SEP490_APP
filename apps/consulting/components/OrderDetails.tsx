import { useNavigation } from '@react-navigation/native'
import { ChevronLeft } from 'lucide-react-native'
import { ScrollView, TouchableOpacity, View, Text, Image } from 'react-native'
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'

type RootStackParamList = {
  TourDetails: { id: number }
}
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'TourDetails'>

export default function OrderDetailsScreen() {
  const navigation = useNavigation<NavigationProps>()

  return (
    <ScrollView>
      <View className='flex-1 mt-3 bg-white p-4'>
        {/* Header */}
        <View className='flex-row items-center px-4 py-2'>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft color={'#292D32'} size={24} />
          </TouchableOpacity>
          <Text className='text-lg font-semibold text-center flex-1'>Order Details</Text>
          <View style={{ width: 24 }} />
        </View>
        <View className='p-4 rounded-lg mt-4' style={{ backgroundColor: '#264eca' }}>
          <Text className='text-white font-bold'>🕒 Guaranteed delivery time: 02-01-2025</Text>
          <Text className='text-white text-sm'>
            The farm is preparing the fish and will deliver them to the shipping unit as soon as possible.
          </Text>
        </View>
        <View className='p-4 bg-white rounded-lg shadow-md mt-3'>
          <View className='border-b border-zinc-300'>
            <Text className='font-bold'>Shipping information</Text>
            <Text className='mb-3'>✈️ Vietnam Airlines</Text>
          </View>
          <View className='mt-2'>
            <Text className='font-bold '>Delivery address</Text>
            <Text>Leslie Alexander</Text>
            <Text className='text-gray-600'>(+84) 123456789</Text>
            <Text>Lot E2a-7, D1 Street, High-Tech Park, Long Thanh My Ward, Thu Duc City, Ho Chi Minh City</Text>
          </View>
        </View>
        <View className='p-4 bg-white rounded-lg shadow-md mt-3'>
          <View>
            <Text className='font-bold text-base'>🏡 Koi Farm Asagi - Tokyo &gt;</Text>
          </View>
          {/* Fish List */}
          <View className='mt-3'>
            <View className='flex-row items-center'>
              <Image source={{ uri: 'https://yourimageurl.com/taisho-sanke.jpg' }} className='w-12 h-12 rounded-lg' />
              <View className='ml-3 flex-1'>
                <Text className='font-bold'>Taisho Sanke</Text>
                <Text className='text-gray-500 text-sm'>Variety: Sanke, Taisho Sanke</Text>
              </View>
              <Text className='font-bold'>x1</Text>
              <Text className='ml-2'>2,000,000 VND</Text>
            </View>

            <View className='flex-row items-center mt-2'>
              <Image source={{ uri: 'https://yourimageurl.com/ginrin-kohaku.jpg' }} className='w-12 h-12 rounded-lg' />
              <View className='ml-3 flex-1'>
                <Text className='font-bold'>Ginrin Kohaku</Text>
                <Text className='text-gray-500 text-sm'>Variety: Ginrin, Kohaku</Text>
              </View>
              <Text className='font-bold'>x1</Text>
              <Text className='ml-2'>2,000,000 VND</Text>
            </View>
          </View>

          {/* Total Price */}
          <Text className='font-bold mt-3 text-right'>Total price: 4,000,000 VND</Text>

          {/* Delivery Section */}
          <View className='mt-4'>
            <Text className='font-bold text-base'>🚚 Delivery calculating</Text>

            <View className='flex-row items-center mt-3'>
              <Image source={{ uri: 'https://yourimageurl.com/box.png' }} className='w-12 h-12' />
              <View className='ml-3 flex-1'>
                <Text className='font-bold'>Large box 55 - 65 cm</Text>
                <Text className='text-gray-500 text-sm'>Included: Taisho Sanke, Gin Kohaku</Text>
              </View>
              <Text className='font-bold'>x1</Text>
              <Text className='ml-2'>1,000,000 VND</Text>
            </View>

            <View className='flex-row items-center mt-2'>
              <Image source={{ uri: 'https://yourimageurl.com/box.png' }} className='w-12 h-12' />
              <View className='ml-3 flex-1'>
                <Text className='font-bold'>Medium box 50 - 55 cm</Text>
                <Text className='text-gray-500 text-sm'>Variety: Ginrin, Minami</Text>
              </View>
              <Text className='font-bold'>x1</Text>
              <Text className='ml-2'>500,000 VND</Text>
            </View>
          </View>

          {/* Delivery Total */}
          <Text className='font-bold mt-3 text-right'>Total price: 1,500,000 VND</Text>

          {/* Final Total */}
          <View className='flex-row justify-between border-t mt-3 pt-3'>
            <Text className='font-bold text-lg'>Total price: </Text>
            <Text className='font-bold text-lg'>5,500,000 VND</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
