import React from 'react'
import { View } from 'react-native'
import Step from './Steps.component'

const steps = ['Step 1', 'Step 2']

type StepsProps = {
  currentStep: number
}

const Steps = ({ currentStep }: StepsProps) => {
  return (
    <View className='flex-row items-center w-full px-6'>
      {steps.map((title, index) => (
        <React.Fragment key={index}>
          <Step
            stepNumber={index + 1} // Step Number
            title={title}
            isActive={currentStep === index}
            isCompleted={index < currentStep}
          />

          {/* Step Connector Line */}
          {index < steps.length - 1 && <View className='flex-1 h-1 bg-gray-300 mx-2' />}
        </React.Fragment>
      ))}
    </View>
  )
}

export default Steps
