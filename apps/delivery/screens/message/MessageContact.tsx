import React, { useState, useEffect, useRef, useContext } from 'react'
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  RefreshControl
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { RouteProp, useNavigation } from '@react-navigation/native'
import axios from 'axios'
import AuthContext from '@shared/context/AuthContext'
import { API_BASE_URL } from '@env'
import { ChevronLeft } from 'lucide-react-native'
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'

interface Message {
  id: number
  fromUserId: string
  toUserId: string
  content: string
  isRead: boolean
  createdTime: string
  createdBy: string
  fromUserAvatar?: string // Optional, for opponent's avatar
}

type RootStackParamList = {
  Messages: { selectedUserId: string } | undefined
  Contact: undefined
}

type MessageScreenRouteProp = RouteProp<RootStackParamList, 'Messages'>

type NavigationProps = NativeStackNavigationProp<RootStackParamList>

interface MessageScreenProps {
  route: MessageScreenRouteProp
}

export default function MessageScreen({ route }: MessageScreenProps) {
  const { selectedUserId } = route.params || {}
  const [chatHistory, setChatHistory] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const flatListRef = useRef<FlatList>(null)
  const authContext = useContext(AuthContext)
  const navigation = useNavigation<NavigationProps>()

  if (!authContext || !authContext.user) {
    throw new Error('AuthContext is not available. Ensure the component is wrapped in AuthProvider.')
  }

  const { user } = authContext

  // Cache failed avatar URLs to avoid retrying
  const [failedAvatars, setFailedAvatars] = useState<Set<string>>(new Set())

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
      // Only update state if messages have changed (based on IDs)
      setChatHistory((prev) => {
        const prevIds = new Set(prev.map((msg) => msg.id))
        const newMessages = messages.filter((msg) => !prevIds.has(msg.id))
        if (newMessages.length > 0 || prev.length !== messages.length) {
          return messages
        }
        return prev
      })
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  // Initial fetch and polling
  useEffect(() => {
    if (!selectedUserId) return

    fetchAllMessages() // Initial fetch

    // Poll every 5 seconds
    const intervalId = setInterval(() => {
      fetchAllMessages()
    }, 5000)

    // Cleanup interval on unmount
    return () => clearInterval(intervalId)
  }, [selectedUserId])

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      await fetchAllMessages()
    } catch (error) {
      console.error('Error refreshing messages:', error)
    } finally {
      setRefreshing(false)
    }
  }

  // Check if createdBy is Consulting Staff
  const isDeliveringStaffRole = (createdBy: string): boolean => {
    return createdBy.startsWith('Delivery Staff')
  }

  // Check if createdBy is another staff role (excludes Consulting Staff)
  const isOtherStaffRole = (createdBy: string): boolean => {
    const roles = ['Sales Staff', 'Manager', 'FarmBreeder', 'Consulting Staff']
    return roles.some((role) => createdBy.startsWith(role))
  }

  // Check if createdBy is a Customer (not a staff role)
  const isCustomerRole = (createdBy: string): boolean => {
    return !isDeliveringStaffRole(createdBy) && !isOtherStaffRole(createdBy)
  }

  // Get consulting staff info from chat history (for sending messages)
  const getConsultingStaffInfo = () => {
    const staffMsg = chatHistory.find((msg) => isDeliveringStaffRole(msg.createdBy))
    return {
      id: staffMsg ? staffMsg.fromUserId : Date.now().toString(), // Fallback ID
      name: staffMsg ? staffMsg.createdBy : 'Delivery Staff' // Fallback name
    }
  }

  // Filter messages for the selected user
  const filteredMessages = chatHistory.filter(
    (msg) =>
      (msg.fromUserId === selectedUserId && msg.toUserId !== selectedUserId) ||
      (msg.toUserId === selectedUserId && msg.fromUserId !== selectedUserId)
  )

  // Get the other participant's username for the header
  const participantUserName = (() => {
    const otherMsg = filteredMessages.find((msg) => !isDeliveringStaffRole(msg.createdBy))
    return otherMsg ? otherMsg.createdBy : 'Chat'
  })()

  // Scroll to bottom when messages update
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true })
  }, [filteredMessages])

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUserId) return

    const staffInfo = getConsultingStaffInfo()

    try {
      await axios.post(
        `${API_BASE_URL}chat/send`,
        {
          toUserId: selectedUserId,
          content: newMessage
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/plain',
            Authorization: `Bearer ${user.token}`
          }
        }
      )

      // Optimistically update UI (no fromUserAvatar for sent messages)
      setChatHistory((prev) => [
        ...prev,
        {
          id: Date.now(),
          fromUserId: staffInfo.id,
          toUserId: selectedUserId,
          content: newMessage,
          isRead: false,
          createdTime: new Date().toISOString(),
          createdBy: staffInfo.name
        }
      ])
      setNewMessage('')
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const renderMessage = ({ item }: { item: Message }) => {
    const isSent = isDeliveringStaffRole(item.createdBy) // Consulting Staff messages are sent
    let userName = item.createdBy

    // If the message is from Consulting Staff, get the other participant's name
    if (isSent) {
      const relatedMsg = chatHistory.find((m) => m.fromUserId === item.toUserId)
      userName = relatedMsg ? relatedMsg.createdBy : 'Unknown'
    }

    // Log fromUserAvatar for debugging
    if (!isSent) {
      console.log(`Rendering received message (ID: ${item.id}): fromUserAvatar = ${item.fromUserAvatar}`)
    }

    // Validate URL
    const isValidUrl = (url: string | undefined): url is string => !!url && /^https?:\/\/.+/i.test(url)

    // Get default avatar based on role
    const getDefaultAvatar = (createdBy: string) => {
      const role = createdBy.split(' ')[0].toLowerCase() // e.g., "sales" or customer name
      const defaults: { [key: string]: string } = {
        sales: 'https://picsum.photos/30?random=1',
        manager: 'https://picsum.photos/30?random=2',
        farmbreeder: 'https://picsum.photos/30?random=3',
        delivery: 'https://picsum.photos/30?random=5',
        // Customers use a generic avatar
        customer: 'https://picsum.photos/30?random=6'
      }
      // Check if createdBy starts with a staff role
      const roleKey = isOtherStaffRole(createdBy) ? role : 'customer'
      return defaults[roleKey] || 'https://picsum.photos/30'
    }

    // Select image source (only for received messages)
    const imageSource =
      isValidUrl(item.fromUserAvatar) && !failedAvatars.has(item.fromUserAvatar)
        ? { uri: item.fromUserAvatar }
        : { uri: getDefaultAvatar(item.createdBy) }

    return (
      <View style={[styles.messageContainer, isSent ? styles.sentMessage : styles.receivedMessage]}>
        {!isSent && (
          <View style={styles.avatar}>
            <Image
              source={imageSource}
              style={styles.avatarImage}
              onError={(e) => {
                console.log(`Failed to load image for message ${item.id}:`, e.nativeEvent.error)
                if (item.fromUserAvatar) {
                  const avatarUrl = item.fromUserAvatar // Local variable for type safety
                  setFailedAvatars((prev) => new Set(prev).add(avatarUrl))
                }
              }}
            />
            {/* <Text style={styles.avatarText}>{userName.charAt(0)}</Text> */}
          </View>
        )}
        <View style={[styles.messageBubble, isSent ? styles.sentBubble : styles.receivedBubble]}>
          <Text style={styles.messageText}>{item.content}</Text>
          <Text style={styles.messageTime}>
            {new Date(item.createdTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
      </View>
    )
  }

  if (!selectedUserId) {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>No conversation selected</Text>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <View style={styles.header} className='flex-row items-center'>
        <TouchableOpacity onPress={() => navigation.navigate('Contact')}>
          <ChevronLeft color={'#292D32'} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerText}>{participantUserName}</Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={filteredMessages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder='Type a message...'
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!newMessage.trim()}
        >
          <Ionicons name='send' size={24} color='#fff' />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5'
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    flex: 1
  },
  messageList: {
    padding: 10
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'flex-end'
  },
  sentMessage: {
    justifyContent: 'flex-end'
  },
  receivedMessage: {
    justifyContent: 'flex-start'
  },
  avatar: {
    width: 30,
    height: 30,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ccc' // Fallback background for visibility
  },
  avatarText: {
    position: 'absolute',
    color: '#000', // Better contrast
    fontSize: 14,
    fontWeight: 'bold'
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 15
  },
  sentBubble: {
    backgroundColor: '#0084ff'
  },
  receivedBubble: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  messageText: {
    fontSize: 16,
    color: '#000'
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    alignSelf: 'flex-end'
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd'
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    borderRadius: 20,
    padding: 10,
    fontSize: 16,
    maxHeight: 100
  },
  sendButton: {
    backgroundColor: '#0084ff',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc'
  }
})
