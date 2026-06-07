<template>
  <div class="border-b border-slate-200">
    <div class="mx-auto max-w-6xl px-6 lg:px-7">
      <div class="flex justify-end py-4">
        <NuxtLink
          to="/cart"
          class="relative text-slate-400 hover:text-slate-900 transition-colors"
          aria-label="View cart"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <ClientOnly>
            <Transition name="badge">
              <span
                v-if="cartCount > 0"
                class="absolute -top-1.5 -right-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-white text-[10px] leading-none font-medium"
              >
                {{ cartCount > 9 ? '9+' : cartCount }}
              </span>
            </Transition>
          </ClientOnly>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const cartStore = useCartStore()
const cartCount = computed(() => cartStore.itemCount)

cartStore.fetchCart()
</script>

<style scoped>
.badge-enter-active,
.badge-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.badge-enter-from,
.badge-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>
