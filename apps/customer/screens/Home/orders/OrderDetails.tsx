import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { ChevronLeft } from 'lucide-react-native'
import React, {
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
  Modal
} from 'react-native'
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'
import { format } from 'date-fns'
import { useOrders } from '@apps/customer/hooks/useOrder'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

type RootStackParamList = {
  OrderDetails: { orderId: number }
  CancelledScreen: { orderId: number }
  UpdatedScreen: { orderId: number }
}
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'OrderDetails'>
type OrderDetailsScreenRouteProp = RouteProp<RootStackParamList, 'OrderDetails'>

const OrderProgressBar = ({ status }: { status: 'unpacked' | 'deposited' | 'packed' | 'delivering' | 'delivered' }) => {
  const statuses = ['unpacked', 'deposited', 'packed', 'delivering', 'delivered'] as const
  const currentStep = statuses.indexOf(status)

  const icons: Record<(typeof statuses)[number], string> = {
    unpacked: 'box-open',
    deposited: 'archive',
    packed: 'box',
    delivering: 'truck',
    delivered: 'check-circle'
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className='mt-2 px-2'>
      <View className='flex-row items-center'>
        {statuses.map((step, index) => {
          const isActive = index <= currentStep
          const isCurrent = index === currentStep

          return (
            <View key={step} className='flex items-center mx-2'>
              {/* Connector Line */}
              {index > 0 && (
                <View className={`absolute top-3 h-0.5 w-16 mx-1 ${isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
              )}

              {/* Icon */}
              <FontAwesome5 name={icons[step]} size={18} color={isActive ? '#1f7a1f' : '#ccc'} />

              {/* Label */}
              <Text className={`text-xs mt-1 ${isActive ? 'text-green-600 font-bold' : 'text-gray-400'}`}>
                {step.charAt(0).toUpperCase() + step.slice(1)}
              </Text>
            </View>
          )
        })}
      </View>
    </ScrollView>
  )
}

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
  const statusMap: Record<string, 'unpacked' | 'deposited' | 'packed' | 'delivering' | 'delivered'> = {
    pending: 'unpacked',
    deposited: 'deposited',
    packed: 'packed',
    delivering: 'delivering',
    delivered: 'delivered',
    Pending: 'unpacked',
    Deposited: 'deposited',
    Packed: 'packed',
    Delivering: 'delivering',
    Delivered: 'delivered'
  }

  const openImageViewer = (images: SetStateAction<never[]>) => {
    setSelectedImages(images)
    setVisible(true)
  }
  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        const data = await fetchOrderDetails(orderId)
        setOrder(data)
        console.log('Order Status ne: ', order.orderStatus)
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

  const formatNumber = (num: { toString: () => string }) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

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
        {order && <OrderProgressBar status={statusMap[order.orderStatus]} />}
        <View className='p-4 rounded-lg mt-4' style={{ backgroundColor: '#264eca' }}>
          <Text className='text-white font-bold'>
            🕒 Guaranteed delivery time: {format(new Date(order.expectedDeliveryDate), 'dd-MM-yyyy')}
          </Text>

          <Text className='text-white text-sm'>
            The farm is preparing the fish and will deliver them to the shipping unit as soon as possible.
          </Text>
        </View>
        <View className='p-4 bg-white rounded-lg shadow-md mt-3'>
          <View>
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
          <View>
            <View className='flex-row justify-between'>
              <Text className='font-bold mt-3 text-right'>Total Koi price:</Text>
              <Text className='mt-3 font-semibold'> {formatNumber(order.totalFishAmount)} VND</Text>
            </View>
            <View className='flex-row justify-between'>
              <Text className='font-bold mt-3 text-right'>Total delivery:</Text>
              <Text className='mt-3 font-semibold'>{formatNumber(order.totalDeliveringAmount)} VND</Text>
            </View>
            <View className='rounded-lg shadow-md mt-3' style={{ backgroundColor: '#DFE5FB' }}>
              <View className='flex-row justify-between'>
                <Text className='font-bold text-right'>Deposit Amout (Paid):</Text>
                <Text className='font-semibold'>- {formatNumber(order.paidAmount)} VND</Text>
              </View>
              <View className='flex-row justify-between'>
                <Text className='font-bold mt-3 text-right'>Remaining: </Text>
                <Text className='mt-3 font-semibold'>{formatNumber(order.remaining)} VND</Text>
              </View>
            </View>
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
        <View className='pt-5 flex-row gap-2 w-full'>
          <TouchableOpacity
            className='flex-1 items-center rounded-lg  p-3 '
            style={{ borderColor: '#CA2629', borderWidth: 1 }}
            onPress={() => navigation.navigate('UpdatedScreen', { orderId: orderId })}
          >
            <Text className='text-center' style={{ color: '#CA2629' }}>
              Update Order
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className='flex-2  items-center rounded-lg shadow-md p-3 '
            style={{ backgroundColor: '#CA2629' }}
            onPress={() => navigation.navigate('CancelledScreen', { orderId: orderId })}
          >
            <Text className='text-center' style={{ color: '#fff' }}>
              Cancel Order
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* <Modal visible={visible} transparent={true} onRequestClose={() => setVisible(false)}>
        <View className='flex-1 bg-black bg-opacity-75 justify-center items-center'>
          {selectedImages.map((img, index) => (
            <Image key={index} source={{ uri: img.imageUrl }} className='w-80 h-80 mb-4' />
          ))}
          <TouchableOpacity onPress={() => setVisible(false)}>
            <Text className='text-white text-lg'>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal> */}
    </ScrollView>
  )
}
