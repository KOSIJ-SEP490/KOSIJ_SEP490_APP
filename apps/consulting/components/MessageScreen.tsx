// import React, { useState, useEffect, useRef, useContext } from 'react'
// import {
//   View,
//   Text,
//   FlatList,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
//   Image
// } from 'react-native'
// import { Ionicons } from '@expo/vector-icons'
// import { RouteProp } from '@react-navigation/native'
// import axios from 'axios'
// import AuthContext from '@shared/context/AuthContext'
// import { CustomerHomeStackParamList } from '@apps/customer/types/navigationCustomerType'

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

// type MessageScreenRouteProp = RouteProp<CustomerHomeStackParamList, 'Messages'>

// interface MessageScreenProps {
//   route: MessageScreenRouteProp
// }

// export default function MessageScreen({ route }: MessageScreenProps) {
//   const { selectedUserId } = route.params || {}
//   const [salesStaffId, setSalesStaffId] = useState<string | null>(null)
//   const [chatHistory, setChatHistory] = useState<Message[]>([])
//   const [newMessage, setNewMessage] = useState('')
//   const flatListRef = useRef<FlatList>(null)
//   const authContext = useContext(AuthContext)

//   if (!authContext || !authContext.user) {
//     throw new Error('AuthContext is not available. Ensure the component is wrapped in AuthProvider.')
//   }

//   const { user } = authContext

//   // Fetch all chat history
//   const fetchAllMessages = async () => {
//     try {
//       const response = await axios.get<{ value: Message[] }>(`/chat/history`, {
//         headers: {
//           accept: 'text/plain',
//           Authorization: `Bearer ${user.token}`
//         }
//       })
//       const messages = response.data.value || []

//       // Determine salesStaffId from messages
//       const firstMsg = messages.find(Boolean)
//       if (firstMsg) {
//         const isFromSales = firstMsg.createdBy?.startsWith('Sales Staff')
//         const staffId = isFromSales ? firstMsg.fromUserId : firstMsg.toUserId
//         setSalesStaffId(staffId)
//       }

//       setChatHistory(messages)
//     } catch (error) {
//       console.error('Failed to fetch messages:', error)
//     }
//   }

//   useEffect(() => {
//     // if (isAuthenticated) {
//     fetchAllMessages()
//     // }
//   }, [])

//   // Filter messages for the selected user
//   const filteredMessages = chatHistory.filter(
//     (msg) =>
//       (msg.fromUserId === selectedUserId && msg.toUserId === salesStaffId) ||
//       (msg.toUserId === selectedUserId && msg.fromUserId === salesStaffId)
//   )

//   // Scroll to bottom when messages update
//   useEffect(() => {
//     flatListRef.current?.scrollToEnd({ animated: true })
//   }, [filteredMessages])

//   // Send message
//   const sendMessage = async () => {
//     if (!newMessage.trim() || !selectedUserId || !salesStaffId) return

//     try {
//       await axios.post(
//         '/chat/send',
//         {
//           toUserId: selectedUserId,
//           content: newMessage
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Accept: 'text/plain',
//             Authorization: `Bearer ${user.token}`
//           }
//         }
//       )

//       // Optimistically update UI
//       setChatHistory((prev) => [
//         ...prev,
//         {
//           id: Date.now(),
//           fromUserId: salesStaffId,
//           toUserId: selectedUserId,
//           content: newMessage,
//           isRead: false,
//           createdTime: new Date().toISOString(),
//           createdBy: `Sales Staff`
//         }
//       ])
//       setNewMessage('')
//     } catch (error) {
//       console.error('Failed to send message:', error)
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

//   const renderMessage = ({ item }: { item: Message }) => {
//     const isSent = item.fromUserId === salesStaffId
//     const userName = extractUserName(item.createdBy)

