<template>
  <section class="py-16">
    <div class="mx-auto max-w-6xl px-6 lg:px-7">
      <NuxtLink to="/" class="inline-flex items-center gap-1 text-sm font-roboto text-slate-400 hover:text-slate-900 transition-colors mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back
      </NuxtLink>

      <div v-if="error" class="text-center py-16 font-roboto text-slate-400">
        Product not found.
      </div>

      <div v-else-if="!product" class="text-center py-16 font-roboto text-slate-400">
        Loading…
      </div>

      <div v-else class="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        <div class="space-y-3">
          <div class="aspect-square overflow-hidden rounded-2xl bg-slate-100">
            <img
              v-if="activeImage"
              :src="activeImage.url"
              :alt="activeImage.altText || product.title"
              class="h-full w-full object-cover"
            />
            <div v-else class="flex h-full items-center justify-center text-slate-300 text-sm font-roboto">
              No image
            </div>
          </div>

          <div v-if="product.images.nodes.length > 1" class="grid grid-cols-4 gap-2">
            <button
              v-for="(img, i) in product.images.nodes"
              :key="img.url"
              type="button"
              class="aspect-square overflow-hidden rounded-lg bg-slate-100 ring-1 transition-all"
              :class="activeImageIndex === i ? 'ring-slate-900 ring-offset-2' : 'ring-slate-200 hover:ring-slate-400'"
              @click="activeImageIndex = i"
            >
              <img :src="img.url" :alt="img.altText || product.title" class="h-full w-full object-cover" />
            </button>
          </div>
        </div>

        <div class="flex flex-col gap-6 lg:pt-8">
          <div>
            <h1 class="font-roboto text-3xl text-slate-900 leading-snug">{{ product.title }}</h1>
            <p class="mt-3 font-roboto text-xl text-slate-700">
              <template v-if="selectedVariant">
                {{ formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode) }}
                <span
                  v-if="selectedVariant.compareAtPrice && Number(selectedVariant.compareAtPrice.amount) > Number(selectedVariant.price.amount)"
                  class="ml-2 text-base text-slate-400 line-through"
                >
                  {{ formatPrice(selectedVariant.compareAtPrice.amount, selectedVariant.compareAtPrice.currencyCode) }}
                </span>
              </template>
            </p>
          </div>

          <div
            v-for="optionName in variantOptionNames"
            :key="optionName"
            class="space-y-3"
          >
            <p class="font-roboto text-sm text-slate-500">{{ optionName }}</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="value in variantOptionValues(optionName)"
                :key="value"
                type="button"
                class="rounded-full border px-5 py-2 text-sm font-roboto transition-colors"
                :class="selectedOptions[optionName] === value
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-300 text-slate-600 hover:border-slate-500'"
                @click="selectOption(optionName, value)"
              >
                {{ value }}
              </button>
            </div>
          </div>

          <div v-if="product.description" class="font-roboto text-sm text-slate-600 leading-relaxed border-t border-slate-200 pt-6">
            {{ product.description }}
          </div>

          <button
            type="button"
            :disabled="!selectedVariant?.availableForSale || isAddingToCart"
            class="w-full rounded-full bg-slate-900 py-3.5 text-sm font-roboto text-white transition-colors hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
            @click="addToCart"
          >
            <span v-if="isAddingToCart">Adding…</span>
            <span v-else-if="!selectedVariant?.availableForSale">Sold Out</span>
            <span v-else>Add to Cart</span>
          </button>

          <p v-if="showAddedConfirmation" class="text-center font-roboto text-sm text-slate-500">
            Added to cart —
            <NuxtLink to="/cart" class="font-medium underline hover:text-slate-900">view cart</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ShopifyVariant } from '~/types/shopify'

definePageMeta({ layout: 'shop' })

const route = useRoute()
const { getProductByHandle } = useProducts()
const cartStore = useCartStore()

const { data, error } = await useAsyncData(
  `product-${route.params.handle}`,
  () => getProductByHandle(route.params.handle as string),
)

const product = computed(() => data.value?.productByHandle ?? null)

const activeImageIndex = ref(0)
const activeImage = computed(() => product.value?.images.nodes[activeImageIndex.value] ?? product.value?.featuredImage ?? null)

const selectedOptions = ref<Record<string, string>>({})
const isAddingToCart = ref(false)
const showAddedConfirmation = ref(false)

watch(product, (p) => {
  if (!p) return
  const first = p.variants.nodes[0]
  if (first) {
    for (const opt of first.selectedOptions) {
      selectedOptions.value[opt.name] = opt.value
    }
  }
}, { immediate: true })

const variantOptionNames = computed(() => {
  if (!product.value) return []
  const names = new Set<string>()
  for (const v of product.value.variants.nodes) {
    for (const o of v.selectedOptions) names.add(o.name)
  }
  return [...names]
})

function variantOptionValues(optionName: string): string[] {
  if (!product.value) return []
  const seen = new Set<string>()
  for (const v of product.value.variants.nodes) {
    const opt = v.selectedOptions.find((o) => o.name === optionName)
    if (opt) seen.add(opt.value)
  }
  return [...seen]
}

function selectOption(name: string, value: string) {
  selectedOptions.value = { ...selectedOptions.value, [name]: value }
}

const selectedVariant = computed<ShopifyVariant | null>(() => {
  if (!product.value) return null
  const match = product.value.variants.nodes.find((v) =>
    v.selectedOptions.every((o) => selectedOptions.value[o.name] === o.value),
  )
  return match ?? product.value.variants.nodes[0] ?? null
})

function formatPrice(amount: string, currency: string) {
  const symbol = currency === 'GBP' ? '£' : currency === 'USD' ? '$' : currency + ' '
  return symbol + Number(amount).toFixed(2)
}

async function addToCart() {
  if (!selectedVariant.value) return
  isAddingToCart.value = true
  await cartStore.addToCart(selectedVariant.value.id, 1)
  isAddingToCart.value = false
  showAddedConfirmation.value = true
  setTimeout(() => { showAddedConfirmation.value = false }, 4000)
}

useSeoMeta({
  title: computed(() => product.value ? `${product.value.title} — Shopify Store` : 'Product — Shopify Store'),
  description: computed(() => product.value?.description ?? ''),
})
</script>
