import React from 'react'
import { TouchableOpacity, Text, View } from 'react-native'

interface ReportFishDeathButtonProps {
  isReportable: boolean
  onPress: () => void
}

const ReportFishDeathButton: React.FC<ReportFishDeathButtonProps> = ({ isReportable, onPress }) => {
  return (
    <View className='px-5 mb-14'>
      <TouchableOpacity
        onPress={onPress}
        disabled={!isReportable}
        className={`rounded-lg py-3 items-center ${isReportable ? 'bg-blue' : 'bg-gray-400'}`}
      >
        <Text className='text-white font-bold text-base'>Report Fish Death</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ReportFishDeathButton
