import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import db from '../firebase'
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore'

export const useInvoiceModal = defineStore('invoice-modal', () => {
  const invoiceModal = ref(null)
  const modalActive = ref(null)
  const invoicesData = ref([])
  const toggleEdit = ref(false)
  const modalState = ref('')
  const useWatch = ref(null)

  onSnapshot(collection(db, 'invoices'), (snapshot) => {
    invoicesData.value = []
    snapshot.forEach((doc) => {
      invoicesData.value.push({ id: doc.id, ...doc.data() })
    })
  })

  const modalStateText = computed(() => {
    return toggleEdit.value === true
      ? (modalState.value = 'Edit Invoice')
      : (modalState.value = 'New Invoice')
  })

  function toggle() {
    invoiceModal.value = !invoiceModal.value
  }

  function toggleWarningModal() {
    modalActive.value = !modalActive.value
  }

  function editInvoice() {
    toggleEdit.value = !toggleEdit.value
  }

  async function deleteInvoice(id) {
    await deleteDoc(doc(db, 'invoices', id))
  }

   

  return {
    invoiceModal,
    modalActive,
    toggle,
    toggleWarningModal,
    editInvoice,
    invoicesData,
    toggleEdit,
    modalStateText,
    useWatch,
    deleteInvoice
  }
})
