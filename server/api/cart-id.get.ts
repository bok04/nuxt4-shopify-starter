import { getCookie } from 'h3'

export default defineEventHandler((event) => {
  const cartId = getCookie(event, 'shopify_cart_id')
  return { cartId: cartId || null }
})
