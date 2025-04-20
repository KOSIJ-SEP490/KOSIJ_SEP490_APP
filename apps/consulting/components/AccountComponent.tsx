import React from 'react'
import { Alert, SafeAreaView, ScrollView } from 'react-native'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import SubLayout from '@shared/layouts/SubLayout'
import EditProfile from './EditedProfile'
import { AccountType } from '@shared/types/Account.dto'
import { useUpdateAccount } from '../api/useAccount.api'

type SettingStackParamList = {
  AccountDetails: { account?: AccountType }
}

type AccountScreenRouteProp = RouteProp<SettingStackParamList, 'AccountDetails'>

export default function AccountScreen() {
  const navigation = useNavigation()
  const route = useRoute<AccountScreenRouteProp>()
  const { account } = route.params
  const { updateAccount } = useUpdateAccount()

  const handleUpdateProfile = async (profileData: {
    email: string
    fullName: string
    phoneNumber: string
    address: string
    sex: string
    profileImage?: string
  }) => {
    const updatedData = {
      fullName: profileData.fullName,
      sex: profileData.sex,
      phoneNumber: profileData.phoneNumber,
      address: profileData.address,
      urlAvatar: profileData.profileImage ?? ''
    }

    const response = await updateAccount(updatedData)

    if (!response) {
      Alert.alert('Update Failed', 'An unexpected error occurred.')
      return
    }

    if ('error' in response) {
      Alert.alert('Update Failed', response.error)
      return
    }

    Alert.alert('Profile Updated', response.message, [
      {
        text: 'OK',
        onPress: () => navigation.goBack()
      }
    ])
  }

  return (
    <SubLayout title='Edit User Information' showBackButton={true}>
      <SafeAreaView className='flex-1 bg-white'>
        <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
          <EditProfile
            initialEmail={account?.email}
            initialFullName={account?.fullName}
            initialPhoneNumber={account?.phoneNumber}
            initialAddress={account?.address ?? ''}
            initialSex={account?.sex ?? ''}
            initialProfileImage={account?.urlAvatar ?? ''}
            onUpdateProfile={handleUpdateProfile}
          />
        </ScrollView>
      </SafeAreaView>
    </SubLayout>
  )
}
