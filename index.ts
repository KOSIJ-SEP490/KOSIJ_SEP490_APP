import { registerRootComponent } from 'expo'
import { AppRegistry } from 'react-native'
import getAppByRole from './roleSelector'

const App = getAppByRole()

registerRootComponent(App)
AppRegistry.registerComponent('main', () => App)
