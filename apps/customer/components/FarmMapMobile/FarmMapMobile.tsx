/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Dimensions, Platform, Linking, Alert } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import axios from 'axios'
import LottieView from 'lottie-react-native'

interface Props {
  address: string
  farmName?: string
}

const { width } = Dimensions.get('window')

const FarmMapMobile: React.FC<Props> = ({ address, farmName }) => {
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let isMounted = true

    const fetchCoords = async (addr: string) => {
      try {
        const res = await axios.get('https://nominatim.openstreetmap.org/search', {
          params: {
            q: addr,
            format: 'json'
          },
          headers: {
            'User-Agent': 'KosijMap/1.0 (intern@example.com)'
          }
        })

        const data = res.data as { lat: string; lon: string }[]

        if (data.length > 0) {
          return {
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon)
          }
        }

        return null
      } catch (err) {
        console.error('Lỗi khi gọi API lấy tọa độ:', err)
        return null
      }
    }

    const tryFetchCoordinates = async (initialAddress: string) => {
      const parts = initialAddress
        .split(' ')
        .map((p) => p.trim())
        .filter(Boolean)

      while (parts.length > 0 && isMounted) {
        const query = parts.join(' ')
        const coords = await fetchCoords(query)
        if (coords) {
          if (isMounted) {
            setCoordinates(coords)
            setLoading(false)
            setError(false)
          }
          return
        }

        parts.pop()
      }

      if (isMounted) {
        setCoordinates(null)
        setLoading(false)
        setError(true)
      }
    }

    if (address) {
      setLoading(true)
      setError(false)
      tryFetchCoordinates(address)
    }

    return () => {
      isMounted = false
    }
  }, [address])

  // Hàm mở bản đồ tương thích Android/iOS
  const openMap = async () => {
    if (!coordinates) return

    const { lat, lon } = coordinates

    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`
    const appleMapsUrl = `http://maps.apple.com/?ll=${lat},${lon}`
    const androidGeoUrl = `geo:${lat},${lon}?q=${lat},${lon}(${farmName || 'Vị trí trang trại'})`

    let url = ''

    if (Platform.OS === 'ios') {
      const canOpenGoogle = await Linking.canOpenURL(googleMapsUrl)
      url = canOpenGoogle ? googleMapsUrl : appleMapsUrl
    } else {
      url = androidGeoUrl
    }

    Linking.openURL(url).catch(() => Alert.alert('Lỗi', 'Không thể mở ứng dụng bản đồ.'))
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          source={require('assets/animation/loading.json')}
          autoPlay
          loop
          style={{ width: 100, height: 100 }}
        />
      </View>
    )
  }

  if (error || !coordinates) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Không thể tìm thấy địa chỉ</Text>
      </View>
    )
  }

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: coordinates.lat,
          longitude: coordinates.lon,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        }}
        scrollEnabled={false}
        zoomEnabled={false}
      >
        <Marker
          coordinate={{ latitude: coordinates.lat, longitude: coordinates.lon }}
          title={farmName || 'Vị trí trang trại'}
          onPress={openMap}
        />
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  mapContainer: {
    width: width - 62,
    height: 300,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8
  },
  map: {
    flex: 1,
    width: null,
    height: null
  },
  loadingContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16
  },
  errorText: {
    fontSize: 16,
    color: '#888'
  }
})

export default FarmMapMobile
