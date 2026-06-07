<template>
  <div class="border border-slate-200 rounded-xl shadow-sm overflow-hidden">
    <NuxtLink :to="`/product/${product.handle}`" class="aspect-square overflow-hidden bg-slate-50 block">
      <img
        v-if="product.featuredImage"
        :src="product.featuredImage.url"
        :alt="product.featuredImage.altText || product.title"
        class="h-full w-full object-cover transition-opacity duration-300 hover:opacity-80"
        loading="lazy"
      />
      <div v-else class="flex h-full items-center justify-center text-slate-300 text-sm font-roboto">
        No image
      </div>
    </NuxtLink>

    <div class="p-5 space-y-2">
      <NuxtLink :to="`/product/${product.handle}`" class="font-roboto text-sm text-slate-900 leading-snug block">
        {{ product.title }}
      </NuxtLink>

      <p class="font-roboto text-sm text-slate-500">
        {{ formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode) }}
        <span v-if="product.priceRange.minVariantPrice.amount !== product.priceRange.maxVariantPrice.amount">
          – {{ formatPrice(product.priceRange.maxVariantPrice.amount, product.priceRange.maxVariantPrice.currencyCode) }}
        </span>
      </p>

      <NuxtLink
        :to="`/product/${product.handle}`"
        class="inline-block rounded-full bg-slate-900 px-5 py-2 text-xs font-roboto text-white transition-colors hover:bg-slate-800"
      >
        View Product
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ShopifyProduct } from '~/types/shopify'

defineProps<{
  product: ShopifyProduct
}>()

function formatPrice(amount: string, currency: string) {
  const symbol = currency === 'GBP' ? '£' : currency === 'USD' ? '$' : currency + ' '
  return symbol + Number(amount).toFixed(2)
}
</script>
