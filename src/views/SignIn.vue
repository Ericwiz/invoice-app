<script setup>
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const email = ref('')
const password = ref('')
const auth = getAuth()
const router = useRouter()
const signin = async() => {
try {
 await signInWithEmailAndPassword(auth, email.value, password.value)
 router.push({path: '/'})
} catch (error) {
   alert(error.message) 
}
}
</script>

<template>
    <div class="bg-signup w-full h-screen bg-cover bg-center flex flex-col justify-center">
      <h1 class="text-white text-2xl mx-auto pb-10">Login to Enter</h1>
      <form class="flex space-y-4 flex-col mx-auto" @submit.prevent="signin">
        <div>
          <input type="email" v-model="email" placeholder="email" class="px-3" />
        </div>
        <div>
          <input type="password" v-model="password" placeholder="password" class="px-3" />
        </div>
  
        <button class="bg-purple-800 py-3 px-5 rounded-lg text-white w-60">Login</button>
        <p class="dark:text-white">
          <RouterLink to="/signup" class="text-blue-300">sign up</RouterLink>
          if you don't have an account.
        </p>
      </form>
    </div>
  </template>
  