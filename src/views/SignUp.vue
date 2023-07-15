<script setup>
import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth'
import { ref } from 'vue'

const username = ref('')
const email = ref('')
const password = ref('')
const auth = getAuth()
const signup = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((cred) => {
        console.log(cred.user)
      updateProfile(auth.currentUser, {
        displayName: username.value
      }).then(() => {
        console.log(auth.currentUser.displayName)
      })
    })
    .catch((err) => console.log(err))
}
</script>

<template>
  <div class="bg-signup w-full h-screen bg-cover bg-center flex flex-col justify-center">
    <h1 class="text-white text-2xl mx-auto pb-10">Register Yourself</h1>
    <form class="flex space-y-4 flex-col mx-auto" @submit.prevent="signup">
      <div>
        <input type="text" v-model="username" placeholder="username" class="px-3" />
      </div>
      <div>
        <input type="email" v-model="email" placeholder="email" class="px-3" />
      </div>
      <div>
        <input type="password" v-model="password" placeholder="password" class="px-3" />
      </div>

      <button class="bg-purple-800 py-3 px-5 rounded-lg text-white w-[95%]">Register</button>
      <p class="text-white">
        <RouterLink to="/signin" class="text-blue-300">sign in</RouterLink>
        if you already registered before.
      </p>
    </form>
  </div>
</template>
