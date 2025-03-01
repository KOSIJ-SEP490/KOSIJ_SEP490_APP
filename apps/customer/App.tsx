import React from 'react'
import { View, ActivityIndicator } from 'react-native'
import CustomerNavigator from '../../shared/navigation/CustomerNavigator'
import AuthNavigator from '../../shared/navigation/AuthNavigator'
import { NavigationContainer } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import AuthContext, { AuthProvider } from '@shared/context/AuthContext'
import { BookingProvider } from './contexts/BookingContext'

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <NavigationContainer>
          <MainNavigator />
          <Toast />
        </NavigationContainer>
      </BookingProvider>
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

  return user ? <CustomerNavigator /> : <AuthNavigator />
}
