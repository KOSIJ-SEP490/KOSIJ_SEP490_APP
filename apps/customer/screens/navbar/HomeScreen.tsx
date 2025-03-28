import { View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import MainLayout from '@shared/layouts/MainLayout'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { RouteProp } from '@react-navigation/native'
import TourCard from '@apps/customer/components/Card/Tour/TourCard'
import Divider from '@shared/components/Divider'
import { useTourCards } from '@apps/customer/hooks/useTour'
import { useAllFarms } from '@apps/customer/hooks/useFarm'

import { useAllFeedbacks } from '@apps/customer/hooks/useFeedback'
import FeedbackCard from '@apps/customer/components/Card/FeedBackCard'
import FarmCard from '@apps/customer/components/Card/Farm/FarmCard'
import { CustomerHomeStackParamList } from '@apps/customer/types/navigationCustomerType'

type HomeScreenProps = {
  navigation: StackNavigationProp<CustomerHomeStackParamList, 'Home'>
  route: RouteProp<CustomerHomeStackParamList, 'Home'>
}

type MenuItem = {
  name: string
  icon: string
  screen: keyof CustomerHomeStackParamList
  iconType: 'ionicons' | 'material'
}

const menuItems: MenuItem[] = [
  {
    name: 'Booking',
    icon: 'bus',
    screen: 'Booking',
    iconType: 'ionicons'
  },
  {
    name: 'Farms',
    icon: 'tractor',
    screen: 'Farms',
    iconType: 'material'
  },
  {
    name: 'Koi',
    icon: 'fish',
    screen: 'Kois',
    iconType: 'material'
  }
]

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { tourCards } = useTourCards()
  const { farms } = useAllFarms()
  const { feedbacks } = useAllFeedbacks()

  const renderIcon = (item: MenuItem) => {
    if (item.iconType === 'ionicons') {
      return <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={32} color='#2563EB' />
    }
    return (
      <MaterialCommunityIcons
        name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap}
        size={32}
        color='#2563EB'
      />
    )
  }

  return (
    <MainLayout
      title='Welcome to Koi Ordering System in Japan'
      backgroundImage='https://images.unsplash.com/photo-1642915658296-41f62aa19e39?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      showBackButton={false}
    >
      <View className='flex-row justify-around w-full mt-5'>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onPress={() => navigation.navigate(item.screen as any)}
            className='items-center'
          >
            <View className='bg-blue-100 rounded-2xl'>{renderIcon(item)}</View>
            <Text className='text-[#2563EB] text-xs font-semibold'>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Divider />

      <View className='px-4 mb-6'>
        <View className='flex-row justify-between items-center px-4 py-4'>
          <Text className='text-base font-semibold'>Upcoming Tours</Text>
          <TouchableOpacity>
            <Text className='text-blue text-sm'>View more</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={tourCards}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
          renderItem={({ item }) => (
            <View className='mr-4'>
              <TourCard {...item} />
            </View>
          )}
        />
      </View>

      <Divider />

      <View className='px-4 mb-6'>
        <View className='flex-row justify-between items-center px-4 py-4'>
          <Text className='text-base font-semibold'>Top Koi Farms</Text>
          <TouchableOpacity>
            <Text className='text-blue text-sm'>View more</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
          style={{ height: 550 }}
        >
          {farms && farms.length > 0 ? (
            farms.map((farm) => (
              <View key={farm.id} className='mb-4'>
                <FarmCard farm={farm} />
              </View>
            ))
          ) : (
            <Text className='text-center text-gray-500'>Loading</Text>
          )}
        </ScrollView>
      </View>

      <Divider />

      <View className='px-4 mb-6'>
        <View className='flex-row justify-between items-center px-4 py-4'>
          <Text className='text-base font-semibold'>Our Customer Feedbacks</Text>
          <TouchableOpacity>
            <Text className='text-blue text-sm'>View more</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
          style={{ height: 390 }}
          className='mb-10'
        >
          {feedbacks && feedbacks.length > 0 ? (
            feedbacks.map((feedback) => (
              <View key={feedback.id} className='mb-4'>
                <FeedbackCard feedback={feedback} />
              </View>
            ))
          ) : (
            <Text className='text-center text-gray-500'>Loading</Text>
          )}
        </ScrollView>
      </View>
    </MainLayout>
  )
}
