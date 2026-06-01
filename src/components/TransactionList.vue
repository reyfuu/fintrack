<template>
  <div class="card flex flex-col">
    <!-- Header -->
    <div class="flex justify-between items-start mb-5">
      <div>
        <h3 class="m-0 text-[0.95rem] font-semibold text-[#f3f4f6]">Semua Transaksi</h3>
        <p class="mt-0.5 mb-0 text-[0.75rem] text-[#9ca3af]">Kelola dan pantau semua catatan transaksi</p>
      </div>
      <span class="text-[0.72rem] bg-[#171a26] border border-[#222533] text-[#9ca3af] px-2 py-0.5 rounded font-medium">
        {{ transactions.length }} total
      </span>
    </div>

    <!-- Toolbar -->
    <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-5">
      <div class="flex items-center gap-2">
        <!-- Filter type buttons -->
        <div class="flex bg-[#171a26] border border-[#222533] rounded p-0.5 gap-1">
          <button
            v-for="f in filters"
            :key="f.id"
            class="flex-1 sm:flex-none px-3 py-1.5 border border-transparent text-[0.8rem] font-medium font-[inherit] rounded cursor-pointer transition-all duration-150"
            :class="activeFilter === f.id
              ? 'bg-[rgba(99,102,241,0.08)] text-[#6366f1] border-[rgba(99,102,241,0.2)] font-semibold'
              : 'text-[#9ca3af] hover:text-[#f3f4f6] hover:bg-white/[0.02]'"
            @click="activeFilter = f.id"
          >
            {{ f.label }}
          </button>
        </div>

        <!-- Filter wallet buttons -->
        <div class="flex bg-[#171a26] border border-[#222533] rounded p-0.5 gap-1">
          <button
            v-for="w in walletFilters"
            :key="w.id"
            class="flex-1 sm:flex-none px-2.5 py-1.5 border border-transparent text-[0.8rem] font-medium font-[inherit] rounded cursor-pointer transition-all duration-150 flex items-center gap-1"
            :class="activeWallet === w.id
              ? w.activeClass
              : 'text-[#9ca3af] hover:text-[#f3f4f6] hover:bg-white/[0.02]'"
            @click="activeWallet = w.id"
          >
            <span v-if="w.icon" class="text-[0.7rem]">{{ w.icon }}</span>
            {{ w.label }}
          </button>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
        <!-- Category Filter -->
        <div class="relative flex items-center w-full sm:w-auto">
          <select
            v-model="activeCategory"
            class="w-full sm:w-40 appearance-none pl-3 pr-7 py-2 bg-[#171a26] border border-[#222533] rounded text-[#f3f4f6] text-[0.8rem] font-[inherit] outline-none transition-all duration-150 focus:border-[rgba(99,102,241,0.5)] cursor-pointer"
          >
            <option value="all">Semua Kategori</option>
            <option v-for="c in availableCategories" :key="c" :value="c">{{ c }}</option>
          </select>
          <div class="absolute right-2.5 text-[#9ca3af] pointer-events-none flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        </div>

        <!-- Search -->
        <div class="relative flex items-center w-full sm:w-60">
          <div class="absolute left-3 text-[#9ca3af]/70 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <input
            v-model="search"
            type="text"
            placeholder="Cari transaksi…"
            class="w-full pl-8 pr-3 py-2 bg-[#171a26] border border-[#222533] rounded text-[#f3f4f6] text-[0.85rem] font-[inherit] outline-none transition-all duration-150 focus:border-[rgba(99,102,241,0.5)] focus:bg-[#11131c] focus:shadow-[0_0_0_1px_rgba(99,102,241,0.15)] placeholder:text-[#9ca3af]/50"
          />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filtered.length === 0" class="flex flex-col items-center justify-center py-12 text-[#9ca3af] text-[0.82rem] gap-2">
      <div class="opacity-50">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
      </div>
      <span>Tidak ada catatan yang ditemukan.</span>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto -mx-2">
      <table class="w-full border-collapse text-left">
        <thead>
          <tr>
            <th class="text-[0.7rem] font-semibold text-[#9ca3af] uppercase tracking-[0.08em] px-3 py-2.5 border-b border-[#222533]">Transaksi</th>
            <th class="text-[0.7rem] font-semibold text-[#9ca3af] uppercase tracking-[0.08em] px-3 py-2.5 border-b border-[#222533] hidden sm:table-cell">Kategori</th>
            <th class="text-[0.7rem] font-semibold text-[#9ca3af] uppercase tracking-[0.08em] px-3 py-2.5 border-b border-[#222533] hidden md:table-cell">Tanggal</th>
            <th class="text-[0.7rem] font-semibold text-[#9ca3af] uppercase tracking-[0.08em] px-3 py-2.5 border-b border-[#222533] text-right">Jumlah</th>
            <!-- Aksi: Edit + Hapus -->
            <th class="w-20 px-0 border-b border-[#222533]"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="tx in filtered"
            :key="tx.id"
            class="group hover:bg-white/[0.02]"
            :class="editingId === tx.id ? 'ring-1 ring-[rgba(99,102,241,0.3)] ring-inset rounded' : ''"
          >
            <td class="px-3 py-3 text-[0.85rem] border-b border-white/[0.03] align-middle">
              <div class="flex items-center gap-2.5">
                <span
                  class="w-1.5 h-1.5 rounded-full shrink-0"
                  :class="tx.type === 'income' ? 'bg-[#10b981]' : 'bg-[#f43f5e]'"
                />
                <span class="font-medium text-[#f3f4f6]">{{ tx.description || '—' }}</span>
              </div>
            </td>
            <td class="px-3 py-3 text-[0.85rem] border-b border-white/[0.03] align-middle hidden sm:table-cell">
              <div class="flex items-center gap-1.5">
                <span class="text-[#9ca3af] bg-[#171a26] border border-[#222533] px-1.5 py-0.5 rounded text-[0.75rem]">{{ tx.category }}</span>
                <span
                  class="px-1.5 py-0.5 rounded text-[0.68rem] font-semibold uppercase tracking-[0.04em]"
                  :class="tx.wallet === 'digital'
                    ? 'bg-[rgba(6,182,212,0.08)] border border-[rgba(6,182,212,0.2)] text-[#06b6d4]'
                    : 'bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.2)] text-[#f59e0b]'"
                >{{ tx.wallet === 'digital' ? '💳' : '💵' }}</span>
              </div>
            </td>
            <td class="px-3 py-3 text-[0.85rem] border-b border-white/[0.03] align-middle hidden md:table-cell">
              <span class="text-[#9ca3af] text-[0.8rem]">{{ formatDate(tx.date) }}</span>
            </td>
            <td class="px-3 py-3 text-[0.85rem] border-b border-white/[0.03] align-middle text-right">
              <span
                class="font-semibold tabular-nums"
                :class="tx.type === 'income' ? 'text-[#10b981]' : 'text-[#f3f4f6]'"
              >
                {{ tx.type === 'income' ? '+' : '-' }}{{ formatIDR(tx.amount) }}
              </span>
            </td>
            <!-- Action buttons -->
            <td class="px-1 py-3 border-b border-white/[0.03] align-middle text-center w-20">
              <div class="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <!-- Edit -->
                <button
                  @click="emit('edit-transaction', tx)"
                  title="Edit transaksi"
                  class="bg-transparent border border-transparent text-[#9ca3af] cursor-pointer p-1.5 rounded inline-flex items-center justify-center transition-all duration-150 hover:bg-[rgba(99,102,241,0.08)] hover:border-[rgba(99,102,241,0.2)] hover:text-[#6366f1]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <!-- Delete -->
                <button
                  @click="remove(tx.id)"
                  title="Hapus catatan"
                  class="bg-transparent border border-transparent text-[#9ca3af] cursor-pointer p-1.5 rounded inline-flex items-center justify-center transition-all duration-150 hover:bg-[rgba(244,63,94,0.08)] hover:border-[rgba(244,63,94,0.2)] hover:text-[#f43f5e]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  transactions: { type: Array, required: true },
  editingId:    { type: [Number, String], default: null }
});

