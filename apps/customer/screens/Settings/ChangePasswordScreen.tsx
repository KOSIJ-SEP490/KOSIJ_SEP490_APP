import PasswordChangeForm from '@apps/customer/components/Form/PasswordChangeForm'
import SubLayout from '@shared/layouts/SubLayout'
import React from 'react'

export default function ChangePasswordScreen() {
  return (
    <SubLayout title='Change Password' showBackButton={true}>
      <PasswordChangeForm />
    </SubLayout>
  )
}
