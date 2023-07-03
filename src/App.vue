<script setup>
import { onMounted, ref } from 'vue';
import TheNavigation from './components/TheNavigation.vue';

const mobile = ref(null)
const checkScreen = () => {
  const windowWidth = window.innerWidth

  if(windowWidth <= 750) {
    mobile.value = true
    return
  }
  mobile.value = false
}

onMounted(() => {
  checkScreen()
  window.addEventListener('resize', checkScreen)
})
</script>

<template>
  <div class="flex bg-[#00031f] min-h-screen flex-col lg:flex-row" v-if="mobile === false">
    <TheNavigation />
    <div class="flex flex-col px-0 py-5 flex-1 relative">
      <RouterView />
    </div>
  </div>

  <div v-else class="flex flex-col items-center text-center justify-center h-screen bg-[#00031f] text-white">
    <h1 class="text-2xl pb-3">Sorry, this app is not on mobile yet!</h1>
    <p class="mt-6 text-sm">To use this app, please upgrade to tablet or desktop.</p>
  </div>
</template>
