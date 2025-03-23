import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { storage } from 'firebaseConfig'

type ProfileEditFormProps = {
  initialEmail?: string
  initialFullName?: string
  initialPhoneNumber?: string
  initialAddress?: string
  initialSex?: string
  initialProfileImage?: string
  onUpdateProfile?: (profileData: {
    email: string
    fullName: string
    phoneNumber: string
    address: string
    sex: string
    profileImage?: string
  }) => void
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  initialEmail = '',
  initialFullName = '',
  initialPhoneNumber = '',
  initialAddress = '',
  initialSex = 'Male',
  initialProfileImage = '',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onUpdateProfile = () => {}
}) => {
  const [email] = useState(initialEmail)
  const [fullName, setFullName] = useState(initialFullName)
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber)
  const [address, setAddress] = useState(initialAddress)
  const [sex, setSex] = useState(initialSex || 'Male')
  const [profileImage, setProfileImage] = useState(initialProfileImage)
  const [isUploading, setIsUploading] = useState(false)

  const handleImagePick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need access to your gallery to upload images.')
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8
      })

      if (!result.canceled && result.assets.length > 0) {
        const localUri = result.assets[0].uri
        await uploadImageToFirebase(localUri)
      }
    } catch (error) {
      console.error('Error picking image:', error)
    }
  }

  const uploadImageToFirebase = async (uri: string) => {
    setIsUploading(true)
    try {
      const response = await fetch(uri)
      const blob = await response.blob()
      const storageRef = ref(storage, `profileImages/${Date.now()}`)
      const uploadTask = uploadBytesResumable(storageRef, blob)

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log(`Upload is ${progress}% done`)
        },
        (error) => {
          console.error('Upload failed:', error)
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          setProfileImage(downloadURL)
        }
      )
    } catch (error) {
      console.error('Image upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleUpdateProfile = () => {
    onUpdateProfile({
      email,
      fullName,
      phoneNumber,
      address,
      sex,
      profileImage
    })
  }

  return (
    <View className='flex-1 bg-white p-5 mt-7 px-7'>
      <View className='items-center mb-6'>
        <View className='w-32 h-32 rounded-full bg-blue overflow-hidden mb-2'>
          {profileImage ? (
            <Image source={{ uri: profileImage }} className='w-full h-full' resizeMode='cover' />
          ) : (
            <Image
              source={{
                uri: 'https://static.vecteezy.com/system/resources/previews/005/176/777/non_2x/user-avatar-line-style-free-vector.jpg'
              }}
              className='w-full h-full'
              resizeMode='cover'
            />
          )}
        </View>
        <TouchableOpacity className='bg-gray-700 py-2 px-6 rounded-md' onPress={handleImagePick} disabled={isUploading}>
          <Text className='text-white font-medium'>{isUploading ? 'Uploading...' : 'Upload'}</Text>
        </TouchableOpacity>
      </View>

      {isUploading && <ActivityIndicator size='large' color='#0000ff' />}

      <View className='mb-4'>
        <Text className='font-medium mb-1 ml-1'>Email</Text>
        <TextInput
          className='border border-gray-300 rounded-lg p-3 text-gray-800 bg-gray-200'
          value={email}
          editable={false}
        />
      </View>

      <View className='mb-4'>
        <Text className='font-medium mb-1 ml-1'>Full Name</Text>
        <TextInput
          className='border border-gray-300 rounded-lg p-3 text-gray-800'
          value={fullName}
          onChangeText={setFullName}
          placeholder='Enter your full name'
        />
      </View>

      <View className='mb-4'>
        <Text className='font-medium mb-1 ml-1'>Phone Number</Text>
        <TextInput
          className='border border-gray-300 rounded-lg p-3 text-gray-800'
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder='Enter your phone number'
          keyboardType='phone-pad'
        />
      </View>

      <View className='mb-4'>
        <Text className='font-medium mb-1 ml-1'>Address</Text>
        <TextInput
          className='border border-gray-300 rounded-lg p-3 text-gray-800'
          value={address}
          onChangeText={setAddress}
          placeholder='Enter your address'
        />
      </View>

      <View className='mb-6'>
        <Text className='font-medium mb-2 ml-1'>Sex</Text>
        <View className='flex-row space-x-3'>
          <TouchableOpacity
            className={`py-2 px-4 rounded-lg border ${sex === 'Male' ? 'bg-blue border-blue' : 'bg-white border-gray-300'}`}
            onPress={() => setSex('Male')}
          >
            <Text className={`font-medium ${sex === 'Male' ? 'text-white' : 'text-gray-700'}`}>Male</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`py-2 px-4 rounded-lg border ${sex === 'Female' ? 'bg-blue border-blue' : 'bg-white border-gray-300'}`}
            onPress={() => setSex('Female')}
          >
            <Text className={`font-medium ${sex === 'Female' ? 'text-white' : 'text-gray-700'}`}>Female</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity className='bg-blue py-3 rounded-lg items-center justify-center' onPress={handleUpdateProfile}>
        <Text className='text-white text-lg font-medium'>Update Profile</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ProfileEditForm
