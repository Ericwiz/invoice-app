<script setup>
import { onMounted, ref, watch } from "vue";
import { Icon } from "@iconify/vue";
import { useInvoiceModal } from '../stores/invoiceModal'
import { useNow, useDateFormat } from '@vueuse/core'
import { uid } from "uid";
import db from '../firebase'
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { storeToRefs } from "pinia";
import { useRoute } from 'vue-router';
import { getAuth } from "firebase/auth";

const route = useRoute()
const store = useInvoiceModal()
const { modalStateText, toggleEdit, useWatch } = storeToRefs(store)
const { toggleWarningModal, toggle } = (store)
const auth = getAuth()
const userId = auth.currentUser.uid

const formattedDate = useDateFormat(useNow(), 'MMM DD, YYYY')
// const loading = ref(null)
// const docId = ref(null)
const billerStreetAddress = ref(null)
const billerCity = ref(null)
const billerZipCode = ref(null)
const billerCountry = ref(null)
const clientName = ref(null)
const clientEmail = ref(null)
const clientStreetAddress = ref(null)
const clientCity = ref(null)
const clientZipCode = ref(null)
const clientCountry = ref(null)
const invoiceDate = ref(null)
const paymentTerms = ref(null)
const paymentDueDateUnix = ref(null)
const paymentDueDate = ref(null)
const productDescription = ref(null)
const invoicePending = ref(null)
const invoiceDraft = ref(null)
const invoiceItemList = ref([])
const invoiceTotal = ref(0)
const invoiceWrap = ref(null)

// Close invoice form
const closeInvoice = () => toggle()
// Check click 
const checkClick = function (e) {
    if (e.target === invoiceWrap.value) {
        toggleWarningModal()
        return;
    }
}
// publish invoice btn
const publishInvoice = () => invoicePending.value = true
// save invoice btn
const saveDraft = () => invoiceDraft.value = true

const calculateInvoiceTotal = () => {
    invoiceTotal.value = 0
    invoiceItemList.value.forEach(item => {
        invoiceTotal.value += item.total
    })
}

const uploadInvoice = async () => {
    if (invoiceItemList.value.length <= 0) {
        alert('Please fill out the work items!')
        return;
    }
    calculateInvoiceTotal()

    // Upload a new invoice
    try {
        await addDoc(collection(db, 'invoices'), {
            userId: userId,
            invoiceId: uid(),
            billerStreetAddress: billerStreetAddress.value,
            billerCity: billerCity.value,
            billerZipCode: billerZipCode.value,
            billerCountry: billerCountry.value,
            clientName: clientName.value,
            clientEmail: clientEmail.value,
            clientStreetAddress: clientStreetAddress.value,
            clientCity: clientCity.value,
            clientZipCode: clientZipCode.value,
            clientCountry: clientCountry.value,
            invoiceDate: invoiceDate.value,
            invoiceDateUnix: formattedDate.value,
            paymentTerms: paymentTerms.value,
            paymentDueDate: paymentDueDate.value,
            paymentDueDateUnix: paymentDueDateUnix.value,
            productDescription: productDescription.value,
            invoiceItemList: invoiceItemList.value,
            invoiceTotal: invoiceTotal.value,
            invoicePending: invoicePending.value,
            invoiceDraft: invoiceDraft.value,
            invoicePaid: null,
        })
    } catch (error) {
        alert(error)
    }
}

const submitForm = () => {
    toggle()
    if(toggleEdit.value) {
        updateInvoice()
        useWatch.value = true
        return
    }
    uploadInvoice()
}


async function updateForm() {
    if (toggleEdit.value) {
        const docRef = doc(db, 'invoices', route.params.invoiceId);
        const currentInvoice = await getDoc(docRef)
        const invoice = currentInvoice.data()

        billerStreetAddress.value = invoice.billerStreetAddress
        billerCity.value = invoice.billerCity
        billerZipCode.value = invoice.billerZipCode
        billerCountry.value = invoice.billerCountry
        clientName.value = invoice.clientName
        clientEmail.value = invoice.clientEmail
        clientStreetAddress.value = invoice.clientStreetAddress
        clientCity.value = invoice.clientCity
        clientZipCode.value = invoice.clientZipCode
        clientCountry.value = invoice.clientCountry
        invoiceDate.value = invoice.invoiceDate
        paymentTerms.value = invoice.paymentTerms
        paymentDueDate.value = invoice.paymentDueDate
        paymentDueDateUnix.value = invoice.paymentDueDateUnix
        productDescription.value = invoice.productDescription
        invoiceItemList.value = invoice.invoiceItemList
        invoiceTotal.value = invoice.invoiceTotal
        invoicePending.value = invoice.invoicePending
        invoiceDraft.value = invoice.invoiceDraft
        return
    }
}

onMounted( () => {
    // get invoice current date
    if (!toggleEdit.value) {
        invoiceDate.value = formattedDate.value
    }
    updateForm()
})

