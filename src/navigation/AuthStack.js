import React from 'react'
import { LoginPage, SignupPage } from '../screens'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginPage}
        options={{
          title: 'Login',
          headerStyle: {
            backgroundColor: '#8df702',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignupPage}
        options={{
          title: 'Sign Up',
          headerStyle: {
            backgroundColor: '#8df702',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  )
}

export default AuthStack