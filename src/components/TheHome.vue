<script setup>
import { Icon } from "@iconify/vue";
import { ref } from "vue";
import { useInvoiceModal } from '../stores/invoiceModal'

const store = useInvoiceModal()

const { toggle } = (store)

const filterMenu = ref(false)

const toggleFilterMenu = () => filterMenu.value = !filterMenu.value

const newInvoice = () => toggle()
</script>

<template>
    <div class="home text-white w-[80%] mx-auto">
        <div class="flex mb-16">
            <div class="flex-1 flex">
                <h1>Invoices</h1>
                <span>4 total invoices</span>
            </div>

            <div class="flex-1 flex justify-end items-center">
                <div @click="toggleFilterMenu" ref="filter" class="flex cursor-pointer items-center relative mr-10">
                    <span class="pointer-events-none">filter by status</span>
                    <Icon icon="ion:arrow-down-outline" class="pointer-events-none ml-3 h-3 w-5" />
                    <ul v-show="filterMenu" class="w-32 absolute top-6 bg-[#1e2139] shadow-md">
                        <li class="cursor-pointer text-xs px-3 py-4 hover:bg-white hover:text-[#1e2139]">Draft</li>
                        <li class="cursor-pointer text-xs px-3 py-4 hover:bg-white hover:text-[#1e2139]">Pending</li>
                        <li class="cursor-pointer text-xs px-3 py-4 hover:bg-white hover:text-[#1e2139]">Paid</li>
                        <li class="cursor-pointer text-xs px-3 py-4 hover:bg-white hover:text-[#1e2139]">Clear Filter</li>
                    </ul>
                </div>
                <div @click="newInvoice" class="px-2 py-1 rounded-3xl bg-[#7c5dfa] cursor-pointer flex items-center">
                    <div class="inner-button mr-2 px-1 py-1 rounded-3xl items-center justify-center bg-white flex">
                        <Icon icon="ph:plus-fill" class="text-purple-600 h-6 w-6" />
                    </div>
                    <span class="text-xs">New Invoice</span>
                </div>
            </div>
        </div>
    </div>
</template>
