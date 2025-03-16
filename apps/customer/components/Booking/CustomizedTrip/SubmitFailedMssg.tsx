import { Modal, Text, TouchableOpacity, View } from 'react-native'

interface SubmitFailedMssgProps {
  visible: boolean
  errorMessage: string | null
  onClose: () => void
}

export default function SubmitFailedMssg({ visible, errorMessage, onClose }: SubmitFailedMssgProps) {
  return (
    <Modal visible={visible} transparent animationType='slide'>
      <View className='flex-1 justify-center items-center bg-black/50'>
        <View className='bg-white p-6 rounded-2xl shadow-lg w-4/5'>
          <View className='items-center'>
            <View className='bg-red-100 p-3 rounded-full'>
              <Text className='text-red-600 text-2xl font-bold'>✖</Text>
            </View>
            <Text className='text-lg font-semibold mt-3 text-red-600'>Booking Failed</Text>
          </View>

          {errorMessage && (
            <View className='mt-4 border-t border-gray-300 pt-4'>
              <Text className='text-gray-700'>{errorMessage}</Text>
            </View>
          )}

          <TouchableOpacity onPress={onClose} className='bg-red-600 mt-4 py-2 rounded-lg items-center'>
            <Text className='text-white font-bold'>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}
