import React from 'react'
import { View, ActivityIndicator } from 'react-native'
import AuthNavigator from '../../shared/navigation/AuthNavigator'
import { NavigationContainer } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import AuthContext, { AuthProvider } from '@shared/context/AuthContext'
import ConsultingNavigator from '@shared/navigation/ConsultingNavigator'
import CustomerNavigator from '@shared/navigation/CustomerNavigator'
import DeliveryNavigator from '@shared/navigation/DeliveryNavigator'

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <MainNavigator />
        <Toast />
      </NavigationContainer>
    </AuthProvider>
  )
}

const MainNavigator = () => {
  const authContext = React.useContext(AuthContext)

  if (!authContext) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    )
  }

  const { user } = authContext

  // 🔍 Ensure correct navigation based on user role
  if (!user) return <AuthNavigator />

  switch (user.role) {
    case 'Customer':
      return <CustomerNavigator />
    case 'Consulting':
      return <ConsultingNavigator />
    case 'Delivery':
      return <DeliveryNavigator />
    default:
      return <AuthNavigator />
  }
}
