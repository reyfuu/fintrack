<template>
  <div class="card h-fit">
    <div class="mb-5">
      <h3 class="m-0 text-[0.95rem] font-semibold text-[#f3f4f6]">Transaksi Baru</h3>
      <p class="mt-0.5 mb-0 text-[0.75rem] text-[#9ca3af]">Catat entri keuangan baru</p>
    </div>

    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
      <!-- Type selector -->
      <div class="flex flex-col gap-1.5">
        <label class="text-[0.72rem] font-semibold text-[#9ca3af] uppercase tracking-[0.08em]">Tipe Transaksi</label>
        <div class="flex bg-[#171a26] border border-[#222533] rounded p-0.5 gap-1">
          <button
            type="button"
            class="flex-1 py-2 text-[0.82rem] font-medium border rounded cursor-pointer transition-all duration-150"
            :class="form.type === 'income'
              ? 'bg-[rgba(16,185,129,0.08)] text-[#10b981] border-[rgba(16,185,129,0.2)] font-semibold'
              : 'bg-transparent text-[#9ca3af] border-transparent hover:text-[#f3f4f6] hover:bg-white/[0.02]'"
            @click="form.type = 'income'; form.category = ''"
          >Pemasukan</button>
          <button
            type="button"
            class="flex-1 py-2 text-[0.82rem] font-medium border rounded cursor-pointer transition-all duration-150"
            :class="form.type === 'expense'
              ? 'bg-[rgba(244,63,94,0.08)] text-[#f43f5e] border-[rgba(244,63,94,0.2)] font-semibold'
              : 'bg-transparent text-[#9ca3af] border-transparent hover:text-[#f3f4f6] hover:bg-white/[0.02]'"
            @click="form.type = 'expense'; form.category = ''"
          >Pengeluaran</button>
        </div>
      </div>

      <!-- Amount -->
      <div class="flex flex-col gap-1.5">
        <label for="amount" class="text-[0.72rem] font-semibold text-[#9ca3af] uppercase tracking-[0.08em]">Jumlah</label>
        <div class="relative flex items-center">
          <span class="absolute left-3 text-[#9ca3af] text-[0.88rem] font-medium pointer-events-none select-none">Rp</span>
          <input
            id="amount"
            type="number"
            v-model="form.amount"
            min="1"
            step="1"
            placeholder="0"
            required
            class="w-full pl-9 pr-3 py-2.5 bg-[#171a26] border border-[#222533] rounded text-[#f3f4f6] text-[0.88rem] font-[inherit] outline-none transition-all duration-150 focus:border-[rgba(99,102,241,0.5)] focus:shadow-[0_0_0_1px_rgba(99,102,241,0.15)] focus:bg-[#11131c] placeholder:text-[#9ca3af]/50"
          />
        </div>
      </div>

      <!-- Category -->
      <div class="flex flex-col gap-1.5">
        <label for="category" class="text-[0.72rem] font-semibold text-[#9ca3af] uppercase tracking-[0.08em]">Kategori</label>
        <div class="relative flex items-center">
          <select
            id="category"
            v-model="form.category"
            required
            class="w-full appearance-none px-3 pr-8 py-2.5 bg-[#171a26] border border-[#222533] rounded text-[#f3f4f6] text-[0.88rem] font-[inherit] outline-none transition-all duration-150 focus:border-[rgba(99,102,241,0.5)] focus:shadow-[0_0_0_1px_rgba(99,102,241,0.15)] focus:bg-[#11131c] cursor-pointer"
          >
            <option value="" disabled>Pilih kategori…</option>
            <option v-for="c in categories" :key="c" :value="c" class="bg-[#171a26] text-[#f3f4f6]">{{ c }}</option>
          </select>
          <div class="absolute right-3 text-[#9ca3af] pointer-events-none flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        </div>
      </div>

      <!-- Date -->
      <div class="flex flex-col gap-1.5">
        <label for="date" class="text-[0.72rem] font-semibold text-[#9ca3af] uppercase tracking-[0.08em]">Tanggal</label>
        <input
          id="date"
          type="date"
          v-model="form.date"
          required
          class="w-full px-3 py-2.5 bg-[#171a26] border border-[#222533] rounded text-[#f3f4f6] text-[0.88rem] font-[inherit] outline-none transition-all duration-150 focus:border-[rgba(99,102,241,0.5)] focus:shadow-[0_0_0_1px_rgba(99,102,241,0.15)] focus:bg-[#11131c] [color-scheme:dark]"
        />
      </div>

      <!-- Note -->
      <div class="flex flex-col gap-1.5">
        <div class="flex justify-between items-center">
          <label for="desc" class="text-[0.72rem] font-semibold text-[#9ca3af] uppercase tracking-[0.08em]">Catatan</label>
          <span class="text-[0.7rem] text-[#9ca3af]/60">Opsional</span>
        </div>
        <input
          id="desc"
          type="text"
          v-model="form.description"
          placeholder="Referensi catatan…"
          class="w-full px-3 py-2.5 bg-[#171a26] border border-[#222533] rounded text-[#f3f4f6] text-[0.88rem] font-[inherit] outline-none transition-all duration-150 focus:border-[rgba(99,102,241,0.5)] focus:shadow-[0_0_0_1px_rgba(99,102,241,0.15)] focus:bg-[#11131c] placeholder:text-[#9ca3af]/50"
        />
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="mt-2 py-3 border border-transparent rounded text-[0.88rem] font-semibold text-white cursor-pointer transition-all duration-150 active:translate-y-px disabled:opacity-40 disabled:cursor-not-allowed"
        :class="form.type === 'income'
          ? 'bg-[#10b981] hover:opacity-90'
          : 'bg-[#6366f1] hover:opacity-90'"
      >
        <span v-if="loading">Memproses…</span>
        <span v-else>Simpan {{ form.type === 'income' ? 'Pemasukan' : 'Pengeluaran' }}</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const emit = defineEmits(['transaction-added']);
const loading = ref(false);

const form = ref({
  type: 'expense',
  amount: '',
  category: '',
  date: new Date().toISOString().split('T')[0],
  description: ''
});

const incomeCategories = ['Gaji', 'Freelance', 'Investasi', 'Bonus', 'Lainnya'];
const expenseCategories = ['Makanan', 'Transportasi', 'Utilitas', 'Hiburan', 'Belanja', 'Kesehatan', 'Lainnya'];

const categories = computed(() =>
  form.value.type === 'income' ? incomeCategories : expenseCategories
);

const handleSubmit = async () => {
  if (!form.value.amount || !form.value.category || !form.value.date) return;
  loading.value = true;
  try {
    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    });
    if (res.ok) {
      emit('transaction-added');
      form.value.amount = '';
      form.value.description = '';
      form.value.category = '';
    }
  } catch (e) {
    console.error('Save failed:', e);
  } finally {
    loading.value = false;
  }
};
</script>
