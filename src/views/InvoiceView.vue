<script setup>
import InvoiceDetail from '../components/InvoiceDetail.vue';
</script>

<template>
   <Suspense>
    <template #default>
        <InvoiceDetail />
    </template>
    <template #fallback>
        <h1>loadingggg</h1>
    </template>
   </Suspense>
</template>