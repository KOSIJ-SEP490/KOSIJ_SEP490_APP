import { API_BASE_URL } from '@env'
import AuthContext from '@shared/context/AuthContext'
import React, { useState, useEffect, useContext } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, RefreshControl, TextInput } from 'react-native'
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
  fromUserAvatar?: string
}

interface Conversation {
  userId: string
  userName: string
  lastMessage: string
  timestamp: string
  fromUserAvatar?: string
  isUnread: boolean
}

interface ContactScreenProps {
  navigation: DeliveryHomeStackNavigationProp
}

export default function ContactScreen({ navigation }: ContactScreenProps) {
  const [chatHistory, setChatHistory] = useState<Message[]>([])
  const [failedAvatars, setFailedAvatars] = useState<Set<string>>(new Set())
  const authContext = useContext(AuthContext)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestedConversations, setSuggestedConversations] = useState<Conversation[]>([])

  if (!authContext || !authContext.user) {
    throw new Error('AuthContext is not available. Ensure the component is wrapped in AuthProvider.')
  }

  const { user } = authContext

  const fetchAllMessages = async () => {
    try {
      const response = await axios.get<{ value: Message[] }>(`${API_BASE_URL}chat/history`, {
        headers: {
          accept: 'text/plain',
          Authorization: `Bearer ${user.token}`
        }
      })
      const messages = response.data.value || []
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
      // console.error('Failed to fetch messages:', error)
    }
  }

  const markMessagesAsRead = async (fromUserId: string) => {
    console.log(`Marking messages as read for fromUserId: ${fromUserId}`)
    try {
      await axios.put(
        `${API_BASE_URL}chat/mark-as-read`,
        { fromUserId },
        {
          headers: {
            accept: 'text/plain',
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      console.log(`Successfully marked messages as read for ${fromUserId}`)

      setChatHistory((prev) =>
        prev.map((msg) => (msg.fromUserId === fromUserId && !msg.isRead ? { ...msg, isRead: true } : msg))
      )

      await fetchAllMessages()
    } catch (error) {
      // console.error(`Failed to mark messages as read for ${fromUserId}:`, error)
      setChatHistory((prev) =>
        prev.map((msg) => (msg.fromUserId === fromUserId && !msg.isRead ? { ...msg, isRead: true } : msg))
      )
    }
  }

  useEffect(() => {
    fetchAllMessages()

    const intervalId = setInterval(() => {
      fetchAllMessages()
    }, 5000)

    return () => clearInterval(intervalId)
  }, [])

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      await fetchAllMessages()
    } catch (error) {
      // console.error('Error refreshing the page:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const isOtherStaffRole = (createdBy: string): boolean => {
    const roles = ['Sales Staff', 'Manager', 'Farm Breeder', 'Consulting Staff']
    return roles.some((role) => createdBy.startsWith(role))
  }

  const isDeliveringStaffRole = (createdBy: string): boolean => {
    return createdBy.startsWith('Delivery Staff')
  }

  const isCustomerRole = (createdBy: string): boolean => {
    return !isOtherStaffRole(createdBy) && !isDeliveringStaffRole(createdBy)
  }

  const isUnreadRole = (createdBy: string): boolean => {
    const roles = ['Sales Staff', 'Consulting Staff', 'Manager', 'Farm Breeder']
    return roles.some((role) => createdBy.startsWith(role))
  }

  const isValidUrl = (url: string | undefined): url is string => !!url && /^https?:\/\/.+/i.test(url)

  const getDefaultAvatar = (userName: string) => {
    const role = userName.split(' ')[0].toLowerCase()
    const defaults: { [key: string]: string } = {
      sales: 'https://picsum.photos/50?random=1',
      manager: 'https://picsum.photos/50?random=2',
      farmbreeder: 'https://picsum.photos/50?random=3',
      consulting: 'https://picsum.photos/50?random=4',
      delivery: 'https://picsum.photos/50?random=5',
      customer: 'https://picsum.photos/50?random=6'
    }
    const roleKey = isOtherStaffRole(userName) ? role : 'customer'
    return defaults[roleKey] || 'https://picsum.photos/50'
  }

  const getUserNameFromId = (userId: string): string => {
    const farmBreeders = [
      { name: 'Ito Koi Farm', userId: 'FAR-010' },
      { name: 'Saito Koi Farm', userId: 'FAR-009' },
      { name: 'Ojiya Nishikigoi Farm', userId: 'FAR-003' },
      { name: 'Omoiya Koi Farm', userId: 'FAR-008' },
      { name: 'Taniguchi Koi Farm', userId: 'FAR-015' },
      { name: 'Dainchi Koi Farm', userId: 'FAR-001' },
      { name: 'Konoike Koi Farm', userId: 'FAR-007' },
      { name: 'Okawa Koi Farm', userId: 'FAR-013' },
      { name: 'Yamaguchi Koi Farm', userId: 'FAR-005' },
      { name: 'Inoue Koi Farm', userId: 'FAR-014' },
      { name: 'Marukin Koi Farm', userId: 'FAR-002' },
      { name: 'Shintaro Koi Farm', userId: 'FAR-011' },
      { name: 'Isa Koi Farm', userId: 'FAR-004' },
      { name: 'Yamatoya Koi Farm', userId: 'FAR-012' },
      { name: 'Nishimura Koi Farm', userId: 'FAR-006' }
    ]

    if (userId.startsWith('SAL-')) {
      const num = parseInt(userId.replace('SAL-', ''), 10)
      return `Sales Staff ${num}`
    } else if (userId.startsWith('CON-')) {
      const num = parseInt(userId.replace('CON-', ''), 10)
      return `Consulting Staff ${num}`
    } else if (userId === 'MAN-000') {
      return 'Manager'
    } else {
      const farm = farmBreeders.find((f) => f.userId === userId)
      return farm ? farm.name : userId
    }
  }

  const getSuggestedConversations = (query: string): Conversation[] => {
    const lowerQuery = query.toLowerCase().trim()
    if (!lowerQuery) return []

    const roles = [
      { name: 'Sales Staff', prefix: 'SAL-', count: 5 },
      { name: 'Consulting Staff', prefix: 'CON-', count: 5 },
      { name: 'Manager', prefix: 'MAN-', count: 1 }
    ]

    const farmBreeders = [
      { name: 'Ito Koi Farm', userId: 'FAR-010' },
      { name: 'Saito Koi Farm', userId: 'FAR-009' },
      { name: 'Ojiya Nishikigoi Farm', userId: 'FAR-003' },
      { name: 'Omoiya Koi Farm', userId: 'FAR-008' },
      { name: 'Taniguchi Koi Farm', userId: 'FAR-015' },
      { name: 'Dainchi Koi Farm', userId: 'FAR-001' },
      { name: 'Konoike Koi Farm', userId: 'FAR-007' },
      { name: 'Okawa Koi Farm', userId: 'FAR-013' },
      { name: 'Yamaguchi Koi Farm', userId: 'FAR-005' },
      { name: 'Inoue Koi Farm', userId: 'FAR-014' },
      { name: 'Marukin Koi Farm', userId: 'FAR-002' },
      { name: 'Shintaro Koi Farm', userId: 'FAR-011' },
      { name: 'Isa Koi Farm', userId: 'FAR-004' },
      { name: 'Yamatoya Koi Farm', userId: 'FAR-012' },
      { name: 'Nishimura Koi Farm', userId: 'FAR-006' }
    ]

    const suggestions: Conversation[] = []

    roles.forEach((role) => {
      if (role.name.toLowerCase().includes(lowerQuery)) {
        const count = role.name === 'Manager' ? 1 : 5
        for (let i = 1; i <= count; i++) {
          const userName = role.name === 'Manager' ? 'Manager' : `${role.name} ${i}`
          const userId = role.name === 'Manager' ? 'MAN-000' : `${role.prefix}${i.toString().padStart(3, '0')}`
          suggestions.push({
            userId,
            userName,
            lastMessage: '',
            timestamp: new Date().toISOString(),
            fromUserAvatar: getDefaultAvatar(userName),
            isUnread: false
          })
        }
      }
    })

    farmBreeders.forEach((farm) => {
      if (farm.name.toLowerCase().includes(lowerQuery)) {
        suggestions.push({
          userId: farm.userId,
          userName: farm.name,
          lastMessage: '',
          timestamp: new Date().toISOString(),
          fromUserAvatar: getDefaultAvatar('Farm Breeder'),
          isUnread: false
        })
      }
    })

    return suggestions.slice(0, 5)
  }

  useEffect(() => {
    setSuggestedConversations(getSuggestedConversations(searchQuery))
  }, [searchQuery])

  const getConversations = (): Conversation[] => {
    const convoMap = new Map<string, Conversation>()
    const userMessages = new Map<string, Message[]>()

    chatHistory.forEach((msg) => {
      const userId = isDeliveringStaffRole(msg.createdBy) ? msg.toUserId : msg.fromUserId
      if (!userMessages.has(userId)) {
        userMessages.set(userId, [])
      }
      userMessages.get(userId)!.push(msg)
    })

    userMessages.forEach((messages, userId) => {
      const sortedMessages = messages.sort(
        (a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()
      )
      const latestMsg = sortedMessages[0]

      let userName: string
      let fromUserAvatar: string | undefined

      if (isDeliveringStaffRole(latestMsg.createdBy)) {
        const relatedMsg = chatHistory.find((m) => m.fromUserId === userId)
        userName = relatedMsg ? relatedMsg.createdBy : getUserNameFromId(userId)
        fromUserAvatar = relatedMsg ? relatedMsg.fromUserAvatar : getDefaultAvatar(userName)
      } else {
        userName = latestMsg.createdBy
        fromUserAvatar = latestMsg.fromUserAvatar
      }

      const isUnread = sortedMessages.some((msg) => !msg.isRead && isUnreadRole(msg.createdBy))

      convoMap.set(userId, {
        userId,
        userName,
        lastMessage: latestMsg.content,
        timestamp: latestMsg.createdTime,
        fromUserAvatar,
        isUnread
      })
    })

    return Array.from(convoMap.values())
  }

  const renderConversation = ({ item }: { item: Conversation }) => {
    console.log(`Rendering conversation (userId: ${item.userId}): fromUserAvatar = ${item.fromUserAvatar}`)

    const imageSource =
      isValidUrl(item.fromUserAvatar) && !failedAvatars.has(item.fromUserAvatar)
        ? { uri: item.fromUserAvatar }
        : { uri: getDefaultAvatar(item.userName) }

    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() => {
          if (item.isUnread) {
            markMessagesAsRead(item.userId)
          }
          setSearchQuery('')
          navigation.navigate('Messages', { selectedUserId: item.userId })
        }}
      >
        <View style={styles.avatar}>
          <Image
            source={imageSource}
            style={styles.avatarImage}
            onError={(e) => {
              console.log(`Failed to load image for conversation ${item.userId}:`, e.nativeEvent.error)
              if (item.fromUserAvatar) {
                const avatarUrl = item.fromUserAvatar
                setFailedAvatars((prev) => new Set(prev).add(avatarUrl))
              }
            }}
          />
        </View>
        <View style={styles.conversationDetails}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage || 'No messages yet'}
          </Text>
          <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
          {item.isUnread && <View style={styles.unreadDot} />}
        </View>
      </TouchableOpacity>
    )
  }

  const renderSuggestion = ({ item }: { item: Conversation }) => {
    const imageSource =
      isValidUrl(item.fromUserAvatar) && !failedAvatars.has(item.fromUserAvatar)
        ? { uri: item.fromUserAvatar }
        : { uri: getDefaultAvatar(item.userName) }

    return (
      <TouchableOpacity
        style={styles.suggestionItem}
        onPress={() => {
          setSearchQuery('')
          navigation.navigate('Messages', { selectedUserId: item.userId })
        }}
      >
        <View style={styles.avatar}>
          <Image
            source={imageSource}
            style={styles.avatarImage}
            onError={(e) => {
              console.log(`Failed to load image for suggestion ${item.userId}:`, e.nativeEvent.error)
              if (item.fromUserAvatar) {
                const avatarUrl = item.fromUserAvatar
                setFailedAvatars((prev) => new Set(prev).add(avatarUrl))
              }
            }}
          />
        </View>
        <Text style={styles.suggestionText}>{item.userName}</Text>
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
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder='Searching ...'
        />
      </View>
      {searchQuery.length > 0 && suggestedConversations.length > 0 && (
        <FlatList
          style={styles.suggestionList}
          data={suggestedConversations}
          renderItem={renderSuggestion}
          keyExtractor={(item) => item.userId}
        />
      )}
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  searchInput: {
    backgroundColor: '#f0f2f5',
    borderRadius: 20,
    padding: 10,
    fontSize: 16
  },
  suggestionList: {
    position: 'absolute',
    top: 80,
    left: 16,
    right: 16,
    maxHeight: 200,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 1000
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  suggestionText: {
    fontSize: 16,
    color: '#000'
  },
  list: {
    paddingHorizontal: 10
  },
  conversationItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center'
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
    backgroundColor: '#ccc'
  },
  avatarText: {
    position: 'absolute',
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold'
  },
  conversationDetails: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative'
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
    right: 25,
    top: 16
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
    position: 'absolute',
    right: 5,
    top: '50%',
    transform: [{ translateY: -5 }]
  }
})
