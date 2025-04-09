import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Modal, Image, Dimensions } from 'react-native'
import { styled } from 'nativewind'

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledImage = styled(Image)

interface TripBookingProps {
  outboundTicketUrl?: string | null
  inboundTicketUrl?: string | null
}

export const AirplaneTicketCard: React.FC<TripBookingProps> = ({ outboundTicketUrl, inboundTicketUrl }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const screenHeight = Dimensions.get('window').height

  const handleViewDetails = (imageUrl: string | null | undefined) => {
    if (imageUrl) {
      setCurrentImage(imageUrl)
      setModalVisible(true)
    }
  }

  const renderTicketSection = (label: string, ticketUrl?: string | null) => {
    return (
      <StyledView className='mb-3 flex-row justify-between items-center'>
        <StyledText className='text-sm'>{label}:</StyledText>
        {ticketUrl ? (
          <StyledTouchableOpacity onPress={() => handleViewDetails(ticketUrl)}>
            <StyledText className='text-blue text-sm'>View Details</StyledText>
          </StyledTouchableOpacity>
        ) : (
          <StyledText className='text-gray-500 text-sm'>Not Yet</StyledText>
        )}
      </StyledView>
    )
  }

  return (
    <StyledView className='p-5 w-full'>
      <StyledView className='flex-row justify-between items-center mb-6'>
        <StyledText className='text-base font-semibold text-blue'>Air Plane Ticket</StyledText>
      </StyledView>

      <StyledView className='bg-white rounded-lg p-3 px-6 pb-0 mb-5 border border-gray-300'>
        {renderTicketSection('Inbound Ticket', inboundTicketUrl)}
        {renderTicketSection('Outbound Ticket', outboundTicketUrl)}
      </StyledView>

      <Modal visible={modalVisible} transparent={true} onRequestClose={() => setModalVisible(false)}>
        <StyledView className='flex-1 justify-center items-center bg-black/90 p-5'>
          <StyledTouchableOpacity className='absolute top-10 right-5 z-10 p-3' onPress={() => setModalVisible(false)}>
            <StyledText className='text-white text-lg'>Close</StyledText>
          </StyledTouchableOpacity>

          {currentImage && (
            <StyledImage
              source={{ uri: currentImage }}
              className='w-full'
              style={{ height: screenHeight * 0.7 }}
              resizeMode='contain'
            />
          )}
        </StyledView>
      </Modal>
    </StyledView>
  )
}
