// import { useOrders } from '@apps/customer/hooks/useOrder'
// import { useNavigation } from '@react-navigation/native'
// import { StackNavigationProp } from '@react-navigation/stack'
// import React, { useEffect, useState } from 'react'
// import {
//   View,
//   Text,
//   FlatList,
//   TextInput,
//   TouchableOpacity,
//   ActivityIndicator,
//   ScrollView,
//   RefreshControl
// } from 'react-native'

// type RootStackParamList = {
//   Orders: undefined
//   OrderDetails: { orderId: number }
// }

// type OrdersScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Orders'>

// const ORDER_STATUSES = ['All', 'Deposited', 'Refunded', 'Pending', 'Delivering', 'Packed', 'Delivered']

// export default function OrdersScreen() {
//   const navigation = useNavigation<OrdersScreenNavigationProp>()
//   const [orders, setOrders] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)
//   const { fetchOrders } = useOrders()
//   const [filteredOrders, setFilteredOrders] = useState<any[]>([])
//   const [searchQuery, setSearchQuery] = useState('')
//   const [selectedStatus, setSelectedStatus] = useState('All')
//   const [showDropdown, setShowDropdown] = useState(false)
//   const [refreshing, setRefreshing] = useState(false)

//   useEffect(() => {
//     const getOrders = async () => {
//       try {
//         const data = await fetchOrders()
//         setOrders(data)
//       } catch (error) {
//         console.error('No Order is found')
//       } finally {
//         setLoading(false)
//       }
//     }
//     getOrders()
//   }, [])

//   useEffect(() => {
//     let filtered = orders

//     if (searchQuery) {
//       const query = searchQuery.toLowerCase()
//       filtered = filtered.filter(
//         (order) =>
//           order.orderId.toString().includes(query) ||
//           order.farmName.toLowerCase().includes(query) ||
//           order.fullName.toLowerCase().includes(query)
//       )
//     }

//     if (selectedStatus !== 'All') {
//       filtered = filtered.filter((order) => order.orderStatus === selectedStatus)
//     }

//     setFilteredOrders(filtered)
//   }, [searchQuery, selectedStatus, orders])

//   const onRefresh = async () => {
//     setRefreshing(true)
//     try {
//       const data = await fetchOrders()
//       setOrders(data)
//     } catch (error) {
//       console.error('Error refreshing the page:', error)
//     } finally {
//       setRefreshing(false)
//     }
//   }

//   if (loading) {
//     return (
//       <View className='flex-1 justify-center items-center bg-white'>
//         <ActivityIndicator size='large' color='#0000ff' />
//       </View>
//     )
//   }

//   return (
//     <View className='flex-1 bg-white p-4'>
//       {/* Header */}
//       <Text className='text-center text-lg font-semibold'>Order History</Text>

//       {/* Search & Filter */}
//       <View className='flex-row items-center mt-3'>
//         <TextInput
//           placeholder='Search'
//           className='flex-1 p-2 border border-gray-300 rounded-lg'
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//         />
//         <TouchableOpacity
//           className='ml-2 px-3 py-2 border border-gray-300 rounded-lg'
//           onPress={() => setShowDropdown(!showDropdown)}
//         >
//           <Text>{selectedStatus} ▼</Text>
//         </TouchableOpacity>
//       </View>
//       {showDropdown && (
//         <View className='absolute right-4 top-20 bg-white shadow-md border border-gray-300 rounded-lg p-2 z-10'>
//           {ORDER_STATUSES.map((status) => (
//             <TouchableOpacity
//               key={status}
//               className='p-2'
//               onPress={() => {
//                 setSelectedStatus(status)
//                 setShowDropdown(false)
//               }}
//             >
//               <Text className={selectedStatus === status ? 'text-blue-500 font-semibold' : 'text-gray-800'}>
//                 {status}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       )}
//       {/* Order List */}
//       <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
//         {filteredOrders.length === 0 ? (
//           <View className='flex-1 justify-center items-center'>
//             <Text className='text-gray-500 text-lg'>No Order is found</Text>
//           </View>
//         ) : (
//           <FlatList
//             data={filteredOrders}
//             keyExtractor={(item) => item.orderId.toString()}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 className='bg-white shadow-md rounded-lg p-3 mt-3 flex-row items-center'
//                 onPress={() => navigation.navigate('OrderDetails', { orderId: item.orderId })}
//               >
//                 {/* Icon */}
//                 <View className='mr-3'>
//                   <Text>📦</Text>
//                 </View>

//                 {/* Order Details */}
//                 <View className='flex-1'>
//                   <Text className='font-semibold'>{item.farmName}</Text>
//                   <Text className='text-gray-500'>Order ID: {item.orderId}</Text>
//                   <Text className='text-gray-500'>Customer: {item.fullName}</Text>
//                   <Text className='text-blue-500'>{new Date(item.createdTime).toLocaleDateString()}</Text>
//                 </View>