//     return (
//       <View style={[styles.messageContainer, isSent ? styles.sentMessage : styles.receivedMessage]}>
//         {!isSent && (
//           <View style={styles.avatar}>
//             <Image
//               source={{ uri: 'https://via.placeholder.com/50' }} // Placeholder image
//               style={styles.avatarImage}
//             />
//             <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
//           </View>
//         )}
//         <View style={[styles.messageBubble, isSent ? styles.sentBubble : styles.receivedBubble]}>
//           <Text style={styles.messageText}>{item.content}</Text>
//           <Text style={styles.messageTime}>
//             {new Date(item.createdTime).toLocaleTimeString([], {
//               hour: '2-digit',
//               minute: '2-digit'
//             })}
//           </Text>
//         </View>
//       </View>
//     )
//   }

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
//     >
//       <View style={styles.header}>
//         <Text style={styles.headerText}>
//           {extractUserName(filteredMessages.find((msg) => msg.createdBy)?.createdBy || 'Chat')}
//         </Text>
//       </View>
//       <FlatList
//         ref={flatListRef}
//         data={filteredMessages}
//         renderItem={renderMessage}
//         keyExtractor={(item) => item.id.toString()}
//         contentContainerStyle={styles.messageList}
//         onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
//       />
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           value={newMessage}
//           onChangeText={setNewMessage}
//           placeholder='Type a message...'
//           multiline
//         />
//         <TouchableOpacity
//           style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
//           onPress={sendMessage}
//           disabled={!newMessage.trim()}
//         >
//           <Ionicons name='send' size={24} color='#fff' />
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f0f2f5'
//   },
//   header: {
//     padding: 16,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd'
//   },
//   headerText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#000'
//   },
//   messageList: {
//     padding: 10
//   },
//   messageContainer: {
//     flexDirection: 'row',
//     marginVertical: 5,
//     alignItems: 'flex-end'
//   },
//   sentMessage: {
//     justifyContent: 'flex-end'
//   },
//   receivedMessage: {
//     justifyContent: 'flex-start'
//   },
//   messageAvatar: {
//     width: 30,
//     height: 30,
//     marginRight: 10
//   },
//   messageBubble: {
//     maxWidth: '70%',
//     padding: 10,
//     borderRadius: 15
//   },
//   sentBubble: {
//     backgroundColor: '#0084ff'
//   },
//   receivedBubble: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#ddd'
//   },
//   messageText: {
//     fontSize: 16,
//     color: '#000'
//   },
//   messageTime: {
//     fontSize: 12,
//     color: '#999',
//     marginTop: 5,
//     alignSelf: 'flex-end'
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     padding: 10,
//     backgroundColor: '#fff',
//     borderTopWidth: 1,
//     borderTopColor: '#ddd'
//   },
//   input: {
//     flex: 1,
//     backgroundColor: '#f0f2f5',
//     borderRadius: 20,
//     padding: 10,
//     fontSize: 16,
//     maxHeight: 100
//   },
//   sendButton: {
//     backgroundColor: '#0084ff',
//     borderRadius: 20,
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: 10
//   },
//   sendButtonDisabled: {
//     backgroundColor: '#ccc'
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
//   }
// })

// import React, { useState, useEffect, useRef, useContext } from 'react'
// import {
//   View,
//   Text,
//   FlatList,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
//   Image,
//   RefreshControl
// } from 'react-native'
// import { Ionicons } from '@expo/vector-icons'
// import { RouteProp } from '@react-navigation/native'
// import axios from 'axios'
// import AuthContext from '@shared/context/AuthContext'
// import { CustomerHomeStackParamList } from '@apps/customer/types/navigationCustomerType'
// import { API_BASE_URL } from '@env'

// interface Message {
//   id: number
//   fromUserId: string
//   toUserId: string
//   content: string
//   isRead: boolean
//   createdTime: string
//   createdBy: string
//   fromUserAvatar: string
// }

// type MessageScreenRouteProp = RouteProp<CustomerHomeStackParamList, 'Messages'>

// interface MessageScreenProps {
//   route: MessageScreenRouteProp
// }

// export default function MessageScreen({ route }: MessageScreenProps) {
//   const { selectedUserId } = route.params || {}
//   const [chatHistory, setChatHistory] = useState<Message[]>([])
//   const [newMessage, setNewMessage] = useState('')
//   const [refreshing, setRefreshing] = useState(false)
//   const flatListRef = useRef<FlatList>(null)
//   const authContext = useContext(AuthContext)

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
//       // Only update state if messages have changed (based on IDs)
//       setChatHistory((prev) => {
//         const prevIds = new Set(prev.map((msg) => msg.id))
//         const newMessages = messages.filter((msg) => !prevIds.has(msg.id))
//         if (newMessages.length > 0 || prev.length !== messages.length) {
//           return messages
//         }
//         return prev
//       })
//     } catch (error) {
//       console.error('Failed to fetch messages:', error)
//     }
//   }

