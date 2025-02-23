import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import MainLayout from '@apps/customer/layouts/MainLayout'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { CustomerStackParamList } from '@apps/customer/types/navigationCustomerType'
import type { RouteProp } from '@react-navigation/native'

type HomeScreenProps = {
  navigation: StackNavigationProp<CustomerStackParamList, 'Home'>
  route: RouteProp<CustomerStackParamList, 'Home'>
}

type MenuItem = {
  name: string
  icon: string
  screen: keyof CustomerStackParamList
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
      <View className='flex-row justify-around w-full mt-2'>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => navigation.navigate(item.screen)} className='items-center'>
            <View className='bg-blue-100 p-4 rounded-2xl mb-2'>{renderIcon(item)}</View>
            <Text className='text-[#2563EB] text-base font-semibold'>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </MainLayout>
  )
}
