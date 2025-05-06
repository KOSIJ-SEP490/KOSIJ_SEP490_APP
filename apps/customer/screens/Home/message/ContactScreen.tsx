// import { CustomerHomeStackNavigationProp } from '@apps/customer/types/navigationCustomerType'
// import { API_BASE_URL } from '@env'
// import AuthContext from '@shared/context/AuthContext'
// import React, { useState, useEffect, useContext } from 'react'
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ScrollView, RefreshControl } from 'react-native'
// import axios from 'axios'
// import { ChevronLeft } from 'lucide-react-native'

// interface Message {
//   id: number
//   fromUserId: string
//   toUserId: string
//   content: string
//   isRead: boolean
//   createdTime: string
//   createdBy: string
// }

// interface Conversation {
//   userId: string
//   userName: string
//   lastMessage: string
//   timestamp: string
// }

// interface ContactScreenProps {
//   navigation: CustomerHomeStackNavigationProp
// }

// export type CustomerHomeStackParamList = {
//   // ... other routes
//   Messages: { selectedUserId: string } | undefined // Allow selectedUserId or no params
//   // ... other routes
// }

// export default function ContactScreen({ navigation }: ContactScreenProps) {
//   const [salesStaffId, setSalesStaffId] = useState<string | null>(null)
//   const [chatHistory, setChatHistory] = useState<Message[]>([])
//   const authContext = useContext(AuthContext)
//   const [refreshing, setRefreshing] = useState(false)

//   if (!authContext || !authContext.user) {
//     throw new Error('AuthContext is not available. Ensure the component is wrapped in AuthProvider.')
//   }

//   const { user } = authContext

//   // Fetch all chat history
//   const fetchAllMessages = async () => {
//     try {
//       const response = await axios.get<{ value: Message[] }>(`${API_BASE_URL}chat/history`, {
//         headers: {
//           accept: 'text/plain',
//           Authorization: `Bearer ${user.token}`
//         }
//       })
//       const messages = response.data.value || []

//       setChatHistory(messages)
//     } catch (error) {
//       console.error('Failed to fetch messages:', error)
//     }
//   }

//   useEffect(() => {
//     fetchAllMessages()
//   }, [])

//   const onRefresh = async () => {
//     setRefreshing(true)
//     try {
//       fetchAllMessages
//     } catch (error) {
//       console.error('Error refreshing the page:', error)
//     } finally {
//       setRefreshing(false)
//     }
//   }

//   // Utility: Clean up system-role prefix
//   const extractUserName = (name: string): string => {
//     const roles = ['Sales Staff', 'Manager', 'FarmBreeder', 'Consulting Staff', 'Delivery Staff']

//     for (const role of roles) {
//       if (name.startsWith(role)) {
//         return name.replace(role, '').trim() || 'Staff'
//       }
//     }

//     return name
//   }

//   // Group messages by user
//   const getConversations = (): Conversation[] => {
//     const convoMap = new Map<string, Conversation>()

//     ;[...chatHistory].reverse().forEach((msg) => {
//       const userId = msg.fromUserId === salesStaffId ? msg.toUserId : msg.fromUserId

//       if (!convoMap.has(userId)) {
//         const rawName = msg.createdBy
//         const cleanName = extractUserName(rawName)

//         if (!cleanName) return
//         convoMap.set(userId, {
//           userId,
//           userName: cleanName,
//           lastMessage: msg.content,
//           timestamp: msg.createdTime
//         })
//       }
//     })

//     return Array.from(convoMap.values())
//   }

//   const renderConversation = ({ item }: { item: Conversation }) => (
//     <TouchableOpacity
//       style={styles.conversationItem}
//       onPress={() => navigation.navigate('Messages', { selectedUserId: item.userId } as any)}
//     >
//       <View style={styles.avatar}>
//         <Image
//           source={{ uri: 'https://via.placeholder.com/50' }} // Placeholder image
//           style={styles.avatarImage}
//         />
//         <Text style={styles.avatarText}>{item.userName.charAt(0)}</Text>
//       </View>{' '}
//       <View style={styles.conversationDetails}>
//         <Text style={styles.userName}>{item.userName}</Text>
//         <Text style={styles.lastMessage} numberOfLines={1}>
//           {item.lastMessage}
//         </Text>
//         <Text style={styles.timestamp}>
//           {new Date(item.timestamp).toLocaleTimeString([], {
//             hour: '2-digit',
//             minute: '2-digit'
//           })}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   )

