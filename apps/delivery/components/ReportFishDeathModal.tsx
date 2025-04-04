import React from 'react'
import { Modal, Platform, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, View } from 'react-native'
import { useOrderById } from '../hooks/useOrder'
import ModalHeader from './ModalHeader'
import ReportTable from './ReportTable'

interface ReportDishDeathModalProps {
  onClose: () => void
  orderID?: number
}

export default function ReportDishDeathModal({ onClose, orderID }: ReportDishDeathModalProps) {
  const { order } = useOrderById(orderID ?? 0)

  return (
    <Modal animationType='slide' transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className='flex-1'>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className='flex-1 bg-white'>
            <ModalHeader onClose={onClose} title='Report Fish Death' />

            <ReportTable order={order} onClose={onClose} />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  )
}
