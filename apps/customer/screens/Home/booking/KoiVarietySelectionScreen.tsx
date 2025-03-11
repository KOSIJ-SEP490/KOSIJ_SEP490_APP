import React, { useState } from 'react'
import { View, ScrollView, TouchableOpacity, TextInput, Text } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useAllKoiVarieties } from '@apps/customer/hooks/useKoi'
import SubLayout from '@apps/customer/layouts/SubLayout'
import AddKoiListButton from '@apps/customer/components/Booking/AddKoiListBtn'
import KoiSelectionCard from '@apps/customer/components/Booking/KoiSelectionCard'
import AddedKoiListModal from '@apps/customer/components/Booking/AddKoiListModal'
import { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import { CustomerHomeStackParamList } from '@apps/customer/types/navigationCustomerType'

const KoiSelectionScreen = () => {
  const { koiVarieties } = useAllKoiVarieties()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedKoi, setSelectedKoi] = useState<number[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const navigation = useNavigation<StackNavigationProp<CustomerHomeStackParamList, 'TravelInformation'>>()

  const handleToggleKoi = (id: number) => {
    setSelectedKoi((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter((koiId) => koiId !== id) : [...prevSelected, id]
    )
  }

  const handleClearAll = () => setSelectedKoi([])

  const filteredKoiVarieties = koiVarieties?.filter((koi) =>
    koi.varietyName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <SubLayout title='Koi Varieties Selection' showBackButton={true}>
      <View className='flex-1 bg-white p-4'>
        <View className='flex-row items-center border border-blue rounded-full px-4 h-12 mb-5 bg-white shadow-sm mt-5'>
          <Ionicons name='search' size={24} color='#6B7FE3' />
          <TextInput
            className='flex-1 text-base ml-2 text-blue-500'
            placeholder='Search Koi variety name'
            placeholderTextColor='#6B7FE3'
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity>
          <AddKoiListButton
            count={selectedKoi.length}
            onPress={() => {
              setModalVisible(true)
            }}
          />
        </TouchableOpacity>

        <View className='h-[550px]'>
          <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
            {filteredKoiVarieties?.map((item) => (
              <KoiSelectionCard
                key={item.id}
                koi={item}
                isSelected={selectedKoi.includes(item.id)}
                onToggle={() => handleToggleKoi(item.id)}
              />
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity
          className='bg-blue py-3 mb-10 rounded-lg items-center mt-4 w-full shadow-md'
          onPress={() => navigation.navigate('TravelInformation')}
        >
          <Text className='text-white text-lg font-semibold'>Continue</Text>
        </TouchableOpacity>
      </View>

      <AddedKoiListModal
        visible={modalVisible}
        selectedKoi={selectedKoi}
        koiVarieties={koiVarieties || []}
        onClose={() => setModalVisible(false)}
        onClearAll={handleClearAll}
        onRemove={handleToggleKoi}
      />
    </SubLayout>
  )
}

export default KoiSelectionScreen
