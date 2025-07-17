import { ShippingAddress } from '../models/models.js'
import { Op } from 'sequelize'

const ShippingAddressController = {
  async index (req, res) {
    try {
      const shippingAddresses = await ShippingAddress.findAll({
        where: { userId: req.user.id },
        order: [['createdAt', 'ASC']]
      })
      res.status(200).json(shippingAddresses)
    } catch (error) {
      console.error('Error en ShippingAddressController.index:', error)
      res.status(500).send('Internal server error')
    }
  },

  async create (req, res) {
    try {
      const userId = req.user.id

      // Verificamos cuántas direcciones tiene ya el usuario
      const existingAddresses = await ShippingAddress.findAll({ where: { userId } })

      const data = {
        ...req.body,
        userId
      }

      if (existingAddresses.length === 0) {
      // Si es la primera, forzar como predeterminada
        data.isDefault = true
      } else if (data.isDefault) {
      // Si no es la primera pero se quiere marcar como predeterminada,
      // desmarcar las anteriores
        await ShippingAddress.update(
          { isDefault: false },
          { where: { userId } }
        )
      }

      const address = await ShippingAddress.create(data)
      return res.status(201).json(address)
    } catch (error) {
      return res.status(400).json({ message: 'Error creating address', error })
    }
  },

  async update (req, res) {
    const { shippingAddressId } = req.params
    try {
      const address = await ShippingAddress.findByPk(shippingAddressId)
      if (!address) {
        return res.status(404).json({ message: 'Address not found' })
      }
      await address.update(req.body)
      return res.json(address)
    } catch (error) {
      return res.status(400).json({ message: 'Error updating address', error })
    }
  },

  async destroy (req, res) {
    const { shippingAddressId } = req.params
    try {
      const address = await ShippingAddress.findByPk(shippingAddressId)
      if (!address) {
        return res.status(404).json({ message: 'Address not found' })
      }
      await address.destroy()
      return res.status(200).json({ message: 'Address deleted successfully' })
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting address', error })
    }
  },

  async markDefault (req, res) {
    const { shippingAddressId } = req.params
    const userId = req.user.id

    try {
      const address = await ShippingAddress.findOne({ where: { id: shippingAddressId, userId } })
      if (!address) {
        return res.status(403).json({ message: 'Forbidden' })
      }

      await ShippingAddress.update({ isDefault: false }, {
        where: {
          userId,
          id: { [Op.ne]: shippingAddressId }
        }
      })

      address.isDefault = true
      await address.save()

      return res.status(200).json(address)
    } catch (error) {
      console.error('Error en markDefault:', error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export default ShippingAddressController
