import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { ChevronLeft } from 'lucide-react-native'
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  SetStateAction,
  useEffect,
  useState
} from 'react'
import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  Image,
  Clipboard,
  Alert,
  ActivityIndicator,
  ImageSourcePropType,
  Modal,
  RefreshControl
} from 'react-native'
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'
import { format } from 'date-fns'
import { useOrders } from '../api/useOrder.api'

type RootStackParamList = {
  OrderDetails: { orderId: number }
  UpdateOrder: { orderId: number }
  Orders: undefined
  MainTabs: { screen?: string }
}
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'OrderDetails'>
type OrderDetailsScreenRouteProp = RouteProp<RootStackParamList, 'OrderDetails'>

export default function OrderDetailsScreen() {
  const navigation = useNavigation<NavigationProps>()
  // const orderId = '#Order2412'
  const { fetchOrderDetails } = useOrders()

  const handleCopy = () => {
    Clipboard.setString(orderId.toString())
    Alert.alert('Copied!', 'Order ID has been copied to clipboard.')
  }
  const route = useRoute<OrderDetailsScreenRouteProp>()
  const { orderId } = route.params

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)
  const [selectedImages, setSelectedImages] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  const openImageViewer = (images: SetStateAction<never[]>) => {
    setSelectedImages(images)
    setVisible(true)
  }
  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        const data = await fetchOrderDetails(orderId)
        setOrder(data)
      } catch (error) {
        // console.error('Failed to load order details')
      } finally {
        setLoading(false)
      }
    }
    getOrderDetails()
  }, [orderId])

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      const data = await fetchOrderDetails(orderId)
      setOrder(JSON.parse(JSON.stringify(data)))
    } catch (error) {
      console.error('Error refreshing the page:', error)
      Alert.alert('Refresh Failed', 'Unable to refresh order details. Please try again later.')
    } finally {
      setRefreshing(false)
    }
  }

  if (loading) {
    return (
      <View className='flex-1 justify-center items-center bg-white'>
        <ActivityIndicator size='large' color='#0000ff' />
      </View>
    )
  }
  const formatNumber = (num: { toString: () => string }) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View className='flex-1 mt-3 bg-white p-4'>
        {/* Header */}
        <View className='flex-row items-center px-4 py-2'>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('MainTabs', {
                screen: 'Orders'
              })
            }
          >
            <ChevronLeft color={'#292D32'} size={24} />
          </TouchableOpacity>
          <Text className='text-lg font-semibold text-center flex-1'>Order Details</Text>
          <View style={{ width: 24 }} />
        </View>
        <View className='p-4 rounded-lg mt-4' style={{ backgroundColor: '#264eca' }}>
          <Text className='text-white font-bold'>
            🕒 Guaranteed delivery time: {format(new Date(order.expectedDeliveryDate), 'dd-MM-yyyy')}
          </Text>

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
            <Text>{order.fullName}</Text>
            <Text className='text-gray-600'>{order.phoneNumber}</Text>
            <Text>{order.deliveryAddress}</Text>
          </View>
        </View>
        <View className='p-4 bg-white rounded-lg shadow-md mt-3'>
          <View>
            <Text className='font-bold text-base'>🏡 {order.farmName} &gt;</Text>
          </View>
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
                <Text className='ml-2'>{formatNumber(fish.koiPrice)} VND</Text>
              </View>
            ))}
          </View>

          {/* Total Price */}
          <View className='flex-row justify-between'>
            <Text className='font-bold mt-3 text-right'>Total Koi price:</Text>
            <Text className='mt-3 font-semibold'> {formatNumber(order.totalFishAmount)} VND</Text>
          </View>
          {/* Delivery Section */}
          <View className='mt-4 border-b border-zinc-300'>
            <Text className='font-bold text-base'>🚚 Delivery calculating</Text>
            {order.boxAllocations.map((delivery: any) => (
              <View key={delivery.id}>
                <View className='flex-row items-center mt-3'>
                  <Image source={{ uri: 'https://yourimageurl.com/box.png' }} className='w-12 h-12' />
                  <View className='ml-3 flex-1'>
                    <Text className='font-bold'>
                      {delivery.boxType} box ({delivery.maxSize}cm)
                    </Text>
                    <Text className='text-gray-500 text-sm'>Included: {delivery.varieties[0].varietyName}</Text>
                  </View>
                  <Text className='font-bold'>x{delivery.quantity}</Text>
                  <Text className='ml-2'>{formatNumber(delivery.cost)} VND</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Delivery Total */}
          <View className='flex-row justify-between'>
            <Text className='font-bold mt-3 text-right'>Total delivery price:</Text>
            <Text className='mt-3 font-semibold'> {formatNumber(order.totalDeliveringAmount)} VND</Text>
          </View>
          {/* Final Total */}
          <View className='flex-row justify-between border-t mt-3 pt-3'>
            <Text className='font-bold text-lg'>Total price: </Text>
            <Text className='font-bold text-lg'>{formatNumber(order.totalOrderAmount)} VND</Text>
          </View>
        </View>

        <View className='p-4 bg-white rounded-lg shadow-md mt-3'>
          {/* Order ID Row */}
          <View className='flex-row items-center justify-between mb-2'>
            <Text className='font-bold'>Order ID</Text>
            <View className='flex-row items-center'>
              <Text className='text-gray-600 mr-2'>{orderId}</Text>
              <TouchableOpacity onPress={handleCopy} className='border border-gray-300 px-2 py-1 rounded-md'>
                <Text className='text-gray-600 text-sm'>Copy</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Payment Method Row */}
          <View className='flex-row justify-between mb-2'>
            <Text className='text-gray-600'>Payment method</Text>
            <Text className='text-gray-800 font-medium'>Online Banking</Text>
          </View>

          {/* Note Row */}
          <View className='flex-row'>
            <Text className='text-gray-600 w-1/4'>Note</Text>
            <Text className='text-gray-800 w-3/4 text-right'>{order.note || 'null'}</Text>
          </View>
        </View>
        <View className='mt-3'>
          <TouchableOpacity
            className='w-full py-3 justify-center items-center rounded-xl shadow-sm'
            style={{
              backgroundColor: '#ffffff',
              borderColor: '#264eca',
              borderWidth: 1.5,
              shadowColor: '#264eca',
              shadowOpacity: 0.3,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
              elevation: 3
            }}
            onPress={() => navigation.navigate('UpdateOrder', { orderId: orderId })}
          >
            <Text className='font-semibold text-center text-base' style={{ color: '#264eca' }}>
              Update Order
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}
