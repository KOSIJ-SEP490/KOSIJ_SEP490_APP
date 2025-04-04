import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import { Order } from '../types/Order/Order.type'
import { PlusCircle, MinusCircle, Edit, X } from 'lucide-react-native'
import { useReportOrderFishDeath } from '../hooks/useOrder'

interface ReportTableProps {
  order?: Order | null
  onClose: () => void
}

export default function ReportTable({ order, onClose }: ReportTableProps) {
  const { reportFishDeath, isLoading, error } = useReportOrderFishDeath()
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [editMode, setEditMode] = useState<number | null>(null)
  const [deadReasons, setDeadReasons] = useState<Record<number, string>>({})

  if (!order || !order.orderDetails.length) {
    return (
      <View className='p-4'>
        <Text className='text-center text-gray-500'>No fish orders available.</Text>
      </View>
    )
  }

  const handleQuantityChange = (id: number, value: number) => {
    const orderItem = order?.orderDetails.find((item) => item.id === id)
    const maxQuantity = orderItem?.quantity || 0

    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, Math.min(value, maxQuantity))
    }))
  }

  const handleDeadReasonChange = (id: number, reason: string) => {
    setDeadReasons((prev) => ({
      ...prev,
      [id]: reason
    }))
  }

  const handleSubmit = async () => {
    if (!order) return false

    const orderDetailsFishDeaths = order.orderDetails
      .filter((item) => quantities[item.id] > 0)
      .map((item) => ({
        orderDetailsId: item.id,
        quantity: quantities[item.id],
        deadReason: deadReasons[item.id] || ''
      }))

    if (orderDetailsFishDeaths.length === 0) {
      alert('Please report at least one fish death')
      return false
    }

    const success = await reportFishDeath(order.orderId, { orderDetailsFishDeaths })
    if (success) {
      alert('Fish deaths reported successfully!')
      onClose()
    }
  }

  return (
    <View>
      <View className='bg-white mx-4 my-2 mt-10 rounded-lg border border-gray-200 overflow-hidden'>
        <ScrollView horizontal>
          <View>
            <View className='bg-gray-100 px-4 py-3 flex-row border-b border-gray-300'>
              <Text className='w-10 text-sm font-bold text-gray-700 text-center'>No</Text>
              <Text className='w-24 text-sm font-bold text-gray-700 text-center'>Image</Text>
              <Text className='w-32 text-sm font-bold text-gray-700 text-center'>Name</Text>
              <Text className='w-24 text-sm font-bold text-gray-700 text-center'>Quantity</Text>
              <Text className='w-24 text-sm font-bold text-gray-700 text-center'>Dead Reason</Text>
            </View>

            <View>
              {order.orderDetails.map((item, index) => {
                const imageUrl =
                  item.orderDetailImages.length > 0
                    ? item.orderDetailImages[0].imageUrl
                    : 'https://via.placeholder.com/50'

                return (
                  <View key={item.id} className='flex-row items-center px-4 py-3 border-b border-gray-200'>
                    <Text className='w-10 text-gray-700 text-center'>{index + 1}</Text>
                    <View className='w-24 flex items-center'>
                      <Image source={{ uri: imageUrl }} className='w-20 h-20 rounded-md' />
                    </View>
                    <Text className='w-32 text-gray-800 font-medium text-center'>{item.variety}</Text>

                    <View className='w-24 flex-row items-center justify-center'>
                      <TouchableOpacity onPress={() => handleQuantityChange(item.id, (quantities[item.id] || 0) - 1)}>
                        <MinusCircle size={20} color='gray' />
                      </TouchableOpacity>
                      <Text className='mx-2 text-gray-800'>{quantities[item.id] || 0}</Text>
                      <TouchableOpacity onPress={() => handleQuantityChange(item.id, (quantities[item.id] || 0) + 1)}>
                        <PlusCircle size={20} color='gray' />
                      </TouchableOpacity>
                    </View>

                    <View className='w-24 items-center'>
                      {editMode === item.id ? (
                        <View className='flex-row items-center'>
                          <TextInput
                            value={deadReasons[item.id] || ''}
                            onChangeText={(text) => handleDeadReasonChange(item.id, text)}
                            className='border border-gray-300 rounded p-1 flex-1'
                            placeholder='Reason'
                          />
                          <TouchableOpacity onPress={() => setEditMode(null)} className='ml-1'>
                            <X size={20} color='gray' />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity onPress={() => setEditMode(item.id)}>
                          <Edit size={20} color='gray' />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )
              })}
            </View>
          </View>
        </ScrollView>
      </View>

      <View className='p-4'>
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading}
          className={`py-4 px-6 rounded-lg ${isLoading ? 'bg-gray-400' : 'bg-blue'}`}
        >
          <Text className='text-white text-center text-base font-bold'>{isLoading ? 'Reporting...' : 'Report'}</Text>
        </TouchableOpacity>
        {error && <Text className='text-red-500 mt-2 text-center'>{error}</Text>}
      </View>
    </View>
  )
}
