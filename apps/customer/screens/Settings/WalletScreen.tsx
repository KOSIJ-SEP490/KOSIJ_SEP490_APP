import React from 'react'
import { ScrollView, View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { CustomerSettingsStackNavigationProp } from '@apps/customer/types/navigationCustomerType'
import SubLayout from '@apps/customer/layouts/SubLayout'
import WalletSection from '@apps/customer/components/Card/Wallet/WalletSection'
import TransactionCard from '@apps/customer/components/Card/Transaction/TransactionCard'
import Divider from '@apps/customer/components/Divider'
import { useWallet } from '@apps/customer/hooks/useWallet'
import { useTransactionByAll } from '@apps/customer/hooks/useTransaction'

export default function WalletScreen() {
  const navigation = useNavigation<CustomerSettingsStackNavigationProp>()
  const { wallet } = useWallet()
  const { transactions } = useTransactionByAll()

  const handleRecharge = () => {
    navigation.navigate('Recharge')
  }

  const handleWithdraw = () => {
    navigation.navigate('Withdraw')
  }

  return (
    <SubLayout title='Wallet' showBackButton={true}>
      <WalletSection balance={wallet?.balance ?? 0} onRecharge={handleRecharge} onWithdraw={handleWithdraw} />
      <Divider />

      <View className='px-5 mt-5'>
        <Text className='text-base font-semibold'>Transaction</Text>
      </View>

      <ScrollView className='px-4 mt-4 h-60'>
        {transactions.length > 0 ? (
          transactions.map((transaction) => <TransactionCard key={transaction.id} transaction={transaction} />)
        ) : (
          <View className='items-center mt-10'>
            <Text className='text-gray-500'>No transactions found</Text>
          </View>
        )}
      </ScrollView>
    </SubLayout>
  )
}
