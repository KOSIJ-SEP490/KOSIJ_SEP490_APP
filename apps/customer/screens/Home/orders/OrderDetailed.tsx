// import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
// import { ChevronLeft } from 'lucide-react-native'
// import React, {
//   JSXElementConstructor,
//   Key,
//   ReactElement,
//   ReactNode,
//   ReactPortal,
//   SetStateAction,
//   useEffect,
//   useState
// } from 'react'
// import {
//   ScrollView,
//   TouchableOpacity,
//   View,
//   Text,
//   Image,
//   Clipboard,
//   Alert,
//   ActivityIndicator,
//   ImageSourcePropType,
//   Modal,
//   RefreshControl,
//   Platform
// } from 'react-native'
// import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'
// import { format } from 'date-fns'
// import { useOrders } from '@apps/customer/hooks/useOrder'
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
// import { Divider, IconButton, Menu, Provider } from 'react-native-paper'

// type RootStackParamList = {
//   OrderDetails: { orderId: number }
//   CancelledScreen: { orderId: number }
//   UpdatedScreen: { orderId: number }
//   PaymentScreen: { orderId: number }
//   PaymentDetails: { orderId: number }
//   PaymentFailed: undefined
//   Orders: undefined
// }
// type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'OrderDetails'>
// type OrderDetailsScreenRouteProp = RouteProp<RootStackParamList, 'OrderDetails'>

// const OrderProgressBar = ({ status }: { status: 'unpacked' | 'deposited' | 'packed' | 'delivering' | 'delivered' }) => {
//   const statuses = ['unpacked', 'deposited', 'packed', 'delivering', 'delivered'] as const
//   const currentStep = statuses.indexOf(status)

//   const icons: Record<(typeof statuses)[number], string> = {
//     unpacked: 'box-open',
//     deposited: 'archive',
//     packed: 'box',
//     delivering: 'truck',
//     delivered: 'check-circle'
//   }

//   return (
//     <ScrollView horizontal showsHorizontalScrollIndicator={false} className='mt-2 px-2'>
//       <View className='flex-row items-center'>
//         {statuses.map((step, index) => {
//           const isActive = index <= currentStep
//           const isCurrent = index === currentStep

//           return (
//             <View key={step} className='flex items-center mx-2'>
//               {/* Connector Line */}
//               {index > 0 && (
//                 <View className={`absolute top-3 h-0.5 w-16 mx-1 ${isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
//               )}

//               {/* Icon */}
//               <FontAwesome5 name={icons[step]} size={18} color={isActive ? '#1f7a1f' : '#ccc'} />

//               {/* Label */}
//               <Text className={`text-xs mt-1 ${isActive ? 'text-green-600 font-bold' : 'text-gray-400'}`}>
//                 {step.charAt(0).toUpperCase() + step.slice(1)}
//               </Text>
//             </View>
//           )
//         })}
//       </View>
//     </ScrollView>
//   )
// }

// export default function OrderDetailsScreen() {
//   const navigation = useNavigation<NavigationProps>()
//   // const orderId = '#Order2412'
//   const { fetchOrderDetails, exportOrderBill } = useOrders()

//   const handleCopy = () => {
//     Clipboard.setString(orderId.toString())
//     Alert.alert('Copied!', 'Order ID has been copied to clipboard.')
//   }
//   const route = useRoute<OrderDetailsScreenRouteProp>()
//   const { orderId } = route.params

//   const [visibleButton, setVisibleButton] = useState(false)

//   const [order, setOrder] = useState<any>(null)
//   const [loading, setLoading] = useState(true)
//   const [visible, setVisible] = useState(false)
//   const [selectedImages, setSelectedImages] = useState([])
//   const [refreshing, setRefreshing] = useState(false)
//   const [loadingExport, setLoadingExport] = useState(false)

//   const statusMap: Record<string, 'unpacked' | 'deposited' | 'packed' | 'delivering' | 'delivered'> = {
//     pending: 'unpacked',
//     deposited: 'deposited',
//     packed: 'packed',
//     delivering: 'delivering',
//     delivered: 'delivered',
//     Pending: 'unpacked',
//     Deposited: 'deposited',
//     Packed: 'packed',
//     Delivering: 'delivering',
//     Delivered: 'delivered'
//   }

