import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import RestaurantDetailScreen from './RestaurantDetailScreen'
import RestaurantsScreen from './RestaurantsScreen'
import RestaurantOrderScreen from '../cart/RestaurantOrderScreen'
import ConfirmOrderScreen from '../cart/ConfirmOrderScreen'

const Stack = createNativeStackNavigator()

export default function RestaurantsStack () {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='RestaurantsScreen'
        component={RestaurantsScreen}
        options={{
          title: 'Restaurants'
        }} />
      <Stack.Screen
        name='RestaurantDetailScreen'
        component={RestaurantDetailScreen}
        options={{
          title: 'Restaurant Detail'
        }} />
      <Stack.Screen
        name = 'RestaurantOrderScreen'
        component={RestaurantOrderScreen}
        options={{
          title: 'New Order'
        }} />
      <Stack.Screen
        name = 'ConfirmOrderScreen'
        component={ConfirmOrderScreen}
        options={{
          title: 'Confirm Order'
        }}
      />
    </Stack.Navigator>
  )
}
