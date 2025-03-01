import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ChevronLeft } from 'lucide-react-native'
import { blue } from 'react-native-reanimated/lib/typescript/Colors'
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'

type RootStackParamList = {
  TourDetails: undefined
  CollectTicket: { ticketImage: string }
}

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'TourDetails'>

export default function TourDetailsScreen() {
  const navigation = useNavigation<NavigationProps>()
  const apiImageUrl = 'https://example.com/ticket.jpg' // Example

  return (
    <ScrollView>
      <View className='flex-1 mt-3 bg-white p-4'>
        <View className='flex-row items-center px-4 py-2'>
          {/* Back Button */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft color={'#292D32'} size={24} />
          </TouchableOpacity>

          <Text className='text-lg font-semibold text-center flex-1'>Tour Detailed</Text>

          <View style={{ width: 24 }} />
        </View>
        <View style={styles.card}>
          {/* Trip Title */}
          <View className='flex-row justify-between'>
            <Text className='text-lg font-bold mt-4'>Koi Serenity Journey</Text>

            {/* Status Badge */}
            <View className='self-end px-3 py-1 rounded-full bg-blue-500' style={{ backgroundColor: 'blue' }}>
              <Text className='text-white text-xs'>Upcoming</Text>
            </View>
          </View>

          {/* Start & End Time */}
          <View className='flex-row justify-between mt-3 border-b border-zinc-300'>
            <View className='p-3 bg-blue-50 rounded-lg items-center mb-3' style={{ backgroundColor: '#f6feff' }}>
              <Text className=' font-semibold' style={{ color: '#264eca' }}>
                Start time
              </Text>
              <Text className='text-black'>2024-12-01 09:00</Text>
            </View>
            <View className='p-3 bg-blue-50 rounded-lg items-center mb-3' style={{ backgroundColor: '#f6feff' }}>
              <Text className='text-blue-600 font-semibold' style={{ color: '#264eca' }}>
                End time
              </Text>
              <Text className='text-black'>2024-12-03 12:00</Text>
            </View>
          </View>

          {/* Additional Information */}
          <Text className='mt-4' style={{ fontWeight: 'bold' }}>
            Additional Information
          </Text>
          <Text className='text-gray-600 text-sm'>
            {'\u2708'} Vietnam Airlines
            {'\n'}🏨 Junnie Hotel (Tokyo Str.Furina 2412, ABC)
            {'\n'}
            {'\u1FAC'} 8
          </Text>
        </View>

        {/* Itinerary */}
        <View style={styles.card}>
          <View className='p-3 rounded-lg mb-2' style={{ backgroundColor: '#f6feff', borderRightColor: '#264eca' }}>
            <View className='flex-row justify-between'>
              <Text className='font-bold'>Day 1</Text>
              <Text>2024-12-01</Text>
            </View>
            <View style={styles.card}>
              <View className='flex-row'>
                <Text style={{ color: '#264eca', fontWeight: 'bold' }}>09:00 AM </Text>
                <Text className='text-gray-600'>Visit Koi Farm Asagi - Tokyo📍</Text>
              </View>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua
              </Text>
            </View>
            <View style={styles.card}>
              <View className='flex-row'>
                <Text style={{ color: '#264eca', fontWeight: 'bold' }}>12:00 AM </Text>
                <Text className='text-gray-600'>Visit Koi Farm Asagi - Tokyo📍</Text>
              </View>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua
              </Text>
            </View>
          </View>
          <View className='p-3 rounded-lg mb-2' style={{ backgroundColor: '#f6feff' }}>
            <View className='flex-row justify-between'>
              <Text className='font-bold'>Day 2</Text>
              <Text>2024-12-01</Text>
            </View>
            <View style={styles.card}>
              <View className='flex-row'>
                <Text style={{ color: '#264eca', fontWeight: 'bold' }}>09:00 AM </Text>
                <Text className='text-gray-600'>Visit Koi Farm Asagi - Tokyo📍</Text>
              </View>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua
              </Text>
            </View>
            <View style={styles.card}>
              <View className='flex-row'>
                <Text style={{ color: '#264eca', fontWeight: 'bold' }}>12:00 AM </Text>
                <Text className='text-gray-600'>Visit Koi Farm Asagi - Tokyo📍</Text>
              </View>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua
              </Text>
            </View>
          </View>
        </View>

        {/* Participants List */}
        <View style={styles.card}>
          <Text className='font-semibold'>Participants List</Text>
          <View className='p-3 rounded-lg mb-4' style={{ backgroundColor: '#f6feff' }}>
            <View className='ml-3'>
              <Text style={{ color: '#264eca', fontWeight: 'bold' }}>John Doe</Text>
              <Text className='text-gray-600'>(307) 555-0133</Text>
              <Text className='text-gray-600'>debra.holt@example.com</Text>
            </View>
          </View>
          <View className='p-3 rounded-lg mb-4' style={{ backgroundColor: '#f6feff' }}>
            <View className='ml-3'>
              <Text style={{ color: '#264eca', fontWeight: 'bold' }}>John Doe</Text>
              <Text className='text-gray-600'>(307) 555-0133</Text>
              <Text className='text-gray-600'>debra.holt@example.com</Text>
            </View>
          </View>
          <View className='p-3 rounded-lg mb-4' style={{ backgroundColor: '#f6feff' }}>
            <View className='ml-3'>
              <Text style={{ color: '#264eca', fontWeight: 'bold' }}>John Doe</Text>
              <Text className='text-gray-600'>(307) 555-0133</Text>
              <Text className='text-gray-600'>debra.holt@example.com</Text>
            </View>
          </View>
        </View>
        <View className='mt-5 ml-5 w-80'>
          {/* Bottom Button */}
          <TouchableOpacity
            style={{ backgroundColor: '#264eca' }}
            className=' p-3 rounded-md  bottom-4 right-4'
            onPress={() => navigation.navigate('CollectTicket', { ticketImage: apiImageUrl })}
          >
            <Text className='text-white text-center'>Start Trip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginTop: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5 // Android shadow
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10
  },
  cardContent: {
    paddingVertical: 10
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },
  description: {
    fontSize: 14,
    color: 'gray'
  }
})
