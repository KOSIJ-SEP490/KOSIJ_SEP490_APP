import React, { useEffect } from 'react'
import { View, Image, StyleSheet, Dimensions } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { AuthStackNavigationProp } from '../../types/navigationAuthType'

const SplashScreen = () => {
  const navigation = useNavigation<AuthStackNavigationProp>()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login')
    }, 2000)

    return () => clearTimeout(timer)
  }, [navigation])

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/images/SplashImage.png')} style={styles.image} resizeMode='cover' />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
})

export default SplashScreen
