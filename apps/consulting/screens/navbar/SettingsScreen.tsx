import React, { useContext, useState, useEffect } from 'react'
import { View, Text, Alert, LogBox, ScrollView } from 'react-native'
import { useNavigation, CommonActions } from '@react-navigation/native'
import AuthContext from '@shared/context/AuthContext'
import { AuthStackNavigationProp } from '@shared/types/navigationAuthType'
import ProfileCard from '@apps/consulting/components/ProfileCard'
import SettingCard from '@apps/consulting/components/SettingCard'
import LoggingOut from '@apps/consulting/components/LoggingOut'
import { useAccount } from '@apps/consulting/api/useAccount.api'
import { AccountType } from '@shared/types/Account.dto'
import { StackNavigationProp } from '@react-navigation/stack'

type SettingStackParamList = {
  // Settings: undefined
  // Account: { account?: AccountType }
  // ChangePassword: { account?: AccountType }
  // Wallet?: undefined
  // Recharge: undefined
  // Withdraw: undefined
  // WithdrawDetails: { withdrawID?: number }
  // TopUpWeb: { url?: string }
  EditProfile: undefined
  ChangePassword: { account?: AccountType }
  AccountDetails: { account?: AccountType }
}

LogBox.ignoreLogs(["The action 'RESET' with payload"])

export default function SettingsScreen() {
  const authContext = useContext(AuthContext)
  const navigation = useNavigation<AuthStackNavigationProp>()
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [darkModeEnabled, setDarkModeEnabled] = useState(true)
  const { account, refetch: refetchAccount } = useAccount()
  const navigation2 = useNavigation<StackNavigationProp<SettingStackParamList>>()

  if (!authContext) {
    return <Text className='text-center p-4'>Error: AuthContext not found!</Text>
  }

  const { logout } = authContext

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetchAccount()
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
    <ScrollView>
      <View className='flex-1 p-6 bg-white'>
        <Text className='text-lg font-bold text-center mb-4'>Account</Text>

        <ProfileCard account={account ?? undefined} />

        <SettingCard
          notificationsEnabled={notificationsEnabled}
          setNotificationsEnabled={setNotificationsEnabled}
          darkModeEnabled={darkModeEnabled}
          setDarkModeEnabled={setDarkModeEnabled}
          onTermsPress={() => console.log('Navigate to Terms and Policies')}
          onChangePasswordPress={() => navigation2.navigate('ChangePassword', { account: account ?? undefined })}
        />

        <LoggingOut onPress={confirmLogout} />
      </View>
    </ScrollView>
  )
}