//   const openImageViewer = (images: SetStateAction<never[]>) => {
//     setSelectedImages(images)
//     setVisible(true)
//   }
//   useEffect(() => {
//     const getOrderDetails = async () => {
//       try {
//         const data = await fetchOrderDetails(orderId)
//         setOrder(data)
//         console.log('Order Status ne: ', order.orderStatus)
//       } catch (error) {
//         // console.error('Failed to load order details')
//       } finally {
//         setLoading(false)
//       }
//     }
//     getOrderDetails()
//   }, [orderId])
//   const onRefresh = async () => {
//     setRefreshing(true)
//     try {
//       const data = await fetchOrderDetails(orderId)
//       setOrder(data)
//     } catch (error) {
//       console.error('Error refreshing the page:', error)
//     } finally {
//       setRefreshing(false)
//     }
//   }

//   const handleExportBill = async () => {
//     setLoadingExport(true)
//     try {
//       await exportOrderBill(orderId.toString())
//       Alert.alert('Success', 'Bill exported successfully.')
//     } catch (error) {
//       console.error('Failed to export bill:', error)
//       Alert.alert('Error', 'Failed to export bill. Please try again.')
//     } finally {
//       setLoadingExport(false)
//       setVisibleButton(false)
//     }
//   }

//   if (loading) {
//     return (
//       <View className='flex-1 justify-center items-center bg-white'>
//         <ActivityIndicator size='large' color='#0000ff' />
//       </View>
//     )
//   }

//   const formatNumber = (num: { toString: () => string }) => {
//     return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
//   }

//   return (
//     <Provider>
//       <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
//         <View className='flex-1 mt-3 bg-white p-4'>
//           {/* Header */}
//           <View className='flex-row items-center px-4 py-2'>
//             <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
//               <ChevronLeft color={'#292D32'} size={24} />
//             </TouchableOpacity>
//             <Text className='text-lg font-semibold text-center flex-1'>Order Details</Text>
//             <View style={{ width: 24 }} />
//           </View>
//           {order && <OrderProgressBar status={statusMap[order.orderStatus]} />}
//           <View className='p-4 rounded-lg mt-4' style={{ backgroundColor: '#264eca' }}>
//             <Text className='text-white font-bold'>
//               🕒 Guaranteed delivery time: {format(new Date(order.expectedDeliveryDate), 'dd-MM-yyyy')}
//             </Text>

//             <Text className='text-white text-sm'>
//               The farm is preparing the fish and will deliver them to the shipping unit as soon as possible.
//             </Text>
//           </View>
//           <View className='p-4 bg-white rounded-lg shadow-md mt-3'>
//             <View>
//               <Text className='font-bold '>Delivery address</Text>
//               <Text>{order.fullName}</Text>
//               <Text className='text-gray-600'>{order.phoneNumber}</Text>
//               <Text>{order.deliveryAddress}</Text>
//             </View>
//           </View>
//           <View className='p-4 bg-white rounded-lg shadow-md mt-3'>
//             <View>
//               <Text className='font-bold text-base'>🏡 {order.farmName} &gt;</Text>
//             </View>
//             {/* Fish List */}
//             <View className='mt-3 border-b border-zinc-300'>
//               {order.orderDetails.map((fish: any) => (
//                 <View className='flex-row items-center mb-3' key={fish.id}>
//                   {/* Clickable Image */}
//                   <TouchableOpacity /*onPress={() => openImageViewer(fish.orderDetailImages)} */>
//                     <Image source={{ uri: fish.orderDetailImages?.[0]?.imageUrl }} className='w-16 h-12 rounded-lg' />
//                   </TouchableOpacity>

//                   <View className='ml-3 flex-1'>
//                     <Text className='font-bold'>{fish.variety}</Text>
//                   </View>
//                   <Text className='font-bold'>x{fish.quantity}</Text>
//                   <Text className='ml-2'>{formatNumber(fish.koiPrice)} VND</Text>
//                 </View>
//               ))}
//             </View>

