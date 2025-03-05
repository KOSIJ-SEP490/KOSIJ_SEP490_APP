import React from 'react'
import { View, ActivityIndicator } from 'react-native'
import AuthNavigator from '../../shared/navigation/AuthNavigator'
import { NavigationContainer } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import AuthContext, { AuthProvider } from '@shared/context/AuthContext'
import ConsultingNavigator from '@shared/navigation/ConsultingNavigator'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// ✅ Create QueryClient instance
const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NavigationContainer>
          <ConsultingNavigator />
          <Toast />
        </NavigationContainer>
      </AuthProvider>
    </QueryClientProvider>
  )
}

const MainNavigator = () => {
  const authContext = React.useContext(AuthContext)
  console.log('AuthContext:', authContext)

  if (!authContext) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    )
  }

  const { user } = authContext
  console.log('User:', user)

  return user ? <ConsultingNavigator /> : <AuthNavigator />
}
