<template>
  <div class="min-h-screen flex items-center justify-center bg-[#090a0f] p-4">
    <div class="w-full max-w-[360px] animate-fadein">
      <!-- Brand -->
      <div class="flex items-center justify-center gap-2.5 mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#6366f1] shrink-0"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        <span class="font-bold text-[1.35rem] tracking-tight bg-gradient-to-br from-white to-[#6366f1] bg-clip-text text-transparent">Fintrack</span>
      </div>

      <form class="card flex flex-col gap-4" @submit.prevent="submit">
        <div class="flex flex-col gap-1.5">
          <label for="passcode" class="text-[0.72rem] font-semibold text-[#9ca3af] uppercase tracking-[0.08em]">
            Passcode
          </label>
          <input
            id="passcode"
            ref="input"
            v-model="passcode"
            type="password"
            autocomplete="current-password"
            placeholder="Masukkan passcode"
            class="bg-[#171a26] border border-[#222533] rounded px-3 py-2.5 text-[0.9rem] text-[#f3f4f6] placeholder:text-[#6b7280] outline-none focus:border-[#6366f1] transition-colors"
          >
        </div>

        <p v-if="error" class="m-0 text-[0.8rem] text-[#f43f5e]">{{ error }}</p>

        <button
          type="submit"
          :disabled="pending || passcode.length === 0"
          class="py-2.5 rounded text-[0.88rem] font-semibold text-white bg-[#6366f1] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity cursor-pointer"
        >
          {{ pending ? 'Memeriksa…' : 'Masuk' }}
        </button>
      </form>

      <p class="mt-5 text-center text-[0.72rem] text-[#6b7280]">
        Fintrack memakai satu passcode bersama, bukan akun per pengguna.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// No dashboard chrome on the login screen.
definePageMeta({ layout: false })
useHead({ title: 'Masuk' })

const fintrack = useFintrack()
const passcode = ref('')
const error = ref('')
const pending = ref(false)
const input = useTemplateRef<HTMLInputElement>('input')

onMounted(() => input.value?.focus())

const submit = async () => {
  error.value = ''
  pending.value = true
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { passcode: passcode.value },
    })
    // Load before navigating. The dashboard's fetch lives in the layout's
    // onMounted, which does not re-fire on the way back from here, so without
    // this the user lands on a dashboard of zeros until they reload.
    await fintrack.fetchData()
    await navigateTo('/')
  } catch (e) {
    error.value = (e as { data?: { error?: string } }).data?.error ?? 'Gagal masuk. Coba lagi.'
    passcode.value = ''
  } finally {
    pending.value = false
  }
}
</script>
