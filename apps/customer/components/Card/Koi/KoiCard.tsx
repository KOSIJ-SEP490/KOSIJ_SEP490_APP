import { KoiVarietyType } from '@apps/customer/types/Koi/koiVariety.type'
import { TripRequestVariety } from '@apps/customer/types/Trip/tripRequestDetails.type'
import { View, Text, Image } from 'react-native'

const fallbackImage = 'https://via.placeholder.com/150'

const isKoiVariety = (koi: KoiVarietyType | TripRequestVariety): koi is KoiVarietyType => {
  return (koi as KoiVarietyType).varietyName !== undefined
}

const KoiCard: React.FC<{ koi: KoiVarietyType | TripRequestVariety }> = ({ koi }) => {
  return (
    <View className='flex-row overflow-hidden bg-white rounded-lg shadow-lg border border-gray-200 m-4 max-w-[360px]'>
      <Image source={{ uri: koi.imageUrl || fallbackImage }} className='w-36 h-48' resizeMode='cover' />
      <View className='flex-1 justify-center p-4'>
        <Text className='text-sm font-semibold mb-2'>{isKoiVariety(koi) ? koi.varietyName : koi.koiName}</Text>
        <Text className='text-gray-700 text-xs'>{koi.description || 'No description available.'}</Text>
      </View>
    </View>
  )
}

export default KoiCard
