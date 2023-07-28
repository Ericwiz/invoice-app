<script setup>
import { Icon } from '@iconify/vue';
import { useDark, useToggle } from '@vueuse/core'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const isDark = useDark()
const toggleDark = useToggle(isDark)

const auth = getAuth()
const currentUser = ref(null)
const router = useRouter()

onAuthStateChanged(auth, (user) => {
currentUser.value = user
})

const logOut = async() => {
  try {
    await signOut(auth)
    router.push({path: '/signin'})
  } catch (error) {
    alert(error)
  }
}
</script>

<template>
  <header class="flex flex-row justify-between lg:min-h-full md:min-w-[90px] lg:flex-col rounded-md bg-[#1e2139] z-50">
    <div class="w-[10%] flex justify-center p-6 lg:w-full rounded-md bg-[#7c5dfa]">
        <Icon icon="fa6-solid:file-invoice-dollar" class="w-auto h-7 text-white"/>
    </div>

    <div class="w-[30%] lg:w-full flex flex-row lg:flex-col space-x-0 lg:justify-between lg:space-y-6 lg:pb-6 px-4 lg:px-0 items-center">
      <!-- Dark Mode -->
      <div class="">
        <button @click="toggleDark()">
          <Icon v-if="isDark" icon="ph:sun" class="text-white w-6 h-6 cursor-pointer"/>
          <Icon v-else icon="ph:moon-bold" class="text-white w-6 h-6 cursor-pointer"/>
        </button>
      </div>

      <div class="border-r-4 border-grey-500 lg:border-b w-full"></div>
      <!-- Profile Picture -->
      <div class="w-full" v-if="currentUser !== null">
        <button @click="logOut" class="w-full text-white">sign out</button>
      </div>
    </div>
  </header>
</template>

<style>

</style>