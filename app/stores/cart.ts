import { defineStore } from 'pinia'
import type { ShopifyCart } from '~/types/shopify'

export const useCartStore = defineStore('cart', () => {
  const cartApi = useCart()

  const cart = ref<ShopifyCart | null>(null)
  const cartId = ref<string | null>(null)
  const isUpdating = ref(false)

  const totalQuantity = computed(() => cart.value?.totalQuantity ?? 0)
  const checkoutUrl = computed(() => cart.value?.checkoutUrl ?? null)
  const lines = computed(() => cart.value?.lines.nodes ?? [])
  const itemCount = computed(() => lines.value.reduce((sum, l) => sum + l.quantity, 0))

  let initialised = false

  async function syncCartId() {
    try {
      const data = await $fetch<{ cartId: string | null }>('/api/cart-id')
      cartId.value = data.cartId
    } catch (e) {
      console.error('[cart] syncCartId failed:', e)
      cartId.value = null
    }
  }

  async function persistCartId(id: string | null) {
    try {
      await $fetch('/api/cart-id', { method: 'POST', body: { cartId: id } })
    } catch (e) {
      console.error('[cart] persistCartId failed:', e)
    }
  }

  async function setCart(updatedCart: ShopifyCart | null) {
    if (!updatedCart) {
      cart.value = null
      cartId.value = null
      await persistCartId(null)
      return
    }
    cart.value = updatedCart
    cartId.value = updatedCart.id
    await persistCartId(updatedCart.id)
  }

  async function ensureInitialised() {
    if (initialised) return
    initialised = true
    await syncCartId()
    if (cartId.value) {
      const result = await cartApi.fetchCart(cartId.value)
      if (!result) {
        cartId.value = null
        await persistCartId(null)
      }
      cart.value = result
    }
  }

  async function fetchCart() {
    await ensureInitialised()
    if (!cartId.value) return null

    const result = await cartApi.fetchCart(cartId.value)
    if (!result) {
      cartId.value = null
      await persistCartId(null)
    }
    cart.value = result
    return result
  }

  async function createCart(variantId?: string, quantity = 1) {
    isUpdating.value = true
    const result = await cartApi.createCart(variantId, quantity)
    await setCart(result)
    isUpdating.value = false
    return cart.value
  }

  async function addToCart(variantId: string, quantity = 1) {
    await ensureInitialised()
    isUpdating.value = true

    if (!cartId.value) {
      await createCart(variantId, quantity)
      isUpdating.value = false
      return cart.value
    }

    const result = await cartApi.addToCart(cartId.value, variantId, quantity)
    await setCart(result)
    isUpdating.value = false
    return cart.value
  }

  async function updateCartLine(lineId: string, quantity: number) {
    await ensureInitialised()
    if (!cartId.value) return
    if (quantity <= 0) return removeFromCart(lineId)

    isUpdating.value = true
    const result = await cartApi.updateCartLine(cartId.value, lineId, quantity)
    await setCart(result)
    isUpdating.value = false
    return cart.value
  }

  async function removeFromCart(lineId: string) {
    await ensureInitialised()
    if (!cartId.value) return

    isUpdating.value = true
    const result = await cartApi.removeFromCart(cartId.value, lineId)
    await setCart(result)
    isUpdating.value = false
    return cart.value
  }

  async function clearCart() {
    cart.value = null
    cartId.value = null
    await persistCartId(null)
  }

  return {
    cart,
    isUpdating,
    cartId,
    totalQuantity,
    checkoutUrl,
    lines,
    itemCount,
    fetchCart,
    createCart,
    addToCart,
    updateCartLine,
    removeFromCart,
    clearCart,
  }
})