//   return (
//     <ScrollView className='bg-white' refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
//       <View className='flex-1 mt-3 bg-white p-4'>
//         {/* Header */}
//         <View className='flex-row items-center px-4 py-2'>
//           <TouchableOpacity onPress={() => navigation.navigate('Home')}>
//             <ChevronLeft color={'#292D32'} size={24} />
//           </TouchableOpacity>
//           <Text className='text-lg font-semibold text-center flex-1'>Chat</Text>
//           <View style={{ width: 24 }} />
//         </View>
//         <View style={styles.container}>
//           <FlatList
//             data={getConversations()}
//             renderItem={renderConversation}
//             keyExtractor={(item) => item.userId}
//             contentContainerStyle={styles.list}
//           />
//         </View>
//       </View>
//     </ScrollView>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff'
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     padding: 16,
//     color: '#000'
//   },
//   list: {
//     paddingHorizontal: 10
//   },
//   conversationItem: {
//     flexDirection: 'row',
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0'
//   },
//   avatar: {
//     width: 50,
//     height: 50,
//     marginRight: 10,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   avatarImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25
//   },
//   avatarText: {
//     position: 'absolute',
//     color: '#fff',
//     fontSize: 20,
//     fontWeight: 'bold'
//   },
//   conversationDetails: {
//     flex: 1,
//     justifyContent: 'center'
//   },
//   userName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#000'
//   },
//   lastMessage: {
//     fontSize: 14,
//     color: '#666'
//   },
//   timestamp: {
//     fontSize: 12,
//     color: '#999',
//     position: 'absolute',
//     right: 0,
//     top: 10
//   }
// })

// import { CustomerHomeStackNavigationProp } from '@apps/customer/types/navigationCustomerType'
// import { API_BASE_URL } from '@env'
// import AuthContext from '@shared/context/AuthContext'
// import React, { useState, useEffect, useContext } from 'react'
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, RefreshControl } from 'react-native'
// import axios from 'axios'
// import { ChevronLeft } from 'lucide-react-native'

// interface Message {
//   id: number
//   fromUserId: string
//   toUserId: string
//   content: string
//   isRead: boolean
//   createdTime: string
//   createdBy: string
// }

// interface Conversation {
//   userId: string
//   userName: string
//   lastMessage: string
//   timestamp: string
// }

// interface ContactScreenProps {
//   navigation: CustomerHomeStackNavigationProp
// }

// export default function ContactScreen({ navigation }: ContactScreenProps) {
//   const [chatHistory, setChatHistory] = useState<Message[]>([])
//   const authContext = useContext(AuthContext)
//   const [refreshing, setRefreshing] = useState(false)

//   if (!authContext || !authContext.user) {
//     throw new Error('AuthContext is not available. Ensure the component is wrapped in AuthProvider.')
//   }

//   const { user } = authContext

//   // Fetch all chat history
//   const fetchAllMessages = async () => {
//     try {
//       const response = await axios.get<{ value: Message[] }>(`${API_BASE_URL}chat/history`, {
//         headers: {
//           accept: 'text/plain',
//           Authorization: `Bearer ${user.token}`
//         }
//       })
//       const messages = response.data.value || []
//       setChatHistory(messages)
//     } catch (error) {
//       console.error('Failed to fetch messages:', error)
//     }
//   }

//   useEffect(() => {
//     fetchAllMessages()
//   }, [])

//   const onRefresh = async () => {
//     setRefreshing(true)
//     try {
//       await fetchAllMessages()
//     } catch (error) {
//       console.error('Error refreshing the page:', error)
//     } finally {
//       setRefreshing(false)
//     }
//   }

//   // Check if createdBy starts with a staff role
//   const isStaffRole = (createdBy: string): boolean => {
//     const roles = ['Sales Staff', 'Manager', 'FarmBreeder', 'Consulting Staff', 'Delivery Staff']
//     return roles.some((role) => createdBy.startsWith(role))
//   }

//   // Group messages by user, prioritizing staff roles
//   const getConversations = (): Conversation[] => {
//     const convoMap = new Map<string, Conversation>()

//     ;[...chatHistory].reverse().forEach((msg) => {
//       let userId: string
//       let userName: string

//       // Determine which participant is the staff member
//       if (isStaffRole(msg.createdBy)) {
//         userId = msg.fromUserId
//         userName = msg.createdBy // Use full createdBy (e.g., "Sales Staff John")
//       } else {
//         // If createdBy is not a staff role, check the other participant
//         userId = msg.toUserId
//         // We need to find a message where toUserId has a staff role createdBy
//         const relatedMsg = chatHistory.find((m) => m.fromUserId === msg.toUserId && isStaffRole(m.createdBy))
//         if (!relatedMsg) return // Skip if no staff role found
//         userName = relatedMsg.createdBy
//       }

//       if (!convoMap.has(userId)) {
//         convoMap.set(userId, {
//           userId,
//           userName,
//           lastMessage: msg.content,
//           timestamp: msg.createdTime
//         })
//       }
//     })

