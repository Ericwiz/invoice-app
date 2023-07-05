<script setup>
import { storeToRefs } from 'pinia';
import { useInvoiceModal } from '../stores/invoiceModal';

const store = useInvoiceModal()

const { toggleWarningModal, toggle } = (store)

const { toggleEdit } = storeToRefs(store)

const closeModal = () => {
    toggleWarningModal()
}
const closeInvoice = () => {
    toggle()
    toggleEdit.value = false
    toggleWarningModal()
}
</script>
<template>
    <div class="flex z-[100] fixed justify-center items-center h-screen w-full">
        <div class="modal-content self-center rounded-2xl px-10 py-8 max-w-[450px] bg-[#252945] text-white m-auto">
            <p class="text-center">Your changes might not be saved, sure you want to leave?</p>
            <div class="mt-6 flex space-x-5">
                <button class="flex-1 bg-purple-700 rounded-full py-4" @click="closeModal">Cancel</button>
                <button class="flex-1 bg-red-700 rounded-full py-4" @click="closeInvoice">Leave</button>
            </div>
        </div>
    </div>
</template>