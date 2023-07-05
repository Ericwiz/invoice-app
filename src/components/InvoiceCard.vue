<script setup>
import { Icon } from '@iconify/vue';
defineProps(['invoice'])
</script>

<template>
    <router-link class="flex gap-4 mb-4 rounded-2xl text-sm py-7 px-8 bg-[#0c0f25] items-center" :to="{ name: 'Invoice', params: { invoiceId: invoice.id }  }">
        <div class="left flex items-center basis-4/6 gap-4">
            <span class="uppercase flex-1">#{{ invoice.invoiceId }}</span>
            <span class="due-date flex-1">{{ invoice.paymentDueDate }}</span>
            <span class="person flex-1">{{ invoice.clientName }}</span>
        </div>

        <div class="flex items-center basis-2/6 gap-4">
            <span class="text-[16px] flex-1 font-[600px]">${{ invoice.invoiceTotal }}</span>
            <div class="status-button flex items-center space-x-2 rounded-full py-2 px-3"
                :class="{ 'before:bg-[#ff8f00] text-[#ff8f00] bg-paid-bg': invoice.invoicePaid, 'before:bg-[#33d69f] text-[#33d69f] bg-pending-bg': invoice.invoicePending, 'before:bg-[#dfe3fa] text-[#dfe3fa] bg-draft-bg': invoice.invoiceDraft, }">
                <Icon icon="carbon:dot-mark" />
                <span v-if="invoice.invoicePaid">paid</span>
                <span v-if="invoice.invoicePending">pending</span>
                <span v-if="invoice.invoiceDraft">draft</span>
            </div>
            <div class="icon">
                <Icon icon="raphael:arrowright" />
            </div>
        </div>
    </router-link>
</template>