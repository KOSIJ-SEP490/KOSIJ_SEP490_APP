import React from 'react'
import SubLayout from '@apps/customer/layouts/SubLayout'
import TopUpCard from '@apps/customer/components/Card/Wallet/TopUpCard'

export default function RechargeScreen() {
  return (
    <SubLayout title='Top Up' showBackButton={true}>
      <TopUpCard />
    </SubLayout>
  )
}
