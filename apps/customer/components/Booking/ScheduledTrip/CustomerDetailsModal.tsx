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
  Keyboard,
  Alert
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
  const [ageError, setAgeError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')

  const isRepresentative = ageGroup === 'adult' && index === 0

  const handleChange = (field: keyof CustomerInfo, value: string | number | boolean | null) => {
    setCustomerDetails((prev) => ({ ...prev, [field]: value }))

    if (field === 'email') setEmailError('')
    if (field === 'phoneNumber') setPhoneError('')
  }

  const calculateAge = (birthDate: Date): number => {
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  const validateAge = (birthDate: Date): boolean => {
    const age = calculateAge(birthDate)

    if (ageGroup === 'adult' && age < 12) {
      setAgeError('Adult must be 12 years or older')
      return false
    } else if (ageGroup === 'child' && (age < 2 || age >= 12)) {
      setAgeError('Child must be between 2-11 years old')
      return false
    } else if (ageGroup === 'infant' && age >= 2) {
      setAgeError('Infant must be under 2 years old')
      return false
    }

    setAgeError('')
    return true
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid Gmail address')
      return false
    }
    setEmailError('')
    return true
  }

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^0\d{9}$/
    if (!phoneRegex.test(phone)) {
      setPhoneError('Phone must start with 0 and have 10 digits')
      return false
    }
    setPhoneError('')
    return true
  }

  const handleDateConfirm = (date: Date) => {
    if (date) {
      if (!validateAge(date)) {
        return
      }

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

      if (Platform.OS === 'android') {
        setDatePickerVisible(false)
      }
      setDatePickerVisible(false)
    }
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
      isRepresentative: isRepresentative,
      hasVisa: null
    })
    setAgeError('')
    setEmailError('')
    setPhoneError('')
  }

  useEffect(() => {
    if (visible) {
      const customerData = bookingData.customerDetails?.[ageGroup]?.[index] || initialCustomer
      if (customerData) {
        setCustomerDetails({
          ...customerData,
          sex: customerData.sex || 'Male'
        })
        if (customerData.dateOfBirth?.year) {
          const birthDate = new Date(
            customerData.dateOfBirth.year,
            customerData.dateOfBirth.month - 1,
            customerData.dateOfBirth.day
          )
          validateAge(birthDate)
        }
        if (customerData.email) {
          validateEmail(customerData.email)
        }
        if (customerData.phoneNumber) {
          validatePhone(customerData.phoneNumber)
        }
      }
    }
  }, [visible, ageGroup, index, initialCustomer])

  const { bookingData, setBookingData } = useBooking()

  const handleSave = (ageGroup: keyof CustomerDetails, index: number, details: CustomerInfo) => {
    if (!details.fullName?.trim()) {
      Alert.alert('Validation Error', 'Full name is required for all passengers.')
      return
    }

    if (!details.dateOfBirth?.year) {
      Alert.alert('Validation Error', 'Date of birth is required for all passengers.')
      return
    }

    const birthDate = new Date(details.dateOfBirth.year, details.dateOfBirth.month - 1, details.dateOfBirth.day)

    if (!validateAge(birthDate)) {
      return
    }

    if (isRepresentative) {
      if (!details.email?.trim()) {
        Alert.alert('Validation Error', 'Email is required for the representative.')
        return
      }
      if (!validateEmail(details.email)) {
        return
      }

      if (!details.phoneNumber?.trim()) {
        Alert.alert('Validation Error', 'Phone number is required for the representative.')
        return
      }
      if (!validatePhone(details.phoneNumber)) {
        return
      }

      if (!details.passport?.trim()) {
        Alert.alert('Validation Error', 'Passport number is required for the representative.')
        return
      }
    }

    const allCustomers = [
      ...bookingData.customerDetails.adult,
      ...bookingData.customerDetails.child,
      ...bookingData.customerDetails.infant
    ]

    const updatedCustomerDetails = { ...bookingData.customerDetails }
    if (!updatedCustomerDetails[ageGroup]) updatedCustomerDetails[ageGroup] = []
    updatedCustomerDetails[ageGroup][index] = {
      ...details,
      isRepresentative: isRepresentative
    }

    const numberOfVisas = allCustomers.reduce(
      (count, customer) => count + (customer.hasVisa !== true ? 1 : 0),
      details.hasVisa !== true ? 1 : 0
    )

    setBookingData((prev) => ({
      ...prev,
      customerDetails: updatedCustomerDetails,
      pricing: {
        ...prev.pricing,
        numberOfVisas,
        totalPrice:
          prev.pricing.adultPrice +
          prev.pricing.childPrice +
          prev.pricing.infantPrice +
          prev.pricing.visaPrice * numberOfVisas
      }
    }))

    onClose()
  }

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  const renderRequiredAsterisk = (isRequired: boolean = true) => {
    return isRequired ? <Text className='text-red-600'>*</Text> : null
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
                {isRepresentative && ' (Representative)'}
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

                <Text className='text-base mb-2 pl-3 font-medium'>Full Name {renderRequiredAsterisk()}</Text>
                <TextInput
                  className='border border-gray-300 rounded-lg p-2 mb-5 w-full py-4'
                  placeholder='Enter full name'
                  value={customerDetails.fullName}
                  onChangeText={(text) => handleChange('fullName', text)}
                />

                <Text className='text-base mb-2 pl-3 font-medium'>Date of Birth {renderRequiredAsterisk()}</Text>
                <TouchableOpacity
                  className='border border-gray-300 rounded-lg p-3 mb-2 bg-gray-100'
                  onPress={() => setDatePickerVisible(true)}
                >
                  <Text className='text-center text-gray-700'>
                    {customerDetails.dateOfBirth?.year
                      ? `${customerDetails.dateOfBirth.day}/${customerDetails.dateOfBirth.month}/${customerDetails.dateOfBirth.year}`
                      : 'Select Date'}
                  </Text>
                </TouchableOpacity>
                {ageError ? <Text className='text-red-500 text-sm mb-3 pl-3'>{ageError}</Text> : null}

                {datePickerVisible && (
                  <Modal transparent animationType='fade'>
                    <View className='flex-1 justify-center items-center bg-black/50'>
                      <View className='bg-white rounded-lg p-5 w-80'>
                        <Text className='text-lg font-semibold mb-3 text-center'>Select Date</Text>
                        <DateTimePicker
                          value={selectedDate}
                          mode='date'
                          display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                          onChange={(event, date) => {
                            if (date) {
                              handleDateConfirm(date)
                              if (Platform.OS === 'android') {
                                setDatePickerVisible(false)
                              }
                            }
                          }}
                        />
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
                      className={`w-5 h-5 border border-blue rounded-full mr-2 ${customerDetails.sex === 'Female' ? 'bg-blue' : 'border-gray-400'}`}
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
                  Email {renderRequiredAsterisk(isRepresentative)}
                </Text>
                <TextInput
                  className='border border-gray-300 rounded-lg p-2 mb-2 py-4 w-full'
                  keyboardType='email-address'
                  placeholder='Enter Gmail address'
                  value={customerDetails.email}
                  onChangeText={(text) => handleChange('email', text)}
                />
                {emailError ? <Text className='text-red-500 text-sm mb-3 pl-3'>{emailError}</Text> : null}

                <Text className='text-base mb-2 pl-3 font-medium'>
                  Phone Number {renderRequiredAsterisk(isRepresentative)}
                </Text>
                <TextInput
                  className='border border-gray-300 rounded-lg p-2 mb-2 py-4 w-full'
                  keyboardType='phone-pad'
                  placeholder='Enter phone number (0xxxxxxxxx)'
                  value={customerDetails.phoneNumber}
                  onChangeText={(text) => handleChange('phoneNumber', text)}
                  maxLength={10}
                />
                {phoneError ? <Text className='text-red-500 text-sm mb-3 pl-3'>{phoneError}</Text> : null}

                <Text className='text-base mb-2 pl-3 font-medium'>
                  Passport Number {renderRequiredAsterisk(isRepresentative)}
                </Text>
                <TextInput
                  className='border border-gray-300 rounded-lg p-2 mb-5 py-4 w-full'
                  placeholder='Enter passport number'
                  value={customerDetails.passport}
                  onChangeText={(text) => handleChange('passport', text)}
                />

                <Text className='text-base mb-2 pl-3 font-medium'>Nationality</Text>
                <TextInput
                  className='border border-gray-300 rounded-lg p-2 mb-5 py-4 w-full'
                  placeholder='Enter nationality'
                  value={customerDetails.nationality}
                  onChangeText={(text) => handleChange('nationality', text)}
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
