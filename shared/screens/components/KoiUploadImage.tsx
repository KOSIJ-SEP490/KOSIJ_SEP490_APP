import React, { useState } from 'react'
import { TouchableOpacity, Text, Image, View, Alert, ActivityIndicator } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { storage } from 'firebaseConfig'
import { AntDesign } from '@expo/vector-icons'

interface KoiUploadImageProps {
  value: string[]
  onChange: (imageUris: string[]) => void
  maxCount?: number
}

export default function KoiUploadImage({ value, onChange, maxCount = 4 }: KoiUploadImageProps) {
  const [loading, setLoading] = useState(false)

  // Function to handle the image picker dialog (Camera or Photo Library)
  const handleImagePicker = () => {
    Alert.alert('Select Image', 'Choose your image source', [
      {
        text: 'Camera',
        onPress: () => openCamera()
      },
      {
        text: 'Library',
        onPress: () => openLibrary()
      },
      {
        text: 'Cancel',
        style: 'cancel'
      }
    ])
  }

  // Function to launch camera
  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync()
    if (permissionResult.granted) {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images', // Correct string literal usage
        quality: 1 // Set quality as per your requirement
      })
      if (!result.canceled && result.assets?.[0].uri) {
        uploadImageToFirebase(result.assets[0].uri)
      }
    } else {
      Alert.alert('Permission required', 'Camera permission is required to take a photo')
    }
  }

  // Function to launch image library
  const openLibrary = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (permissionResult.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images', // Correct string literal usage
        quality: 1 // Set quality as per your requirement
      })
      if (!result.canceled && result.assets?.[0].uri) {
        uploadImageToFirebase(result.assets[0].uri)
      }
    } else {
      Alert.alert('Permission required', 'Library permission is required to select an image')
    }
  }

  // Upload image to Firebase Storage
  const uploadImageToFirebase = async (uri: string) => {
    setLoading(true)
    const imageName = new Date().getTime() + '.jpg'
    const imageRef = ref(storage, 'images/' + imageName)
    const response = await fetch(uri)
    const blob = await response.blob()

    const uploadTask = uploadBytesResumable(imageRef, blob)
    uploadTask.on(
      'state_changed',
      null,
      (error) => {
        console.error('Error uploading image: ', error)
        setLoading(false)
        Alert.alert('Error', 'Failed to upload image')
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
        onChange([...value, downloadURL])
        setLoading(false)
      }
    )
  }

  // Handle image deletion
  const handleDeleteImage = (imageUri: string) => {
    Alert.alert('Confirm', 'Are you sure you want to delete this image?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', onPress: () => onChange(value.filter((uri) => uri !== imageUri)) }
    ])
  }

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
      {/* Display images in a grid layout */}
      {value.map((uri, index) => (
        <View key={index} style={{ position: 'relative', width: '22%' }}>
          <Image source={{ uri }} style={{ width: '100%', height: 80, borderRadius: 8 }} />
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              backgroundColor: 'red',
              borderRadius: 50,
              padding: 5
            }}
            onPress={() => handleDeleteImage(uri)}
          >
            <AntDesign name='close' size={16} color='white' />
          </TouchableOpacity>
        </View>
      ))}

      {/* Placeholder for empty image slots */}
      {value.length < maxCount &&
        new Array(maxCount - value.length).fill(null).map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={handleImagePicker}
            style={{
              width: '22%',
              height: 80,
              backgroundColor: '#f0f0f0',
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: '#ddd'
            }}
          >
            <Text style={{ fontSize: 24, color: '#888' }}>+</Text>
          </TouchableOpacity>
        ))}

      {/* Display loading indicator when uploading */}
      {loading && <ActivityIndicator size='small' color='blue' style={{ marginTop: 10 }} />}
    </View>
  )
}
