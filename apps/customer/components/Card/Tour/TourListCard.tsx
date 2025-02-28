import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import TourCard from './TourCard'
import { TourCardType } from '../../../types/tourCard.type'
import TourFilter from '../../Filter/TourFilter'

const TourListCard: React.FC<{ tourCards: TourCardType[] }> = ({ tourCards }) => {
  const [filterVisible, setFilterVisible] = useState(false)
  const [filters, setFilters] = useState({
    priceRange: [0, 100000000],
    departurePoint: '',
    numberOfFarms: ''
  })

  const filteredTours = tourCards.filter((tour) => {
    const isDefaultFilter = filters.departurePoint === '' && filters.numberOfFarms === ''

    const withinPriceRange = tour.standardPrice >= filters.priceRange[0] && tour.standardPrice <= filters.priceRange[1]

    const matchesDeparture = filters.departurePoint === '' || tour.departurePoint.includes(filters.departurePoint)
    const matchesFarmCount = filters.numberOfFarms === '' || tour.totalFarmVisit.toString() === filters.numberOfFarms

    return withinPriceRange && (isDefaultFilter || (matchesDeparture && matchesFarmCount))
  })

  return (
    <View className='p-4 bg-white rounded-lg shadow-md flex-row'>
      <View className='w-16 mr-2'>
        <TouchableOpacity className='items-center mb-8' onPress={() => setFilterVisible(true)}>
          <Feather name='sliders' size={24} color='#000' />
          <Text className='text-sm font-medium mt-1'>Filter</Text>
        </TouchableOpacity>

        <View className='items-center'>
          <Feather name='align-left' size={24} color='#000' />
          <Text className='text-sm font-medium mt-1'>Sort</Text>
        </View>
      </View>

      <ScrollView className='flex-1' showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {filteredTours.length > 0 ? (
          filteredTours.map((item) => (
            <View key={item.id.toString()} className='mb-4'>
              <TourCard {...item} />
            </View>
          ))
        ) : (
          <Text className='text-center text-gray-500'>No tours match your filters.</Text>
        )}
      </ScrollView>

      <TourFilter
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={(newFilters) => {
          setFilters((prevFilters) => ({
            ...prevFilters,
            ...newFilters,
            priceRange: newFilters.priceRange ?? prevFilters.priceRange
          }))
          setFilterVisible(false)
        }}
      />
    </View>
  )
}

export default TourListCard
