import SubLayout from '@apps/customer/layouts/SubLayout'
import {
  CustomerSettingsStackNavigationProp,
  CustomerSettingsStackParamList
} from '@apps/customer/types/navigationCustomerType'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'
import { ActivityIndicator } from 'react-native'
import Toast from 'react-native-toast-message'
import { WebView } from 'react-native-webview'

type TopUpWebScreenRouteProp = RouteProp<CustomerSettingsStackParamList, 'TopUpWeb'>

const TopUpWebScreen: React.FC = () => {
  const route = useRoute<TopUpWebScreenRouteProp>()
  const navigation = useNavigation<CustomerSettingsStackNavigationProp>()
  const { url } = route.params

  const handleNavigationStateChange = (navState: { url: string }) => {
    const currentUrl = navState.url

    if (currentUrl.includes('Vnpay/Callback')) {
      const params = new URLSearchParams(currentUrl.split('?')[1])
      const transactionStatus = params.get('vnp_TransactionStatus')
      if (transactionStatus === '00') {
        Toast.show({
          type: 'success',
          text1: 'Top Up',
          text2: 'Top Up Successfully'
        })
      } else {
        Toast.show({
          type: 'error',
          text1: 'Top Up',
          text2: 'Top Up Failed'
        })
      }

      navigation.replace('Settings')
    }
  }

  return (
    <SubLayout title='VN Pay' showBackButton={false}>
      <WebView
        className='mt-5'
        source={{ uri: url ?? '' }}
        startInLoadingState
        onNavigationStateChange={handleNavigationStateChange}
        renderLoading={() => <ActivityIndicator size='large' color='#0000ff' style={{ marginTop: 20 }} />}
      />
    </SubLayout>
  )
}

export default TopUpWebScreen