//   useEffect(() => {
//     if (!selectedUserId) return

//     fetchAllMessages() // Initial fetch

//     // Poll every 5 seconds
//     const intervalId = setInterval(() => {
//       fetchAllMessages()
//     }, 5000)

//     // Cleanup interval on unmount
//     return () => clearInterval(intervalId)
//   }, [selectedUserId])

//   const onRefresh = async () => {
//     setRefreshing(true)
//     try {
//       await fetchAllMessages()
//     } catch (error) {
//       console.error('Error refreshing messages:', error)
//     } finally {
//       setRefreshing(false)
//     }
//   }

//   // Check if createdBy starts with a staff role
//   const isStaffRole = (createdBy: string): boolean => {
//     const roles = ['Sales Staff', 'Manager', 'FarmBreeder', 'Consulting Staff', 'Delivery Staff']
//     return roles.some((role) => createdBy.startsWith(role))
//   }

//   // Get customer info from chat history
//   const getCustomerInfo = () => {
//     const customerMsg = chatHistory.find((msg) => !isStaffRole(msg.createdBy))
//     return {
//       id: customerMsg ? customerMsg.fromUserId : Date.now().toString(), // Fallback ID
//       name: customerMsg ? customerMsg.createdBy : 'Customer', // Fallback name
//       img: customerMsg ? customerMsg.fromUserAvatar : undefined
//     }
//   }

//   // Filter messages for the selected staff member
//   const filteredMessages = chatHistory.filter(
//     (msg) =>
//       (msg.fromUserId === selectedUserId && msg.toUserId !== selectedUserId) ||
//       (msg.toUserId === selectedUserId && msg.fromUserId !== selectedUserId) ||
//       (msg.fromUserAvatar === selectedUserId && msg.toUserId !== selectedUserId) ||
//       (msg.toUserId === selectedUserId && msg.fromUserAvatar !== selectedUserId)
//   )

//   // Get the staff member's username for the header
//   const staffUserName = (() => {
//     const staffMsg = filteredMessages.find((msg) => isStaffRole(msg.createdBy))
//     return staffMsg ? staffMsg.createdBy : 'Chat'
//   })()

//   // Scroll to bottom when messages update
//   useEffect(() => {
//     flatListRef.current?.scrollToEnd({ animated: true })
//   }, [filteredMessages])

//   // Send message
//   const sendMessage = async () => {
//     if (!newMessage.trim() || !selectedUserId) return

//     const customerInfo = getCustomerInfo()

//     try {
//       await axios.post(
//         `${API_BASE_URL}chat/send`,
//         {
//           toUserId: selectedUserId,
//           content: newMessage
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Accept: 'text/plain',
//             Authorization: `Bearer ${user.token}`
//           }
//         }
//       )

//       // Optimistically update UI
//       setChatHistory((prev) => [
//         ...prev,
//         {
//           id: Date.now(),
//           fromUserId: customerInfo.id,
//           toUserId: selectedUserId,
//           content: newMessage,
//           isRead: false,
//           createdTime: new Date().toISOString(),
//           createdBy: customerInfo.name,
//           fromUserAvatar: customerInfo.img
//         }
//       ])
//       setNewMessage('')
//     } catch (error) {
//       console.error('Failed to send message:', error)
//     }
//   }

//   const renderMessage = ({ item }: { item: Message }) => {
//     const isSent = !isStaffRole(item.createdBy) // Customer's messages are sent, staff's are received
//     const userName = item.createdBy

//     return (
//       <View style={[styles.messageContainer, isSent ? styles.sentMessage : styles.receivedMessage]}>
//         {!isSent && (
//           <View style={styles.avatar}>
//             <Image
//               source={{ uri: item.fromUserAvatar }} // Placeholder image
//               style={styles.avatarImage}
//             />
//             <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
//           </View>
//         )}
//         <View style={[styles.messageBubble, isSent ? styles.sentBubble : styles.receivedBubble]}>
//           <Text style={styles.messageText}>{item.content}</Text>
//           <Text style={styles.messageTime}>
//             {new Date(item.createdTime).toLocaleTimeString([], {
//               hour: '2-digit',
//               minute: '2-digit'
//             })}
//           </Text>
//         </View>
//       </View>
//     )
//   }

