// import { useNavigation } from '@react-navigation/native'
// import { StackNavigationProp } from '@react-navigation/stack'
// import React from 'react'
// import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native'

// const trips = [
//   { id: '1', title: 'Koi Serenity Journey', status: 'Upcoming' },
//   { id: '2', title: 'Koi Serenity Journey', status: 'Completed' },
//   { id: '3', title: 'Koi Serenity Journey', status: 'Completed' },
//   { id: '4', title: 'Koi Serenity Journey', status: 'Completed' },
//   { id: '5', title: 'Koi Serenity Journey', status: 'Completed' }
// ]

// type RootStackParamList = {
//   Orders: undefined
//   TourDetails: undefined
// }

// type OrdersScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Orders'>

// export default function OrdersScreen() {
//   const navigation = useNavigation<OrdersScreenNavigationProp>()

//   return (
//     <View className='flex-1 bg-white p-4'>
//       {/* Header */}
//       <Text className='text-center text-lg font-semibold'>Order History</Text>

//       {/* Search & Filter */}
//       <View className='flex-row items-center mt-3'>
//         <TextInput placeholder='Search' className='flex-1 p-2 border border-gray-300 rounded-lg' />
//         <TouchableOpacity className='ml-2 px-3 py-2 border border-gray-300 rounded-lg'>
//           <Text>All ▼</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Trip List */}
//       <FlatList
//         data={trips}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             className='bg-white shadow-md rounded-lg p-3 mt-3 flex-row items-center'
//             onPress={() => navigation.navigate('TourDetails')}
//           >
//             {/* Icon */}
//             <View className='mr-3'>
//               <Text>🛳️</Text>
//             </View>

//             {/* Trip Details */}
//             <View className='flex-1'>
//               <Text className='font-semibold'>{item.title}</Text>
//               <Text className='text-gray-500'>Order ID: TRP-20241201</Text>
//               <Text className='text-gray-500'>Customer: Leslie Alexander</Text>
//               <Text className='text-blue-500'>2024-12-01</Text>
//             </View>

//             {/* Status Badge */}
//             <View className={`px-3 py-1 rounded-full ${item.status === 'Upcoming' ? 'bg-yellow-300' : 'bg-green-600'}`}>
//               <Text className='text-white text-xs'>{item.status}</Text>
//             </View>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   )
// }
import { useOrders } from '@apps/consulting/api/useOrder.api'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'

type RootStackParamList = {
  Orders: undefined
  OrderDetails: { orderId: number }
}

type OrdersScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Orders'>

const ORDER_STATUSES = ['All', 'Deposited', 'Refunded', 'Pending', 'Delivering', 'Packed', 'Delivered', 'Cancelled']

export default function OrdersScreen() {
  const navigation = useNavigation<OrdersScreenNavigationProp>()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { fetchOrders } = useOrders()
  const [filteredOrders, setFilteredOrders] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [showDropdown, setShowDropdown] = useState(false)
  useEffect(() => {
    const getOrders = async () => {
      try {
        const data = await fetchOrders()
        setOrders(data)
      } catch (error) {
        console.error('Failed to load orders')
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

  if (loading) {
    return (
      <View className='flex-1 justify-center items-center bg-white'>
        <ActivityIndicator size='large' color='#0000ff' />
      </View>
    )
  }

  return (
    <View className='flex-1 bg-white p-4'>
      {/* Header */}
      <Text className='text-center text-lg font-semibold'>Order History</Text>

      {/* Search & Filter */}
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
      {showDropdown && (
        <View className='absolute right-4 top-20 bg-white shadow-md border border-gray-300 rounded-lg p-2 z-10'>
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
      )}
      {/* Order List */}
      {filteredOrders.length === 0 ? (
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
              {/* Icon */}
              <View className='mr-3'>
                <Text>📦</Text>
              </View>

              {/* Order Details */}
              <View className='flex-1'>
                <Text className='font-semibold'>{item.farmName}</Text>
                <Text className='text-gray-500'>Order ID: {item.orderId}</Text>
                <Text className='text-gray-500'>Customer: {item.fullName}</Text>
                <Text className='text-blue-500'>{new Date(item.createdTime).toLocaleDateString()}</Text>
              </View>

              {/* Status Badge */}
              <View
                className={`px-3 py-1 rounded-full `}
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
                                : item.orderStatuss === 'Cancelled'
                                  ? '#000000'
                                  : '#D3D3D3'
                }}
              >
                <Text className='text-white text-xs'>{item.orderStatus}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  )
}
