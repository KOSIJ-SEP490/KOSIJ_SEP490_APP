import React, { useEffect } from 'react'
import { View, Text, Modal, TouchableOpacity } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useBooking } from '@apps/customer/contexts/BookingContext'

interface AddedKoiListModalProps {
  visible: boolean
  selectedKoi: number[]
  koiVarieties: { id: number; varietyName: string }[]
  onClose: () => void
  onClearAll: () => void
  onRemove: (id: number) => void
}

const AddedKoiListModal: React.FC<AddedKoiListModalProps> = ({
  visible,
  selectedKoi,
  koiVarieties,
  onClose,
  onClearAll,
  onRemove
}) => {
  const { addKoiVarietyRequest, removeKoiVarietyRequest } = useBooking()

  useEffect(() => {
    selectedKoi.forEach((id) => addKoiVarietyRequest(id))
  }, [selectedKoi])

  return (
    <Modal visible={visible} transparent animationType='slide'>
      <View className='flex-1 justify-center px-5 items-center bg-black/50'>
        <View className='bg-white w-full rounded-xl shadow-lg'>
          <View className='flex-row items-center bg-blue p-4 rounded-t-xl'>
            <Text className='text-white text-base font-semibold text-center flex-1 ml-3'>Added Koi List</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name='close' size={24} color='white' />
            </TouchableOpacity>
          </View>

          <View className='p-5 pt-4'>
            {selectedKoi.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  onClearAll()
                  selectedKoi.forEach((id) => removeKoiVarietyRequest(id))
                }}
                className='self-end mb-5'
              >
                <Text className='text-red-500 text-sm font-semibold'>Clear all</Text>
              </TouchableOpacity>
            )}

            {selectedKoi.length === 0 ? (
              <Text className='text-center text-gray-500 my-4'>No koi selected</Text>
            ) : (
              selectedKoi.map((id) => {
                const koi = koiVarieties.find((k) => k.id === id)
                return (
                  <View key={id} className='flex-row justify-between items-center py-2'>
                    <Text className='text-black text-sm'>{koi?.varietyName}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        removeKoiVarietyRequest(id)
                        onRemove(id)
                      }}
                    >
                      <Text className='text-red-500'>Remove</Text>
                    </TouchableOpacity>
                  </View>
                )
              })
            )}
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default AddedKoiListModal
