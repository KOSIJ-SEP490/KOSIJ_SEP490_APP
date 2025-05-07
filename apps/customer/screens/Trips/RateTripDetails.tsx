import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native'
import { Appbar, Button, Card } from 'react-native-paper'
import { FontAwesome } from '@expo/vector-icons'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'
import TripBookingInfo from '@apps/customer/components/Booking/TripBookingInfo'
import { useTripBookingById } from '@apps/customer/hooks/useTripBooking'
import { useCreateFeedback } from '@apps/customer/hooks/useFeedback'

type RootStackParamList = {
  TripBookingDetails: { tripBookingID: number }
  RateTripDetails: { tripBookingID: number }
  Trips: { initialTab?: string }
}
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'RateTripDetails'>
type RateTripDetailsScreenRouteProp = RouteProp<RootStackParamList, 'RateTripDetails'>

const RateTripDetails = () => {
  const navigation = useNavigation<NavigationProps>()
  const route = useRoute<RateTripDetailsScreenRouteProp>()
  const { tripBookingID } = route.params
  const [loading, setLoading] = useState(true)
  const { tripBookingDetail } = useTripBookingById(tripBookingID)
  const { createFeedback } = useCreateFeedback()
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [farmFeedback, setFarmFeedback] = useState<{
    [farmId: number]: { rating: number; review: string }
  }>({})

  const handleRating = (newRating: number) => {
    setRating(newRating)
  }

  const handleFarmRating = (farmId: number, newRating: number) => {
    setFarmFeedback((prev) => ({
      ...prev,
      [farmId]: {
        ...prev[farmId],
        rating: newRating,
        review: prev[farmId]?.review || ''
      }
    }))
  }

  const handleFarmReview = (farmId: number, newReview: string) => {
    setFarmFeedback((prev) => ({
      ...prev,
      [farmId]: {
        ...prev[farmId],
        rating: prev[farmId]?.rating || 0,
        review: newReview
      }
    }))
  }

  const handleSubmit = async () => {
    try {
      if (!tripBookingDetail || !tripBookingDetail.farmIds || tripBookingDetail.farmIds.length === 0) {
        Alert.alert('Error', 'No farms available to provide feedback for.')
        return
      }

      const feedbackData: {
        tripBookingId: number
        rating: number
        review: string
        feedbackFarmCommand: [
          { farmId: number; rating: number; review: string },
          ...{ farmId: number; rating: number; review: string }[]
        ]
      } = {
        tripBookingId: tripBookingID,
        rating,
        review,
        feedbackFarmCommand: tripBookingDetail.farmIds.map((farm) => ({
          farmId: Number(farm.id),
          rating: farmFeedback[farm.id]?.rating || 0,
          review: farmFeedback[farm.id]?.review || ''
        })) as [
          { farmId: number; rating: number; review: string },
          ...{ farmId: number; rating: number; review: string }[]
        ]
      }

      const response = await createFeedback(feedbackData)
      console.log('Feedback submitted successfully:', response)
      Alert.alert(
        'Feedback Submitted',
        'Thank you for your feedback!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Trips', { initialTab: 'Completed' })
          }
        ],
        { cancelable: false }
      )
    } catch (error) {
      console.error('Failed to submit feedback:', error)
      Alert.alert(
        'Submission Failed',
        'Please try again later.',
        [{ text: 'OK', onPress: () => console.log('User acknowledged the error') }],
        { cancelable: false }
      )
    }
  }
  console.log('handle submit: ', handleSubmit)

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
        <TripBookingInfo tripBooking={tripBookingDetail} />
        {tripBookingDetail?.farmIds.map((farm) => (
          <Card key={farm.id} style={{ margin: 16, padding: 16, backgroundColor: 'white' }}>
            <View className='mb-3 border-b border-zinc-300'>
              <Text className='font-bold text-base'>{farm.farmName}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => handleFarmRating(farm.id, star)}>
                  <FontAwesome
                    name={star <= (farmFeedback[farm.id]?.rating || 0) ? 'star' : 'star-o'}
                    size={30}
                    color={star <= (farmFeedback[farm.id]?.rating || 0) ? '#FFD700' : '#d3d3d3'}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Review Input */}
            <View style={{ marginHorizontal: 16, marginTop: 30 }}>
              <TextInput
                value={farmFeedback[farm.id]?.review || ''}
                onChangeText={(text) => handleFarmReview(farm.id, text)}
                placeholder={`We’d love to hear your feedback about ${farm.farmName}!`}
                multiline
                maxLength={300}
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
          </Card>
        ))}
        <View>
          <Text style={{ textAlign: 'center', marginVertical: 10, fontSize: 16 }}>
            How was your overall trip experience?
          </Text>
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
              maxLength={300}
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
