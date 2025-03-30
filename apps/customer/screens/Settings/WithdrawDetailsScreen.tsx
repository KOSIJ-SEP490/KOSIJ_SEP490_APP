import WithdrawDetailForm from '@apps/customer/components/Card/Wallet/WithdrawDetailsForm'
import { CustomerSettingsStackParamList } from '@apps/customer/types/navigationCustomerType'
import { RouteProp, useRoute } from '@react-navigation/native'
import SubLayout from '@shared/layouts/SubLayout'
import React from 'react'

type WithdrawDetailsScreenRouteProp = RouteProp<CustomerSettingsStackParamList, 'WithdrawDetails'>

export default function WithdrawDetailsScreen() {
  const route = useRoute<WithdrawDetailsScreenRouteProp>()
  const { withdrawID } = route.params

  return (
    <SubLayout title='Withdraw' showBackButton={true}>
      <WithdrawDetailForm withdrawID={withdrawID} />
    </SubLayout>
  )
}
