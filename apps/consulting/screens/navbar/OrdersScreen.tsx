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
import { fetchOrders } from '@apps/consulting/api/useOrder.api'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'

type RootStackParamList = {
  Orders: undefined
  OrderDetails: undefined
}

type OrdersScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Orders'>

export default function OrdersScreen() {
  const navigation = useNavigation<OrdersScreenNavigationProp>()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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
        <TextInput placeholder='Search' className='flex-1 p-2 border border-gray-300 rounded-lg' />
        <TouchableOpacity className='ml-2 px-3 py-2 border border-gray-300 rounded-lg'>
          <Text>All ▼</Text>
        </TouchableOpacity>
      </View>

      {/* Order List */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.orderId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            className='bg-white shadow-md rounded-lg p-3 mt-3 flex-row items-center'
            onPress={() => navigation.navigate('OrderDetails')}
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
              className={`px-3 py-1 rounded-full ${item.orderStatus === 'Pending' ? 'bg-yellow-300' : 'bg-green-600'}`}
            >
              <Text className='text-white text-xs'>{item.orderStatus}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}
