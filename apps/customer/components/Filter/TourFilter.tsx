import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Modal, Pressable, ScrollView } from 'react-native'
import { Feather } from '@expo/vector-icons'
import MultiSlider from '@ptomasroos/react-native-multi-slider'

interface TourFilterProps {
  visible: boolean
  onClose: () => void
  onApply: (filters: Partial<FilterValues>) => void
  currentFilters: FilterValues
}

interface FilterValues {
  priceRange: [number, number]
  departurePoint: string
  numberOfFarms: string
}

const departurePoints = [
  { id: '1', name: 'Ha Noi (Noi Bai Airport)' },
  { id: '2', name: 'Ho Chi Minh (Tan Son Nhat Airport)' }
]

export default function TourFilter({ visible, onClose, onApply, currentFilters }: TourFilterProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>(currentFilters.priceRange)
  const [departurePoint, setDeparturePoint] = useState(currentFilters.departurePoint)
  const [numberOfFarms, setNumberOfFarms] = useState(currentFilters.numberOfFarms)

  const handleClear = () => {
    const clearedFilters = {
      priceRange: [0, 100000000] as [number, number],
      departurePoint: '',
      numberOfFarms: ''
    }

    setPriceRange(clearedFilters.priceRange)
    setDeparturePoint(clearedFilters.departurePoint)
    setNumberOfFarms(clearedFilters.numberOfFarms)

    onApply(clearedFilters)
  }

  const handleApply = () => {
    const filters: Partial<FilterValues> = {}

    if (priceRange[0] !== 0 || priceRange[1] !== 100000000) {
      filters.priceRange = priceRange
    }

    if (departurePoint) {
      filters.departurePoint = departurePoint
    }

    if (numberOfFarms) {
      filters.numberOfFarms = numberOfFarms
    }

    onApply(filters)
    onClose()
  }

  if (!visible) return null

  return (
    <Modal animationType='slide' transparent={true} visible={visible} onRequestClose={onClose}>
      <View className='flex-1 bg-black/50'>
        <View className='h-2/3 mt-auto bg-white rounded-t-3xl'>
          <View className='flex-row items-center justify-between p-4 border-b border-gray-200'>
            <TouchableOpacity onPress={onClose}>
              <Feather name='x' size={24} color='black' />
            </TouchableOpacity>
            <Text className='text-[#2C52ED] text-xl font-semibold'>Filter</Text>
            <TouchableOpacity onPress={handleClear}>
              <Text className='text-red-500 text-base'>Clear</Text>
            </TouchableOpacity>
          </View>

          <ScrollView className='p-6 space-y-8'>
            <View>
              <Text className='text-base font-medium mb-2'>Price Range (per person)</Text>
              <View className='ml-6'>
                <MultiSlider
                  values={priceRange}
                  min={0}
                  max={100000000}
                  step={100000}
                  sliderLength={320}
                  selectedStyle={{ backgroundColor: '#2C52ED' }}
                  unselectedStyle={{ backgroundColor: '#E5E7EB' }}
                  containerStyle={{ height: 40 }}
                  trackStyle={{ height: 4 }}
                  markerStyle={{
                    backgroundColor: '#2C52ED',
                    height: 24,
                    width: 24,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5
                  }}
                  onValuesChange={(values) => setPriceRange(values as [number, number])}
                />
              </View>
              <View className='flex-row justify-between mt-4'>
                <Text className='border border-gray-300 rounded-lg px-4 py-3 flex-1 mr-4'>
                  {priceRange[0].toLocaleString()} VND
                </Text>
                <Text className='border border-gray-300 rounded-lg px-4 py-3 flex-1'>
                  {priceRange[1].toLocaleString()} VND
                </Text>
              </View>
            </View>

            <View>
              <Text className='text-base font-medium mb-2'>Departure Point</Text>
              <View className='space-y-2'>
                {departurePoints.map((point) => (
                  <Pressable
                    key={point.id}
                    className={`p-4 border rounded-lg ${departurePoint === point.name ? 'border-[#2C52ED] bg-blue-50' : 'border-gray-300'}`}
                    onPress={() => setDeparturePoint(point.name)}
                  >
                    <Text className={`${departurePoint === point.name ? 'text-[#2C52ED] font-medium' : ''}`}>
                      {point.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View>
              <Text className='text-base font-medium mb-2'>Number of Farms to Visit</Text>
              <View className='flex-row space-x-2'>
                {['1', '2', '3', '4+'].map((num) => (
                  <Pressable
                    key={num}
                    className={`flex-1 p-4 border rounded-lg items-center ${numberOfFarms === num ? 'border-[#2C52ED] bg-blue-50' : 'border-gray-300'}`}
                    onPress={() => setNumberOfFarms(num === numberOfFarms ? '' : num)}
                  >
                    <Text className={`${numberOfFarms === num ? 'text-[#2C52ED] font-medium' : ''}`}>{num}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </ScrollView>

          <View className='p-6 pt-0'>
            <TouchableOpacity className='bg-[#2C52ED] py-4 rounded-full' onPress={handleApply}>
              <Text className='text-white text-center text-lg font-semibold'>Show Results</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}
