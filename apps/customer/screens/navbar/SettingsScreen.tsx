import React, { useContext, useState, useEffect } from 'react'
import { View, Text, Alert, LogBox } from 'react-native'
import { useNavigation, CommonActions } from '@react-navigation/native'
import AuthContext from '@shared/context/AuthContext'
import { AuthStackNavigationProp } from '@shared/types/navigationAuthType'
import ProfileCard from '@apps/customer/components/Card/Account/AccountCard'
import SettingsCard from '@apps/customer/components/Card/Settinngs/SettingsCard'
import LogoutButton from '@apps/customer/components/Button/LogoutBtn'
import { useAccount } from '@apps/customer/hooks/useAccount'
import { useWallet } from '@apps/customer/hooks/useWallet'
import { CustomerSettingsStackNavigationProp } from '@apps/customer/types/navigationCustomerType'
import WalletBalance from '@apps/customer/components/Card/Wallet/WalletCard'

LogBox.ignoreLogs(["The action 'RESET' with payload"])

export default function SettingsScreen() {
  const authContext = useContext(AuthContext)
  const navigation = useNavigation<AuthStackNavigationProp>()
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [darkModeEnabled, setDarkModeEnabled] = useState(true)
  const { account, refetch: refetchAccount } = useAccount()
  const { wallet, refetch: refetchWallet } = useWallet()
  const navigation2 = useNavigation<CustomerSettingsStackNavigationProp>()

  if (!authContext) {
    return <Text className='text-center p-4'>Error: AuthContext not found!</Text>
  }

  const { logout } = authContext

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetchAccount()
      refetchWallet()
    })
    return unsubscribe
  }, [navigation])

  const confirmLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout()
          setTimeout(() => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }]
              })
            )
          }, 100)
        }
      }
    ])
  }

  return (
    <View className='flex-1 p-6 bg-white pt-16'>
      <Text className='text-lg font-bold text-center mb-4'>Account</Text>

      <ProfileCard account={account ?? undefined} />

      <WalletBalance balance={wallet?.balance ?? 0} onPress={() => navigation2.navigate('Wallet')} />

      <SettingsCard
        notificationsEnabled={notificationsEnabled}
        setNotificationsEnabled={setNotificationsEnabled}
        darkModeEnabled={darkModeEnabled}
        setDarkModeEnabled={setDarkModeEnabled}
        onTermsPress={() => console.log('Navigate to Terms and Policies')}
        onChangePasswordPress={() => navigation2.navigate('ChangePassword', { account: account ?? undefined })}
      />

      <LogoutButton onPress={confirmLogout} />
    </View>
  )
}
