import { KoiVarietyType } from '@apps/customer/types/Koi/koiVariety.type'
import { View, Text, Image } from 'react-native'

const KoiCard: React.FC<{ koi: KoiVarietyType }> = ({ koi }) => {
  return (
    <View className='flex-row overflow-hidden bg-white rounded-lg shadow-lg border border-gray-200 m-4 max-w-[360px]'>
      <Image source={{ uri: koi.imageUrl }} className='w-36 h-48' resizeMode='cover' />
      <View className='flex-1 justify-center p-4'>
        <Text className='text-sm font-semibold mb-2'>{koi.varietyName}</Text>
        <Text className='text-gray-700 text-xs'>{koi.description}</Text>
      </View>
    </View>
  )
}

export default KoiCard