//   if (!selectedUserId) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.headerText}>No conversation selected</Text>
//       </View>
//     )
//   }

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
//     >
//       <View style={styles.header}>
//         <Text style={styles.headerText}>{staffUserName}</Text>
//       </View>
//       <FlatList
//         ref={flatListRef}
//         data={filteredMessages}
//         renderItem={renderMessage}
//         keyExtractor={(item) => item.id.toString()}
//         contentContainerStyle={styles.messageList}
//         onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//       />
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           value={newMessage}
//           onChangeText={setNewMessage}
//           placeholder='Type a message...'
//           multiline
//         />
//         <TouchableOpacity
//           style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
//           onPress={sendMessage}
//           disabled={!newMessage.trim()}
//         >
//           <Ionicons name='send' size={24} color='#fff' />
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f0f2f5'
//   },
//   header: {
//     padding: 16,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd'
//   },
//   headerText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#000',
//     textAlign: 'center'
//   },
//   messageList: {
//     padding: 10
//   },
//   messageContainer: {
//     flexDirection: 'row',
//     marginVertical: 5,
//     alignItems: 'flex-end'
//   },
//   sentMessage: {
//     justifyContent: 'flex-end'
//   },
//   receivedMessage: {
//     justifyContent: 'flex-start'
//   },
//   avatar: {
//     width: 30,
//     height: 30,
//     marginRight: 10,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   avatarImage: {
//     width: 30,
//     height: 30,
//     borderRadius: 15
//   },
//   avatarText: {
//     position: 'absolute',
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold'
//   },
//   messageBubble: {
//     maxWidth: '70%',
//     padding: 10,
//     borderRadius: 15
//   },
//   sentBubble: {
//     backgroundColor: '#0084ff'
//   },
//   receivedBubble: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#ddd'
//   },
//   messageText: {
//     fontSize: 16,
//     color: '#000'
//   },
//   messageTime: {
//     fontSize: 12,
//     color: '#999',
//     marginTop: 5,
//     alignSelf: 'flex-end'
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     padding: 10,
//     backgroundColor: '#fff',
//     borderTopWidth: 1,
//     borderTopColor: '#ddd'
//   },
//   input: {
//     flex: 1,
//     backgroundColor: '#f0f2f5',
//     borderRadius: 20,
//     padding: 10,
//     fontSize: 16,
//     maxHeight: 100
//   },
//   sendButton: {
//     backgroundColor: '#0084ff',
//     borderRadius: 20,
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: 10
//   },
//   sendButtonDisabled: {
//     backgroundColor: '#ccc'
//   }
// })

// import React, { useState, useEffect, useRef, useContext } from 'react'
// import {
//   View,
//   Text,
//   FlatList,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
//   Image,
//   RefreshControl,
//   ScrollView
// } from 'react-native'
// import { Ionicons } from '@expo/vector-icons'
// import { RouteProp, useNavigation } from '@react-navigation/native'
// import axios from 'axios'
// import AuthContext from '@shared/context/AuthContext'
// import { API_BASE_URL } from '@env'
// import { ChevronLeft } from 'lucide-react-native'
// import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'

// interface Message {
//   id: number
//   fromUserId: string
//   toUserId: string
//   content: string
//   isRead: boolean
//   createdTime: string
//   createdBy: string
//   fromUserAvatar?: string // Optional, for opponent's (staff) avatar
// }

// type RootStackParamList = {
//   Messages: { selectedUserId: string } | undefined
//   Contact: undefined
// }

// type MessageScreenRouteProp = RouteProp<RootStackParamList, 'Messages'>

// type NavigationProps = NativeStackNavigationProp<RootStackParamList>

// interface MessageScreenProps {
//   route: MessageScreenRouteProp
// }

// export default function MessageScreen({ route }: MessageScreenProps) {
//   const { selectedUserId } = route.params || {}
//   const [chatHistory, setChatHistory] = useState<Message[]>([])
//   const [newMessage, setNewMessage] = useState('')
//   const [refreshing, setRefreshing] = useState(false)
//   const flatListRef = useRef<FlatList>(null)
//   const authContext = useContext(AuthContext)
//   const navigation = useNavigation<NavigationProps>()

