/* eslint-disable react/prop-types */
import { initializeDB, addItem, removeItem, getCart } from './LocalStorageController'
import React, { useEffect, useState, useContext } from 'react'
import { StyleSheet, View, FlatList, ImageBackground, Pressable, Text } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { getDetail } from '../../api/RestaurantEndpoints'
import { getDetail as getOrderDetail } from '../../api/OrderEndpoints'
import ImageCard from '../../components/ImageCard'
import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import { brandPrimary, brandPrimaryTap, brandSecondary, flashStyle, flashTextStyle } from '../../styles/GlobalStyles'
import { AuthorizationContext } from '../../context/AuthorizationContext'

export default function RestaurantOrderScreen ({ navigation, route }) {
  const [restaurant, setRestaurant] = useState({})
  const { loggedInUser } = useContext(AuthorizationContext)
  const [cart, setCart] = useState()

  useEffect(() => {
    async function fetchRestaurantDetail () {
      try {
        const fetchedRestaurant = await getDetail(route.params.id)
        setRestaurant(fetchedRestaurant)
        initializeDB(route.params.id)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving restaurants. ${error} `,
          type: 'error',
          style: flashStyle,
          titleStyle: flashTextStyle
        })
      }
    }

    async function fetchOrderDetail () {
      try {
        const fetchedOrder = await getOrderDetail(route.params.orderId)
        initializeDB(route.params.id)
        for (const item of fetchedOrder.products) {
          addItem(item.id, item.OrderProducts.quantity)
        }
        setCart(getCart())
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving restaurants. ${error} `,
          type: 'error',
          style: flashStyle,
          titleStyle: flashTextStyle
        })
      }
    }
    if (route.params.orderId) {
      fetchOrderDetail()
    }

    fetchRestaurantDetail()
  }, [route])

  const renderHeader = () => {
    return (
      <View>
        <ImageBackground source={(restaurant?.heroImage) ? { uri: process.env.API_BASE_URL + '/' + restaurant.heroImage, cache: 'force-cache' } : undefined} style={styles.imageBackground}>
          <View style={styles.restaurantHeaderContainer}>
            <TextSemiBold textStyle={styles.textTitle}>{restaurant.name}</TextSemiBold>
          </View>
        </ImageBackground>
      </View>
    )
  }
  let total = 0
  if (cart === undefined || cart == {}) {
    total = 0
  } else {
    total = 0
    const array = JSON.parse(cart).items
    for (let i = 0; i < array.length; i++) {
      total += restaurant.products.filter(y => y.id === array[i].id)[0].price * array[i].quantity
    }
  }
  const renderProduct = ({ item }) => {
    let quantity
    if (cart === undefined || cart == {}) {
      quantity = 0
    } else {
      quantity = JSON.parse(cart).items.filter(y => y.id === item.id)[0] !== undefined ? JSON.parse(cart).items.filter(y => y.id === item.id)[0].quantity : 0
    }
    return (
      <ImageCard
        imageUri={item.image ? { uri: process.env.API_BASE_URL + '/' + item.image } : undefined}
        title={item.name}>
        <View style={styles.imageCard}>
          <View style={styles.imageCardText}>
            <TextRegular numberOfLines={2}>{item.description}</TextRegular>
            <TextSemiBold textStyle={styles.price}>{item.price.toFixed(2)}€</TextSemiBold>
          </View>
          <View style={styles.buttonsContainer}>
            <Pressable
              onPress={() => { removeItem(item.id); setCart(getCart()) } }
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? brandPrimaryTap
                    : brandPrimary
                },
                styles.littleButton
              ]}>
              <TextRegular textStyle={styles.textButtom}>
                -
              </TextRegular>
            </Pressable>
            <TextRegular textStyle={styles.textRef}>
              {quantity}
            </TextRegular>
            <Pressable
              onPress={() => { addItem(item.id); setCart(getCart()) }}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? brandPrimaryTap
                    : brandPrimary
                },
                styles.littleButton
              ]}>
              <TextRegular textStyle={styles.textButtom}>
                +
              </TextRegular>
            </Pressable>
          </View>
        </View>
      </ImageCard>
    )
  }
  const renderEmptyProductsList = () => {
    return (
      <TextRegular textStyle={styles.emptyList}>
        This restaurant has no products yet.
      </TextRegular>
    )
  }
  if (!loggedInUser) {
    return (<View>
        <Text style = {styles.textAlert}>NOT LOGGED IN</Text>
        <Pressable
            onPress={() => navigation.navigate('Profile')
            }
            style={({ pressed }) => [
              {
                backgroundColor: pressed
                  ? brandPrimaryTap
                  : brandPrimary
              },
              styles.buttonAlert
            ]}>
            <TextRegular textStyle={styles.textButtomAlert}>
              Log in
            </TextRegular>
          </Pressable>
      </View>)
  } else {
    return (
      <View style={styles.container}>
      <FlatList
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyProductsList}
          style={styles.container}
          data={restaurant.products}
          renderItem={renderProduct}
          keyExtractor={item => item.id.toString()}
        />
        <View style={styles.checkOut} opacity={0.0}>
          <TextSemiBold textStyle={styles.textCheckout}>
            TOTAL: {total}€
          </TextSemiBold>
          <View style={styles.buttonCheckoutContainer}>
            <Pressable
            onPress={() => {
              if (cart === undefined || JSON.parse(cart).items.length === 0) {
                showMessage({
                  message: 'Cart can\'t be empty',
                  type: 'warning',
                  style: flashStyle,
                  titleStyle: flashTextStyle
                })
              } else {
                navigation.navigate('ConfirmOrderScreen', { id: route.params.id, update: route.orderId })
              }
            }
              }
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? brandPrimaryTap
                    : brandPrimary
                },
                styles.buttonCheckout
              ]}>
            {<TextRegular textStyle={styles.textButtom}>
              Check Out
            </TextRegular>}
          </Pressable>
          </View>
        </View>
    </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    padding: 15,
    marginBottom: 5,
    backgroundColor: brandSecondary
  },
  restaurantHeaderContainer: {
    height: 50,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'column',
    alignItems: 'center'
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center'
  },
  image: {
    height: 100,
    width: 100,
    margin: 10
  },
  description: {
    color: 'white'
  },
  textTitle: {
    fontSize: 20,
    color: 'white'
  },
  textCheckout: {
    fontSize: '220%',
    fontFamily: 'NotoSerif_700Bold'
  },
  emptyList: {
    textAlign: 'center',
    padding: 50
  },
  button: {
    textAlign: 'center',
    borderRadius: 8,
    marginBottom: 5,
    height: 40,
    width: '100%',
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'row'
  },
  text: {
    fontSize: 16,
    color: brandSecondary,
    textAlign: 'center',
    marginLeft: 5
  },
  textButtom: {
    fontSize: 16,
    color: brandSecondary,
    textAlign: 'center'
  },
  textAlert: {
    fontSize: 30,
    fontFamily: 'NotoSerif_700Bold',
    textAlign: 'center',
    marginTop: 60
  },
  buttonAlert: {
    borderRadius: 8,
    height: 40,
    padding: 10,
    width: '40%',
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center'
  },
  buttonCheckout: {
    textAlign: 'center',
    borderRadius: 8,
    height: '80%',
    width: '150px',
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonCheckoutContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: '5%'
  },
  textButtomAlert: {
    fontSize: 16,
    color: brandSecondary,
    textAlign: 'center'
  },
  checkOut: {
    flexDirection: 'row',
    width: '100%',
    height: '10%'
  },
  imageCard: {
    flexDirection: 'row',
    width: '100%',
    height: '10%'
  },
  imageCardText: {
    width: '50%',
    height: '50%',
    alignContent: 'center'
  },
  buttonsContainer: {
    flexDirection: 'row',
    width: '100%',
    height: '10%',
    alignContent: 'center'
  },
  littleButton: {
    textAlign: 'center',
    borderRadius: 8,
    marginBottom: 5,
    height: 40,
    width: '15%',
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textRef: {
    fontSize: 24,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: 6,
    marginHorizontal: 10
  }
})
