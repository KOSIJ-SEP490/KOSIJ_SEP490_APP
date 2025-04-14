import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useResetPasswordAccount } from '../api/useAccount.api'

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [oldPasswordVisible, setOldPasswordVisible] = useState(false)
  const [newPasswordVisible, setNewPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)

  const { updateAccount, loading, success, responseMessage } = useResetPasswordAccount()

  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match!')
      return
    }

    const result = await updateAccount({ oldPassword, newPassword, confirmPassword })

    if (result && 'error' in result) {
      alert(result.error)
    } else if (success) {
      alert(responseMessage || 'Password updated successfully!')
    }
  }

  return (
    <View className='px-7 py-6 mt-5'>
      <Text className='text-sm font-semibold mb-2'>Old Password</Text>
      <View className='relative'>
        <TextInput
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry={!oldPasswordVisible}
          className='border border-gray-300 rounded-lg p-4 mb-5 text-sm'
        />
        <TouchableOpacity onPress={() => setOldPasswordVisible(!oldPasswordVisible)} className='absolute right-4 top-4'>
          <Feather name={oldPasswordVisible ? 'eye-off' : 'eye'} size={20} color='#666' />
        </TouchableOpacity>
      </View>

      <Text className='text-sm font-semibold mb-2'>New Password</Text>
      <View className='relative'>
        <TextInput
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={!newPasswordVisible}
          className='border border-gray-300 rounded-lg p-4 mb-5 text-sm'
        />
        <TouchableOpacity onPress={() => setNewPasswordVisible(!newPasswordVisible)} className='absolute right-4 top-4'>
          <Feather name={newPasswordVisible ? 'eye-off' : 'eye'} size={20} color='#666' />
        </TouchableOpacity>
      </View>

      <Text className='text-sm font-semibold mb-2'>Confirm New Password</Text>
      <View className='relative'>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!confirmPasswordVisible}
          className='border border-gray-300 rounded-lg p-4 mb-12 text-sm'
        />
        <TouchableOpacity
          onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
          className='absolute right-4 top-4'
        >
          <Feather name={confirmPasswordVisible ? 'eye-off' : 'eye'} size={20} color='#666' />
        </TouchableOpacity>
      </View>

      <View className='items-center'>
        <TouchableOpacity
          onPress={handleSave}
          disabled={loading}
          className={`bg-blue w-32 py-4 rounded-lg items-center ${loading ? 'opacity-50' : ''}`}
        >
          {loading ? (
            <ActivityIndicator color='#fff' />
          ) : (
            <Text className='text-white text-sm font-semibold'>Save</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ChangePassword
