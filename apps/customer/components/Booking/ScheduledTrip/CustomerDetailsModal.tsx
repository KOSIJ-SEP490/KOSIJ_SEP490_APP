import { CustomerDetails, CustomerInfo } from '@apps/customer/types/Booking/bookingData.type'
import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { ScrollView } from 'react-native-gesture-handler'
import { useBooking } from '@apps/customer/contexts/BookingContext'

interface CustomerDetailModalProps {
  visible: boolean
  onClose: () => void
  onSave: (ageGroup: keyof CustomerDetails, index: number, customerDetails: CustomerInfo) => void
  ageGroup: keyof CustomerDetails
  index: number
  initialCustomer?: CustomerInfo
}

const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  visible,
  onClose,
  ageGroup,
  index,
  initialCustomer
}) => {
  const [customerDetails, setCustomerDetails] = useState<CustomerInfo>(
    initialCustomer || {
      ageGroup,
      fullName: '',
      dateOfBirth: { year: 1970, month: 1, day: 1, dayOfWeek: 'Sunday' },
      sex: 'Male',
      nationality: '',
      email: '',
      phoneNumber: '',
      passport: '',
      isRepresentative: ageGroup === 'adult' && index === 0,
      hasVisa: null
    }
  )

  const [datePickerVisible, setDatePickerVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())

  const handleChange = (field: keyof CustomerInfo, value: string | number | boolean | null) => {
    setCustomerDetails((prev) => ({ ...prev, [field]: value }))
  }

  const handleDateConfirm = (date: Date) => {
    if (date) {
      setSelectedDate(date)
      setCustomerDetails((prev) => ({
        ...prev,
        dateOfBirth: {
          ...prev.dateOfBirth,
          day: date.getDate(),
          month: date.getMonth() + 1,
          year: date.getFullYear(),
          dayOfWeek: 'Sunday'
        }
      }))
    }
    setDatePickerVisible(false)
  }

  const handleReset = () => {
    setCustomerDetails({
      ageGroup,
      fullName: '',
      dateOfBirth: { year: 0, month: 0, day: 0, dayOfWeek: 'Sunday' },
      sex: 'Male',
      nationality: '',
      email: '',
      phoneNumber: '',
      passport: '',
      isRepresentative: ageGroup === 'adult' && index === 0,
      hasVisa: null
    })
  }

  useEffect(() => {
    if (visible) {
      const customerData = bookingData.customerDetails?.[ageGroup]?.[index] || initialCustomer
      if (customerData) {
        setCustomerDetails({
          ...customerData,
          sex: customerData.sex || 'Male'
        })
      }
    }
  }, [visible, ageGroup, index, initialCustomer])

  const { bookingData, setBookingData } = useBooking()

  const handleSave = (ageGroup: keyof CustomerDetails, index: number, details: CustomerInfo) => {
    if (
      !details.fullName?.trim() ||
      !details.dateOfBirth?.year ||
      !details.email?.trim() ||
      !details.phoneNumber?.trim() ||
      !details.passport?.trim()
    ) {
      alert('Please fill in all required fields before saving.')
      return
    }

    setBookingData((prev) => {
      const updatedDetails = { ...prev.customerDetails }

      if (!updatedDetails[ageGroup]) updatedDetails[ageGroup] = []
      updatedDetails[ageGroup][index] = {
        ...details,
        isRepresentative: ageGroup === 'adult' && index === 0
      }

      return { ...prev, customerDetails: updatedDetails }
    })

    onClose()
  }

  return (
    <Modal transparent visible={visible} animationType='slide'>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className='flex-1 justify-center items-center bg-black/50'>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className='bg-white rounded-xl w-full h-full'
          >
            <View className='bg-blue pt-14 px-5 rounded-t-xl flex-row justify-between items-center'>
              <Text className='text-lg text-white font-semibold mb-4 text-center flex-1 '>
                {ageGroup.charAt(0).toUpperCase() + ageGroup.slice(1)} {index + 1}
              </Text>

              <TouchableOpacity onPress={onClose} className='absolute right-10 top-14'>
                <Text className='text-white text-2xl'>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View className='px-5 py-5'>
                <Text onPress={handleReset} className='text-red-500 font-semibold text-right pr-1'>
                  Reset
                </Text>

                <Text className='text-base mb-2 pl-3 font-medium'>
                  Full Name <Text className='text-red-600'>*</Text>
                </Text>
                <TextInput
                  className='border border-gray-300 rounded-lg p-2 mb-5 w-full py-4'
                  placeholder='Enter full name'
                  value={customerDetails.fullName}
                  onChangeText={(text) => handleChange('fullName', text)}
                />

                <Text className='text-base mb-2 pl-3 font-medium'>
                  Date of Birth <Text className='text-red-600'>*</Text>
                </Text>
                <TouchableOpacity
                  className='border border-gray-300 rounded-lg p-3 mb-5 bg-gray-100'
                  onPress={() => setDatePickerVisible(true)}
                >
                  <Text className='text-center text-gray-700'>
                    {customerDetails.dateOfBirth?.day
                      ? `${customerDetails.dateOfBirth.day}/${customerDetails.dateOfBirth.month}/${customerDetails.dateOfBirth.year}`
                      : 'Select Date'}
                  </Text>
                </TouchableOpacity>

                {datePickerVisible && (
                  <Modal transparent animationType='fade'>
                    <View className='flex-1 justify-center items-center bg-black/50'>
                      <View className='bg-white rounded-lg p-5 w-80'>
                        <Text className='text-lg font-semibold mb-3 text-center'>Select Date</Text>
                        <DateTimePicker
                          value={selectedDate}
                          mode='date'
                          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                          onChange={(event, date) => {
                            if (date) setSelectedDate(date)
                          }}
                        />
                        <View className='flex-row justify-between mt-3'>
                          <TouchableOpacity
                            className='bg-gray-400 px-4 py-2 rounded-lg'
                            onPress={() => setDatePickerVisible(false)}
                          >
                            <Text className='text-white font-semibold'>Cancel</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            className='bg-blue px-4 py-2 rounded-lg'
                            onPress={() => handleDateConfirm(selectedDate)}
                          >
                            <Text className='text-white font-semibold'>Confirm</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </Modal>
                )}

                <Text className='text-base mb-2 pl-3 font-medium'>Sex</Text>

                <View className='flex-row justify-start mb-5 pl-2'>
                  <TouchableOpacity onPress={() => handleChange('sex', 'Male')} className='flex-row items-center mr-5'>
                    <View
                      className={`w-5 h-5 border border-blue rounded-full mr-2 ${customerDetails.sex === 'Male' ? 'bg-blue' : 'border-gray-400'}`}
                    />
                    <Text>Male</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleChange('sex', 'Female')} className='flex-row items-center'>
                    <View
                      className={`w-5 h-5 border border-blue  rounded-full mr-2 ${customerDetails.sex === 'Female' ? 'bg-blue' : 'border-gray-400'}`}
                    />
                    <Text>Female</Text>
                  </TouchableOpacity>
                </View>

                <Text className='text-base mb-2 pl-3 font-medium'>Visa Status</Text>

                <View className='flex-row justify-start mb-5 pl-2'>
                  <TouchableOpacity
                    onPress={() => handleChange('hasVisa', true)}
                    className='flex-row items-center mr-5'
                  >
                    <View
                      className={`w-5 h-5 border border-blue rounded-full mr-2 ${customerDetails.hasVisa ? 'bg-blue' : 'border-gray-400'}`}
                    />
                    <Text>Has Visa</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleChange('hasVisa', null)} className='flex-row items-center'>
                    <View
                      className={`w-5 h-5 border border-blue rounded-full mr-2 ${!customerDetails.hasVisa ? 'bg-blue' : 'border-gray-400'}`}
                    />
                    <Text>No Visa</Text>
                  </TouchableOpacity>
                </View>

                <Text className='text-base mb-2 pl-3 font-medium'>
                  Email <Text className='text-red-600'>*</Text>
                </Text>
                <TextInput
                  className='border border-gray-300 rounded-lg p-2 mb-5 py-4 w-full'
                  keyboardType='email-address'
                  placeholder='Enter email'
                  value={customerDetails.email}
                  onChangeText={(text) => handleChange('email', text)}
                />

                <Text className='text-base mb-2 pl-3 font-medium'>
                  Phone Number <Text className='text-red-600'>*</Text>
                </Text>
                <TextInput
                  className='border border-gray-300 rounded-lg p-2 mb-5 py-4 w-full'
                  keyboardType='phone-pad'
                  placeholder='Enter phone number'
                  value={customerDetails.phoneNumber}
                  onChangeText={(text) => handleChange('phoneNumber', text)}
                />

                <Text className='text-base mb-2 pl-3 font-medium'>Nationality</Text>
                <TextInput
                  className='border border-gray-300 rounded-lg p-2 mb-5 py-4 w-full'
                  placeholder='Enter nationality'
                  value={customerDetails.nationality}
                  onChangeText={(text) => handleChange('nationality', text)}
                />

                <Text className='text-base mb-2 pl-3 font-medium'>
                  Passport Number{' '}
                  <Text className='text-gray-400'>
                    <Text className='text-red-600'>*</Text>
                  </Text>
                </Text>
                <TextInput
                  className='border border-gray-300 rounded-lg p-2 mb-5 py-4 w-full'
                  placeholder='Enter passport number'
                  value={customerDetails.passport}
                  onChangeText={(text) => handleChange('passport', text)}
                />

                <View className='flex-row justify-center mt-5'>
                  <TouchableOpacity
                    onPress={() => handleSave(ageGroup, index, customerDetails)}
                    className='bg-blue px-4 p-4 rounded-lg w-full'
                  >
                    <Text className='text-white font-semibold text-center text-base'>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export default CustomerDetailModal