// Update invoice

const updateInvoice =  async() => {
    const invoiceRef = doc(db, 'invoices', route.params.invoiceId)
    try {
        await updateDoc(invoiceRef, {
            billerStreetAddress: billerStreetAddress.value,
            billerCity: billerCity.value,
            billerZipCode: billerZipCode.value,
            billerCountry: billerCountry.value,
            clientName: clientName.value,
            clientEmail: clientEmail.value,
            clientStreetAddress: clientStreetAddress.value,
            clientCity: clientCity.value,
            clientZipCode: clientZipCode.value,
            clientCountry: clientCountry.value,
            invoiceDate: invoiceDate.value,
            invoiceDateUnix: formattedDate.value,
            paymentTerms: paymentTerms.value,
            paymentDueDate: paymentDueDate.value,
            paymentDueDateUnix: paymentDueDateUnix.value,
            productDescription: productDescription.value,
            invoiceItemList: invoiceItemList.value,
            invoiceTotal: invoiceTotal.value,
        }
        )
    } catch (error) {
        alert(error)
    }
    
}

watch(paymentTerms, () => {
    const futureDate = new Date()
    paymentDueDateUnix.value = futureDate.setDate(futureDate.getDate() + parseInt(paymentTerms.value))
    paymentDueDate.value = useDateFormat(paymentDueDateUnix.value, 'MMM DD, YYYY').value
})

const addNewInvoiceItem = () => {
    return invoiceItemList.value.push({
        id: uid(),
        itemName: '',
        qty: '',
        price: 0,
        total: 0
    })
}

const deleteInvoiceItem = (id) => {
    invoiceItemList.value = invoiceItemList.value.filter(item => item.id != id)
}


</script>

