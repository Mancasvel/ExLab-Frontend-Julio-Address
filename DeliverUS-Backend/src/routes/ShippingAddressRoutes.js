import ShippingAddressController from '../controllers/ShippingAddressController.js'
import * as ShippingAddressValidation from '../controllers/validation/ShippingAddressValidation.js'
import { isLoggedIn, hasRole } from '../middlewares/AuthMiddleware.js'
import { handleValidation } from '../middlewares/ValidationHandlingMiddleware.js'
import { checkEntityExists } from '../middlewares/EntityMiddleware.js'
import { ShippingAddress } from '../models/models.js'
import { checkShippingAddressOwnership } from '../middlewares/ShippingAddressMiddleware.js'

const loadShippingAddressRoutes = function (app) {
  // Listar y crear direcciones del usuario autenticado
  app.route('/shippingAddresses')
    .get(
      isLoggedIn,
      hasRole('customer'),
      ShippingAddressController.index
    )
    .post(
      isLoggedIn,
      hasRole('customer'),
      ShippingAddressValidation.create,
      handleValidation,
      ShippingAddressController.create
    )

  // Actualizar dirección concreta (opcional, si lo usas)
  app.route('/shippingAddresses/:shippingAddressId')
    .put(
      isLoggedIn,
      hasRole('customer'),
      checkEntityExists(ShippingAddress, 'shippingAddressId'),
      checkShippingAddressOwnership,
      ShippingAddressController.update
    )
    .delete(
      isLoggedIn,
      hasRole('customer'),
      checkEntityExists(ShippingAddress, 'shippingAddressId'),
      checkShippingAddressOwnership,
      ShippingAddressController.destroy
    )

  // Marcar dirección como predeterminada
  app.route('/shippingAddresses/:shippingAddressId/default')
    .patch(
      isLoggedIn,
      hasRole('customer'),
      checkEntityExists(ShippingAddress, 'shippingAddressId'),
      checkShippingAddressOwnership,
      ShippingAddressController.markDefault
    )
}

export default loadShippingAddressRoutes
