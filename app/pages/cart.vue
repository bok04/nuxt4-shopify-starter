<template>
  <section class="py-16">
    <div class="mx-auto max-w-6xl px-6 lg:px-7">
      <div class="mx-auto max-w-3xl">
        <h1 class="font-roboto text-2xl text-slate-900 mb-12">Cart</h1>

        <ClientOnly>
          <template #fallback>
            <div class="space-y-4">
              <div v-for="i in 2" :key="i" class="flex gap-4 p-4 border-b border-slate-200">
                <div class="h-24 w-24 shrink-0 rounded-lg bg-slate-200 animate-pulse" />
                <div class="flex flex-1 flex-col justify-between gap-3 py-1">
                  <div class="space-y-2">
                    <div class="h-3.5 w-2/3 rounded bg-slate-200 animate-pulse" />
                    <div class="h-3 w-1/3 rounded bg-slate-200 animate-pulse" />
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="h-7 w-24 rounded bg-slate-200 animate-pulse" />
                    <div class="h-3.5 w-12 rounded bg-slate-200 animate-pulse" />
                  </div>
                </div>
              </div>
              <div class="border-t border-slate-200 pt-6 space-y-3">
                <div class="flex justify-between">
                  <div class="h-3.5 w-16 rounded bg-slate-200 animate-pulse" />
                  <div class="h-3.5 w-20 rounded bg-slate-200 animate-pulse" />
                </div>
                <div class="h-12 w-full rounded-lg bg-slate-900 animate-pulse" />
              </div>
            </div>
          </template>

          <div v-if="!cartStore.lines.length" class="text-center py-16">
            <p class="font-roboto text-slate-500 mb-6">Your cart is empty.</p>
            <NuxtLink to="/" class="inline-block rounded-full bg-slate-900 px-8 py-3 text-sm font-roboto text-white transition-colors hover:bg-slate-800">
              Browse Products
            </NuxtLink>
          </div>

          <div v-else class="divide-y divide-slate-200">
            <div v-for="line in cartStore.lines" :key="line.id" class="flex gap-4 py-6">
              <div class="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                <img
                  v-if="line.merchandise.image"
                  :src="line.merchandise.image.url"
                  :alt="line.merchandise.image.altText || line.merchandise.title"
                  class="h-full w-full object-cover"
                />
                <div v-else class="flex h-full items-center justify-center text-slate-300 text-xs font-roboto">
                  No image
                </div>
              </div>

              <div class="flex flex-1 flex-col justify-between gap-2 min-w-0">
                <div>
                  <p class="font-roboto text-sm font-medium text-slate-900">{{ line.merchandise.product.title }}</p>
                  <p v-if="line.merchandise.title !== 'Default Title'" class="font-roboto text-xs text-slate-500 mt-0.5">
                    {{ line.merchandise.title }}
                  </p>
                </div>

                <div class="flex items-center justify-between gap-4">
                  <div class="flex items-center border border-slate-300 rounded-full overflow-hidden">
                    <button
                      type="button"
                      class="px-3 py-1 text-sm font-roboto text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-30"
                      :disabled="line.quantity <= 1 || cartStore.isUpdating"
                      @click="cartStore.updateCartLine(line.id, line.quantity - 1)"
                    >
                      −
                    </button>
                    <span class="px-3 py-1 text-sm font-roboto text-slate-900 tabular-nums min-w-[2rem] text-center">{{ line.quantity }}</span>
                    <button
                      type="button"
                      class="px-3 py-1 text-sm font-roboto text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-30"
                      :disabled="cartStore.isUpdating"
                      @click="cartStore.updateCartLine(line.id, line.quantity + 1)"
                    >
                      +
                    </button>
                  </div>

                  <div class="flex items-center gap-4">
                    <p class="font-roboto text-sm text-slate-900 tabular-nums whitespace-nowrap">
                      {{ formatPrice(line.cost.totalAmount.amount, line.cost.totalAmount.currencyCode) }}
                    </p>
                    <button
                      type="button"
                      class="text-slate-300 hover:text-slate-500 transition-colors"
                      :disabled="cartStore.isUpdating"
                      @click="cartStore.removeFromCart(line.id)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-6 space-y-4">
              <div class="flex justify-between font-roboto text-sm">
                <span class="text-slate-500">Subtotal</span>
                <span class="text-slate-900 tabular-nums font-medium">
                  {{ formatPrice(cartStore.cart!.cost.subtotalAmount.amount, cartStore.cart!.cost.subtotalAmount.currencyCode) }}
                </span>
              </div>

              <a
                :href="checkoutUrl"
                class="block w-full rounded-full bg-slate-900 py-3.5 text-center text-sm font-roboto text-white transition-colors hover:bg-slate-800"
              >
                Checkout
              </a>
            </div>
          </div>
        </ClientOnly>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'shop' })

const cartStore = useCartStore()
const config = useRuntimeConfig()

const checkoutUrl = computed(() => {
  const base = cartStore.checkoutUrl
  if (!base) return undefined
  const returnTo = `${config.public.siteUrl}/`
  return `${base}?return_to=${encodeURIComponent(returnTo)}`
})

function formatPrice(amount: string, currency: string) {
  const symbol = currency === 'GBP' ? '£' : currency === 'USD' ? '$' : currency + ' '
  return symbol + Number(amount).toFixed(2)
}
</script>
