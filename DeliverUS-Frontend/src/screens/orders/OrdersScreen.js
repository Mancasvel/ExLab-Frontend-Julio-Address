import React, { useState, useContext, useEffect } from 'react'
import { StyleSheet, View, Pressable, Text } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { FlatList } from 'react-native-web'
import { getUserOrders, remove } from '../../api/OrderEndpoints'
import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import { brandPrimary, brandPrimaryTap, brandSecondary, flashStyle, flashTextStyle } from '../../styles/GlobalStyles'
import { AuthorizationContext } from '../../context/AuthorizationContext'
import ImageCard from '../../components/ImageCard'
import * as GlobalStyles from '../../styles/GlobalStyles'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import DeleteModal from '../../components/DeleteModal'

export default function OrderScreen ({ navigation, route }) {
  const [orders, setOrders] = useState([])
  const [orderToBeDeleted, setOrderToBeDeleted] = useState(null)
  const { loggedInUser } = useContext(AuthorizationContext)
  useEffect(() => {
    if (loggedInUser) {
      fetchOrders()
    } else {
      setOrders(null)
    }
  }, [loggedInUser, route])

  const fetchOrders = async () => {
    try {
      const fetchedOrders = await getUserOrders()
      setOrders(fetchedOrders)
    } catch (err) {
      showMessage({
        message: `There was an error while retrieving your orders. ${err}`,
        type: 'error',
        style: flashStyle,
        titleStyle: flashTextStyle
      })
    }
  }

  const removeOrder = async (order) => {
    try {
      await remove(order.id)
      await fetchOrders()
      setOrderToBeDeleted(null)
      showMessage({
        message: `Order ${order.name} succesfully removed`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    } catch (error) {
      console.log(error)
      setOrderToBeDeleted(null)
      showMessage({
        message: `Order ${order.name} could not be removed.`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const renderOrders = ({ item }) => {
    return (
      <ImageCard
        imageUri={item.restaurant.logo ? { uri: process.env.API_BASE_URL + '/' + item.restaurant.logo } : undefined}
        title = {item.restaurant.name}
        style={styles.imageCard}
        onPress={() => {
          navigation.navigate('OrderDetailScreen', { id: item.id })
        }}
        >
          <TextSemiBold>Status: {item.status}</TextSemiBold>
            <TextRegular numberOfLines={3}>Date: {item.createdAt.substring(0, 10)}</TextRegular>
            <TextRegular numberOfLines={3}>Last update: {item.updatedAt.substring(11, 16)}</TextRegular>
            <TextRegular numberOfLines={3}>Total Price: {item.price}</TextRegular>
            <TextRegular numberOfLines={3}>Address: {item.address}</TextRegular>

         { item.status === 'pending' &&
         <View style={styles.actionButtonsContainer}>
          <Pressable
            onPress={() => navigation.navigate('RestaurantOrderScreen', { id: item.restaurantId, orderId: item.id })
            }
            style={({ pressed }) => [
              {
                backgroundColor: pressed
                  ? GlobalStyles.brandBlueTap
                  : GlobalStyles.brandBlue
              },
              styles.actionButton
            ]}>
          <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
            <MaterialCommunityIcons name='pencil' color={'white'} size={20}/>
            <TextRegular textStyle={styles.text}>
              Edit
            </TextRegular>
          </View>
        </Pressable>

        <Pressable
            onPress={() => { setOrderToBeDeleted(item) }}
            style={({ pressed }) => [
              {
                backgroundColor: pressed
                  ? GlobalStyles.brandPrimaryTap
                  : GlobalStyles.brandPrimary
              },
              styles.actionButton
            ]}>
          <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
            <MaterialCommunityIcons name='delete' color={'white'} size={20}/>
            <TextRegular textStyle={styles.text}>
              Delete
            </TextRegular>
            </View>
        </Pressable>
        </View>
        }

        </ImageCard>
    )
  }

  if (!loggedInUser) {
    return (<View>
        <Text style = {styles.text}>NOT LOGGED IN</Text>
        <Pressable
            onPress={() => navigation.navigate('Profile')
            }
            style={({ pressed }) => [
              {
                backgroundColor: pressed
                  ? brandPrimaryTap
                  : brandPrimary
              },
              styles.button
            ]}>
            <TextRegular textStyle={styles.textButtom}>
              Log in
            </TextRegular>
          </Pressable>
      </View>)
  } else {
    return (
      <>
      <FlatList
        style = {styles.container}
        data = {orders}
        renderItem = {renderOrders}
        keyExtractor = {item => item.id.toString()}
      />
      <DeleteModal
        isVisible={orderToBeDeleted !== null}
        onCancel={() => setOrderToBeDeleted(null)}
        onConfirm={() => removeOrder(orderToBeDeleted)}>
          <TextRegular>The order and their assigned products will be deleted as well</TextRegular>
          <TextRegular>If the order is already accepted, it cannot be deleted.</TextRegular>
      </DeleteModal>
    </>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    fontSize: 16,
    color: 'white',
    alignSelf: 'center',
    marginLeft: 5
  },
  button: {
    borderRadius: 8,
    height: 40,
    marginTop: 12,
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    width: '80%'
  },
  actionButton: {
    borderRadius: 8,
    height: 40,
    marginTop: 12,
    margin: '1%',
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'column',
    width: '50%'
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    bottom: 5,
    width: '90%'
  },
  imageCard: {
    height: 250
  },
  textButtom: {
    fontSize: 16,
    color: brandSecondary,
    textAlign: 'center'
  },
  emptyList: {
    textAlign: 'center',
    padding: 50
  }
})
/* const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 50
  },
  button: {
    borderRadius: 8,
    height: 40,
    margin: 12,
    padding: 10,
    width: '100%'
  },
  text: {
    fontSize: 16,
    color: brandSecondary,
    textAlign: 'center'
  },
  actionButton: {
    borderRadius: 8,
    height: 40,
    marginTop: 12,
    margin: '1%',
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'column',
    width: '50%'
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    bottom: 5,
    position: 'absolute',
    width: '90%'
  },
  emptyList: {
    textAlign: 'center',
    padding: 50
  }
}) */
