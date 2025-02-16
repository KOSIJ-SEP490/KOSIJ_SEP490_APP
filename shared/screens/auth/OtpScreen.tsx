import React, { useState } from 'react'
import { View, Text, TextInput, Button } from 'react-native'

const OtpScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <View>
      <Text>Login</Text>
      <TextInput placeholder='Email' value={email} onChangeText={setEmail} />
      <TextInput placeholder='Password' secureTextEntry value={password} onChangeText={setPassword} />
      <Button title='Login' />
      <Button title='Register' />
    </View>
  )
}

export default OtpScreen
