import DashboardCard from '@apps/delivery/components/DashBoardCard'
import OrderCard from '@apps/delivery/components/OrderCard'
import { useCurrentOrderByAll } from '@apps/delivery/hooks/useOrder'
import { DeliveryHomeStackNavigationProp } from '@apps/delivery/types/navigationDelivery.type'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import MainLayout from '@shared/layouts/MainLayout'
import { MessageCircleMore } from 'lucide-react-native'
import { styled } from 'nativewind'
import React, { useCallback, useRef } from 'react'
import { ScrollView, View, Text, TouchableOpacity, Animated } from 'react-native'

const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledAnimatedView = styled(Animated.View)

export default function HomeScreen() {
  const { orders, error, refetch } = useCurrentOrderByAll()
  const navigation = useNavigation<DeliveryHomeStackNavigationProp>()

  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [])
  )

  if (error) {
    return (
      <MainLayout
        title='Welcome to Koi Ordering System in Japan'
        backgroundImage='https://images.unsplash.com/photo-1551825687-f9de1603ed8b?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        showBackButton={false}
      >
        <View className='p-4'>
          <Text className='text-red-500'>{error}</Text>
        </View>
      </MainLayout>
    )
  }

  const scaleAnim = useRef(new Animated.Value(1)).current

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true
    }).start()
  }

  const handleOrderPress = (orderId: number) => {
    navigation.navigate('OrderDetails', { orderID: orderId })
  }

  return (
    <MainLayout
      title='Welcome to Koi Ordering System in Japan'
      backgroundImage='https://images.unsplash.com/photo-1551825687-f9de1603ed8b?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      showBackButton={false}
    >
      <DashboardCard />
      <View className='mt-10 px-5'>
        <Text className='text-base font-semibold'>Current Delivering Order</Text>
      </View>
      <ScrollView
        className='p-4 px-5'
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {orders.length > 0 ? (
          orders.map((order) => (
            <OrderCard key={order.orderId} order={order} onPress={() => handleOrderPress(order.orderId)} />
          ))
        ) : (
          <Text className='text-center text-gray-500 mt-6'>No orders found.</Text>
        )}
        <StyledTouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => navigation.navigate('Contact')}
          activeOpacity={0.8}
        >
          <StyledAnimatedView
            className='absolute bottom-4 right-4 w-14 h-14 bg-blue-600 rounded-full justify-center items-center shadow-lg'
            style={{
              backgroundColor: '#264ECA',
              elevation: 8,
              zIndex: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 6,
              transform: [{ scale: scaleAnim }]
            }}
          >
            <MessageCircleMore color='#fff' size={26} />
          </StyledAnimatedView>
        </StyledTouchableOpacity>
      </ScrollView>
    </MainLayout>
  )
}
