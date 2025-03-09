import React, { useState, useMemo } from 'react'
import { View, Text, TextInput, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useAllKoiVarieties } from '@apps/customer/hooks/useKoi'
import KoiCard from '@apps/customer/components/Card/Koi/KoiCard'
import MainLayout from '@apps/customer/layouts/MainLayout'

export default function KoisScreen() {
  const { koiVarieties, error } = useAllKoiVarieties()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredKoiVarieties = useMemo(() => {
    if (!searchQuery.trim() || !koiVarieties) return koiVarieties

    return koiVarieties.filter((koi) => koi.varietyName.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [koiVarieties, searchQuery])

  return (
    <MainLayout
      title='Koi Variety'
      backgroundImage='https://images.unsplash.com/photo-1719234690062-8dda365f7157?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      showBackButton={true}
    >
      <View className='p-4 pb-0'>
        <View className='flex-row items-center border border-blue rounded-full px-4 h-12 mb-5'>
          <Ionicons name='search' size={24} color='#6B7FE3' />
          <TextInput
            className='flex-1 text-base ml-2 pb-1 text-blue'
            placeholder='Koi Variety Name'
            placeholderTextColor='#6B7FE3'
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 10 }}>
          {error ? (
            <View className='flex-1 justify-center items-center'>
              <Text className='text-center text-red-500'>Failed to load koi varieties.</Text>
            </View>
          ) : filteredKoiVarieties && filteredKoiVarieties.length > 0 ? (
            filteredKoiVarieties.map((koi) => (
              <View key={koi.id} className='mb-4'>
                <KoiCard koi={koi} />
              </View>
            ))
          ) : (
            <View className='flex-1 justify-center items-center'>
              <Text className='text-center text-gray-500'>
                {searchQuery ? 'No matching koi varieties found.' : 'No koi varieties available.'}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </MainLayout>
  )
}
