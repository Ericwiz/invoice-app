<script setup>
import InvoiceDetail from '../components/InvoiceDetail.vue';
import LoaderComp from '../components/LoaderComp.vue';
</script>

<template>
   <Suspense>
    <template #default>
        <InvoiceDetail />
    </template>
    <template #fallback>
        <LoaderComp />
    </template>
   </Suspense>
</template>