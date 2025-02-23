/* eslint-disable @typescript-eslint/no-explicit-any */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { FC } from 'react'

interface ScreenType {
  name: string
  component: React.ComponentType<any>
  icon: keyof typeof Ionicons.glyphMap
}

interface AppNavigatorProps {
  screens: ScreenType[]
}

const Tab = createBottomTabNavigator()

const AppNavigator: FC<AppNavigatorProps> = ({ screens }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#264ECA', paddingTop: 7 },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'white'
      }}
    >
      {screens.map(({ name, component, icon }) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name={icon} size={size} color={color} />
          }}
        />
      ))}
    </Tab.Navigator>
  )
}

export default AppNavigator
