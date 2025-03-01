import { StackScreenProps } from '@react-navigation/stack'
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import { ChevronLeft, ArrowRight, UploadCloud, CheckCircle } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import Steps from './Steps.container'

type RootStackParamList = {
  CollectTicket: { ticketImage: string }
}

type Props = StackScreenProps<RootStackParamList, 'CollectTicket'>

const CollectTicket = ({ route }: Props) => {
  const navigation = useNavigation()
  const { ticketImage } = route.params || {}
  const [currentStep, setCurrentStep] = useState(1)

  return (
    <View className='flex-1 bg-white px-4 pt-4'>
      {/* Header */}
      <View className='mt-3 flex-row items-center px-4 py-2'>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft color={'#292D32'} size={24} />
        </TouchableOpacity>
        <Text className='text-lg font-semibold text-center flex-1'>Tour Detailed</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Steps Indicator */}
      <Steps currentStep={currentStep} />

      {currentStep === 1 ? (
        // ✅ STEP 1: Collect Tickets
        <>
          <View className='p-4 rounded-lg mt-4' style={{ backgroundColor: '#264eca' }}>
            <Text className='text-white font-bold'>🚀 Please collect tickets at the check-in counter</Text>
            <Text className='text-white text-sm'>Please collect tickets at least 3 hours before the flight.</Text>
          </View>

          {/* Ticket Image Upload */}
          <View className='mt-4 border-dashed border-2 border-gray-300 rounded-lg p-4 items-center'>
            {ticketImage ? (
              <Image source={{ uri: ticketImage }} className='w-full h-40 rounded-lg' />
            ) : (
              <View className='items-center'>
                <UploadCloud size={32} className='text-gray-400' />
                <Text className='text-gray-500'>Upload ticket image</Text>
              </View>
            )}
          </View>
        </>
      ) : (
        // ✅ STEP 2: Take Attendance
        <ScrollView>
          <View className='p-4 rounded-lg mt-4' style={{ backgroundColor: '#264eca' }}>
            <Text className='text-white font-bold'>
              ℹ️ Please complete the attendance check before proceeding to check-in.
            </Text>
          </View>

          {/* Attendance List */}
          <ScrollView className='mt-4' style={{ maxHeight: 400 }}>
            <View className='bg-gray-100 p-4 rounded-lg mt-4'>
              <Text className='text-lg font-semibold mb-2'>Take attendance</Text>
              {Array(8)
                .fill('Wade Warren')
                .map((name, index) => (
                  <View key={index} className='flex-row justify-between p-2 bg-white rounded-md mb-2'>
                    <Text>{name}</Text>
                    <CheckCircle color={'#2563eb'} size={20} />
                  </View>
                ))}
            </View>
          </ScrollView>
        </ScrollView>
      )}

      {/* Navigation Buttons (Fixed at Bottom) */}
      <View className='absolute bottom-4 left-4 right-4 flex-row justify-between'>
        <TouchableOpacity className='px-4 py-2 border border-blue-600 rounded-full' onPress={() => setCurrentStep(1)}>
          <Text className='text-blue-600'>← Prev</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`px-4 py-2 rounded-full flex-row items-center ${currentStep === 1 ? '#264eca' : 'bg-green-600'}`}
          onPress={() => (currentStep === 1 ? setCurrentStep(2) : alert('Done!'))}
        >
          <Text className='text-white mr-2'>{currentStep === 1 ? 'Next' : 'Done'}</Text>
          {currentStep === 1 ? (
            <ArrowRight size={18} className='text-white' />
          ) : (
            <CheckCircle size={18} className='text-white' />
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CollectTicket
