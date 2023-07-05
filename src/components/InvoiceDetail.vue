<script setup>
import { Icon } from '@iconify/vue';
import db from '../firebase';
import { getDoc, doc } from 'firebase/firestore';
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { useInvoiceModal } from '../stores/invoiceModal';
defineProps(['invoiceId'])

const route = useRoute()
const store = useInvoiceModal()
const { editInvoice, toggle } = store

const docRef = doc(db, 'invoices', route.params.invoiceId);

const currentInvoice = await getDoc(docRef)

const invoice = computed(() => {
    return currentInvoice.data()
})

const editInvoiceFilds = () => {
    toggle()
    editInvoice()
}
</script>

<template>
    <div v-if="invoice" class="invoice-view w-[80%] mx-auto">
        <RouterLink class="flex mb-8 items-center text-white text-xs" :to="{ name: 'Home' }">
            <Icon icon="mdi:arrow-left-thin" class="mr-4 w-5 h-5"/> Go back
        </RouterLink>

        <!-- Header -->
        <div class="flex bg-[#1e2139] rounded-3xl items-center text-xs py-6 px-8">
            <div class="left flex items-center">
                <span class="text-[#dfe3fa] mr-4">Status</span>
                <div class="status-button flex items-center space-x-2 rounded-full py-2 px-3"
                    :class="{ 'before:bg-[#ff8f00] text-[#ff8f00] bg-paid-bg': invoice.invoicePaid, 'before:bg-[#33d69f] text-[#33d69f] bg-pending-bg': invoice.invoicePending, 'before:bg-[#dfe3fa] text-[#dfe3fa] bg-draft-bg': invoice.invoiceDraft, }">
                    <Icon icon="carbon:dot-mark" />
                    <span v-if="invoice.invoicePaid">paid</span>
                    <span v-if="invoice.invoicePending">pending</span>
                    <span v-if="invoice.invoiceDraft">draft</span>
                </div>
            </div>
            <div class="flex flex-1 justify-end space-x-2">
                <button @click="editInvoiceFilds" class="bg-purple-900 text-white rounded-full py-3 px-4">Edit</button>
                <button @click="deleteInvoice(invoice.id)" class="bg-red-800 text-white rounded-full py-3 px-4">Delete</button>
                <button v-if="invoice.invoicePending" class="bg-green-800 text-white rounded-full py-3 px-4" @click="markAsPaid(invoice.id)">Mark as Paid</button>
                <button v-if="invoice.invoiceDraft || invoice.invoicePaid" @click="markAsPending(invoice.id)" class="bg-yellow-800 text-white rounded-full py-3 px-4">Mark as Pending</button>
            </div>
        </div>

        <!-- Details -->
        <div class="flex bg-[#1e2139] rounded-3xl flex-col p-12 mt-6">
            <div class="text-[#dfe3fa] flex justify-between top">
                <div class="left text-[#dfe3fa] flex text-xs flex-col">
                    <p >
                        <span class="text-[#888eb0]">#</span> {{ invoice.invoiceId }}
                    </p>
                    <p class="pt-2">{{ invoice.productDescription }}</p>
                </div>

                <div class="right text-[#dfe3fa] flex flex-col items-end text-xs space-y-1">
                    <p class="text-white">{{ invoice.billerStreetAddress }}</p>
                    <p>{{ invoice.billerCity }}</p>
                    <p>{{ invoice.billerZipCode }}</p>
                    <p class="text-white">{{ invoice.id }}</p>
                </div>
            </div>

            <div class="middle flex mt-[50px] text-[#dfe3fa] gap-4">
                <div class="payment flex flex-col flex-1">
                    <h4 class="text-xs font-normal mb-4">Invoice Date</h4>
                    <p class="text-[16px] font-semibold">{{ invoice.invoiceDate }}</p>

                    <h4 class="text-xs font-normal mb-4">Payment Due Date</h4>
                    <p class="text-[16px] font-semibold">{{ invoice.paymentDueDate }}</p>
                </div>

                <div class="bill flex flex-col flex-1 space-y-1">
                    <h4 class="text-xs font-normal mb-4 text-[#dfe3fa]">Bill To</h4>
                    <p class="text-xs">{{ invoice.clientName }}</p>
                    <p class="text-xs">{{ invoice.clientStreetAddress }}</p>
                    <p class="text-xs">{{ invoice.clientCity }}</p>
                    <p class="text-xs">{{ invoice.clientZipCode }}</p>
                    <p class="text-xs">{{ invoice.clientCountry }}</p>
                </div>

                <div class="flex flex-col flex-[2]">
                    <h4 class="text-xs font-normal mb-4 text-[#dfe3fa]">Send To</h4>
                    <p>{{ invoice.clientEmail }}</p>
                </div>
            </div>

            <div class="flex flex-col mt-12">
                <div class="p-8 rounded-bd-r bg-[#251945]">
                    <div class="text-[#dfe3fa] flex text-xs mb-8 headings">
                        <p class="flex-1 text-right">Item Name</p>
                        <p class="flex-1 text-right">QTY</p>
                        <p class="flex-1 text-right">Price</p>
                        <p class="flex-1 text-right">Total</p>
                    </div>
                    <div v-for="(item, index) in invoice.invoiceItemList" :key="index" class="text-[13px] mb-8 text-white flex item">
                        <p class="flex-1 text-right">{{ item.itemName }}</p>
                        <p class="flex-1 text-right">{{ item.qty }}</p>
                        <p class="flex-1 text-right">{{ item.price }}</p>
                        <p class="flex-1 text-right">{{ item.total }}</p>
                    </div>

                    <div class="flex p-8 text-white bg-totalPrice-bg items-center rounded-bd-t total">
                        <h4>Amount Due</h4>
                        <p class="flex-1 text-xs">${{ invoice.invoiceTotal }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.top .left p:first-child{
    font-size: 24px;
    text-transform: uppercase;
    color: #fff;
    margin-bottom: 8px;
}
.top .left p:nth-child(2){
    font-size: 16px;
    text-transform: uppercase;
    color: #fff;
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