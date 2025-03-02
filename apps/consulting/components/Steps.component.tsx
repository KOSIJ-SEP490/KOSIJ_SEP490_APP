import React from 'react'
import { View, Text } from 'react-native'
import { CheckIcon } from 'react-native-heroicons/solid' // Importing heroicons
import clsx from 'clsx'

type StepProps = {
  stepNumber: number
  title: string
  isActive: boolean
  isCompleted: boolean
}

const Step = ({ stepNumber, title, isActive, isCompleted }: StepProps) => {
  return (
    <View className='flex-1 flex-row items-center'>
      {/* Step Circle */}
      <View
        className={clsx(
          'w-10 h-10 rounded-full flex items-center justify-center border-2',
          isCompleted
            ? 'bg-green-500 border-green-500'
            : isActive
              ? 'bg-blue-500 border-blue-500'
              : 'bg-gray-200 border-gray-300'
        )}
      >
        {isCompleted ? (
          <CheckIcon size={24} color='white' />
        ) : (
          <Text className={clsx('font-bold', isActive ? 'text-white text-lg' : 'text-gray-600 text-base')}>
            {stepNumber}
          </Text>
        )}
      </View>

      {/* Step Title (Aligned with the Circle) */}
      <Text className={clsx('ml-2 text-sm font-medium', isActive ? 'text-blue-500' : 'text-gray-500')}>{title}</Text>
    </View>
  )
}

export default Step
