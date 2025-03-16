import { useBooking } from '@apps/customer/contexts/BookingContext'
import type React from 'react'
import { useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, Modal, ScrollView } from 'react-native'
import { Calendar, ChevronDown, Minus, Plus, X } from 'react-native-feather'

const DatePicker = ({
  visible,
  onClose,
  onSelectDate
}: {
  visible: boolean
  onClose: () => void
  onSelectDate: (date: Date) => void
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()

  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  const days = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const changeMonth = (increment: boolean) => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(newMonth.getMonth() + (increment ? 1 : -1))
    setCurrentMonth(newMonth)
  }

  const handleSelectDate = (day: number) => {
    if (!day) return
    const newDate = new Date(currentMonth)
    newDate.setDate(day)
    setSelectedDate(newDate)
  }

  const confirmSelection = () => {
    onSelectDate(selectedDate)
    onClose()
  }

  return (
    <Modal visible={visible} transparent={true} animationType='fade'>
      <View className='flex-1 justify-center items-center bg-black/50'>
        <View className='bg-white w-[90%] rounded-xl p-4'>
          <View className='flex-row justify-between items-center mb-4'>
            <Text className='text-lg font-bold'>Select Date</Text>
            <TouchableOpacity onPress={onClose}>
              <X width={24} height={24} stroke='#000' />
            </TouchableOpacity>
          </View>

          <View className='flex-row justify-between items-center mb-4'>
            <TouchableOpacity onPress={() => changeMonth(false)}>
              <Text className='text-lg'>←</Text>
            </TouchableOpacity>
            <Text className='text-base font-medium'>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </Text>
            <TouchableOpacity onPress={() => changeMonth(true)}>
              <Text className='text-lg'>→</Text>
            </TouchableOpacity>
          </View>

          <View className='flex-row flex-wrap mb-4'>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <View key={`header-${index}`} className='w-[14.28%] py-2'>
                <Text className='text-center font-medium'>{day}</Text>
              </View>
            ))}

            {days.map((day, index) => (
              <TouchableOpacity
                key={`day-${index}`}
                className={`w-[14.28%] py-2 items-center ${
                  day &&
                  selectedDate.getDate() === day &&
                  selectedDate.getMonth() === currentMonth.getMonth() &&
                  selectedDate.getFullYear() === currentMonth.getFullYear()
                    ? 'bg-blue rounded-full'
                    : ''
                }`}
                onPress={() => day && handleSelectDate(day)}
              >
                {day ? (
                  <Text
                    className={`text-center ${
                      selectedDate.getDate() === day &&
                      selectedDate.getMonth() === currentMonth.getMonth() &&
                      selectedDate.getFullYear() === currentMonth.getFullYear()
                        ? 'text-white'
                        : ''
                    }`}
                  >
                    {day}
                  </Text>
                ) : null}
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity className='bg-blue py-3 rounded-lg' onPress={confirmSelection}>
            <Text className='text-white text-center font-medium'>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const TravelInfoCard: React.FC = () => {
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [startDate, setStartDate] = useState<Date | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [budget, setBudget] = useState('')
  const [formattedBudget, setFormattedBudget] = useState('')
  const [nights, setNights] = useState('')
  const [customers, setCustomers] = useState(0)
  const [departurePoint, setDeparturePoint] = useState('')
  const [nameContact, setNameContact] = useState('')
  const [emailContact, setEmailContact] = useState('')
  const [phoneContact, setPhoneContact] = useState('')
  const [showDepartureOptions, setShowDepartureOptions] = useState(false)
  const { setBookingRequest } = useBooking()

  const departureOptions = ['Ha Noi (Noi Bai Airport)', 'Ho Chi Minh (Tan Son Nhat Airport)']

  const formatDate = (date: Date | null) => {
    if (!date) return ''

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const day = days[date.getDay()]

    const dd = String(date.getDate()).padStart(2, '0')
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const yyyy = date.getFullYear()

    return `${day} ${dd}/${mm}/${yyyy}`
  }

  const formatNumber = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '')

    if (numericValue) {
      return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
    return ''
  }

  const handleBudgetChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '')
    const formatted = formatNumber(numericValue)

    setFormattedBudget(formatted)
    setBudget(numericValue)

    setBookingRequest((prev) => ({
      ...prev,
      affordableBudget: Number(numericValue)
    }))
  }

  const handleNameChange = (text: string) => {
    setNameContact(text)
    setBookingRequest((prev) => ({
      ...prev,
      nameContact: text
    }))
  }

  const handleEmailChange = (text: string) => {
    setEmailContact(text)
    setBookingRequest((prev) => ({
      ...prev,
      emailContact: text
    }))
  }

  const handlePhoneChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '')
    setPhoneContact(numericValue)
    setBookingRequest((prev) => ({
      ...prev,
      phoneContact: numericValue
    }))
  }

  const handleCustomerChange = (increment: boolean) => {
    const newValue = increment ? customers + 1 : Math.max(1, customers - 1)
    setCustomers(newValue)

    setBookingRequest((prev) => ({
      ...prev,
      numberOfPassengers: newValue
    }))
  }

  const handleSelectDate = (date: Date) => {
    setStartDate(date)
    setShowDatePicker(false)

    setBookingRequest((prev) => ({
      ...prev,
      departureDate: date.toISOString()
    }))
  }

  const handleNightsChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '')
    setNights(numericValue)

    setBookingRequest((prev) => ({
      ...prev,
      nights: numericValue ? Number(numericValue) : 0
    }))
  }

  const handleSelectDeparturePoint = (option: string) => {
    setDeparturePoint(option)
    setShowDepartureOptions(false)

    setBookingRequest((prev) => ({
      ...prev,
      departurePoint: option
    }))
  }

  return (
    <View className='mt-8 px-5'>
      <View className='mb-4'>
        <Text className='text-sm font-bold mb-2'>Name Contact</Text>
        <TextInput
          className='border border-gray-200 rounded-lg p-4 bg-white text-sm'
          value={nameContact}
          placeholder='Enter your name'
          onChangeText={handleNameChange}
        />
      </View>

      <View className='mb-4'>
        <Text className='text-sm font-bold mb-2'>Email Contact</Text>
        <TextInput
          className='border border-gray-200 rounded-lg p-4 bg-white text-sm'
          value={emailContact}
          placeholder='Enter your email'
          keyboardType='email-address'
          onChangeText={handleEmailChange}
        />
      </View>

      <View className='mb-4'>
        <Text className='text-sm font-bold mb-2'>Phone Contact</Text>
        <TextInput
          className='border border-gray-200 rounded-lg p-4 bg-white text-sm'
          value={phoneContact}
          placeholder='Enter your phone number'
          keyboardType='numeric'
          onChangeText={handlePhoneChange}
        />
      </View>
      <View className='mb-4'>
        <Text className='text-sm font-bold mb-2'>Start Date</Text>
        <TouchableOpacity
          className='flex-row items-center border border-gray-200 rounded-lg p-4 bg-white'
          onPress={() => setShowDatePicker(true)}
        >
          <Calendar width={20} height={20} stroke='#000' />
          <Text className='flex-1 ml-2 text-sm'>{startDate ? formatDate(startDate) : 'Select a date'}</Text>
        </TouchableOpacity>
      </View>

      <View className='flex-row justify-between mb-4'>
        <View className='w-[48%]'>
          <Text className='text-sm font-bold mb-2'>Affordable Budget (VND)</Text>
          <TextInput
            className='border border-gray-200 rounded-lg p-4 bg-white text-sm'
            value={formattedBudget}
            placeholder='0'
            keyboardType='numeric'
            onChangeText={handleBudgetChange}
          />
        </View>

        <View className='w-[48%]'>
          <Text className='text-sm font-bold mb-2'>Number of Nights</Text>
          <TextInput
            className='border border-gray-200 rounded-lg p-4 bg-white text-sm'
            value={nights}
            placeholder='0'
            keyboardType='numeric'
            onChangeText={handleNightsChange}
          />
        </View>
      </View>

      <View className='mb-4'>
        <Text className='text-sm font-bold mb-2'>Number of Customers</Text>
        <View className='flex-row items-center justify-between border border-gray-200 rounded-lg p-4 bg-white'>
          <Text className='text-sm'>Customer Amount</Text>
          <View className='flex-row items-center'>
            <TouchableOpacity
              className='w-9 h-9 rounded-full justify-center items-center border border-gray-200'
              onPress={() => handleCustomerChange(false)}
            >
              <Minus width={20} height={20} stroke='#E74C3C' />
            </TouchableOpacity>
            <Text className='mx-3 text-sm'>{customers}</Text>
            <TouchableOpacity
              className='w-9 h-9 rounded-full justify-center items-center border border-gray-200'
              onPress={() => handleCustomerChange(true)}
            >
              <Plus width={20} height={20} stroke='#3498DB' />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className='mb-4'>
        <Text className='text-sm font-bold mb-2'>Departure Point</Text>
        <TouchableOpacity
          className='flex-row items-center justify-between border border-gray-200 rounded-lg p-4 bg-white'
          onPress={() => setShowDepartureOptions(true)}
        >
          <Text className='text-sm'>{departurePoint || 'Select a departure point'}</Text>
          <ChevronDown width={20} height={20} stroke='#000' />
        </TouchableOpacity>
      </View>

      <DatePicker visible={showDatePicker} onClose={() => setShowDatePicker(false)} onSelectDate={handleSelectDate} />

      <Modal visible={showDepartureOptions} transparent={true} animationType='fade'>
        <View className='flex-1 justify-center items-center bg-black/50'>
          <View className='bg-white w-[90%] rounded-xl p-4'>
            <View className='flex-row justify-between items-center mb-4'>
              <Text className='text-lg font-bold'>Select Departure Point</Text>
              <TouchableOpacity onPress={() => setShowDepartureOptions(false)}>
                <X width={24} height={24} stroke='#000' />
              </TouchableOpacity>
            </View>

            <ScrollView className='max-h-60'>
              {departureOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  className='py-3 border-b border-gray-100'
                  onPress={() => handleSelectDeparturePoint(option)}
                >
                  <Text className='text-base'>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default TravelInfoCard
