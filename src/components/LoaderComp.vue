<script setup>
import { FulfillingBouncingCircleSpinner } from 'epic-spinners'
</script>
<template>
    <div class="flex justify-center h-screen flex-col">
        <fulfilling-bouncing-circle-spinner class="m-auto" :animation-duration="4000" :size="100" color="#1e2139" />
        <h3 class=" m-auto text-white font-light font-mono">Loading Invoice details...</h3>
    </div>
</template>
