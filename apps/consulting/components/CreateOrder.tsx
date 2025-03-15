import { useNavigation, useRoute } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import { ArrowRight, CheckCircle, ChevronLeft } from 'lucide-react-native'
import { Key, useContext, useEffect, useState } from 'react'
import { TouchableOpacity, View, Text, ScrollView, Image, TextInput } from 'react-native'
import Steps from './Steps.container'
import * as ImagePicker from 'expo-image-picker'
import { Picker } from '@react-native-picker/picker'
import { District, fetchCities, fetchDistricts, fetchWards, Location, Ward } from '../api/useAddress.api'
import AuthContext from '@shared/context/AuthContext'
import { API_BASE_URL } from '@env'
import axios from 'axios'

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
      koiNote: '',
      koiFarm: '',
      bookingAccout: '',
      fullName: '',
      phoneNumber: '',
      country: '',
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
        koiNote: '',
        koiFarm: '',
        bookingAccout: '',
        fullName: '',
        phoneNumber: '',
        country: 'Vietnam',
        city: '',
        cityId: '',
        district: '',
        districtId: '',
        ward: '',
        wardId: '',
        address: 'Lot E2a-7, D1 Street, High-Tech Park'
      }
    ])
  }

  const removeForm = (id: number) => {
    setForms(forms.filter((form) => form.id !== id))
  }

  const pickImage = async (index: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    })

    if (!result.canceled) {
      const newForms = [...forms]
      const selectedImages = result.assets.map((asset) => asset.uri)
      newForms[index].koiImage = [...newForms[index].koiImage, ...selectedImages]
      setForms(newForms)
    }
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
  const itineraryArray = Object.values(tourDetails?.value?.tourResponse?.tourDetails?.itineraryDetails || {})

  return (
    <View className='flex-1 bg-white px-4 pt-4'>
      {/* Header */}
      <View className='mt-3 flex-row items-center px-4 py-2'>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft color={'#292D32'} size={24} />
        </TouchableOpacity>
        <Text className='text-lg font-semibold text-center flex-1'>Create Order</Text>
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
                    style={{ borderColor: '#ccc', borderWidth: 1 }}
                    selectedValue={form.koiFarm}
                    onValueChange={(itemValue) => {
                      const newForms = [...forms]
                      newForms[index].koiFarm = itemValue
                      setForms(newForms)
                    }}
                  >
                    <Picker.Item label='Select Koi Farm' value='' />
                    {tourDetails?.value?.map((farm: { farmName: string; farmId: number }) => (
                      <Picker.Item key={farm.farmId} label={farm.farmName} value={farm.farmId} />
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
              <View className='mt-3'>
                <Text>
                  Koi Name <Text style={{ color: 'red' }}>*</Text>
                </Text>
                <TextInput
                  style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 5, marginBottom: 10 }}
                  placeholder='Enter koi name'
                  value={form.koiName}
                  onChangeText={(text) => {
                    const newForms = [...forms]
                    newForms[index].koiName = text
                    setForms(newForms)
                  }}
                />
              </View>
              <View className='flex-row justify-between'>
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
              <View className='flex-row justify-between'>
                <View className='w-36'>
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
                <View className='w-36'>
                  <Text>
                    Koi Deposit <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <TextInput
                    style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 5, marginBottom: 10 }}
                    placeholder='Enter'
                    value={form.koiDeposit}
                    onChangeText={(text) => {
                      const newForms = [...forms]
                      newForms[index].koiDeposit = text
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
                  value={form.koiNote}
                  onChangeText={(text) => {
                    const newForms = [...forms]
                    newForms[index].koiNote = text
                    setForms(newForms)
                  }}
                  multiline
                  maxLength={30}
                  numberOfLines={3}
                />
              </View>
              <View key={form.id}>
                <Text>
                  Koi Image <Text style={{ color: 'red' }}>*</Text>
                </Text>

                <TouchableOpacity onPress={() => pickImage(index)} style={{ marginBottom: 10, alignItems: 'center' }}>
                  <View
                    style={{
                      width: 100,
                      height: 100,
                      backgroundColor: '#eee',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 5
                    }}
                  >
                    <Text>+ Upload</Text>
                  </View>
                </TouchableOpacity>

                {/* Display uploaded images */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {form.koiImage.map((uri, imgIndex) => (
                    <Image
                      key={imgIndex}
                      source={{ uri }}
                      style={{ width: 100, height: 100, marginRight: 10, borderRadius: 5, marginBottom: 10 }}
                    />
                  ))}
                </View>

                {index !== 0 && (
                  <TouchableOpacity
                    onPress={() => removeForm(form.id)}
                    style={{
                      backgroundColor: 'red',
                      padding: 10,
                      borderRadius: 5,
                      alignItems: 'center',
                      marginTop: 10
                    }}
                  >
                    <Text style={{ color: 'white' }}>Remove</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}

          <TouchableOpacity
            onPress={addForm}
            style={{ backgroundColor: '#264eca', padding: 15, borderRadius: 5, alignItems: 'center' }}
          >
            <Text style={{ color: 'white', fontSize: 16 }}>Create more ☺</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ScrollView className='mt-2' style={{ maxHeight: 400 }}>
          {forms.map((form, index) => (
            <View
              key={form.id}
              style={{ borderWidth: 1, borderColor: '#ccc', padding: 15, marginBottom: 20, borderRadius: 10 }}
            >
              <View>
                <Text>
                  Booking Account <Text style={{ color: 'red' }}>*</Text>
                </Text>
                <Picker
                  selectedValue={form.bookingAccout}
                  onValueChange={(itemValue) => {
                    const newForms = [...forms]
                    newForms[index].bookingAccout = itemValue
                    setForms(newForms)
                  }}
                >
                  <Picker.Item label='Select Trip Booking Account' value='' />
                  {tripBookingName?.value?.map(
                    (account: { tripBookingId: number; customerName: string | undefined }) => (
                      <Picker.Item
                        key={account.tripBookingId}
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
                  value={form.fullName}
                  onChangeText={(text) => {
                    const newForms = [...forms]
                    newForms[index].fullName = text
                    setForms(newForms)
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
                  value={form.phoneNumber}
                  onChangeText={(text) => {
                    const newForms = [...forms]
                    newForms[index].phoneNumber = text
                    setForms(newForms)
                  }}
                />
              </View>
              <View>
                <Text>
                  Province/City <Text style={{ color: 'red' }}>*</Text>
                </Text>
                <Picker selectedValue={form.cityId} onValueChange={(value) => handleCityChange(value, index)}>
                  <Picker.Item label='Select city' value='' />
                  {cities.map((city) => (
                    <Picker.Item key={city.code} label={city.name} value={city.code} />
                  ))}{' '}
                </Picker>
              </View>
              <View>
                <Text>
                  District <Text style={{ color: 'red' }}>*</Text>
                </Text>
                <Picker selectedValue={form.districtId} onValueChange={(value) => handleDistrictChange(value, index)}>
                  <Picker.Item label='Select District' value='' />
                  {districts.map((district) => (
                    <Picker.Item key={district.code} label={district.name} value={district.code} />
                  ))}{' '}
                </Picker>
              </View>
              <View>
                <Text>
                  Ward <Text style={{ color: 'red' }}>*</Text>
                </Text>
                <Picker selectedValue={form.wardId} onValueChange={(value) => handleWardChange(value, index)}>
                  <Picker.Item label='Select Ward' value='' />
                  {wards.map((ward) => (
                    <Picker.Item key={ward.code} label={ward.name} value={ward.code} />
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
                  value={form.address}
                  onChangeText={(text) => {
                    const newForms = [...forms]
                    newForms[index].address = text
                    setForms(newForms)
                  }}
                />
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <View className='absolute bottom-4 left-4 right-4 flex-row justify-between'>
        <TouchableOpacity className='px-4 py-2 border border-blue-600 rounded-full' onPress={() => setCurrentStep(1)}>
          <Text className='text-blue-600'>← Prev</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`px-4 py-2 rounded-full flex-row items-center ${currentStep === 1 ? '#264eca' : 'bg-green-600'}`}
          onPress={() => (currentStep === 1 ? setCurrentStep(2) : console.log('hihihi'))}
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
