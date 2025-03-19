import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { ChevronLeft } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { ScrollView, TouchableOpacity, View, Text, Image, ActivityIndicator, TextInput } from 'react-native'
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'
import { useOrders } from '@apps/customer/hooks/useOrder'

type RootStackParamList = {
  CancelledScreen: { orderId: number }
}
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'CancelledScreen'>
type CancelledScreenRouteProp = RouteProp<RootStackParamList, 'CancelledScreen'>

export default function CancelledScreen() {
  const navigation = useNavigation<NavigationProps>()
  const { fetchOrderDetails } = useOrders()

  const route = useRoute<CancelledScreenRouteProp>()
  const { orderId } = route.params

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        const data = await fetchOrderDetails(orderId)
        setOrder(data)
      } catch (error) {
        console.error('Failed to load order details')
      } finally {
        setLoading(false)
      }
    }
    getOrderDetails()
  }, [orderId])

  if (loading) {
    return (
      <View className='flex-1 justify-center items-center bg-white'>
        <ActivityIndicator size='large' color='#0000ff' />
      </View>
    )
  }

  return (
    <ScrollView>
      <View className='flex-1 mt-3 bg-white p-4'>
        {/* Header */}
        <View className='flex-row items-center px-4 py-2'>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft color={'#292D32'} size={24} />
          </TouchableOpacity>
          <Text className='text-lg font-semibold text-center flex-1'>Cancel Order</Text>
          <View style={{ width: 24 }} />
        </View>
        <View className='p-4 bg-white rounded-lg shadow-md mt-3'>
          {/* Fish List */}
          <View className='mt-3 border-b border-zinc-300'>
            {order.orderDetails.map((fish: any) => (
              <View className='flex-row items-center mb-3' key={fish.id}>
                {/* Clickable Image */}
                <TouchableOpacity /*onPress={() => openImageViewer(fish.orderDetailImages)} */>
                  <Image source={{ uri: fish.orderDetailImages?.[0]?.imageUrl }} className='w-16 h-12 rounded-lg' />
                </TouchableOpacity>

                <View className='ml-3 flex-1'>
                  <Text className='font-bold'>{fish.variety}</Text>
                </View>
                <Text className='font-bold'>x{fish.quantity}</Text>
                <Text className='ml-2'>{fish.koiPrice} VND</Text>
              </View>
            ))}
          </View>

          {/* Total Price */}
          <Text className='font-bold mt-3 text-right'>Total price: {order.totalAmount}</Text>

          {/* Delivery Section */}
          <View className='mt-4 border-b border-zinc-300'>
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

        <View
          className='mt-3 border rounded-lg justify-center'
          style={{ borderColor: '#ccc', backgroundColor: '#FFF9B7' }}
        >
          <Text className='p-2'>Your Deposit Amount will be lost after canceling this Order</Text>
        </View>

        <View className='mt-3'>
          <Text className='font-bold text-base'>
            Canceled Reason <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 8,
              borderRadius: 5,
              marginBottom: 10,
              minHeight: 100,
              textAlignVertical: 'top'
            }}
            multiline
            maxLength={30}
            numberOfLines={3}
          />
        </View>

        <View className='mt-3'>
          <TouchableOpacity
            className='w-full h-10 justify-center rounded-lg shadow-md'
            style={{ backgroundColor: '#CA2629' }}
          >
            <Text className='text-center' style={{ color: '#fff' }}>
              Cancel Order
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}
