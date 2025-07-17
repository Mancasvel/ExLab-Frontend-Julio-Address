/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import TextSemiBold from '../../components/TextSemibold'
import ImageCard from '../../components/ImageCard'
import TextRegular from '../../components/TextRegular'
import { StyleSheet, Text, FlatList, Pressable, ScrollView, View } from 'react-native'
import { getAll } from '../../api/RestaurantEndpoints'
import { getPopularProducts } from '../../api/ProductEndpoints'
import { brandPrimary, brandPrimaryTap, brandSecondary, flashTextStyle, flashStyle } from '../../styles/GlobalStyles'
import { showMessage } from 'react-native-flash-message'
import { API_BASE_URL } from '@env'

export default function RestaurantsScreen ({ navigation, route }) {
  const [restaurants, setRestaurants] = useState([])
  const [products, setPopularProducts] = useState([])

  useEffect(() => {
    async function fetchRestaurants () { // Addresses problem 1
      try {
        const fetchedRestaurants = await getAll()
        const fetchedProducts = await getPopularProducts()

        setPopularProducts(fetchedProducts)
        setRestaurants(fetchedRestaurants)
      } catch (error) { // Addresses problem 3
        showMessage({
          message: `There was an error while retrieving restaurants. ${error} `,
          type: 'error',
          style: flashStyle,
          titleStyle: flashTextStyle
        })
      }
    }
    fetchRestaurants()
  }, [route])
  const renderRestaurant = ({ item }) => {
    return (
      <ImageCard
        imageUri={item.logo ? { uri: API_BASE_URL + '/' + item.logo } : undefined}
        title={item.name}
        onPress={() => {
          navigation.navigate('RestaurantDetailScreen', { id: item.id })
        }}
        >
          <TextRegular numberOfLines={2}>{item.description}</TextRegular>
          {item.averageServiceMinutes !== null &&
            <TextSemiBold>Avg. service time: <TextSemiBold textStyle={{ color: brandPrimary }}>{item.averageServiceMinutes} min.</TextSemiBold></TextSemiBold>
          }
          <TextSemiBold>Shipping: <TextSemiBold textStyle={{ color: brandPrimary }}>{item.shippingCosts.toFixed(2)}€</TextSemiBold></TextSemiBold>
        </ImageCard>
    )
  }
  const renderProducts = ({ item }) => {
    return (
        <ImageCard
          imageUri={item.image ? { uri: API_BASE_URL + '/' + item.image } : undefined}
          title={item.name}
          >
            <TextRegular numberOfLines={2}>{item.description}</TextRegular>
            <TextSemiBold>Price: <TextSemiBold textStyle={{ color: brandPrimary }}>{item.price.toFixed(2)}€</TextSemiBold></TextSemiBold>
            <TextSemiBold>Restaurant: <TextSemiBold textStyle={{ color: brandPrimary }}>{item.restaurant.name}</TextSemiBold> </TextSemiBold>
          </ImageCard>
    )
  }
  return (
    <ScrollView>
      <View>
        <TextSemiBold textStyle={{ fontSize: 20, textAlign: 'center' }}>Productos populares </TextSemiBold>
        <View style = {styles.containerCenter2}>
        <FlatList
        data={products}
        style={styles.container}
        renderItem={renderProducts}
        keyExtractor={item => item.id.toString()}
        horizontal={false}
        />
        </View>
        <TextSemiBold textStyle={{ fontSize: 20 }}>Restaurantes </TextSemiBold>
        <FlatList
        style={styles.container}
        data={restaurants}
        renderItem={renderRestaurant}
        keyExtractor={item => item.id.toString()}
        />
     </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  container2: {
    flexDirection: 'row'
  },
  containerCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 100
  },
  containerCenter2: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 100
  }
})
