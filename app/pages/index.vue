<template>
  <section class="py-16">
    <div class="mx-auto max-w-6xl px-6 lg:px-7">
      <h1 class="font-roboto text-2xl text-slate-900 mb-12">Shop</h1>

      <div v-if="!products" class="text-center py-16 font-roboto text-slate-400">
        Loading…
      </div>

      <div v-else class="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
        <ShopProductCard v-for="product in products.products.nodes" :key="product.id" :product="product" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'shop' })

const { getAllProducts } = useProducts()

const { data: products } = await useAsyncData('shop-products', () => getAllProducts(50))
</script>
