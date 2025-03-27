import { useWithdraw } from '@apps/customer/hooks/useWallet'
import { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import WithDrawSuccessModal from '../Card/Wallet/WithDrawSuccessModal'
import WithDrawFailModal from '../Card/Wallet/WithdrawFailedModal'

export default function WithdrawForm() {
  const [amount, setAmount] = useState('')
  const [bankName, setBankName] = useState('')
  const [bankNumber, setBankNumber] = useState('')
  const [holderName, setHolderName] = useState('')
  const { withdrawalResponse, error, loading, withdraw } = useWithdraw()
  const [successModalVisible, setSuccessModalVisible] = useState(false)
  const [failModalVisible, setFailModalVisible] = useState(false)

  useEffect(() => {
    if (withdrawalResponse) {
      setSuccessModalVisible(true)
    }
  }, [withdrawalResponse])

  useEffect(() => {
    if (error) {
      setFailModalVisible(true)
    }
  }, [error])

  const handleSubmit = async () => {
    if (!amount || !bankName || !bankNumber || !holderName) {
      Alert.alert('Error', 'Please fill in all fields.')
      return
    }

    const numericAmount = Number(amount.replace(/\./g, '')) // Remove dots before sending
    await withdraw(numericAmount, bankName, bankNumber, holderName)
  }

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '') // Remove non-numeric characters
    return new Intl.NumberFormat('vi-VN').format(Number(numericValue))
  }

  const handleAmountChange = (text: string) => {
    const formattedValue = formatCurrency(text)
    setAmount(formattedValue)
  }

  return (
    <View className='flex-1 px-5 py-6 bg-white'>
      <Text className='text-base font-medium mb-1'>Enter the amount</Text>
      <TextInput
        className='border border-gray-300 rounded-lg p-3 pt-2 text-sm text-gray-700'
        placeholder='Enter amount in VND'
        value={amount}
        onChangeText={handleAmountChange}
        keyboardType='numeric'
      />

      <Text className='text-base font-medium mt-4 mb-1'>Bank Name</Text>
      <TextInput
        className='border border-gray-300 rounded-lg p-3 text-sm text-gray-700'
        placeholder='Enter bank name'
        value={bankName}
        onChangeText={setBankName}
      />

      <Text className='text-base font-medium mt-4 mb-1'>Bank Number</Text>
      <TextInput
        className='border border-gray-300 rounded-lg p-3 text-sm text-gray-700'
        placeholder='Enter bank number'
        value={bankNumber}
        onChangeText={setBankNumber}
        keyboardType='numeric'
      />

      <Text className='text-base font-medium mt-4 mb-1'>Holder Name</Text>
      <TextInput
        className='border border-gray-300 rounded-lg p-3 text-sm text-gray-700'
        placeholder='Enter holder name'
        value={holderName}
        onChangeText={setHolderName}
      />

      <TouchableOpacity
        className={`bg-blue mt-6 p-3 rounded-lg items-center ${loading ? 'opacity-50' : ''}`}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text className='text-white text-lg font-bold'>{loading ? 'Processing...' : 'Submit'}</Text>
      </TouchableOpacity>

      {withdrawalResponse && (
        <WithDrawSuccessModal
          visible={successModalVisible}
          onClose={() => setSuccessModalVisible(false)}
          response={withdrawalResponse}
        />
      )}

      {error && (
        <WithDrawFailModal
          visible={failModalVisible}
          onClose={() => setFailModalVisible(false)}
          errorMessage={error ?? 'Unknown error occurred'}
        />
      )}
    </View>
  )
}
