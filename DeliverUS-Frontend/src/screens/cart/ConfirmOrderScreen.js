/* eslint-disable react/prop-types */
import { addItem, removeItem, getCart } from './LocalStorageController'
import React, { useEffect, useState, useContext } from 'react'
import { StyleSheet, View, FlatList, ImageBackground, Pressable, Text } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { getDetail } from '../../api/RestaurantEndpoints'
import { createOrder, updateOrder } from '../../api/OrderEndpoints'
import ImageCard from '../../components/ImageCard'
import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import { brandPrimary, brandPrimaryTap, brandSecondary, flashStyle, flashTextStyle } from '../../styles/GlobalStyles'
import { AuthorizationContext } from '../../context/AuthorizationContext'
import { Formik } from 'formik'
import InputItem from '../../components/InputItem'
import * as yup from 'yup'

export default function ConfirmOrderScreen ({ navigation, route }) {
  const [restaurant, setRestaurant] = useState({})
  const { loggedInUser } = useContext(AuthorizationContext)
  useEffect(() => {
    async function fetchRestaurantDetail () {
      try {
        const fetchedRestaurant = await getDetail(route.params.id)
        setRestaurant(fetchedRestaurant)
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
  const [cart, setCart] = useState()
  let total = 0
  if (cart === undefined || cart === {}) {
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
    if (cart === undefined || cart === {}) {
      quantity = 0
    } else {
      quantity = JSON.parse(cart).items.filter(y => y.id === item.id)[0] !== undefined ? JSON.parse(cart).items.filter(y => y.id === item.id)[0].quantity : 0
    }
    if (quantity > 0) {
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
    } else {
      return (
        <View></View>
      )
    }
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
  } else if (cart === undefined || JSON.parse(cart).items.length === 0) {
    return (
      <View style={styles.container2}>
      <FlatList
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyProductsList}
          style={styles.containerList}
          data={restaurant.products}
          renderItem={renderProduct}
          keyExtractor={item => item.id.toString()}
        />
        <View style={styles.container3}>
          <View style={styles.container3}>
          <TextSemiBold textStyle={styles.textCheckout}>
          Your cart is empty
          </TextSemiBold>
        </View>
        <Pressable
              onPress={() => {
                navigation.popToTop()
              }
              }
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? brandPrimaryTap
                    : brandPrimary
                },
                styles.buttonCenter
              ]}>
              <TextRegular textStyle={styles.textButtomAlert}>
                Go to Restaurants
              </TextRegular>
          </Pressable>
        </View>
    </View>
    )
  } else {
    const itemsParsed = []
    const cartItems = JSON.parse(cart).items
    for (let i = 0; i < cartItems.length; i++) {
      const item = {
        productId: cartItems[i].id,
        quantity: cartItems[i].quantity
      }
      itemsParsed.push(item)
    }
    const carrito = {
      address: 'Fake street 123',
      restaurantId: JSON.parse(cart).restaurantID,
      products: itemsParsed
    }
    let envio = 0
    if (total < 10) {
      envio = restaurant.shippingCosts
    }
    const validationSchema = yup.object().shape({
      address: yup
        .string()
        .max(75, 'Address too long')
        .required('Address is required')
    })
    return (
      <View style={styles.container2}>
      <FlatList
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyProductsList}
          style={styles.containerList}
          data={restaurant.products}
          renderItem={renderProduct}
          keyExtractor={item => item.id.toString()}
        />
        <View style={styles.container3}>
          <View style={styles.container3}>
              <TextSemiBold textStyle={styles.textCheckout}>
              Products: {total}€ <br/>
              Shipping: {envio}€ <br/>
              Total: {total + envio}€
              </TextSemiBold>
          </View>
          <Formik
            initialValues={{
              address: `${loggedInUser.address}`
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              carrito.address = values.address
              if (route.params.update) {
                updateOrder(carrito)
              } else {
                createOrder(carrito)
              }
              navigation.popToTop()
              navigation.navigate('My Orders', { screen: 'OrdersScreen', params: { dirty: true } })
            }
            }>
            {({ handleSubmit, setFieldValue, values }) => (
              <View style={styles.container}>
                <InputItem
                  name = 'address'
                  label = 'Address'
                />
                <Pressable
              onPress={() => {
                handleSubmit()
              }
              }
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? brandPrimaryTap
                    : brandPrimary
                },
                styles.buttonCenter
              ]}>
              <TextRegular textStyle={styles.textButtomAlert}>
                Confirm order
              </TextRegular>
          </Pressable>
              </View>
            )}
          </Formik>
        </View>
    </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  containerList: {
    flex: 3,
    width: '100%',
    flexBasis: '60%'
  },
  container2: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  container3: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginLeft: '0.5%',
    marginRight: '0.5%'
  },
  checkOut: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'flex-end',
    marginLeft: '0.5%',
    marginRight: '0.5%'
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
    fontSize: '200%',
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
  buttonCenter: {
    textAlign: 'center',
    borderRadius: 8,
    marginBottom: 5,
    height: '10%',
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
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
    fontSize: '100%',
    color: brandSecondary,
    textAlign: 'center',
    justifyContent: 'flex-end',
    marginRight: '5%'
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
