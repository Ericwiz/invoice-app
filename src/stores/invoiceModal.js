import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useInvoiceModal = defineStore('invoice-modal', () => {
  const invoiceModal = ref(null)
  // const doubleCount = computed(() => count.value * 2)
  function toggle() {
    invoiceModal.value = ! invoiceModal.value
  }

  return { invoiceModal, toggle }
})
