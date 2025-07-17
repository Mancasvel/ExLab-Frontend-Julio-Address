/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList, ImageBackground, Image, Pressable } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { getDetail } from '../../api/OrderEndpoints'
import ImageCard from '../../components/ImageCard'
import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import { brandPrimary, brandPrimaryDisabled, brandPrimaryTap, brandSecondary, flashStyle, flashTextStyle } from '../../styles/GlobalStyles'

export default function OrderDetailScreen ({ navigation, route }) {
  const [order, setOrder] = useState({})

  useEffect(() => {
    async function fetchOrderDetail () {
      try {
        const fetchedOrder = await getDetail(route.params.id)
        setOrder(fetchedOrder)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving orders. ${error} `,
          type: 'error',
          style: flashStyle,
          titleStyle: flashTextStyle
        })
      }
    }
    fetchOrderDetail()
  }, [route])

  const renderHeader = () => {
    let statusLogo
    let status
    if (order.status === 'delivered') {
      statusLogo = 'public/orders/delivered.gif'
      status = 'Delivered'
    } else if (order.status === 'pending') {
      statusLogo = 'public/orders/pending_r.gif'
      status = 'Pending'
    } else if (order.status === 'sent') {
      statusLogo = 'public/orders/sent_r.gif'
      status = 'Sent'
    } else if (order.status === 'in process') {
      statusLogo = 'public/orders/in_process_r.gif'
      status = 'In Process'
    }
    return (
      <View>
          <View style={styles.restaurantHeaderContainer}>
            <View style={styles.restaurantHeaderContainer}>
              <TextSemiBold textStyle={styles.textTitle}>Pedido nº {order.id}<br></br>Total: {order.price}€<br></br>Address: {order.address}</TextSemiBold>
              <View style={styles.restaurantHeaderContainer3}>
                <Image style={styles.image} source={order?.restaurant?.logo ? { uri: process.env.API_BASE_URL + '/' + order.restaurant.logo, cache: 'force-cache' } : undefined} />
                <View style={styles.txt}>
                  <TextRegular textStyle={styles.description}>{order.restaurant?.name}</TextRegular>
                </View>
              </View>
            </View>
            <View style={styles.restaurantHeaderContainer2}>
              <Image style={styles.image} source={statusLogo ? { uri: process.env.API_BASE_URL + '/' + statusLogo, cache: 'force-cache' } : undefined} />
              <TextRegular textStyle={styles.description}>{status}</TextRegular>
            </View>
          </View>
      </View>
    )
  }

  const renderEmptyOrdersList = () => {
    return (
      <TextRegular textStyle={styles.emptyList}>
        This order has no products yet.
      </TextRegular>
    )
  }

  const renderProduct = ({ item }) => {
    return (
      <ImageCard
        imageUri={item.image ? { uri: process.env.API_BASE_URL + '/' + item.image } : undefined}
        title={item.name}
      >
        <TextRegular numberOfLines={2}>{item.description}</TextRegular>
        <TextSemiBold textStyle={styles.price}>{item.price.toFixed(2)}€</TextSemiBold>
        <TextSemiBold textStyle={styles.price}>Cantidad: {item.OrderProducts.quantity}</TextSemiBold>
        <TextSemiBold textStyle={styles.price}>Total: {(item.price * item.OrderProducts.quantity).toFixed(2)}€</TextSemiBold>
      </ImageCard>
    )
  }

  return (
      <FlatList
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyOrdersList}
          style={styles.container}
          data={order.products}
          renderItem={renderProduct}
          keyExtractor={item => item.id.toString()}
        />
  )
}

const styles = StyleSheet.create({
  image: {
    height: 100,
    width: 100,
    margin: 10
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  textTitle: {
    fontSize: 20,
    color: 'white'
  },
  description: {
    color: 'white'
  },
  container: {
    flex: 1
  },
  row: {
    padding: 15,
    marginBottom: 5,
    backgroundColor: brandSecondary
  },
  restaurantHeaderContainer: {
    flex: 1,
    height: 100,
    padding: 20,
    backgroundColor: brandPrimaryTap,
    flexDirection: 'row',
    alignItems: 'center'
  },
  restaurantHeaderContainer2: {
    flex: 1,
    height: 140,
    backgroundColor: brandPrimaryTap,
    flexDirection: 'column',
    alignItems: 'center'
  },
  restaurantHeaderContainer3: {
    flex: 1,
    height: 140,
    backgroundColor: brandPrimaryTap,
    flexDirection: 'column'
  },
  emptyList: {
    textAlign: 'center',
    padding: 50
  },
  button: {
    borderRadius: 8,
    height: 40,
    marginTop: 12,
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    fontSize: 16,
    color: brandSecondary,
    textAlign: 'center',
    marginLeft: 5
  },
  txt: {
    marginLeft: 13
  }
})
