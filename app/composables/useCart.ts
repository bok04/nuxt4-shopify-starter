import type { ShopifyCart } from '~/types/shopify'

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      totalAmount { amount currencyCode }
      subtotalAmount { amount currencyCode }
      totalTaxAmount { amount currencyCode }
      totalDutyAmount { amount currencyCode }
    }
    lines(first: 50) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            product {
              id
              handle
              title
            }
            image {
              url
              altText
              width
              height
            }
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
            selectedOptions { name value }
          }
        }
        cost {
          totalAmount { amount currencyCode }
          subtotalAmount { amount currencyCode }
        }
      }
    }
    note
    attributes { key value }
  }
`

export const useCart = () => {
  const { sendQuery } = useShopify()

  async function fetchCart(cartId: string) {
    const gql = `
      ${CART_FRAGMENT}
      query Cart($cartId: ID!) {
        cart(id: $cartId) {
          ...CartFields
        }
      }
    `
    const result = await sendQuery<{ cart: ShopifyCart | null }>(gql, { cartId })
    return result.cart
  }

  async function createCart(variantId?: string, quantity = 1) {
    const input: Record<string, unknown> = variantId
      ? { lines: [{ merchandiseId: variantId, quantity }] }
      : {}

    const gql = `
      ${CART_FRAGMENT}
      mutation CartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart { ...CartFields }
          userErrors { field message }
        }
      }
    `
    const result = await sendQuery<{
      cartCreate: { cart: ShopifyCart | null; userErrors: { field: string; message: string }[] }
    }>(gql, { input })

    if (result.cartCreate.userErrors.length) {
      console.error('Cart create errors:', result.cartCreate.userErrors)
    }

    return result.cartCreate.cart
  }

  async function addToCart(cartId: string, variantId: string, quantity = 1) {
    const gql = `
      ${CART_FRAGMENT}
      mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart { ...CartFields }
          userErrors { field message }
        }
      }
    `
    const result = await sendQuery<{
      cartLinesAdd: { cart: ShopifyCart | null; userErrors: { field: string; message: string }[] }
    }>(gql, { cartId, lines: [{ merchandiseId: variantId, quantity }] })

    if (result.cartLinesAdd.userErrors.length) {
      console.error('Cart add errors:', result.cartLinesAdd.userErrors)
    }

    return result.cartLinesAdd.cart
  }

  async function updateCartLine(cartId: string, lineId: string, quantity: number) {
    const gql = `
      ${CART_FRAGMENT}
      mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart { ...CartFields }
          userErrors { field message }
        }
      }
    `
    const result = await sendQuery<{
      cartLinesUpdate: { cart: ShopifyCart | null; userErrors: { field: string; message: string }[] }
    }>(gql, { cartId, lines: [{ id: lineId, quantity }] })

    if (result.cartLinesUpdate.userErrors.length) {
      console.error('Cart update errors:', result.cartLinesUpdate.userErrors)
    }

    return result.cartLinesUpdate.cart
  }

  async function removeFromCart(cartId: string, lineId: string) {
    const gql = `
      ${CART_FRAGMENT}
      mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart { ...CartFields }
          userErrors { field message }
        }
      }
    `
    const result = await sendQuery<{
      cartLinesRemove: { cart: ShopifyCart | null; userErrors: { field: string; message: string }[] }
    }>(gql, { cartId, lineIds: [lineId] })

    if (result.cartLinesRemove.userErrors.length) {
      console.error('Cart remove errors:', result.cartLinesRemove.userErrors)
    }

    return result.cartLinesRemove.cart
  }

  return {
    fetchCart,
    createCart,
    addToCart,
    updateCartLine,
    removeFromCart,
  }
}
