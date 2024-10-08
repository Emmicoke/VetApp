import React from 'react'
import { HomePage, AccountPage, UpdateAccountPage } from '../screens'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const UserStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomePage}
        options={{
          title: 'Home',
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
        name="Account"
        component={AccountPage}
        options={{
          title: 'Account',
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
        name="Update Account"
        component={UpdateAccountPage}
        options={{
          title: 'Update Account',
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

export default UserStack