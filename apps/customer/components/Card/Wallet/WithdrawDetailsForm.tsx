import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import { format } from 'date-fns'
import { useCancelWithdraw, useWithdrawById } from '@apps/customer/hooks/useWallet'
import StatusModal from './WithdrawCancelModal'

type WithdrawDetailFormProps = {
  withdrawID?: number | null
}

const WithdrawDetailForm: React.FC<WithdrawDetailFormProps> = ({ withdrawID }) => {
  const { cancelWithdrawal, loading } = useCancelWithdraw()
  const [isCancelling, setIsCancelling] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalData, setModalData] = useState({
    type: 'success',
    title: '',
    message: ''
  })

  const { withdrawal, refetch } = useWithdrawById(withdrawID ?? 0)

  const handleCancel = async () => {
    if (!withdrawal?.id) return

    setIsCancelling(true)
    const { success, message } = await cancelWithdrawal(withdrawal.id)
    setIsCancelling(false)

    setModalData({
      type: success ? 'success' : 'error',
      title: success ? 'Success' : 'Error',
      message:
        message || (success ? 'Withdrawal request canceled successfully.' : 'Failed to cancel withdrawal request.')
    })
    setModalVisible(true)

    if (success) {
      refetch()
    }
  }

  const closeModal = () => {
    setModalVisible(false)
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 border-amber-300'
      case 'Success':
        return 'bg-emerald-100 border-emerald-300'
      case 'Canceled':
        return 'bg-rose-100 border-rose-300'
      case 'Failed':
        return 'bg-rose-100 border-rose-300'
      default:
        return 'bg-gray-100 border-gray-300'
    }
  }

  const getStatusTextColor = (status?: string) => {
    switch (status) {
      case 'Pending':
        return 'text-amber-800'
      case 'Success':
        return 'text-emerald-800'
      case 'Canceled':
        return 'text-rose-800'
      case 'Failed':
        return 'text-rose-800'
      default:
        return 'text-gray-800'
    }
  }

  return (
    <View className='p-6 my-4 rounded-lg shadow-sm'>
      <StatusModal
        visible={modalVisible}
        type={modalData.type as 'success' | 'error'}
        title={modalData.title}
        message={modalData.message}
        onClose={closeModal}
      />

      <View className='mb-4'>
        <View className='flex-row justify-between items-center mb-2'>
          <View className={`${getStatusColor(withdrawal?.withdrawStatus)} px-4 py-2 rounded-full border`}>
            <Text className={`${getStatusTextColor(withdrawal?.withdrawStatus)} font-medium text-sm`}>
              {withdrawal?.withdrawStatus}
            </Text>
          </View>
          <Text className='text-gray-500 text-xs'>
            {format(new Date(withdrawal?.createdTime || new Date()), "dd MMM yyyy 'at' hh:mm a")}
          </Text>
        </View>

        {(withdrawal?.withdrawStatus === 'Canceled' || withdrawal?.withdrawStatus === 'Failed') &&
          withdrawal?.deniedReason && (
            <View className='mt-3 p-3 bg-rose-50 rounded-lg border border-rose-100'>
              <Text className='text-rose-800 font-medium text-sm'>Reason:</Text>
              <Text className='text-rose-700 text-sm mt-1'>{withdrawal.deniedReason}</Text>
            </View>
          )}
      </View>

      <View className='space-y-4 mb-6'>
        <View>
          <Text className='text-gray-700 font-medium mb-2 text-sm'>Request Withdraw ID</Text>
          <TextInput
            value={withdrawal?.id.toString()}
            editable={false}
            className='border border-gray-200 p-3 rounded-lg text-gray-600 text-sm'
          />
        </View>

        <View>
          <Text className='text-gray-700 font-medium mb-2 text-sm'>Amount</Text>
          <TextInput
            value={`${withdrawal?.amount.toLocaleString()} VND`}
            editable={false}
            className='border border-gray-200 p-3 rounded-lg text-gray-600 text-sm'
          />
        </View>

        <View>
          <Text className='text-gray-700 font-medium mb-2 text-sm'>Bank Name</Text>
          <TextInput
            value={withdrawal?.bankName}
            editable={false}
            className='border border-gray-200 p-3 rounded-lg text-gray-600 text-sm'
          />
        </View>

        <View>
          <Text className='text-gray-700 font-medium mb-2 text-sm'>Bank Number</Text>
          <TextInput
            value={withdrawal?.bankNumber}
            editable={false}
            className='border border-gray-200 p-3 rounded-lg text-gray-600 text-sm'
          />
        </View>

        <View>
          <Text className='text-gray-700 font-medium mb-2 text-sm'>Holder Name</Text>
          <TextInput
            value={withdrawal?.holderName}
            editable={false}
            className='border border-gray-200 p-3 rounded-lg text-gray-600 text-sm'
          />
        </View>
      </View>

      {withdrawal?.withdrawStatus === 'Pending' && (
        <TouchableOpacity
          className={`bg-red-600 py-3 rounded-lg shadow-sm flex-row justify-center items-center ${
            loading || isCancelling ? 'opacity-70' : ''
          }`}
          onPress={handleCancel}
          disabled={loading || isCancelling}
        >
          {isCancelling ? (
            <>
              <ActivityIndicator color='#fff' className='mr-2' />
              <Text className='text-white text-center text-base font-medium'>Cancelling...</Text>
            </>
          ) : (
            <Text className='text-white text-center text-base font-medium'>Cancel Request</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  )
}

export default WithdrawDetailForm