//                 {/* Status Badge */}
//                 <View
//                   className={`px-3 py-1 rounded-full `}
//                   style={{
//                     backgroundColor:
//                       item.orderStatus === 'Deposited'
//                         ? '#ADD8E6'
//                         : item.orderStatus === 'Refunded'
//                           ? '#A94064'
//                           : item.orderStatus === 'Pending'
//                             ? '#FFA500'
//                             : item.orderStatus === 'Delivering'
//                               ? '#FFD700'
//                               : item.orderStatus === 'Packed'
//                                 ? '#0000FF'
//                                 : item.orderStatus === 'Delivered'
//                                   ? '#008000'
//                                   : '#D3D3D3'
//                   }}
//                 >
//                   <Text className='text-white text-xs'>{item.orderStatus}</Text>
//                 </View>
//               </TouchableOpacity>
//             )}
//           />
//         )}
//       </ScrollView>
//     </View>
//   )
// }

import { useOrders } from '@apps/customer/hooks/useOrder'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native'

type RootStackParamList = {
  Orders: undefined
  OrderDetails: { orderId: number }
}

type OrdersScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Orders'>

const ORDER_STATUSES = ['All', 'Deposited', 'Refunded', 'Pending', 'Delivering', 'Packed', 'Delivered']

export default function OrdersScreen() {
  const navigation = useNavigation<OrdersScreenNavigationProp>()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { fetchOrders } = useOrders()
  const [filteredOrders, setFilteredOrders] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [showDropdown, setShowDropdown] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const getOrders = async () => {
      try {
        const data = await fetchOrders()
        setOrders(data)
      } catch (error) {
        // console.error('No Order is found')
      } finally {
        setLoading(false)
      }
    }
    getOrders()
  }, [])

  useEffect(() => {
    let filtered = orders

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (order) =>
          order.orderId.toString().includes(query) ||
          order.farmName.toLowerCase().includes(query) ||
          order.fullName.toLowerCase().includes(query)
      )
    }

    if (selectedStatus !== 'All') {
      filtered = filtered.filter((order) => order.orderStatus === selectedStatus)
    }

    setFilteredOrders(filtered)
  }, [searchQuery, selectedStatus, orders])

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      const data = await fetchOrders()
      setOrders(data)
    } catch (error) {
      console.error('Error refreshing the page:', error)
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

  const sections = [
    {
      type: 'header',
      render: () => <Text className='text-center text-lg font-semibold'>Order History</Text>
    },
    {
      type: 'searchFilter',
      render: () => (
        <View className='flex-row items-center mt-3'>
          <TextInput
            placeholder='Search'
            className='flex-1 p-2 border border-gray-300 rounded-lg'
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity
            className='ml-2 px-3 py-2 border border-gray-300 rounded-lg'
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <Text>{selectedStatus} ▼</Text>
          </TouchableOpacity>
        </View>
      )
    },
    ...(showDropdown
      ? [
          {
            type: 'dropdown',
            render: () => (
              <View className='absolute right-0 top-2 bg-white shadow-md border border-gray-300 rounded-lg p-2 z-10'>
                {ORDER_STATUSES.map((status) => (
                  <TouchableOpacity
                    key={status}
                    className='p-2'
                    onPress={() => {
                      setSelectedStatus(status)
                      setShowDropdown(false)
                    }}
                  >
                    <Text className={selectedStatus === status ? 'text-blue-500 font-semibold' : 'text-gray-800'}>
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )
          }
        ]
      : []),
    {
      type: 'orderList',
      render: () =>
        filteredOrders.length === 0 ? (
          <View className='flex-1 justify-center items-center'>
            <Text className='text-gray-500 text-lg'>No Order is found</Text>
          </View>
        ) : (
          <FlatList
            data={filteredOrders}
            keyExtractor={(item) => item.orderId.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                className='bg-white shadow-md rounded-lg p-3 mt-3 flex-row items-center'
                onPress={() => navigation.navigate('OrderDetails', { orderId: item.orderId })}
              >
                <View className='mr-3'>
                  <Text>📦</Text>
                </View>
                <View className='flex-1'>
                  <Text className='font-semibold'>{item.farmName}</Text>
                  <Text className='text-gray-500'>Order ID: {item.orderId}</Text>
                  <Text className='text-gray-500'>Customer: {item.fullName}</Text>
                  <Text className='text-blue-500'>{new Date(item.createdTime).toLocaleDateString()}</Text>
                </View>
                <View
                  className='px-3 py-1 rounded-full'
                  style={{
                    backgroundColor:
                      item.orderStatus === 'Deposited'
                        ? '#ADD8E6'
                        : item.orderStatus === 'Refunded'
                          ? '#A94064'
                          : item.orderStatus === 'Pending'
                            ? '#FFA500'
                            : item.orderStatus === 'Delivering'
                              ? '#FFD700'
                              : item.orderStatus === 'Packed'
                                ? '#0000FF'
                                : item.orderStatus === 'Delivered'
                                  ? '#008000'
                                  : '#D3D3D3'
                  }}
                >
                  <Text className='text-white text-xs'>{item.orderStatus}</Text>
                </View>
              </TouchableOpacity>
            )}
            nestedScrollEnabled
          />
        )
    }
  ]

  return (
    <FlatList
      data={sections}
      keyExtractor={(item) => item.type}
      renderItem={({ item }) => item.render()}
      contentContainerStyle={{ padding: 16, backgroundColor: '#fff', flexGrow: 1 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    />
  )
}
