import { useNotifications } from '@apps/consulting/api/useNotification.api'
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import dayjs from 'dayjs'

export default function NotiScreen() {
  const [notifications, setNotifications] = useState<any[]>([])
  const { fetchNotification } = useNotifications()

  useEffect(() => {
    async function getNotifications() {
      const fetchedNotifications = await fetchNotification()
      setNotifications(fetchedNotifications)
    }

    getNotifications()
  }, [])

  const formatTime = (createdTime: string) => {
    console.log('Received createdTime:', createdTime)

    const [date, time] = createdTime.split(' ')
    const [day, month, year] = date.split('-')

    const formattedDate = `${year}-${month}-${day}T${time}`

    const notificationDate = new Date(formattedDate)
    console.log('notificationDate: ', notificationDate)

    if (isNaN(notificationDate.getTime())) {
      console.error('Invalid date format:', createdTime)
      return ''
    }

    const dayFormatted = String(notificationDate.getDate()).padStart(2, '0')
    const monthFormatted = String(notificationDate.getMonth() + 1).padStart(2, '0')
    const yearFormatted = notificationDate.getFullYear()

    const now = new Date()
    const diffInMs = now.getTime() - notificationDate.getTime()
    const diffInHours = diffInMs / (1000 * 3600)

    if (diffInHours < 24) {
      return notificationDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else {
      return `${dayFormatted}/${monthFormatted}/${yearFormatted}`
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Notifications</Text>
        <TouchableOpacity>
          <Text style={styles.readAllText}>Read All</Text>
        </TouchableOpacity>
      </View>
      {notifications.map((notification) => {
        const title = `${notification.actionType} ${notification.referenceType}`
        return (
          <View
            key={notification.id}
            style={[styles.notification, notification.markAsRead && styles.unreadNotification]}
          >
            <Icon name='plane' size={20} color='#333' style={styles.icon} solid={false} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{notification.message}</Text>
            </View>
            <Text style={styles.time}>{formatTime(notification.createdTime)}</Text>
            {notification.markAsRead && <View style={styles.unreadDot} />}
          </View>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
    marginBottom: 20
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    flex: 1
  },
  readAllText: {
    fontSize: 14,
    color: 'red'
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    position: 'relative'
  },
  unreadNotification: {
    backgroundColor: '#DDE4FA'
  },
  icon: {
    marginRight: 10
  },
  textContainer: {
    flex: 1
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  message: {
    fontSize: 14,
    color: '#555',
    marginTop: 5
  },
  time: {
    fontSize: 12,
    color: '#888',
    position: 'absolute',
    top: 5,
    right: 10
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#5aa7ff',
    position: 'absolute',
    top: '70%',
    right: 10,
    transform: [{ translateY: -4 }],
    elevation: 5
  }
})
