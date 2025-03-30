import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native'
import { Appbar, Button } from 'react-native-paper'
import { FontAwesome } from '@expo/vector-icons'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'
import TripBookingInfo from '@apps/customer/components/Booking/TripBookingInfo'
import { useTripBookingById } from '@apps/customer/hooks/useTripBooking'
import { useCreateFeedback } from '@apps/customer/hooks/useFeedback'

type RootStackParamList = {
  TripBookingDetails: { tripBookingID: number }
  RateTripDetails: { tripBookingID: number }
}
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'RateTripDetails'>
type RateTripDetailsScreenRouteProp = RouteProp<RootStackParamList, 'RateTripDetails'>

const RateTripDetails = () => {
  const navigation = useNavigation<NavigationProps>()
  const route = useRoute<RateTripDetailsScreenRouteProp>()
  const { tripBookingID } = route.params
  const [loading, setLoading] = useState(true)
  const { tripBookingDetail } = useTripBookingById(tripBookingID)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const { createFeedback } = useCreateFeedback()

  const handleRating = (newRating: number) => {
    setRating(newRating)
  }

  const handleSubmit = async () => {
    try {
      const feedbackData = {
        tripBookingID: tripBookingID,
        feedbackType: 'Tour',
        rating: rating,
        review: review
      }
      const response = await createFeedback(feedbackData)
      console.log('Feedback submitted successfully:', response)
      console.log('Feedback Data:', feedbackData)
      Alert.alert(
        'Feedback Submitted',
        'Thank you for your feedback!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('TripBookingDetails', { tripBookingID })
          }
        ],
        { cancelable: false }
      )
    } catch (error) {
      console.error('Failed to submit feedback:', error)
      Alert.alert(
        'Submission Failed',
        'Please try again later.',
        [
          {
            text: 'OK',
            onPress: () => console.log('User acknowledged the error')
          }
        ],
        { cancelable: false }
      )
    }
  }

  return (
    <ScrollView>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        {/* Header */}
        <Appbar.Header style={{ backgroundColor: '#1E51A4' }}>
          <Appbar.BackAction
            onPress={() => navigation.navigate('TripBookingDetails', { tripBookingID: tripBookingID })}
            color='white'
          />
          <Appbar.Content title='Rate' titleStyle={{ color: 'white' }} />
        </Appbar.Header>

        {/* Countdown Timer */}
        <Text style={{ textAlign: 'center', marginVertical: 10, fontSize: 16 }}>
          How was your overall trip experience?
        </Text>
        <TripBookingInfo tripBooking={tripBookingDetail} />
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => handleRating(star)}>
              <FontAwesome
                name={star <= rating ? 'star' : 'star-o'}
                size={30}
                color={star <= rating ? '#FFD700' : '#d3d3d3'}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Review Input */}
        <View style={{ marginHorizontal: 16, marginTop: 30 }}>
          <TextInput
            value={review}
            onChangeText={setReview}
            placeholder='Share your reviews here'
            multiline
            maxLength={30}
            numberOfLines={3}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 10,
              borderRadius: 5,
              fontSize: 16,
              minHeight: 100,
              textAlignVertical: 'top'
            }}
          />
        </View>
        <View style={{ marginHorizontal: 16, marginTop: 30, marginBottom: 10 }}>
          {/* Rate Button */}
          <Button mode='contained' style={{ backgroundColor: '#1E51A4', paddingVertical: 8 }} onPress={handleSubmit}>
            <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}>Submit</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  )
}

export default RateTripDetails