const emit = defineEmits(['transaction-deleted', 'edit-transaction']);

const activeFilter = ref('all');
const activeWallet = ref('all');
const activeCategory = ref('all');
const search = ref('');

const filters = [
  { id: 'all',     label: 'Semua' },
  { id: 'income',  label: 'Pemasukan' },
  { id: 'expense', label: 'Pengeluaran' },
];

const walletFilters = [
  { id: 'all',     label: 'Semua',    icon: null,  activeClass: 'bg-[rgba(99,102,241,0.08)] text-[#6366f1] border-[rgba(99,102,241,0.2)] font-semibold' },
  { id: 'cash',    label: 'Cash',     icon: '💵', activeClass: 'bg-[rgba(245,158,11,0.08)] text-[#f59e0b] border-[rgba(245,158,11,0.2)] font-semibold' },
  { id: 'digital', label: 'Digital',  icon: '💳', activeClass: 'bg-[rgba(6,182,212,0.08)] text-[#06b6d4] border-[rgba(6,182,212,0.2)] font-semibold' },
];

const formatIDR = (value) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

const availableCategories = computed(() => {
  const cats = new Set(props.transactions.map(t => t.category));
  return Array.from(cats).sort();
});

const filtered = computed(() => {
  let list = props.transactions;
  if (activeFilter.value !== 'all') {
    list = list.filter(t => t.type === activeFilter.value);
  }
  if (activeWallet.value !== 'all') {
    list = list.filter(t => t.wallet === activeWallet.value);
  }
  if (activeCategory.value !== 'all') {
    list = list.filter(t => t.category === activeCategory.value);
  }
  if (search.value.trim()) {
    const q = search.value.toLowerCase();
    list = list.filter(t =>
      t.category.toLowerCase().includes(q) ||
      (t.description || '').toLowerCase().includes(q)
    );
  }
  return list;
});

const formatDate = (d) => {
  return new Date(d).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' });
};

const remove = async (id) => {
  if (!confirm('Hapus permanen catatan transaksi ini?')) return;
  try {
    const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
    if (res.ok) emit('transaction-deleted');
  } catch (e) {
    console.error('Delete failed:', e);
  }
};
</script>