//     return Array.from(convoMap.values())
//   }

//   const renderConversation = ({ item }: { item: Conversation }) => (
//     <TouchableOpacity
//       style={styles.conversationItem}
//       onPress={() => navigation.navigate('Messages', { selectedUserId: item.userId } as any)}
//     >
//       <View style={styles.avatar}>
//         <Image
//           source={{ uri: 'https://via.placeholder.com/50' }} // Replace with actual avatar URL if available
//           style={styles.avatarImage}
//         />
//         <Text style={styles.avatarText}>{item.userName.charAt(0)}</Text>
//       </View>
//       <View style={styles.conversationDetails}>
//         <Text style={styles.userName}>{item.userName}</Text>
//         <Text style={styles.lastMessage} numberOfLines={1}>
//           {item.lastMessage}
//         </Text>
//         <Text style={styles.timestamp}>
//           {new Date(item.timestamp).toLocaleTimeString([], {
//             hour: '2-digit',
//             minute: '2-digit'
//           })}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   )

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.headerContainer}>
//         <TouchableOpacity onPress={() => navigation.navigate('Home')}>
//           <ChevronLeft color={'#292D32'} size={24} />
//         </TouchableOpacity>
//         <Text style={styles.headerText}>Chat</Text>
//         <View style={{ width: 24 }} />
//       </View>
//       <FlatList
//         data={getConversations()}
//         renderItem={renderConversation}
//         keyExtractor={(item) => item.userId}
//         contentContainerStyle={styles.list}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//       />
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff'
//   },
//   headerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12
//   },
//   headerText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#000',
//     textAlign: 'center',
//     flex: 1
//   },
//   list: {
//     paddingHorizontal: 10
//   },
//   conversationItem: {
//     flexDirection: 'row',
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0'
//   },
//   avatar: {
//     width: 50,
//     height: 50,
//     marginRight: 10,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   avatarImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25
//   },
//   avatarText: {
//     position: 'absolute',
//     color: '#fff',
//     fontSize: 20,
//     fontWeight: 'bold'
//   },
//   conversationDetails: {
//     flex: 1,
//     justifyContent: 'center'
//   },
//   userName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#000'
//   },
//   lastMessage: {
//     fontSize: 14,
//     color: '#666'
//   },
//   timestamp: {
//     fontSize: 12,
//     color: '#999',
//     position: 'absolute',
//     right: 0,
//     top: 10
//   }
// })

import { CustomerHomeStackNavigationProp } from '@apps/customer/types/navigationCustomerType'
import { API_BASE_URL } from '@env'
import AuthContext from '@shared/context/AuthContext'
import React, { useState, useEffect, useContext } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, RefreshControl } from 'react-native'
import axios from 'axios'
import { ChevronLeft } from 'lucide-react-native'

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
  navigation: CustomerHomeStackNavigationProp
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
        messages.map((msg) => ({ id: msg.id, fromUserAvatar: msg.fromUserAvatar }))
      )
      setChatHistory(messages)
    } catch (error) {
      console.log('Failed to fetch messages:', error)
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
      console.log(`Failed to mark messages as read for ${fromUserId}:`, error)
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
      console.log('Error refreshing the page:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const isStaffRole = (createdBy: string): boolean => {
    const roles = ['Sales Staff', 'Manager', 'Farm Breeder', 'Consulting Staff', 'Delivery Staff']
    return roles.some((role) => createdBy.startsWith(role))
  }

  const isUnreadRole = (createdBy: string): boolean => {
    const roles = ['Sales Staff', 'Consulting Staff', 'Delivery Staff', 'Manager']
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
      delivery: 'https://picsum.photos/50?random=5'
    }
    return defaults[role] || 'https://picsum.photos/50'
  }

  const getConversations = (): Conversation[] => {
    const convoMap = new Map<string, Conversation>()
    const userMessages = new Map<string, Message[]>()

    chatHistory.forEach((msg) => {
      const userId = isStaffRole(msg.createdBy) ? msg.fromUserId : msg.toUserId
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

      if (isStaffRole(latestMsg.createdBy)) {
        userName = latestMsg.createdBy
        fromUserAvatar = latestMsg.fromUserAvatar
      } else {
        const relatedMsg = chatHistory.find((m) => m.fromUserId === userId && isStaffRole(m.createdBy))
        if (!relatedMsg) return
        userName = relatedMsg.createdBy
        fromUserAvatar = relatedMsg.fromUserAvatar
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
          navigation.navigate('Messages', { selectedUserId: item.userId } as any)
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
            {item.lastMessage}
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

  return (
    <View style={styles.container} className='mt-5'>
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
