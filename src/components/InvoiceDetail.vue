<script setup>
import { Icon } from '@iconify/vue'
import DeleteWarninig from './DeleteWarning.vue'
import db from '../firebase'
import { getDoc, doc, updateDoc } from 'firebase/firestore'
import { useRoute, useRouter } from 'vue-router'
import { ref, watch } from 'vue'
import { useInvoiceModal } from '../stores/invoiceModal'
import { storeToRefs } from 'pinia'
import { useNotification } from "@kyvg/vue3-notification";

const route = useRoute()
const router = useRouter()
const store = useInvoiceModal()
const { editInvoice, toggle, deleteInvoice } = store
const { toggleEdit, useWatch } = storeToRefs(store)
const paid = ref(null)
const openModal = ref(null)

const docRef = doc(db, 'invoices', route.params.invoiceId)

const currentInvoice = await getDoc(docRef)
const invoice = ref(null)
invoice.value = currentInvoice.data()

const editInvoiceFilds = () => {
  toggle()
  editInvoice()
  toggleEdit.value = true
  useWatch.value = false
}

// to return the value of useWatch so it can be watched
watch(useWatch,
  async () => {
    if (useWatch.value) {
      invoice.value = (await getDoc(docRef)).data()
    }
  }
)

const { notify } = useNotification()

const removeInvoice = () => {
  deleteInvoice(route.params.invoiceId)
  router.push({ name: 'Home' })
  notify({
    title: "Invoice has been deleted successfully",
  })
}

const markAsPaid = async () => {
  await updateDoc(doc(db, 'invoices', route.params.invoiceId), {
    invoicePaid: true,
    invoicePending: false,
  })
  paid.value = true
}

const markAsPending = async () => {
  await updateDoc(doc(db, 'invoices', route.params.invoiceId), {
    invoicePaid: false,
    invoicePending: true,
    invoiceDraft: false
  })
  paid.value = false
}

watch(paid, async () => {
  invoice.value = (await getDoc(docRef)).data()

})

const toggleDelete = () => {
  openModal.value = true
}
const closeModal = () => {
  openModal.value = false
}
</script>