//             {/* Total Price */}
//             <View>
//               <View className='flex-row justify-between'>
//                 <Text className='font-bold mt-3 text-right'>Total Koi price:</Text>
//                 <Text className='mt-3 font-semibold'> {formatNumber(order.totalFishAmount)} VND</Text>
//               </View>
//               <View className='flex-row justify-between'>
//                 <Text className='font-bold mt-3 text-right'>Total delivery:</Text>
//                 <Text className='mt-3 font-semibold'>{formatNumber(order.totalDeliveringAmount)} VND</Text>
//               </View>
//               <View className='rounded-lg shadow-md mt-3' style={{ backgroundColor: '#DFE5FB' }}>
//                 <View className='flex-row justify-between'>
//                   <Text className='font-bold text-right'>Deposit Amout:</Text>
//                   <Text className='font-semibold'>{formatNumber(order.paidAmount)} VND</Text>
//                 </View>
//                 <View className='flex-row justify-between'>
//                   <Text className='font-bold mt-3 text-right'>Remaining: </Text>
//                   <Text className='mt-3 font-semibold'>{formatNumber(order.remaining)} VND</Text>
//                 </View>
//               </View>
//             </View>

//             {/* Final Total */}
//             <View className='flex-row justify-between border-t mt-3 pt-3'>
//               <Text className='font-bold text-lg'>Total price: </Text>
//               <Text className='font-bold text-lg'>{formatNumber(order.totalOrderAmount)} VND</Text>
//             </View>
//           </View>
//           <View className='p-4 bg-white rounded-lg shadow-md mt-3'>
//             {/* Order ID Row */}
//             <View className='flex-row items-center justify-between mb-2'>
//               <Text className='font-bold'>Order ID</Text>
//               <View className='flex-row items-center'>
//                 <Text className='text-gray-600 mr-2'>{orderId}</Text>
//                 <TouchableOpacity onPress={handleCopy} className='border border-gray-300 px-2 py-1 rounded-md'>
//                   <Text className='text-gray-600 text-sm'>Copy</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>

//             {/* Payment Method Row */}
//             <View className='flex-row justify-between mb-2'>
//               <Text className='text-gray-600'>Payment method</Text>
//               <Text className='text-gray-800 font-medium'>KOSIJ Wallet</Text>
//             </View>

//             {/* Note Row */}
//             <View className='flex-row'>
//               <Text className='text-gray-600 w-1/4'>Note</Text>
//               <Text className='text-gray-800 w-3/4 text-right'>{order.note || 'null'}</Text>
//             </View>
//           </View>
//           <View className='flex-row gap-2 w-full pt-5'>
//             {/* Payment Button */}
//             {/* <View className='flex-1'>
//               <TouchableOpacity
//                 className='items-center rounded-lg shadow-md p-3'
//                 style={{ backgroundColor: '#F0A500' }}
//                 onPress={() => navigation.navigate('PaymentDetails', { orderId: orderId })}
//               >
//                 <Text className='text-white'>Payment</Text>
//               </TouchableOpacity>
//             </View> */}
//             {['Pending', 'Delivering'].includes(order.orderStatus) ? (
//               <View className='flex-1'>
//                 <TouchableOpacity
//                   className='items-center rounded-lg shadow-md p-3'
//                   style={{ backgroundColor: '#F0A500' }}
//                   onPress={() => navigation.navigate('PaymentDetails', { orderId: orderId })}
//                 >
//                   <Text className='text-white'>Payment</Text>
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <View className='flex-1'>
//                 <TouchableOpacity
//                   className='items-center rounded-lg shadow-md p-3 opacity-50'
//                   style={{ backgroundColor: '#F0A500' }}
//                   disabled
//                 >
//                   <Text className='text-white'>Payment</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//             <View>
//               {/* Menu Button */}
//               <Menu
//                 visible={visibleButton}
//                 onDismiss={() => setVisibleButton(false)}
//                 anchor={
//                   <TouchableOpacity
//                     className='rounded-lg border '
//                     style={{ borderColor: '#F0A500' }}
//                     onPress={() => setVisibleButton((prev) => !prev)}
//                   >
//                     <IconButton icon='dots-vertical' size={13} />
//                   </TouchableOpacity>
//                 }
//                 contentStyle={{
//                   width: 120,
//                   paddingVertical: 2
//                 }}
//               >
//                 <Menu.Item
//                   onPress={() => {
//                     setVisibleButton(false)
//                     navigation.navigate('UpdatedScreen', { orderId })
//                   }}
//                   title='Update Order'
//                   titleStyle={{ fontSize: 12 }}
//                   style={{ height: 30, justifyContent: 'center', paddingVertical: 2 }}
//                 />
//                 <Divider />
//                 <Menu.Item
//                   onPress={() => {
//                     setVisibleButton(false)
//                     navigation.navigate('CancelledScreen', { orderId })
//                   }}
//                   title='Cancel Order'
//                   titleStyle={{ fontSize: 12 }}
//                   style={{ height: 30, justifyContent: 'center', paddingVertical: 2 }}
//                 />
//                 <Divider />
//                 <Menu.Item
//                   onPress={handleExportBill}
//                   title={loadingExport ? 'Exporting...' : 'Export Bill'}
//                   titleStyle={{ fontSize: 12 }}
//                   style={{ height: 30, justifyContent: 'center', paddingVertical: 2 }}
//                   disabled={loadingExport}
//                 />
//               </Menu>
//             </View>
//           </View>
//         </View>
//         {/* <Modal visible={visible} transparent={true} onRequestClose={() => setVisible(false)}>
//         <View className='flex-1 bg-black bg-opacity-75 justify-center items-center'>
//           {selectedImages.map((img, index) => (
//             <Image key={index} source={{ uri: img.imageUrl }} className='w-80 h-80 mb-4' />
//           ))}
//           <TouchableOpacity onPress={() => setVisible(false)}>
//             <Text className='text-white text-lg'>Close</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal> */}
//       </ScrollView>
//     </Provider>
//   )
// }

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { ChevronLeft } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  Clipboard,
  Alert,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  RefreshControl
} from 'react-native'
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'
import { format } from 'date-fns'
import { useOrders } from '@apps/customer/hooks/useOrder'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { Divider, IconButton, Menu, Provider } from 'react-native-paper'