//   if (!authContext || !authContext.user) {
//     throw new Error('AuthContext is not available. Ensure the component is wrapped in AuthProvider.')
//   }

//   const { user } = authContext

//   // Cache failed avatar URLs to avoid retrying
//   const [failedAvatars, setFailedAvatars] = useState<Set<string>>(new Set())

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
//       // Log API response to inspect fromUserAvatar
//       console.log(
//         'Fetched messages:',
//         messages.map((msg) => ({ id: msg.id, fromUserAvatar: msg.fromUserAvatar }))
//       )
//       // Only update state if messages have changed (based on IDs)
//       setChatHistory((prev) => {
//         const prevIds = new Set(prev.map((msg) => msg.id))
//         const newMessages = messages.filter((msg) => !prevIds.has(msg.id))
//         if (newMessages.length > 0 || prev.length !== messages.length) {
//           return messages
//         }
//         return prev
//       })
//     } catch (error) {
//       console.error('Failed to fetch messages:', error)
//     }
//   }

//   // Initial fetch and polling
//   useEffect(() => {
//     if (!selectedUserId) return

//     fetchAllMessages() // Initial fetch

//     // Poll every 5 seconds
//     const intervalId = setInterval(() => {
//       fetchAllMessages()
//     }, 5000)

//     // Cleanup interval on unmount
//     return () => clearInterval(intervalId)
//   }, [selectedUserId])

//   const onRefresh = async () => {
//     setRefreshing(true)
//     try {
//       await fetchAllMessages()
//     } catch (error) {
//       console.error('Error refreshing messages:', error)
//     } finally {
//       setRefreshing(false)
//     }
//   }

//   // Check if createdBy starts with a staff role
//   const isStaffRole = (createdBy: string): boolean => {
//     const roles = ['Sales Staff', 'Manager', 'FarmBreeder', 'Consulting Staff', 'Delivery Staff']
//     return roles.some((role) => createdBy.startsWith(role))
//   }

//   // Get customer info from chat history
//   const getCustomerInfo = () => {
//     const customerMsg = chatHistory.find((msg) => !isStaffRole(msg.createdBy))
//     return {
//       id: customerMsg ? customerMsg.fromUserId : Date.now().toString(), // Fallback ID
//       name: customerMsg ? customerMsg.createdBy : 'Customer' // Fallback name
//     }
//   }

//   // Filter messages for the selected staff member
//   const filteredMessages = chatHistory.filter(
//     (msg) =>
//       (msg.fromUserId === selectedUserId && msg.toUserId !== selectedUserId) ||
//       (msg.toUserId === selectedUserId && msg.fromUserId !== selectedUserId)
//   )

//   // Get the staff member's username for the header
//   const staffUserName = (() => {
//     const staffMsg = filteredMessages.find((msg) => isStaffRole(msg.createdBy))
//     return staffMsg ? staffMsg.createdBy : 'Chat'
//   })()

//   // Scroll to bottom when messages update
//   useEffect(() => {
//     flatListRef.current?.scrollToEnd({ animated: true })
//   }, [filteredMessages])

//   // Send message
//   const sendMessage = async () => {
//     if (!newMessage.trim() || !selectedUserId) return

//     const customerInfo = getCustomerInfo()

//     try {
//       await axios.post(
//         `${API_BASE_URL}chat/send`,
//         {
//           toUserId: selectedUserId,
//           content: newMessage
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Accept: 'text/plain',
//             Authorization: `Bearer ${user.token}`
//           }
//         }
//       )

//       // Optimistically update UI (no fromUserAvatar for sent messages)
//       setChatHistory((prev) => [
//         ...prev,
//         {
//           id: Date.now(),
//           fromUserId: customerInfo.id,
//           toUserId: selectedUserId,
//           content: newMessage,
//           isRead: false,
//           createdTime: new Date().toISOString(),
//           createdBy: customerInfo.name
//         }
//       ])
//       setNewMessage('')
//     } catch (error) {
//       console.error('Failed to send message:', error)
//     }
//   }

