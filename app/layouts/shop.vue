<template>
  <ShopCartButton />
  <main class="min-h-screen isolate">
    <slot />
  </main>
</template>

<script setup lang="ts">
const cartStore = useCartStore()
await cartStore.fetchCart()
</script>
