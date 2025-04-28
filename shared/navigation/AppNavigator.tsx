import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { FC } from 'react'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'

interface ScreenType {
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      screenOptions={({ route }) => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home'
        const mainScreens = ['Home', 'Trips', 'Orders', 'Notifications', 'Settings']

        return {
          headerShown: false,
          tabBarStyle: mainScreens.includes(routeName)
            ? { backgroundColor: '#264ECA', paddingTop: 7, height: 93 }
            : { display: 'none' },
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'white'
        }
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
