import WithdrawRequestCard from '@apps/customer/components/Card/Wallet/WithdrawRequestCard'
import WithdrawForm from '@apps/customer/components/Form/WithDrawForm'
import { useWithdrawRequestByAll } from '@apps/customer/hooks/useWallet'
import SubLayout from '@shared/layouts/SubLayout'
import React, { useState, useCallback } from 'react'
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'

export default function WithdrawScreen() {
  const { withdrawalRequests, loading, error, refetch } = useWithdrawRequestByAll()
  const [selectedTab, setSelectedTab] = useState<'withdraw' | 'request'>('withdraw')

  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [])
  )

  return (
    <SubLayout title='Withdraw' showBackButton={true}>
      <View className='flex-row justify-center space-x-4 mb-4 mt-10'>
        <TouchableOpacity
          className={`px-6 py-2 rounded-lg ${selectedTab === 'withdraw' ? 'bg-blue' : 'bg-gray-200'}`}
          onPress={() => setSelectedTab('withdraw')}
        >
          <Text className={`text-base font-bold ${selectedTab === 'withdraw' ? 'text-white' : 'text-black'}`}>
            Withdraw
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`px-6 py-2 rounded-lg ${selectedTab === 'request' ? 'bg-blue' : 'bg-gray-200'}`}
          onPress={() => setSelectedTab('request')}
        >
          <Text className={`text-base font-bold ${selectedTab === 'request' ? 'text-white' : 'text-black'}`}>
            Request
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'withdraw' ? (
        <WithdrawForm />
      ) : (
        <View className='flex-1 mt-5 px-5'>
          <Text className='text-base ml-5 font-bold'>Withdrawal Requests</Text>

          {loading && <ActivityIndicator size='large' color='#0000ff' />}
          {error && <Text className='text-red-500'>{error}</Text>}

          <ScrollView className='space-y-4 mb-14'>
            {withdrawalRequests.map((request) => (
              <WithdrawRequestCard key={request.id} withdrawRequest={request} />
            ))}
          </ScrollView>
        </View>
      )}
    </SubLayout>
  )
}