//   const renderMessage = ({ item }: { item: Message }) => {
//     const isSent = !isStaffRole(item.createdBy) // Customer's messages are sent, staff's are received
//     const userName = item.createdBy

//     // Log fromUserAvatar for debugging
//     if (!isSent) {
//       console.log(`Rendering staff message (ID: ${item.id}): fromUserAvatar = ${item.fromUserAvatar}`)
//     }

//     // Validate URL
//     const isValidUrl = (url: string | undefined): url is string => !!url && /^https?:\/\/.+/i.test(url)

//     // Get default avatar based on role
//     const getDefaultAvatar = (createdBy: string) => {
//       const role = createdBy.split(' ')[0].toLowerCase() // e.g., "sales" from "Sales Staff John"
//       const defaults: { [key: string]: string } = {
//         sales: 'https://picsum.photos/30?random=1',
//         manager: 'https://picsum.photos/30?random=2',
//         farmbreeder: 'https://picsum.photos/30?random=3',
//         consulting: 'https://picsum.photos/30?random=4',
//         delivery: 'https://picsum.photos/30?random=5'
//       }
//       return defaults[role] || 'https://picsum.photos/30'
//     }

//     // Select image source
//     const imageSource =
//       isValidUrl(item.fromUserAvatar) && !failedAvatars.has(item.fromUserAvatar)
//         ? { uri: item.fromUserAvatar }
//         : { uri: getDefaultAvatar(item.createdBy) }

//     return (
//       <View style={[styles.messageContainer, isSent ? styles.sentMessage : styles.receivedMessage]}>
//         {!isSent && (
//           <View style={styles.avatar}>
//             <Image
//               source={imageSource}
//               style={styles.avatarImage}
//               onError={(e) => {
//                 console.log(`Failed to load image for message ${item.id}:`, e.nativeEvent.error)
//                 if (item.fromUserAvatar) {
//                   const avatarUrl = item.fromUserAvatar // Local variable for type safety
//                   setFailedAvatars((prev) => new Set(prev).add(avatarUrl))
//                 }
//               }}
//             />
//             <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
//           </View>
//         )}
//         <View style={[styles.messageBubble, isSent ? styles.sentBubble : styles.receivedBubble]}>
//           <Text style={styles.messageText}>{item.content}</Text>
//           <Text style={styles.messageTime}>
//             {new Date(item.createdTime).toLocaleTimeString([], {
//               hour: '2-digit',
//               minute: '2-digit'
//             })}
//           </Text>
//         </View>
//       </View>
//     )
//   }

