import React from 'react'
import { View, Text, TouchableOpacity, Image, ActionSheetIOS, Platform } from 'react-native'
import { styled } from 'nativewind'
import * as ImagePicker from 'expo-image-picker'

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)

interface PackageImageUploadProps {
  packageImage: string | null
  setPackageImage: (uri: string | null) => void
}

export default function PackageImageUpload({ packageImage, setPackageImage }: PackageImageUploadProps) {
  const pickImage = async (fromCamera: boolean) => {
    const permission = await ImagePicker.requestCameraPermissionsAsync()
    if (!permission.granted) {
      alert('Permission to access camera is required!')
      return
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1
        })

    if (!result.canceled && result.assets.length > 0) {
      setPackageImage(result.assets[0].uri)
    }
  }

  const showImageOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Gallery'],
          cancelButtonIndex: 0
        },
        (buttonIndex) => {
          if (buttonIndex === 1) pickImage(true)
          else if (buttonIndex === 2) pickImage(false)
        }
      )
    } else {
      pickImage(false)
    }
  }

  return (
    <StyledView className='mb-6'>
      <StyledText className='text-base font-medium mb-2'>Upload Package Image</StyledText>
      <StyledTouchableOpacity className='bg-gray-500 rounded-lg p-4 items-center' onPress={showImageOptions}>
        <StyledText className='text-white text-base'>Take Photo / Choose Image</StyledText>
      </StyledTouchableOpacity>

      {packageImage && (
        <StyledView className='mt-4 items-center'>
          <Image source={{ uri: packageImage }} className='w-full h-60 rounded-lg' resizeMode='cover' />
        </StyledView>
      )}
    </StyledView>
  )
}
