import { ShippingAddress } from '../models/models.js'

export const checkShippingAddressOwnership = async (req, res, next) => {
  try {
    const shippingAddressId = req.params.shippingAddressId
    const shippingaddress = await ShippingAddress.findByPk(shippingAddressId)

    if (!shippingaddress) {
      return res.status(404).json({ message: 'Address not found' })
    }

    if (shippingaddress.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    next()
  } catch (error) {
    console.error('Error in checkShippingAddressOwnership middleware:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
