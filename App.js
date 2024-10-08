//Vet appointment application for web and mobile
//Fahrettin Emin Korkut 25.04.2024
import * as React from 'react';
import RootNavigation from './src/navigation/RootNavigation';
import { store } from './src/redux/store'
import { Provider } from 'react-redux'

const App = () => {
  return (
    <Provider store={store}>
      <RootNavigation />
    </Provider>
  )
}

export default App;