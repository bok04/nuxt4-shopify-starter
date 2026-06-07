import { setCookie, getRequestProtocol } from 'h3'

export default defineEventHandler(async (event) => {
  const { cartId } = await readBody(event)

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

  return { success: true }
})
