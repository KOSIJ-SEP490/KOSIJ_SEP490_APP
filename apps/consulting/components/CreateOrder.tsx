import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import { ArrowRight, CheckCircle, ChevronLeft } from 'lucide-react-native'
import { useState } from 'react'
import { TouchableOpacity, View, Text, ScrollView, Image, TextInput } from 'react-native'
import Steps from './Steps.container'
import * as ImagePicker from 'expo-image-picker'
import { Picker } from '@react-native-picker/picker'

type RootStackParamList = {
  TourDetails: { id: number }
}

const CreateOrder = () => {
  const navigation = useNavigation<StackScreenProps<RootStackParamList>['navigation']>()
  const [currentStep, setCurrentStep] = useState(1)
  const [forms, setForms] = useState([
    {
      id: 1,
      koiName: '',
      koiAge: '',
      koiSex: 'Male',
      koiVariety: '',
      koiType: 'Retail',
      koiImage: null,
      koiQuantity: 0,
      koiWeight: '',
      koiLength: '',
      koiPrice: '',
      koiDeposit: '',
      koiNote: '',
      koiFarm: ''
    }
  ])

  const addForm = () => {
    setForms([
      ...forms,
      {
        id: forms.length + 1,
        koiName: '',
        koiAge: '',
        koiSex: 'Male',
        koiVariety: '',
        koiType: 'Retail',
        koiImage: null,
        koiQuantity: 0,
        koiWeight: '',
        koiLength: '',
        koiPrice: '',
        koiDeposit: '',
        koiNote: '',
        koiFarm: ''
      }
    ])
  }

  const removeForm = (id: number) => {
    setForms(forms.filter((form) => form.id !== id))
  }

  const pickImage = async (index: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    })

    if (!result.canceled) {
      const newForms = [...forms]
      newForms[index].koiImage = result.assets[0].uri as unknown as null
      setForms(newForms)
    }
  }
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
                      newForms[index].koiSex = itemValue
                      setForms(newForms)
                    }}
                  >
                    <Picker.Item label='Koi Farm Asagi - Tokyo' value='Koi Farm Asagi - Tokyo' />
                    <Picker.Item label='Koi Farm Asagi - Osaka' value='Koi Farm Asagi - Osaka' />
                  </Picker>
                </View>
                <View className='mb-2'>
                  <Text>
                    Koi Variety <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <TextInput
                    style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 5, marginBottom: 10 }}
                    placeholder='Enter koi name'
                    value={form.koiVariety}
                    onChangeText={(text) => {
                      const newForms = [...forms]
                      newForms[index].koiName = text
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
                  <Text>
                    Koi Age <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <TextInput
                    style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 5, marginBottom: 10 }}
                    placeholder='Enter koi age'
                    keyboardType='numeric'
                    value={form.koiAge}
                    onChangeText={(text) => {
                      const newForms = [...forms]
                      newForms[index].koiAge = text
                      setForms(newForms)
                    }}
                  />
                </View>
                <View className='w-36'>
                  <Text>
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
              </View>
              <View className='flex-row justify-between'>
                <View className='w-36'>
                  <Text>
                    Koi Sex <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <Picker
                    style={{ borderColor: '#ccc', borderWidth: 1 }}
                    selectedValue={form.koiSex}
                    onValueChange={(itemValue) => {
                      const newForms = [...forms]
                      newForms[index].koiSex = itemValue
                      setForms(newForms)
                    }}
                  >
                    <Picker.Item label='Male' value='Male' />
                    <Picker.Item label='Female' value='Female' />
                  </Picker>
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
                    value={form.koiVariety}
                    onChangeText={(text) => {
                      const newForms = [...forms]
                      newForms[index].koiVariety = text
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
                    value={form.koiVariety}
                    onChangeText={(text) => {
                      const newForms = [...forms]
                      newForms[index].koiVariety = text
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
                    value={form.koiVariety}
                    onChangeText={(text) => {
                      const newForms = [...forms]
                      newForms[index].koiVariety = text
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
                    value={form.koiVariety}
                    onChangeText={(text) => {
                      const newForms = [...forms]
                      newForms[index].koiVariety = text
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
                  value={form.koiVariety}
                  onChangeText={(text) => {
                    const newForms = [...forms]
                    newForms[index].koiVariety = text
                    setForms(newForms)
                  }}
                  multiline
                  maxLength={30}
                  numberOfLines={3}
                />
              </View>

              <Text>
                Koi Image <Text style={{ color: 'red' }}>*</Text>
              </Text>
              <TouchableOpacity onPress={() => pickImage(index)} style={{ marginBottom: 10, alignItems: 'center' }}>
                {form.koiImage ? (
                  <Image source={{ uri: form.koiImage }} style={{ width: 100, height: 100, borderRadius: 5 }} />
                ) : (
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
                )}
              </TouchableOpacity>

              {forms.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeForm(form.id)}
                  style={{ backgroundColor: 'red', padding: 10, borderRadius: 5, alignItems: 'center' }}
                >
                  <Text style={{ color: 'white' }}>Remove</Text>
                </TouchableOpacity>
              )}
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
        <></>
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
