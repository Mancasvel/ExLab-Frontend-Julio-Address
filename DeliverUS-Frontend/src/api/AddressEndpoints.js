import { get, post, patch, destroy } from './helpers/ApiRequestsHelper'

function getAddresses (data) {
  return get('/shippingaddresses')
}

function addAddress (data) {
  return post('/shippingaddresses', data)
}

function setDefault (id) {
  return patch('/shippingaddresses/${id}/default')
}

function deleteAddress (id) {
  return destroy('shippingaddresses/${id}')
}

export { getAddresses, addAddress, setDefault, deleteAddress }
