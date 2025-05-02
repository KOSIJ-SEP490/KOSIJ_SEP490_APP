import { API_BASE_URL } from '@env'
import AuthContext from '@shared/context/AuthContext'
import React, { useState, useEffect, useContext } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, RefreshControl } from 'react-native'
import axios from 'axios'
import { ChevronLeft } from 'lucide-react-native'
import { DeliveryHomeStackNavigationProp } from '@apps/delivery/types/navigationDelivery.type'

interface Message {
  id: number
  fromUserId: string
  toUserId: string
  content: string
  isRead: boolean
  createdTime: string
  createdBy: string
  fromUserAvatar?: string // Optional, for avatar
}

interface Conversation {
  userId: string
  userName: string
  lastMessage: string
  timestamp: string
  fromUserAvatar?: string // Avatar for the conversation participant
}

interface ContactScreenProps {
  navigation: DeliveryHomeStackNavigationProp
}

export default function ContactScreen({ navigation }: ContactScreenProps) {
  const [chatHistory, setChatHistory] = useState<Message[]>([])
  const [failedAvatars, setFailedAvatars] = useState<Set<string>>(new Set())
  const authContext = useContext(AuthContext)
  const [refreshing, setRefreshing] = useState(false)

  if (!authContext || !authContext.user) {
    throw new Error('AuthContext is not available. Ensure the component is wrapped in AuthProvider.')
  }

  const { user } = authContext

  // Fetch all chat history
  const fetchAllMessages = async () => {
    try {
      const response = await axios.get<{ value: Message[] }>(`${API_BASE_URL}chat/history`, {
        headers: {
          accept: 'text/plain',
          Authorization: `Bearer ${user.token}`
        }
      })
      const messages = response.data.value || []
      // Log API response to inspect fromUserAvatar
      console.log(
        'Fetched messages:',
        messages.map((msg) => ({
          id: msg.id,
          fromUserId: msg.fromUserId,
          toUserId: msg.toUserId,
          createdBy: msg.createdBy,
          fromUserAvatar: msg.fromUserAvatar
        }))
      )
      setChatHistory(messages)
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  useEffect(() => {
    fetchAllMessages() // Initial fetch

    // Poll every 5 seconds
    const intervalId = setInterval(() => {
      fetchAllMessages()
    }, 5000)

    // Cleanup interval on unmount
    return () => clearInterval(intervalId)
  }, [])

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      await fetchAllMessages()
    } catch (error) {
      console.error('Error refreshing the page:', error)
    } finally {
      setRefreshing(false)
    }
  }

  // Check if createdBy starts with a staff role (excluding Consulting Staff)
  const isOtherStaffRole = (createdBy: string): boolean => {
    const roles = ['Sales Staff', 'Manager', 'FarmBreeder', 'Consulting Staff']
    return roles.some((role) => createdBy.startsWith(role))
  }

  // Check if createdBy is Consulting Staff
  const isDeliveringStaffRole = (createdBy: string): boolean => {
    return createdBy.startsWith('Delivery Staff')
  }

  // Check if createdBy is a Customer (not a staff role)
  const isCustomerRole = (createdBy: string): boolean => {
    return !isOtherStaffRole(createdBy) && !isDeliveringStaffRole(createdBy)
  }

  // Validate URL
  const isValidUrl = (url: string | undefined): url is string => !!url && /^https?:\/\/.+/i.test(url)

  // Get default avatar based on role or customer
  const getDefaultAvatar = (userName: string) => {
    const role = userName.split(' ')[0].toLowerCase() // e.g., "sales" or customer name
    const defaults: { [key: string]: string } = {
      sales: 'https://picsum.photos/50?random=1',
      manager: 'https://picsum.photos/50?random=2',
      farmbreeder: 'https://picsum.photos/50?random=3',
      delivery: 'https://picsum.photos/50?random=5',
      // Customers use a generic avatar
      customer: 'https://picsum.photos/50?random=6'
    }
    // Check if userName starts with a staff role
    const roleKey = isOtherStaffRole(userName) ? role : 'customer'
    return defaults[roleKey] || 'https://picsum.photos/50'
  }

  // Group messages by user, from Consulting Staff perspective
  const getConversations = (): Conversation[] => {
    const convoMap = new Map<string, Conversation>()

    ;[...chatHistory].reverse().forEach((msg) => {
      let userId: string // ID of the other participant
      let userName: string // Name of the other participant
      let fromUserAvatar: string | undefined // Avatar of the other participant

      if (isDeliveringStaffRole(msg.createdBy)) {
        // Message sent by Consulting Staff, other participant is toUserId
        userId = msg.toUserId
        // Find a message where toUserId sent a message (to get their createdBy and avatar)
        const relatedMsg = chatHistory.find((m) => m.fromUserId === msg.toUserId)
        if (!relatedMsg) return // Skip if no related message
        userName = relatedMsg.createdBy // e.g., "Sales Staff John", "Wendy"
        fromUserAvatar = relatedMsg.fromUserAvatar
      } else {
        // Message sent by other participant (Customer, Sales Staff, etc.)
        userId = msg.fromUserId
        userName = msg.createdBy // e.g., "Sales Staff John", "Wendy"
        fromUserAvatar = msg.fromUserAvatar
      }

      if (!convoMap.has(userId)) {
        convoMap.set(userId, {
          userId,
          userName,
          lastMessage: msg.content,
          timestamp: msg.createdTime,
          fromUserAvatar
        })
      }
    })

    return Array.from(convoMap.values())
  }

  const renderConversation = ({ item }: { item: Conversation }) => {
    // Log fromUserAvatar for debugging
    console.log(`Rendering conversation (userId: ${item.userId}): fromUserAvatar = ${item.fromUserAvatar}`)

    // Select image source
    const imageSource =
      isValidUrl(item.fromUserAvatar) && !failedAvatars.has(item.fromUserAvatar)
        ? { uri: item.fromUserAvatar }
        : { uri: getDefaultAvatar(item.userName) }

    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() => navigation.navigate('Messages', { selectedUserId: item.userId })}
      >
        <View style={styles.avatar}>
          <Image
            source={imageSource}
            style={styles.avatarImage}
            onError={(e) => {
              console.log(`Failed to load image for conversation ${item.userId}:`, e.nativeEvent.error)
              if (item.fromUserAvatar) {
                const avatarUrl = item.fromUserAvatar // Local variable for type safety
                setFailedAvatars((prev) => new Set(prev).add(avatarUrl))
              }
            }}
          />
          {/* <Text style={styles.avatarText}>{item.userName.charAt(0)}</Text> */}
        </View>
        <View style={styles.conversationDetails}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <ChevronLeft color={'#292D32'} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Chat</Text>
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={getConversations()}
        renderItem={renderConversation}
        keyExtractor={(item) => item.userId}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    flex: 1
  },
  list: {
    paddingHorizontal: 10
  },
  conversationItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  avatar: {
    width: 50,
    height: 50,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc' // Fallback background for visibility
  },
  avatarText: {
    position: 'absolute',
    color: '#000', // Better contrast
    fontSize: 20,
    fontWeight: 'bold'
  },
  conversationDetails: {
    flex: 1,
    justifyContent: 'center'
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000'
  },
  lastMessage: {
    fontSize: 14,
    color: '#666'
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    position: 'absolute',
    right: 0,
    top: 10
  }
})