<template>
  <div class="w-[80%] mx-auto">
    <RouterLink class="flex mb-8 items-center dark:text-white text-xs" :to="{ name: 'Home' }">
      <Icon icon="mdi:arrow-left-thin" class="mr-4 w-5 h-5 text-blue-600 dark:text-white" /> Go back
    </RouterLink>

    <!-- Header -->
    <div class="flex bg-white shadow-lg dark:bg-[#1e2139] rounded-3xl items-center text-xs py-6 px-8">
      <div class="left flex items-center">
        <span class="dark:text-[#dfe3fa] mr-4">Status</span>
        <div class="status-button flex items-center space-x-2 rounded-full py-2 px-3"
          :class="{ 'before:bg-[#ff8f00] text-[#ff7b00] dark:text-[#ff8f00] bg-normal-bg dark:bg-paid-d-bg': invoice.invoicePaid, 'before:bg-[#33d69f] text-[#049953] dark:text-[#33d69f] bg-normal-bg dark:bg-pending-d-bg': invoice.invoicePending, 'before:bg-[#dfe3fa] dark:text-[#dfe3fa] bg-normal-bg dark:bg-draft-d-bg': invoice.invoiceDraft, }">
          <Icon icon="carbon:dot-mark" />
          <span v-if="invoice.invoicePaid">paid</span>
          <span v-if="invoice.invoicePending">pending</span>
          <span v-if="invoice.invoiceDraft">draft</span>
        </div>
      </div>
      <div class="flex flex-1 justify-end space-x-2">
        <button @click="editInvoiceFilds" class="bg-purple-900 text-white rounded-full py-3 px-4">
          Edit
        </button>
        <button @click="toggleDelete()" class="bg-red-800 text-white rounded-full py-3 px-4">
          Delete
        </button>
        <button v-if="invoice.invoicePending" class="bg-green-800 text-white rounded-full py-3 px-4"
          @click="markAsPaid(invoice.id)">
          Mark as Paid
        </button>
        <button v-if="invoice.invoiceDraft || invoice.invoicePaid" @click="markAsPending(invoice.id)"
          class="bg-yellow-800 text-white rounded-full py-3 px-4">
          Mark as Pending
        </button>
      </div>
    </div>
    <!-- Modal -->
    <div>
      <DeleteWarninig @close-modal="closeModal" @remove-invoice="removeInvoice" :open-modal="openModal" />
      <div v-if="invoice" class="invoice-view w-[80%] mx-auto">
      </div>

      <!-- Details -->
      <div class="flex bg-white shadow-lg dark:bg-[#1e2139] rounded-3xl flex-col p-12 mt-6">
        <div class="text-[#000] dark:text-[#dfe3fa] flex justify-between top">
          <div class="left text-[#000] dark:text-[#dfe3fa] flex text-xs flex-col">
            <p class=""><span class="text-[#565b77] dark:text-[#888eb0]">#</span> {{ invoice.invoiceId }}</p>
            <p class="pt-2 text-black dark:text-[#dfe3fa]">{{ invoice.productDescription }}</p>
          </div>

          <div class="right text-[#5c5f72] dark:text-[#dfe3fa] flex flex-col items-end text-xs space-y-1">
            <p class="dark:text-white">{{ invoice.billerStreetAddress }}</p>
            <p>{{ invoice.billerCity }}</p>
            <p>{{ invoice.billerZipCode }}</p>
            <p class="text-white">{{ invoice.id }}</p>
          </div>
        </div>

        <div class="middle flex mt-[50px] dark:text-[#dfe3fa] gap-4">
          <div class="payment flex flex-col flex-1">
            <h4 class="text-xs font-normal mb-4 text-[#4e515f] dark:text-[#dfe3fa]">Invoice Date</h4>
            <p class="text-[16px] font-semibold">{{ invoice.invoiceDate }}</p>

            <h4 class="text-xs font-normal mb-4 text-[#4e515f] dark:text-[#dfe3fa]">Payment Due Date</h4>
            <p class="text-[16px] font-semibold">{{ invoice.paymentDueDate }}</p>
          </div>

          <div class="bill flex flex-col flex-1 space-y-1">
            <h4 class="text-xs font-normal mb-4 text-[#4e515f] dark:text-[#dfe3fa]">Bill To</h4>
            <p class="text-xs ">{{ invoice.clientName }}</p>
            <p class="text-xs text-[#4e515f] dark:text-[#dfe3fa]">{{ invoice.clientStreetAddress }}</p>
            <p class="text-xs text-[#4e515f] dark:text-[#dfe3fa]">{{ invoice.clientCity }}</p>
            <p class="text-xs text-[#4e515f] dark:text-[#dfe3fa]">{{ invoice.clientZipCode }}</p>
            <p class="text-xs text-[#4e515f] dark:text-[#dfe3fa]">{{ invoice.clientCountry }}</p>
          </div>

          <div class="flex flex-col flex-[2]">
            <h4 class="text-xs font-normal mb-4 text-[#4e515f] dark:text-[#dfe3fa]">Send To</h4>
            <p>{{ invoice.clientEmail }}</p>
          </div>
        </div>

        <div class="flex flex-col mt-12">
          <div class="p-8 rounded-bd-r bg-[#dbd9e9] dark:bg-[#251945]">
            <div class="text-[#6e7285] dark:text-[#dfe3fa] flex text-xs mb-8 headings">
              <p class="flex-1 text-right">Item Name</p>
              <p class="flex-1 text-right">QTY</p>
              <p class="flex-1 text-right">Price</p>
              <p class="flex-1 text-right">Total</p>
            </div>
            <div v-for="(item, index) in invoice.invoiceItemList" :key="index"
              class="text-[13px] mb-8 text-white flex item">
              <p class="flex-1 text-right text-[#15161b] dark:text-white">{{ item.itemName }}</p>
              <p class="flex-1 text-right text-[#6d738f] dark:text-white">{{ item.qty }}</p>
              <p class="flex-1 text-right text-[#767fa3] dark:text-white">{{ item.price }}</p>
              <p class="flex-1 text-right text-[#15161b] dark:text-white">{{ item.total }}</p>
            </div>

            <div class="flex p-8 text-white bg-totalPrice-bg items-center rounded-bd-t total">
              <h4>Amount Due</h4>
              <p class="flex-1 text-xs">${{ invoice.invoiceTotal }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.top .left p:first-child {
  font-size: 24px;
  text-transform: uppercase;
  /* color: #fff; */
  margin-bottom: 8px;
}

.top .left p:nth-child(2) {
  font-size: 16px;
  text-transform: uppercase;
  /* color: #fff; */
  margin-bottom: 8px;
}

.payment h4:nth-child(3) {
  margin-top: 32px;
}

.bill p:nth-child(2) {
  font-size: 16px;
}

.bill p:nth-child(3) {
  margin-top: auto;
}

.headings p:first-child {
  flex: 3;
  text-align: left;
}

.item:last-child {
  margin-bottom: 0;
}

.item p:first-child {
  flex: 3;
  text-align: left;
}

.total p:nth-child(2) {
  font-size: 28px;
  text-align: right;
}
</style>
