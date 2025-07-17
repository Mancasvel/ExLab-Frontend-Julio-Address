import { check } from 'express-validator'

const create = [
  check('alias')
    .exists().withMessage('Alias is required')
    .isString().withMessage('Alias must be a string')
    .trim(),
  check('street')
    .exists().withMessage('Street is required')
    .isString().withMessage('Street must be a string')
    .trim(),
  check('city')
    .exists().withMessage('City is required')
    .isString().withMessage('City must be a string')
    .trim(),
  check('zipCode')
    .exists().withMessage('Zip code is required')
    .isString().withMessage('Zip code must be a string')
    .trim(),
  check('province')
    .exists().withMessage('Province is required')
    .isString().withMessage('Province must be a string')
    .trim(),
  check('isDefault')
    .optional()
    .isBoolean().withMessage('isDefault must be true or false')
    .toBoolean()
]

const update = [
  check('isDefault')
    .exists().withMessage('isDefault is required')
    .isBoolean().withMessage('isDefault must be true or false')
    .toBoolean()
]

export { create, update }
