<script setup>
import { Icon } from "@iconify/vue";
import { computed, ref } from "vue";
import { useInvoiceModal } from '../stores/invoiceModal'
import InvoiceCard from "./InvoiceCard.vue";
import { storeToRefs } from "pinia";

const store = useInvoiceModal()
const paid= ref('')

const { toggle } = (store)
const { invoicesData } = storeToRefs(store)

const newInvoice = () => toggle()

const totalInvoice = computed(() => {
    return invoicesData.value.length
})

// filter paid
const filterInvoice = computed(() => {
    return invoicesData.value.filter(invoice => {
        if(paid.value === 'paid') {
            return invoice.invoicePaid
        } else if (paid.value === 'pending') {
            return invoice.invoicePending
        }else if (paid.value === 'draft') {
            return invoice.invoiceDraft
        }
        return invoicesData.value
    })
})
</script>

<template>
    <div class="home text-white w-[80%] mx-auto">
        <div class="flex mb-16 items-center">
            <div class="flex-1 flex flex-col space-y-5">
                <h1 class="text-5xl font-serif font-bold">Invoices</h1>
                <span class="font-serif text-lg font-bold">There are {{ totalInvoice }} total invoices</span>
            </div>

            <div class="flex-1 flex justify-end space-x-36 items-center">
                <select v-model="paid"   class="w-44 cursor-pointer text-lg bg-[#1e2139] shadow-md">
                    <option disabled value="" class="text-xs">Filter by Status</option>
                    <option  value="pending"  class="cursor-pointer text-sm hover:bg-white hover:text-[#1e2139]">Pending</option>
                    <option value="paid"  class="cursor-pointer text-sm hover:bg-white hover:text-[#1e2139]">Paid</option>
                    <option value="draft"  class="cursor-pointer text-sm hover:bg-white hover:text-[#1e2139]">Draft</option>
                    <option v-if="paid.length > 0" value="all"  class="cursor-pointer text-sm hover:bg-white hover:text-[#1e2139]">Clear Filter</option>
                </select>
                <div @click="newInvoice()" class="px-2 py-1 rounded-3xl bg-[#7c5dfa] cursor-pointer flex items-center">
                    <div class="inner-button mr-2 px-1 py-1 rounded-3xl items-center justify-center bg-white flex">
                        <Icon icon="ph:plus-fill" class="text-purple-600 h-6 w-6" />
                    </div>
                    <span class="text-xs">New Invoice</span>
                </div>
            </div>
        </div>
        <div v-if="invoicesData.length > 0">
            <InvoiceCard v-for="(invoice, index) in filterInvoice" :key="index" :invoice="invoice"/>
        </div>
        <div v-else class="flex flex-col mt-36 items-center">
            <img class="w-[214px] h-[200px]" src="../assets/undraw_printing_invoices_-5-r4r.svg" alt="empty page svg">
            <h3 class="text-lg mt-8">You have not created any invoice yet!</h3>
            <p class="text-center max-w-[224px] text-xs mt-4">Click the New Invoice button to create a new invoice!</p>
        </div>
    </div>
</template>
