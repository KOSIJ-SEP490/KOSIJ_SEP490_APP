import React, { useContext } from 'react'
import { View, Text, Button, Alert, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AuthContext from '../../../../shared/context/AuthContext'
import { AuthStackNavigationProp } from '../../../../shared/types/navigationAuthType'

export default function SettingsScreen() {
  const authContext = useContext(AuthContext)
  const navigation = useNavigation<AuthStackNavigationProp>()

  if (!authContext) {
    return <Text>Error: AuthContext not found!</Text>
  }

  const { logout } = authContext

  const confirmLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout()
          navigation.navigate('Login')
        }
      }
    ])
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings</Text>
      <Button title='Logout' onPress={confirmLogout} color='red' />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  text: {
    fontSize: 18,
    marginBottom: 20
  }
})