type RootStackParamList = {
  OrderDetails: { orderId: number }
  CancelledScreen: { orderId: number }
  UpdatedScreen: { orderId: number }
  PaymentScreen: { orderId: number }
  PaymentDetails: { orderId: number }
  PaymentFailed: undefined
  Orders: undefined
}
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'OrderDetails'>
type OrderDetailsScreenRouteProp = RouteProp<RootStackParamList, 'OrderDetails'>

const OrderProgressBar = ({ status }: { status: string }) => {
  const statuses = [
    { key: 'Pending', icon: 'box-open', label: 'Unpacked' },
    { key: 'Deposited', icon: 'archive', label: 'Deposited' },
    { key: 'Packed', icon: 'box', label: 'Packed' },
    { key: 'Delivering', icon: 'truck', label: 'Delivering' },
    { key: 'Completed', icon: 'check-circle', label: 'Completed' }
  ]

  const currentIndex = statuses.findIndex((s) => s.key === status)

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressRow}>
        {statuses.map((statusItem, index) => {
          const isActive = index <= currentIndex
          const isCurrent = index === currentIndex

          return (
            <View key={statusItem.key} style={styles.progressItem}>
              {index > 0 && (
                <View style={[styles.connector, isActive ? styles.connectorActive : styles.connectorInactive]} />
              )}
              <View
                style={[styles.iconContainer, isActive ? styles.iconContainerActive : styles.iconContainerInactive]}
              >
                <FontAwesome5 name={statusItem.icon} size={18} color={isActive ? '#fff' : '#ccc'} />
              </View>
              <Text
                style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}
                numberOfLines={1}
                ellipsizeMode='tail'
              >
                {statusItem.label}
              </Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}

export default function OrderDetailsScreen() {
  const navigation = useNavigation<NavigationProps>()
  const { fetchOrderDetails, exportOrderBill } = useOrders()
  const route = useRoute<OrderDetailsScreenRouteProp>()
  const { orderId } = route.params

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [visibleButton, setVisibleButton] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [loadingExport, setLoadingExport] = useState(false)

  const statusMap: Record<string, 'Pending' | 'Deposited' | 'Packed' | 'Delivering' | 'Completed'> = {
    pending: 'Pending',
    deposited: 'Deposited',
    packed: 'Packed',
    delivering: 'Delivering',
    delivered: 'Completed',
    Pending: 'Pending',
    Deposited: 'Deposited',
    Packed: 'Packed',
    Delivering: 'Delivering',
    Delivered: 'Completed'
  }

  const handleCopy = () => {
    Clipboard.setString(orderId.toString())
    Alert.alert('Copied!', 'Order ID has been copied to clipboard.')
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
      setOrder(data)
    } catch (error) {
      console.error('Error refreshing the page:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const handleExportBill = async () => {
    setLoadingExport(true)
    try {
      await exportOrderBill(orderId.toString())
      Alert.alert('Success', 'Bill exported successfully.')
    } catch (error) {
      console.error('Failed to export bill:', error)
      Alert.alert('Error', 'Failed to export bill. Please try again.')
    } finally {
      setLoadingExport(false)
      setVisibleButton(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#0000ff' />
      </View>
    )
  }

  const formatNumber = (num: { toString: () => string }) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  return (
    <Provider>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
              <ChevronLeft color={'#292D32'} size={24} />
            </TouchableOpacity>
            <Text style={styles.headerText}>Order Details</Text>
            <View style={{ width: 24 }} />
          </View>
          {order && <OrderProgressBar status={statusMap[order.orderStatus]} />}
          <View style={[styles.infoCard, { backgroundColor: '#264eca' }]}>
            <Text style={styles.infoTitle}>
              🕒 Guaranteed delivery time: {format(new Date(order.expectedDeliveryDate), 'dd-MM-yyyy')}
            </Text>
            <Text style={styles.infoText}>
              The farm is preparing the fish and will deliver them to the shipping unit as soon as possible.
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Delivery address</Text>
            <Text>{order.fullName}</Text>
            <Text style={styles.textGray}>{order.phoneNumber}</Text>
            <Text>{order.deliveryAddress}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>🏡 {order.farmName} </Text>
            {/* Fish List */}
            <View style={styles.fishList}>
              {order.orderDetails.map((fish: any) => (
                <View style={styles.fishItem} key={fish.id}>
                  <Image source={{ uri: fish.orderDetailImages?.[0]?.imageUrl }} style={styles.fishImage} />
                  <View style={styles.fishDetails}>
                    <Text style={styles.fishName}>{fish.variety}</Text>
                  </View>
                  <Text style={styles.fishQuantity}>x{fish.quantity}</Text>
                  <Text style={styles.fishPrice}>{formatNumber(fish.koiPrice)} VND</Text>
                </View>
              ))}
            </View>
            {/* Total Price */}
            <View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Total Koi price:</Text>
                <Text style={styles.priceValue}>{formatNumber(order.totalFishAmount)} VND</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Total delivery:</Text>
                <Text style={styles.priceValue}>{formatNumber(order.totalDeliveringAmount)} VND</Text>
              </View>
              <View style={[styles.priceCard, { backgroundColor: '#DFE5FB' }]}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Deposit Amount:</Text>
                  <Text style={styles.priceValue}>{formatNumber(order.paidAmount)} VND</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Remaining:</Text>
                  <Text style={styles.priceValue}>{formatNumber(order.remaining)} VND</Text>
                </View>
              </View>
            </View>
            {/* Final Total */}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total price:</Text>
              <Text style={styles.totalValue}>{formatNumber(order.totalOrderAmount)} VND</Text>
            </View>
          </View>
          <View style={styles.card}>
            {/* Order ID Row */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Order ID</Text>
              <View style={styles.orderIdContainer}>
                <Text style={styles.textGray}>{orderId}</Text>
                <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
                  <Text style={styles.copyText}>Copy</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* Payment Method Row */}
            <View style={styles.infoRow}>
              <Text style={styles.textGray}>Payment method</Text>
              <Text style={styles.infoValue}>KOSIJ Wallet</Text>
            </View>
            {/* Note Row */}
            <View style={styles.infoRow}>
              <Text style={[styles.textGray, { width: '25%' }]}>Note</Text>
              <Text style={[styles.infoValue, { width: '75%', textAlign: 'right' }]}>{order.note || 'null'}</Text>
            </View>
          </View>
          <View style={styles.buttonRow}>
            {['Pending', 'Delivering'].includes(order.orderStatus) ? (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#F0A500' }]}
                  onPress={() => navigation.navigate('PaymentDetails', { orderId: orderId })}
                >
                  <Text style={styles.buttonText}>Payment</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#F0A500', opacity: 0.5 }]} disabled>
                  <Text style={styles.buttonText}>Payment</Text>
                </TouchableOpacity>
              </View>
            )}
            <View>
              <Menu
                visible={visibleButton}
                onDismiss={() => setVisibleButton(false)}
                anchor={
                  <TouchableOpacity
                    style={[styles.menuButton, { borderColor: '#F0A500' }]}
                    onPress={() => setVisibleButton((prev) => !prev)}
                  >
                    <IconButton icon='dots-vertical' size={13} />
                  </TouchableOpacity>
                }
                contentStyle={styles.menuContent}
              >
                <Menu.Item
                  onPress={() => {
                    setVisibleButton(false)
                    navigation.navigate('UpdatedScreen', { orderId })
                  }}
                  title='Update Order'
                  titleStyle={styles.menuItemText}
                  style={styles.menuItem}
                />
                <Divider />
                <Menu.Item
                  onPress={() => {
                    setVisibleButton(false)
                    navigation.navigate('CancelledScreen', { orderId })
                  }}
                  title='Cancel Order'
                  titleStyle={styles.menuItemText}
                  style={styles.menuItem}
                />
                <Divider />
                <Menu.Item
                  onPress={handleExportBill}
                  title={loadingExport ? 'Exporting...' : 'Export Bill'}
                  titleStyle={styles.menuItemText}
                  style={styles.menuItem}
                  disabled={loadingExport}
                />
              </Menu>
            </View>
          </View>
        </View>
      </ScrollView>
    </Provider>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  container: {
    flex: 1,
    marginTop: 12,
    backgroundColor: '#fff',
    padding: 16
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1
  },
  progressContainer: {
    marginTop: 8,
    paddingHorizontal: 8
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  progressItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative'
  },
  connector: {
    position: 'absolute',
    top: 20,
    left: '-50%',
    right: '50%',
    height: 2,
    backgroundColor: '#ccc',
    zIndex: 5
  },
  connectorActive: {
    backgroundColor: '#1f7a1f'
  },
  connectorInactive: {
    backgroundColor: '#ccc'
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10
  },
  iconContainerActive: {
    backgroundColor: '#1f7a1f'
  },
  iconContainerInactive: {
    backgroundColor: '#e5e7eb'
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center'
  },
  labelActive: {
    color: '#1f7a1f',
    fontWeight: '600'
  },
  labelInactive: {
    color: '#9ca3af'
  },
  infoCard: {
    padding: 16,
    borderRadius: 8,
    marginTop: 16
  },
  infoTitle: {
    color: '#fff',
    fontWeight: '700'
  },
  infoText: {
    color: '#fff',
    fontSize: 14
  },
  card: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 12
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 16
  },
  fishList: {
    marginTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#d4d4d4'
  },
  fishItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  fishImage: {
    width: 64,
    height: 48,
    borderRadius: 8
  },
  fishDetails: {
    flex: 1,
    marginLeft: 12
  },
  fishName: {
    fontWeight: '700'
  },
  fishQuantity: {
    fontWeight: '700'
  },
  fishPrice: {
    marginLeft: 8
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12
  },
  priceLabel: {
    fontWeight: '700'
  },
  priceValue: {
    fontWeight: '600'
  },
  priceCard: {
    borderRadius: 8,
    padding: 16,
    marginTop: 12
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#d4d4d4',
    marginTop: 12,
    paddingTop: 12
  },
  totalLabel: {
    fontWeight: '700',
    fontSize: 18
  },
  totalValue: {
    fontWeight: '700',
    fontSize: 18
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  infoLabel: {
    fontWeight: '700'
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textGray: {
    color: '#4b5563'
  },
  copyButton: {
    borderWidth: 1,
    borderColor: '#d4d4d4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8
  },
  copyText: {
    color: '#4b5563',
    fontSize: 12
  },
  infoValue: {
    color: '#1f2937',
    fontWeight: '500'
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 20
  },
  buttonContainer: {
    flex: 1
  },
  actionButton: {
    alignItems: 'center',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3
  },
  buttonText: {
    color: '#fff'
  },
  menuButton: {
    borderWidth: 1,
    borderRadius: 8
  },
  menuContent: {
    width: 120,
    paddingVertical: 2
  },
  menuItem: {
    height: 30,
    justifyContent: 'center',
    paddingVertical: 2
  },
  menuItemText: {
    fontSize: 12
  }
})
