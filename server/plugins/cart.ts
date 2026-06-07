import { getCookie, setCookie, getRequestProtocol } from 'h3'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', (event) => {
    const cartId = getCookie(event, 'shopify_cart_id')

    if (cartId) {
      setCookie(event, 'shopify_cart_id', cartId, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
        secure: getRequestProtocol(event) === 'https',
        httpOnly: true,
        sameSite: 'lax',
      })

      event.context.shopifyCartId = cartId
    }
  })
})
