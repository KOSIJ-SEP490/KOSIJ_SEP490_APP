import { View, Text } from 'react-native'
import { useDashboard } from '../hooks/useOrder'

export default function DashboardCard() {
  const { dashboard, error } = useDashboard()

  if (error) {
    return (
      <View className='p-4 bg-red-500 rounded-lg'>
        <Text className='text-white text-center'>{error}</Text>
      </View>
    )
  }

  return (
    <View className='p-4 px-5 mt-3'>
      <Text className='text-base font-semibold'>Dashboard</Text>
      <View className='bg-blue p-6 rounded-lg mt-2'>
        {dashboard ? (
          <View>
            <Text className='text-white text-base'>Total Shipment: {dashboard.totalOrders}</Text>
            <Text className='text-white text-base'>Packaged Shipment: {dashboard.totalPackagedOrders}</Text>
            <Text className='text-white text-base'>Delivering Shipment: {dashboard.totalDeliveringOrders}</Text>
            <Text className='text-white text-base'>Success Shipment: {dashboard.totalSuccessfulOrders}</Text>
            <Text className='text-white text-base'>Canceled Shipment: {dashboard.totalCancelledOrders}</Text>
            <Text className='text-white text-base'>Refunded Shipment: {dashboard.totalRefundedOrders}</Text>
          </View>
        ) : (
          <Text className='text-white text-center mt-2'>Loading...</Text>
        )}
      </View>
    </View>
  )
}
