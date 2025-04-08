import React from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { format } from 'date-fns'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { DeliveryNotificationsStackParamList } from '../types/navigationDelivery.type'
import { NotificationType } from '../types/Notifications/Notification.type'
import { useMarkAsRead } from '../hooks/useNotification'

interface NotificationCardProps {
  notification?: NotificationType | null
  onMarkAsRead?: () => void
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onMarkAsRead }) => {
  const { markAsRead, loading } = useMarkAsRead()
  const navigation = useNavigation<StackNavigationProp<DeliveryNotificationsStackParamList>>()

  if (!notification) {
    return null
  }

  const { id, message, markAsRead: isRead, referenceType, createdTime, refId } = notification

  const formattedDate = (() => {
    try {
      const [day, month, year, time] = createdTime.split(/[- ]/)
      const [hours, minutes, seconds] = time.split(':')
      const dateObj = new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`)
      return format(dateObj, 'MMM d, yyyy h:mm a')
    } catch {
      return 'Invalid date'
    }
  })()

  const handlePress = async () => {
    if (!isRead && !loading) {
      const success = await markAsRead(id)
      if (success && onMarkAsRead) {
        onMarkAsRead()
      }
    }

    navigateBasedOnReference(referenceType, refId)
  }

  const navigateBasedOnReference = (type?: string, refId?: number) => {
    if (!type || !refId) return

    switch (type) {
      case 'Order':
        navigation.navigate('OrderDetails', { orderID: refId })
        break
      default:
        break
    }
  }

  return (
    <TouchableOpacity
      className={`mx-4 my-2 p-3 rounded-lg border ${isRead ? 'bg-white border-gray-200' : 'bg-blue-light border-blue'}`}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={loading}
    >
      <View className='flex-row justify-between items-start mb-1'>
        <Text className={`text-sm font-semibold ${isRead ? 'text-gray-800' : 'text-blue-900'}`} numberOfLines={1}>
          {referenceType || 'Notification'}
        </Text>

        {!isRead &&
          (loading ? (
            <ActivityIndicator size='small' color='#3B82F6' />
          ) : (
            <View className='bg-blue rounded-full w-2 h-2 mt-1' />
          ))}
      </View>

      <Text className={`text-sm mb-1 ${isRead ? 'text-gray-600' : 'text-gray-800'}`} numberOfLines={2}>
        {message || 'No message content'}
      </Text>

      <Text className='text-xs text-gray-500 mt-1'>{formattedDate}</Text>
    </TouchableOpacity>
  )
}

export default NotificationCard
