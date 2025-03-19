import React from 'react'
import { Alert, SafeAreaView, ScrollView } from 'react-native'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import ProfileEditForm from '@apps/customer/components/Form/ProfileEditForm'
import SubLayout from '@apps/customer/layouts/SubLayout'
import { CustomerSettingsStackParamList } from '@apps/customer/types/navigationCustomerType'
import { useUpdateAccount } from '@apps/customer/hooks/useAccount'

type AccountScreenRouteProp = RouteProp<CustomerSettingsStackParamList, 'Account'>

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
          <ProfileEditForm
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
