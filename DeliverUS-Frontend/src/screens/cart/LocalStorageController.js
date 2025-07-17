const DB = 'cart'

/*
{
  "items": [
    {
    "id":1,
    "quantity":1
  }
  ],
  "restaurantID": 1
}
*/

export function initializeDB (id) {
  localStorage.setItem(DB, `{
    "items": [],
    "restaurantID": ${id}
  }`)
}

export function getCart () {
  return localStorage.getItem(DB)
}

export function addItem (id, times = 1) {
  const cart = JSON.parse(localStorage.getItem(DB))
  const isProductInCart = cart.items.some(item => item.id === id)

  if (isProductInCart) {
    for (let i = 0; i < cart.items.length; i++) {
      if (cart.items[i].id === id) {
        cart.items[i].quantity += times
        localStorage.setItem(DB, JSON.stringify(cart))
        break
      }
    }
  } else {
    const add = {
      id: id,
      quantity: times
    }
    cart.items.push(add)
    localStorage.setItem(DB, JSON.stringify(cart))
  }
}

export function removeItem (id) {
  const cart = JSON.parse(localStorage.getItem(DB))
  const isProductInCart = cart.items.some(item => item.id === id)

  if (isProductInCart) {
    for (let i = 0; i < cart.items.length; i++) {
      if (cart.items[i].id === id) {
        cart.items[i].quantity -= 1
        if (cart.items[i].quantity <= 0) {
          cart.items.splice(i, 1)
        }
        localStorage.setItem(DB, JSON.stringify(cart))
        break
      }
    }
  }
}
