<script setup>
import TheHome from '../components/TheHome.vue'
</script>

<template>
  <main>

    <Suspense>
      <template #default>
        <TheHome />
      </template>

      <template #fallback>
        <div class="text-white text-3xl underline uppercase">
          looaddddinnnnng
        </div>
      </template>
    </Suspense>
  </main>
</template>
