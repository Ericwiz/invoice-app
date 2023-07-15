<template>
    <!-- Warning Modal -->
    <Teleport to="body">
      <div  class="flex z-[100] absolute top-[50%] left-0 right-0 justify-center items-center w-[80%] m-auto">
        <div v-if="openModal"  class="modal-content self-center rounded-2xl px-10 py-8 max-w-[450px] shadow-lg bg-[#252945] text-white m-auto">
            <p class="text-center">This Invoice Will be deleted permanently! Still want to proceed?</p>
            <div class="mt-6 flex space-x-5">
                <button class="flex-1 bg-purple-700 rounded-full py-4" @click="$emit('closeModal')">Cancel</button>
                <button class="flex-1 bg-red-700 rounded-full py-4" @click="$emit('removeInvoice')">Proceed</button>
            </div>
        </div>
    </div>
    </Teleport>
</template>

<script setup>
defineProps(['openModal'])
defineEmits(['closeModal', 'removeInvoice'])
</script>