import React, { useState } from 'react'
import { View, Text, TextInput, Button } from 'react-native'

const RegisterScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    const userData = { id: 1, email, role: 'customer' }
  }

  return (
    <View>
      <Text>Login</Text>
      <TextInput placeholder='Email' value={email} onChangeText={setEmail} />
      <TextInput placeholder='Password' secureTextEntry value={password} onChangeText={setPassword} />
      <Button title='Login' onPress={handleLogin} />
      <Button title='Register' />
    </View>
  )
}

export default RegisterScreen
