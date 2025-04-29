import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native'
import MainLayout from '@shared/layouts/MainLayout'
import { useAllFarms } from '@apps/customer/hooks/useFarm'
import FarmCard from '@apps/customer/components/Card/Farm/FarmCard'

export default function FarmsScreen() {
  const { farms, error } = useAllFarms()
  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const filteredFarms = farms?.filter((farm) => {
    const nameMatch = farm.farmName.toLowerCase().includes(searchQuery.toLowerCase())
    const locationMatch = locationFilter ? farm.location.toLowerCase().includes(locationFilter.toLowerCase()) : true
    return nameMatch && locationMatch
  })

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  return (
    <MainLayout
      title='Farms'
      backgroundImage='https://live.staticflickr.com/7368/16530274295_1144e68454_z.jpg'
      showBackButton={true}
    >
      <View className='p-4 pb-0'>
        <View className='flex-row items-center border border-blue rounded-full px-4 h-12 mb-3'>
          <Ionicons name='search' size={24} color='#6B7FE3' />
          <TextInput
            className='flex-1 text-base ml-2 pb-1 text-blue'
            placeholder='Search by Farm Name'
            placeholderTextColor='#6B7FE3'
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity onPress={toggleFilters}>
            <Ionicons name={showFilters ? 'filter' : 'filter-outline'} size={24} color='#6B7FE3' />
          </TouchableOpacity>
        </View>

        {showFilters && (
          <>
            <View className='flex-row items-center border border-blue rounded-full px-4 h-12 mb-3'>
              <Ionicons name='location' size={24} color='#6B7FE3' />
              <TextInput
                className='flex-1 text-base ml-2 pb-1 text-blue'
                placeholder='Filter by Location'
                placeholderTextColor='#6B7FE3'
                value={locationFilter}
                onChangeText={setLocationFilter}
              />
            </View>
          </>
        )}
      </View>

      <View className='px-5'>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 10 }}>
          {error ? (
            <View className='flex-1 justify-center items-center'>
              <Text className='text-center text-red-500'>Failed to load farms.</Text>
            </View>
          ) : filteredFarms && filteredFarms.length > 0 ? (
            filteredFarms.map((farm) => (
              <View key={farm.id} className='mb-4'>
                <FarmCard farm={farm} />
              </View>
            ))
          ) : (
            <View className='flex-1 justify-center items-center'>
              <Text className='text-center text-gray-500'>
                {searchQuery || locationFilter !== null ? 'No matching farms found.' : 'No farms available.'}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </MainLayout>
  )
}