<template>
    <div ref="invoiceWrap" @click="checkClick"
        class="fixed overflow-scroll top-0 left-0 dark:bg-transparent h-full lg:left-[90px] w-full flex flex-col z-50">
        <form @submit.prevent="submitForm" class="invoice-form relative p-14 max-w-[700px] shadow-form-shadow 
        w-full bg-[#dfe3e9] dark:bg-[#141625] dark:text-white">
            <h1 class="mb-4 text-2xl font-bold">{{ modalStateText }}</h1>

            <!-- Bill From -->
            <div class="flex flex-col mb-12">
                <h4 class="text-sm text-[#7c5dfa] mb-6">Bill From</h4>
                <div class="flex flex-col">
                    <label for="billerStreetAddress">Street Address</label>
                    <input required type="text" class="bg-gray-300 dark:bg-[#1e2139] dark:text-white" id="billerStreetAddress" v-model="billerStreetAddress">
                </div>

                <div class="location-details gap-4 flex space-x-3">
                    <div class="input flex flex-col w-full flex-1">
                        <label for="billerCity">City</label>
                        <input class="w-44 bg-gray-300 dark:bg-[#1e2139] dark:text-white" required type="text" id="billerCity" v-model="billerCity">
                    </div>

                    <div class="input flex flex-col w-full flex-1">
                        <label for="billerZipCode">Zip Code</label>
                        <input class="w-44 bg-gray-300 dark:bg-[#1e2139] dark:text-white" required type="text" id="billerZipCode" v-model="billerZipCode">
                    </div>

                    <div class="input flex flex-col w-full flex-1">
                        <label for="billerCountry">Country</label>
                        <input class="w-44 bg-gray-300 dark:bg-[#1e2139] dark:text-white" required type="text" id="billerCountry" v-model="billerCountry">
                    </div>
                </div>
            </div>

            <!-- Bill To -->

            <div class="bill-to mb-12 flex flex-col">
                <h4 class="text-sm text-[#7c5dfa] mb-6">Bill To</h4>

                <div class="input flex flex-col">
                    <label for="clientName">Client's Name</label>
                    <input required type="text" class="bg-gray-300 dark:bg-[#1e2139] dark:text-white" id="clientName" v-model="clientName">
                </div>

                <div class="input flex flex-col">
                    <label for="clientEmail">Client's Email</label>
                    <input required type="email" class="bg-gray-300 dark:bg-[#1e2139] dark:text-white" id="clientEmail" v-model="clientEmail">
                </div>

                <div class="input flex flex-col">
                    <label for="clientStreetAddress">Street Address</label>
                    <input required type="text" class="bg-gray-300 dark:bg-[#1e2139] dark:text-white" id="clientStreetAddress" v-model="clientStreetAddress">
                </div>

                <div class="location-details flex space-x-3 gap-4">
                    <div class="input flex flex-col w-full flex-1">
                        <label for="clientCity">City</label>
                        <input class="w-44 bg-gray-300 dark:bg-[#1e2139] dark:text-white" required type="text" id="clientCity" v-model="clientCity">
                    </div>

                    <div class="input flex flex-col w-full flex-1">
                        <label for="clientZipCode">Zip Code</label>
                        <input class="w-44 bg-gray-300 dark:bg-[#1e2139] dark:text-white" required type="text" id="clientZipCode" v-model="clientZipCode">
                    </div>

                    <div class="input flex flex-col w-full flex-1">
                        <label for="clientCountry">Country</label>
                        <input class="w-44 bg-gray-300 dark:bg-[#1e2139] dark:text-white" required type="text" id="clientCountry" v-model="clientCountry">
                    </div>
                </div>
            </div>

            <!-- Invoice Work Details -->
            <div class="invoice-work flex flex-col gap-6">
                <div class="payment flex flex-1 space-x-8">
                    <div class="input flex flex-col w-full">
                        <label for="invoiceDate">Invoice Date</label>
                        <input disabled type="text" class="bg-gray-300 dark:bg-[#1e2139] dark:text-white" id="invoiceDate" v-model="invoiceDate">
                    </div>
                    <div class="input flex flex-col w-full">
                        <label for="paymentDueDate">Payment Due Date</label>
                        <input disabled type="text" class="bg-gray-300 dark:bg-[#1e2139] dark:text-white" id="paymentDueDate" v-model="paymentDueDate">
                    </div>
                </div>
                <div class="input flex flex-col">
                    <label for="paymentTerms">Payment Terms</label>
                    <select required id="paymentTerms" class="bg-gray-300 dark:bg-[#1e2139] dark:text-white" v-model="paymentTerms">
                        <option value="20">Next 20 days</option>
                        <option value="30">Next 30 days</option>
                        <option value="40">Next 40 days</option>
                        <option value="50">Next 50 days</option>
                        <option value="60">Next 60 days</option>
                    </select>
                </div>

                <div class="input flex flex-col">
                    <label for="productDescription">Description</label>
                    <input required type="text" class="bg-gray-300 dark:bg-[#1e2139] dark:text-white" id="productDescription" v-model="productDescription">
                </div>

                <div class="work-items">
                    <h3 class="mb-4 text-lg text-[#777f98]">Item List</h3>
                    <!-- <table class="w-full flex flex-col"> -->
                    <div class="table-heading gap-4 text-xs flex justify-between mb-4">
                        <span class="">Item Name</span>
                        <span class="pr-8">Qty</span>
                        <span class="pr-6">Price</span>
                        <span class="mr-10">Total</span>
                    </div>

                    <div class="table-items mb-6 relative gap-6 text-xs flex justify-between w-full"
                        v-for="(item, index) in invoiceItemList" :key="index">
                        <div>
                            <input required class="w-[100%] bg-gray-300 dark:bg-[#1e2139] dark:text-white" type="text" v-model="item.itemName">
                        </div>
                        <div class="">
                            <input required class="w-[100%] bg-gray-300 dark:bg-[#1e2139] dark:text-white" type="text" v-model="item.qty">
                        </div>
                        <div>
                            <input required class="w-[100%] bg-gray-300 dark:bg-[#1e2139] dark:text-white" type="text" v-model="item.price">
                        </div>
                        <span class="self-center">${{ item.total = item.qty * item.price }}</span>
                        <Icon @click="deleteInvoiceItem(item.id)" icon="material-symbols:delete"
                            class="w-6 h-8 m-auto cursor-pointer" />
                    </div>

                    <div @click="addNewInvoiceItem"
                        class="flex rounded-full py-2 bg-gray-400 dark:bg-[#01051b] dark:text-white items-center justify-center w-full cursor-pointer">
                        <Icon icon="typcn:plus-outline" class="mr-1" />
                        <span>Add New Item</span>
                    </div>
                </div>
            </div>

            <!-- Save/Exit -->
            <div class="save text-white flex mt-10">
                <div @click="closeInvoice" class="left flex-1">
                    <button type="button" class="bg-red-600 rounded-full px-5 py-3">Cancel</button>
                </div>
                <div class="flex flex-1 justify-end space-x-5">
                    <button v-if="!toggleEdit" type="submit" @click="saveDraft"
                        class="bg-purple-950 rounded-full px-4 py-3">Save as Draft</button>
                    <button v-if="!toggleEdit" type="submit" @click="publishInvoice"
                        class="bg-purple-700 rounded-full px-4 py-3">Create Invoice</button>
                    <button v-if="toggleEdit" type="submit" @click="updateInvoice"
                        class="bg-purple-900 rounded-full text-white py-3 px-4">Save Edit</button>
                </div>
            </div>
        </form>
    </div>
</template>

<style>
::-webkit-scrollbar {
    display: none;
}

.input {
    margin-bottom: 24px;
}

label {
    font-size: 12px;
    margin-bottom: 6px;
}

input,
select {
    padding: 6px 4px;
    border-radius: 4px;
    border: none;
    outline: none;

}</style>