//   if (!selectedUserId) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.headerText}>No conversation selected</Text>
//       </View>
//     )
//   }

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       // behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       // keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
//     >
//       <View style={styles.header} className='flex-row items-center'>
//         <TouchableOpacity onPress={() => navigation.navigate('Contact')}>
//           <ChevronLeft color={'#292D32'} size={24} />
//         </TouchableOpacity>
//         <Text style={styles.headerText}>{staffUserName}</Text>
//       </View>
//       <FlatList
//         ref={flatListRef}
//         data={filteredMessages}
//         renderItem={renderMessage}
//         keyExtractor={(item) => item.id.toString()}
//         contentContainerStyle={styles.messageList}
//         onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//       />
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           value={newMessage}
//           onChangeText={setNewMessage}
//           placeholder='Type a message...'
//           multiline
//         />
//         <TouchableOpacity
//           style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
//           onPress={sendMessage}
//           disabled={!newMessage.trim()}
//         >
//           <Ionicons name='send' size={24} color='#fff' />
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f0f2f5'
//   },
//   header: {
//     padding: 16,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd'
//   },
//   headerText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#000',
//     textAlign: 'center'
//   },
//   messageList: {
//     padding: 10
//   },
//   messageContainer: {
//     flexDirection: 'row',
//     marginVertical: 5,
//     alignItems: 'flex-end'
//   },
//   sentMessage: {
//     justifyContent: 'flex-end'
//   },
//   receivedMessage: {
//     justifyContent: 'flex-start'
//   },
//   avatar: {
//     width: 30,
//     height: 30,
//     marginRight: 10,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   avatarImage: {
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     backgroundColor: '#ccc'
//   },
//   avatarText: {
//     position: 'absolute',
//     color: '#000',
//     fontSize: 14,
//     fontWeight: 'bold'
//   },
//   messageBubble: {
//     maxWidth: '70%',
//     padding: 10,
//     borderRadius: 15
//   },
//   sentBubble: {
//     backgroundColor: '#0084ff'
//   },
//   receivedBubble: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#ddd'
//   },
//   messageText: {
//     fontSize: 16,
//     color: '#000'
//   },
//   messageTime: {
//     fontSize: 12,
//     color: '#999',
//     marginTop: 5,
//     alignSelf: 'flex-end'
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     padding: 10,
//     backgroundColor: '#fff',
//     borderTopWidth: 1,
//     borderTopColor: '#ddd'
//   },
//   input: {
//     flex: 1,
//     backgroundColor: '#f0f2f5',
//     borderRadius: 20,
//     padding: 10,
//     fontSize: 16,
//     maxHeight: 100
//   },
//   sendButton: {
//     backgroundColor: '#0084ff',
//     borderRadius: 20,
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: 10
//   },
//   sendButtonDisabled: {
//     backgroundColor: '#ccc'
//   }
// })

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
  fromUserAvatar?: string
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

  const [failedAvatars, setFailedAvatars] = useState<Set<string>>(new Set())

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

  useEffect(() => {
    if (!selectedUserId) return

    fetchAllMessages()

    const intervalId = setInterval(() => {
      fetchAllMessages()
    }, 5000)

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

  const isConsultingStaffRole = (createdBy: string): boolean => {
    return createdBy.startsWith('Consulting Staff')
  }

  const isOtherStaffRole = (createdBy: string): boolean => {
    const roles = ['Sales Staff', 'Manager', 'FarmBreeder', 'Delivery Staff']
    return roles.some((role) => createdBy.startsWith(role))
  }

  const isCustomerRole = (createdBy: string): boolean => {
    return !isConsultingStaffRole(createdBy) && !isOtherStaffRole(createdBy)
  }

  const getConsultingStaffInfo = () => {
    const staffMsg = chatHistory.find((msg) => isConsultingStaffRole(msg.createdBy))
    return {
      id: staffMsg ? staffMsg.fromUserId : Date.now().toString(),
      name: staffMsg ? staffMsg.createdBy : 'Consulting Staff'
    }
  }

  const filteredMessages = chatHistory.filter(
    (msg) =>
      (msg.fromUserId === selectedUserId && msg.toUserId !== selectedUserId) ||
      (msg.toUserId === selectedUserId && msg.fromUserId !== selectedUserId)
  )

  const participantUserName = (() => {
    const otherMsg = filteredMessages.find((msg) => !isConsultingStaffRole(msg.createdBy))
    return otherMsg ? otherMsg.createdBy : 'Chat'
  })()

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true })
  }, [filteredMessages])

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
    const isSent = isConsultingStaffRole(item.createdBy)
    let userName = item.createdBy

    if (isSent) {
      const relatedMsg = chatHistory.find((m) => m.fromUserId === item.toUserId)
      userName = relatedMsg ? relatedMsg.createdBy : 'Unknown'
    }

    if (!isSent) {
      console.log(`Rendering received message (ID: ${item.id}): fromUserAvatar = ${item.fromUserAvatar}`)
    }

    const isValidUrl = (url: string | undefined): url is string => !!url && /^https?:\/\/.+/i.test(url)

    const getDefaultAvatar = (createdBy: string) => {
      const role = createdBy.split(' ')[0].toLowerCase()
      const defaults: { [key: string]: string } = {
        sales: 'https://picsum.photos/30?random=1',
        manager: 'https://picsum.photos/30?random=2',
        farmbreeder: 'https://picsum.photos/30?random=3',
        delivery: 'https://picsum.photos/30?random=5',
        customer: 'https://picsum.photos/30?random=6'
      }
      const roleKey = isOtherStaffRole(createdBy) ? role : 'customer'
      return defaults[roleKey] || 'https://picsum.photos/30'
    }

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
                  const avatarUrl = item.fromUserAvatar
                  setFailedAvatars((prev) => new Set(prev).add(avatarUrl))
                }
              }}
            />
            <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
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
    backgroundColor: '#ccc'
  },
  avatarText: {
    position: 'absolute',
    color: '#000',
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
