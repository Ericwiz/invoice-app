<script setup>
import { onMounted, ref } from 'vue';
import TheNavigation from './components/TheNavigation.vue';
import InvoiceModal from './components/InvoiceModal.vue';
import WarningModal from './components/WarningModal.vue';
import { useInvoiceModal } from './stores/invoiceModal';
import { storeToRefs } from 'pinia';

const store = useInvoiceModal()
const invoices = ref([])

const { invoiceModal, modalActive } = storeToRefs(store)

const mobile = ref(null)

const checkScreen = () => {
  const windowWidth = window.innerWidth

  if (windowWidth <= 750) {
    mobile.value = true
    return
  }
  mobile.value = false
}

onMounted(() => {
  checkScreen()
  window.addEventListener('resize', checkScreen)
  console.log(invoices.value)
})
</script>

<template>
  <notifications position="top center" />
  <div class="flex bg-[#dfe3e9] dark:bg-[#00031f] min-h-screen flex-col lg:flex-row" v-if="mobile === false">
    <TheNavigation />
    <div class="flex flex-col px-0 flex-1 relative">
      <WarningModal v-if="modalActive" />
      <Transition name="invoiceModal">
        <InvoiceModal v-if="invoiceModal" />
      </Transition>
      <RouterView />
    </div>
  </div>

  <div v-else class="flex flex-col items-center text-center justify-center h-screen bg-[#00031f] text-white">
    <h1 class="text-2xl pb-3">Sorry, this app is not on mobile yet!</h1>
    <p class="mt-6 text-sm">To use this app, please upgrade to tablet or desktop.</p>
  </div>
</template>

<style scoped>
.invoiceModal-enter-active {
  transition: opacity .3s ease;
}

.invoiceModal-leave-active {
  transition: opacity .3s ease;
}

.invoiceModal-leave-to {
  opacity: 0;
}

.invoiceModal-enter-from {
  opacity: 0;
}</style>