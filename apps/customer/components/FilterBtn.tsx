import { TouchableOpacity, Text } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { styled } from 'nativewind'

const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledText = styled(Text)

const FilterButton = ({ onPress }: { onPress?: () => void }) => {
  return (
    <StyledTouchableOpacity className='mr-4 p-2 flex items-center justify-center' onPress={onPress}>
      <FontAwesome5 name='sliders-h' size={20} color='black' />
      <StyledText className='text-xs text-gray-500'>Filter</StyledText>
    </StyledTouchableOpacity>
  )
}

export default FilterButton
