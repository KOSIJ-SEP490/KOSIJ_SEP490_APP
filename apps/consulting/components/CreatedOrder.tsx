import { useNavigation, useRoute } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import { ArrowRight, CheckCircle, ChevronLeft } from 'lucide-react-native'
import { Key, useContext, useEffect, useState } from 'react'
import { TouchableOpacity, View, Text, ScrollView, Image, TextInput, Alert } from 'react-native'
import Steps from './Steps.container'
import * as ImagePicker from 'expo-image-picker'
import { Picker } from '@react-native-picker/picker'
import { District, fetchCities, fetchDistricts, fetchWards, Location, Ward } from '../api/useAddress.api'
import AuthContext from '@shared/context/AuthContext'
import { API_BASE_URL } from '@env'
import axios from 'axios'
import { useOrders } from '../api/useOrder.api'
import KoiUploadImage from '@shared/screens/components/KoiUploadImage'

type CreateOrderScreenProps = {
  id: number
}
type RootStackParamList = {
  TourDetails: { id: number }
}

const CreateOrder = () => {
  const route = useRoute()
  const { id } = route.params as CreateOrderScreenProps
  const [tourDetails, setTourDetails] = useState<any>(null)
  const navigation = useNavigation<StackScreenProps<RootStackParamList>['navigation']>()
  const [currentStep, setCurrentStep] = useState(1)
  const authContext = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const [tripBookingName, setTripBookingName] = useState<any>(null)
  const { createOrder } = useOrders()
  if (!authContext || !authContext.user) {
    throw new Error('AuthContext is not available. Ensure the component is wrapped in AuthProvider.')
  }

  const { user } = authContext
  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}farms/trip/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            Accept: 'text/plain'
          }
        })
        setTourDetails(response.data)
      } catch (error) {
        console.error('Error fetching tour details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTourDetails()
  }, [id])
  const [forms, setForms] = useState([
    {
      id: 1,
      koiName: '',
      koiVariety: '',
      koiType: 'Retail',
      koiImage: [] as string[],
      koiQuantity: 0,
      koiWeight: '',
      koiLength: '',
      koiPrice: '',
      koiDeposit: '',
      note: '',
      koiFarm: '',
      bookingAccout: '',
      fullName: '',
      phoneNumber: '',
      city: '',
      cityId: '',
      district: '',
      districtId: '',
      ward: '',
      wardId: '',
      address: ''
    }
  ])

  const addForm = () => {
    setForms([
      ...forms,
      {
        id: forms.length + 1,
        koiName: '',
        koiVariety: '',
        koiType: 'Retail',
        koiImage: [],
        koiQuantity: 0,
        koiWeight: '',
        koiLength: '',
        koiPrice: '',
        koiDeposit: '',
        note: '',
        koiFarm: '',
        bookingAccout: '',
        fullName: '',
        phoneNumber: '',
        city: '',
        cityId: '',
        district: '',
        districtId: '',
        ward: '',
        wardId: '',
        address: ''
      }
    ])
  }

  const removeForm = (id: number) => {
    setForms(forms.filter((form) => form.id !== id))
  }

  const [cities, setCities] = useState<Location[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])

  useEffect(() => {
    const loadCities = async () => {
      try {
        const cityData: Location[] = await fetchCities()
        setCities(Array.isArray(cityData) ? (cityData as Location[]) : [])
      } catch (error) {
        console.error('Error loading cities:', error)
      }
    }
    loadCities()
  }, [])

  const handleCityChange = async (value: string, index: number) => {
    const selectedCity: Location | undefined = cities.find((city) => city.code === value)
    const updatedForms = [...forms]
    updatedForms[index] = {
      ...updatedForms[index],
      city: selectedCity?.name || '',
      cityId: value,
      district: '',
      districtId: '',
      ward: '',
      wardId: ''
    }
    setForms(updatedForms)

    try {
      const districtData: District[] = await fetchDistricts(value)
      setDistricts(districtData)
      setWards([])
    } catch (error) {
      console.error('Error fetching districts:', error)
    }
  }

  useEffect(() => {
    const fetchTripBookingDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}trip/${id}/trip-bookings`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            Accept: 'text/plain'
          }
        })
        setTripBookingName(response.data)
      } catch (error) {
        console.log('Error fetch Trip Booking Name', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTripBookingDetails()
  }, [id])

  const handleDistrictChange = async (value: string, index: number) => {
    const selectedDistrict: District | undefined = districts.find((district) => district.code === value)
    const updatedForms = [...forms]
    updatedForms[index] = {
      ...updatedForms[index],
      district: selectedDistrict?.name || '',
      districtId: value,
      ward: '',
      wardId: ''
    }
    setForms(updatedForms)

    try {
      const wardData: Ward[] = await fetchWards(value)
      setWards(wardData)
    } catch (error) {
      console.error('Error fetching wards:', error)
    }
  }

  const handleWardChange = (value: string, index: number) => {
    const selectedWard: Ward | undefined = wards.find((ward) => ward.code === value)
    const updatedForms = [...forms]
    updatedForms[index] = {
      ...updatedForms[index],
      ward: selectedWard?.name || '',
      wardId: value
    }
    setForms(updatedForms)
  }

  const handleSubmitOrder = async () => {
    if (!authContext || !authContext.user) return
    const token = authContext.user.token

    try {
      setLoading(true)

      // Upload images to Firebase and get URLs
      const uploadedForms = await Promise.all(
        forms.map(async (form) => {
          // const uploadedImages = await Promise.all(
          //   form.koiImage.map(async (imageUri, imgIndex) => {
          //     const imageUrl = await uploadImageToFirebase(imageUri)
          //     return { imageUrl }
          //   })
          // ).then((images) => images.filter(Boolean))
          return {
            variety: form.koiVariety,
            koiType: form.koiType,
            quantity: form.koiQuantity,
            length: Number(form.koiLength),
            weight: Number(form.koiWeight),
            koiPrice: Number(form.koiPrice),
            note: form.note,
            // orderDetailImages: /*uploadedImages*/ form.koiImage
            orderDetailImages: form.koiImage.map((imageUrl) => ({ imageUrl })) // Convert to array of objects
          }
        })
      )

      const orderDetails = uploadedForms.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.variety === item.variety && t.koiPrice === item.koiPrice)
      )

      const orderData = {
        fullName: forms[0].fullName,
        phoneNumber: forms[0].phoneNumber,
        province: forms[0].city,
        district: forms[0].district,
        ward: forms[0].ward,
        deliveryAddress: forms[0].address,
        note: forms[0].note,
        farmId: Number(forms[0].koiFarm) || 0,
        tripBookingId: Number(forms[0].bookingAccout) || 0,
        orderDetails: orderDetails
      }

      console.log('Final Order Data:', JSON.stringify(orderData, null, 2))

      // Call API to create order
      const response = await createOrder(orderData)
      console.log('Order created successfully:', response)

      Alert.alert('Success', 'Order has been created successfully!')
      navigation.goBack()
    } catch (error) {
      console.error('Failed to create order:', error)
      Alert.alert('Error', 'Failed to create order. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  return (
    <View className='flex-1 bg-white px-4 pt-4'>
      {/* Header */}
      <View className='mt-3 flex-row items-center px-4 py-2'>
        <TouchableOpacity onPress={() => navigation.navigate('TourDetails', { id: id })}>
          <ChevronLeft color={'#292D32'} size={24} />
        </TouchableOpacity>
        <Text className='text-lg font-semibold text-center flex-1'>Record Order</Text>
        <View style={{ width: 24 }} />
      </View>

      <Steps currentStep={currentStep} />

      {currentStep === 1 ? (
        <ScrollView className='mt-2' style={{ maxHeight: 400 }}>
          {forms.map((form, index) => (
            <View
              key={form.id}
              style={{ borderWidth: 1, borderColor: '#ccc', padding: 15, marginBottom: 20, borderRadius: 10 }}
            >
              <View style={{ borderBottomColor: '#ccc', borderBottomWidth: 1 }}>
                <View>
                  <Text>
                    Koi Farm <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <Picker
                    selectedValue={forms[0]?.koiFarm || ''}
                    onValueChange={(itemValue) => {
                      console.log('Selected farmId:', itemValue) // ✅ Debugging log
                      setForms((prevForms) => {
                        const updatedForms = [...prevForms]
                        updatedForms[0].koiFarm = String(itemValue) // ✅ Convert to string
                        return updatedForms
                      })
                    }}
                  >
                    <Picker.Item label='Select Koi Farm' value='' />
                    {tourDetails?.value?.map((farm: { id: number; farmName: string }) => (
                      <Picker.Item key={`farm-${farm.id}`} label={farm.farmName} value={String(farm.id)} />
                    ))}
                  </Picker>
                </View>
                <View className='mb-2'>
                  <Text>
                    Koi Variety <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <TextInput
                    style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 5, marginBottom: 10 }}
                    placeholder='Enter'
                    value={form.koiVariety}
                    onChangeText={(text) => {
                      const newForms = [...forms]
                      newForms[index].koiVariety = text
                      setForms(newForms)
                    }}
                  />
                </View>
              </View>

              <View className='flex-row justify-between mt-3'>
                <View className='w-36'>
                  <Text className='mb-2'>
                    Koi Quantity <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: '#ccc',
                      borderRadius: 5,
                      overflow: 'hidden',
                      height: 37
                    }}
                  >
                    {/* Increment Button */}
                    <TouchableOpacity
                      style={{
                        padding: 10,
                        borderRightWidth: 1,
                        borderColor: '#ccc',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 40,
                        height: 45
                      }}
                      onPress={() => {
                        const newForms = [...forms]
                        newForms[index].koiQuantity = Number(newForms[index].koiQuantity) + 1
                        setForms(newForms)
                      }}
                    >
                      <Text style={{ fontSize: 18 }}>+</Text>
                    </TouchableOpacity>

                    {/* Quantity Input */}
                    <TextInput
                      style={{
                        textAlign: 'center',
                        flex: 1,
                        paddingVertical: 10,
                        height: 42
                      }}
                      keyboardType='numeric'
                      value={String(form.koiQuantity)}
                      onChangeText={(text) => {
                        const newForms = [...forms]
                        newForms[index].koiQuantity = text.replace(/[^0-9]/g, '') as unknown as number
                        setForms(newForms)
                      }}
                    />

                    {/* Decrement Button */}
                    <TouchableOpacity
                      style={{
                        padding: 10,
                        borderLeftWidth: 1,
                        borderColor: '#ccc',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 40,
                        height: 45
                      }}
                      onPress={() => {
                        const newForms = [...forms]
                        newForms[index].koiQuantity = Math.max(1, Number(newForms[index].koiQuantity) - 1)
                        setForms(newForms)
                      }}
                    >
                      <Text style={{ fontSize: 18 }}>-</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View className='w-36'>
                  <Text>
                    Koi Type <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <Picker
                    selectedValue={form.koiType}
                    onValueChange={(itemValue) => {
                      const newForms = [...forms]
                      newForms[index].koiType = itemValue
                      setForms(newForms)
                    }}
                  >
                    <Picker.Item label='Retail' value='Retail' />
                    <Picker.Item label='Wholesale' value='Wholesale' />
                  </Picker>
                </View>
              </View>

              <View className='flex-row justify-between'>
                <View className='w-36'>
                  <Text>
                    Koi Weight <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <TextInput
                    style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 5, marginBottom: 10 }}
                    placeholder='Enter'
                    value={form.koiWeight}
                    onChangeText={(text) => {
                      const newForms = [...forms]
                      newForms[index].koiWeight = text
                      setForms(newForms)
                    }}
                  />
                </View>
                <View className='w-36'>
                  <Text>
                    Koi Length <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <TextInput
                    style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 5, marginBottom: 10 }}
                    placeholder='Enter'
                    value={form.koiLength}
                    onChangeText={(text) => {
                      const newForms = [...forms]
                      newForms[index].koiLength = text
                      setForms(newForms)
                    }}
                  />
                </View>
              </View>
              <View className='flex-row'>
                <View className='w-full'>
                  <Text>
                    Koi Price <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <TextInput
                    style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 5, marginBottom: 10 }}
                    placeholder='Enter'
                    value={form.koiPrice}
                    onChangeText={(text) => {
                      const newForms = [...forms]
                      newForms[index].koiPrice = text
                      setForms(newForms)
                    }}
                  />
                </View>
              </View>
              <View>
                <Text>Koi Note</Text>
                <TextInput
                  editable
                  style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 8,
                    borderRadius: 5,
                    marginBottom: 10,
                    minHeight: 100,
                    textAlignVertical: 'top'
                  }}
                  placeholder='Enter'
                  value={form.note}
                  onChangeText={(text) => {
                    const newForms = [...forms]
                    newForms[index].note = text
                    setForms(newForms)
                  }}
                  multiline
                  maxLength={30}
                  numberOfLines={3}
                />
              </View>
              <View key={form.id}>
                <Text className='mb-2'>
                  Koi Image <Text style={{ color: 'red' }}>*</Text>
                </Text>
                <KoiUploadImage
                  value={form.koiImage}
                  onChange={(newImageUrls: string[]) => {
                    const updatedForms = [...forms]
                    updatedForms[index].koiImage = newImageUrls
                    setForms(updatedForms)
                  }}
                  maxCount={4}
                />
              </View>
            </View>
          ))}

          <TouchableOpacity
            onPress={addForm}
            style={{
              padding: 15,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: '#264eca',
              borderStyle: 'dashed',
              flexDirection: 'row',
              backgroundColor: '#ffffff'
            }}
          >
            <Text style={{ color: '#264eca', fontSize: 16, fontWeight: '600' }}>Create more</Text>
            <Text style={{ color: '#264eca', fontSize: 18 }}>+</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ScrollView className='mt-2' style={{ maxHeight: 400 }}>
          {forms.length > 0 && (
            <View
              key={forms[0].id}
              style={{ borderWidth: 1, borderColor: '#ccc', padding: 15, marginBottom: 20, borderRadius: 10 }}
            >
              <View>
                <Text>
                  Booking Account <Text style={{ color: 'red' }}>*</Text>
                </Text>
                <Picker
                  selectedValue={forms[0].bookingAccout}
                  onValueChange={(itemValue) => {
                    const updatedForms = [...forms]
                    updatedForms[0].bookingAccout = itemValue
                    setForms(updatedForms)
                  }}
                >
                  <Picker.Item label='Select Trip Booking Account' value='' />
                  {tripBookingName?.value?.map(
                    (account: { tripBookingId: number; customerName: string | undefined }) => (
                      <Picker.Item
                        key={`trip-${account.tripBookingId}`}
                        label={account.customerName}
                        value={account.tripBookingId}
                      />
                    )
                  )}
                </Picker>
              </View>
              <View>
                <Text>
                  FullName <Text style={{ color: 'red' }}>*</Text>
                </Text>
                <TextInput
                  style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 5, marginBottom: 10 }}
                  placeholder='Enter'
                  value={forms[0].fullName}
                  onChangeText={(text) => {
                    const updatedForms = [...forms]
                    updatedForms[0].fullName = text
                    setForms(updatedForms)
                  }}
                />
              </View>

              <View>
                <Text>
                  Phone Number <Text style={{ color: 'red' }}>*</Text>
                </Text>
                <TextInput
                  style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 5, marginBottom: 10 }}
                  placeholder='Enter'
                  value={forms[0].phoneNumber}
                  onChangeText={(text) => {
                    const updatedForms = [...forms]
                    updatedForms[0].phoneNumber = text
                    setForms(updatedForms)
                  }}
                />
              </View>
              <View>
                <Text>
                  Province/City <Text style={{ color: 'red' }}>*</Text>
                </Text>
                <Picker selectedValue={forms[0].cityId} onValueChange={(value) => handleCityChange(value, 0)}>
                  <Picker.Item label='Select city' value='' />
                  {cities.map((city) => (
                    <Picker.Item key={`city-${city.code}`} label={city.name} value={city.code} />
                  ))}
                </Picker>
              </View>
              <View>
                <Text>
                  District <Text style={{ color: 'red' }}>*</Text>
                </Text>
                <Picker selectedValue={forms[0].districtId} onValueChange={(value) => handleDistrictChange(value, 0)}>
                  <Picker.Item label='Select District' value='' />
                  {districts.map((district) => (
                    <Picker.Item key={`district-${district.code}`} label={district.name} value={district.code} />
                  ))}
                </Picker>
              </View>
              <View>
                <Text>
                  Ward <Text style={{ color: 'red' }}>*</Text>
                </Text>
                <Picker selectedValue={forms[0].wardId} onValueChange={(value) => handleWardChange(value, 0)}>
                  <Picker.Item label='Select Ward' value='' />
                  {wards.map((ward) => (
                    <Picker.Item key={`ward-${ward.code}`} label={ward.name} value={ward.code} />
                  ))}
                </Picker>
              </View>
              <View>
                <Text>
                  Address <Text style={{ color: 'red' }}>*</Text>
                </Text>
                <TextInput
                  style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 5, marginBottom: 10 }}
                  placeholder='Enter'
                  value={forms[0].address}
                  onChangeText={(text) => {
                    const updatedForms = [...forms]
                    updatedForms[0].address = text
                    setForms(updatedForms)
                  }}
                />
              </View>
            </View>
          )}
        </ScrollView>
      )}

      <View className='absolute bottom-4 left-4 right-4 flex-row justify-between'>
        <TouchableOpacity className='px-4 py-2 border border-blue-600 rounded-full' onPress={() => setCurrentStep(1)}>
          <Text className='text-blue-600'>← Prev</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`px-4 py-2 rounded-full flex-row items-center ${currentStep === 1 ? '#264eca' : 'bg-green-600'}`}
          onPress={() => (currentStep === 1 ? setCurrentStep(2) : handleSubmitOrder())}
        >
          <Text className='text-white mr-2'>{currentStep === 1 ? 'Next' : 'Done'}</Text>
          {currentStep === 1 ? (
            <ArrowRight size={18} className='text-white' />
          ) : (
            <CheckCircle size={18} className='text-white' />
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CreateOrder
