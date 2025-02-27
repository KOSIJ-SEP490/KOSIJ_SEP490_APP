import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Modal, TextInput } from 'react-native'
import { Feather } from '@expo/vector-icons'
import MultiSlider from '@ptomasroos/react-native-multi-slider'

interface TourFilterProps {
  visible: boolean
  onClose: () => void
  onApply: (filters: Partial<FilterValues>) => void
}

interface FilterValues {
  priceRange: [number, number]
  departurePoint: string
  numberOfFarms: string
}

export default function TourFilter({ visible, onClose, onApply }: TourFilterProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([1000000, 10000000])
  const [departurePoint, setDeparturePoint] = useState('')
  const [numberOfFarms, setNumberOfFarms] = useState('')

  const handleClear = () => {
    setPriceRange([1000000, 10000000])
    setDeparturePoint('')
    setNumberOfFarms('')
  }

  const handleApply = () => {
    const filters: Partial<FilterValues> = {}

    if (priceRange[0] !== 1000000 || priceRange[1] !== 10000000) {
      filters.priceRange = priceRange
    }

    if (departurePoint.trim()) {
      filters.departurePoint = departurePoint
    }

    if (numberOfFarms.trim()) {
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

          <View className='p-6 space-y-8'>
            <View>
              <Text className='text-base font-medium mb-2'>Price Range (per person)</Text>
              <View className='ml-6'>
                <MultiSlider
                  values={priceRange}
                  min={1000000}
                  max={10000000}
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
              <TextInput
                className='border border-gray-300 rounded-lg p-4'
                placeholder='Enter departure point'
                value={departurePoint}
                onChangeText={setDeparturePoint}
              />
            </View>

            <View>
              <Text className='text-base font-medium mb-2'>Number of Farms to Visit</Text>
              <TextInput
                className='border border-gray-300 rounded-lg p-4'
                value={numberOfFarms}
                onChangeText={setNumberOfFarms}
                keyboardType='numeric'
                placeholder='Enter number of farms'
              />
            </View>
          </View>

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
