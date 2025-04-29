import NotificationCard from '@apps/customer/components/Card/Notification/NotificationCard'
import { useMarkAsReadAll, useNotificationsByAll } from '@apps/customer/hooks/useNotifications'
import SubLayout from '@shared/layouts/SubLayout'
import React, { useCallback } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { ActivityIndicator } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'

export default function NotificationsScreen() {
  const { notifications, error, reload } = useNotificationsByAll()
  const { markAllAsRead, loading: markAllLoading } = useMarkAsReadAll()

  useFocusEffect(
    useCallback(() => {
      reload()

      const interval = setInterval(() => {
        reload()
      }, 5000)

      return () => clearInterval(interval)
    }, [reload])
  )

  const handleMarkAll = async () => {
    await markAllAsRead()
    reload()
  }

  const reversedNotifications = notifications
    ? [...notifications].sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime())
    : []

  return (
    <SubLayout title='Notifications' showBackButton={false}>
      {error ? (
        <View className='flex-1 justify-center items-center p-4'>
          <Text className='text-red-500 text-center'>{error}</Text>
        </View>
      ) : !notifications ? (
        <View className='flex-1 justify-center items-center'>
          <ActivityIndicator size='large' />
        </View>
      ) : notifications.length === 0 ? (
        <View className='flex-1 justify-center items-center'>
          <Text className='text-gray-500 text-lg'>There are no notifications yet</Text>
        </View>
      ) : (
        <ScrollView
          className='flex-1 mt-10'
          contentContainerStyle={{ paddingBottom: 20 }}
          contentOffset={{ x: 0, y: 10000 }}
        >
          <TouchableOpacity
            onPress={handleMarkAll}
            disabled={markAllLoading}
            className='bg-blue mx-4 my-2 p-3 rounded-lg items-center'
          >
            {markAllLoading ? (
              <ActivityIndicator color='white' />
            ) : (
              <Text className='text-white font-medium'>Mark All Notifications as Read</Text>
            )}
          </TouchableOpacity>

          {reversedNotifications.map((item) => (
            <NotificationCard key={item.id.toString()} notification={item} onMarkAsRead={reload} />
          ))}
        </ScrollView>
      )}
    </SubLayout>
  )
}
