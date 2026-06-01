<template>
  <!-- [x]TODO: implement chart tracking 
    1. pie chart
    2. line chart
  -->
  <!-- [x]TODO: made filter list about all income or expenses-->
   <!-- TODO: made calendar to choose what expeses and income in that day-->
  <!-- TODO: deploy in vercel -->
  <div class="flex flex-col gap-6">

    <!-- Wallet Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
      <!-- Cash Wallet -->
      <div class="card flex flex-col gap-3 transition-all duration-150 hover:border-[rgba(245,158,11,0.3)] hover:bg-[#171a26]">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded flex items-center justify-center bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.2)]">
              <span class="text-base">💵</span>
            </div>
            <div>
              <div class="text-[0.88rem] font-semibold text-[#f3f4f6]">Dompet Biasa</div>
              <div class="text-[0.72rem] text-[#9ca3af]">Cash / Tunai</div>
            </div>
          </div>
          <span class="text-[0.68rem] uppercase tracking-[0.08em] font-semibold bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.2)] text-[#f59e0b] px-1.5 py-0.5 rounded">Cash</span>
        </div>
        <div class="text-2xl font-bold tracking-tight tabular-nums" :class="walletSummary.cash.balance >= 0 ? 'text-[#f59e0b]' : 'text-[#f43f5e]'">
          {{ formatIDR(walletSummary.cash.balance) }}
        </div>
        <div class="flex gap-4 text-[0.75rem]">
          <div class="flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
            <span class="text-[#9ca3af]">Masuk</span>
            <span class="font-medium text-[#10b981]">{{ formatIDR(walletSummary.cash.totalIncome) }}</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-[#f43f5e]"></span>
            <span class="text-[#9ca3af]">Keluar</span>
            <span class="font-medium text-[#f43f5e]">{{ formatIDR(walletSummary.cash.totalExpense) }}</span>
          </div>
        </div>
      </div>

      <!-- Digital Wallet -->
      <div class="card flex flex-col gap-3 transition-all duration-150 hover:border-[rgba(6,182,212,0.3)] hover:bg-[#171a26]">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded flex items-center justify-center bg-[rgba(6,182,212,0.08)] border border-[rgba(6,182,212,0.2)]">
              <span class="text-base">💳</span>
            </div>
            <div>
              <div class="text-[0.88rem] font-semibold text-[#f3f4f6]">Dompet Digital</div>
              <div class="text-[0.72rem] text-[#9ca3af]">E-Wallet / QRIS</div>
            </div>
          </div>
          <span class="text-[0.68rem] uppercase tracking-[0.08em] font-semibold bg-[rgba(6,182,212,0.08)] border border-[rgba(6,182,212,0.2)] text-[#06b6d4] px-1.5 py-0.5 rounded">Digital</span>
        </div>
        <div class="text-2xl font-bold tracking-tight tabular-nums" :class="walletSummary.digital.balance >= 0 ? 'text-[#06b6d4]' : 'text-[#f43f5e]'">
          {{ formatIDR(walletSummary.digital.balance) }}
        </div>
        <div class="flex gap-4 text-[0.75rem]">
          <div class="flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
            <span class="text-[#9ca3af]">Masuk</span>
            <span class="font-medium text-[#10b981]">{{ formatIDR(walletSummary.digital.totalIncome) }}</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-[#f43f5e]"></span>
            <span class="text-[#9ca3af]">Keluar</span>
            <span class="font-medium text-[#f43f5e]">{{ formatIDR(walletSummary.digital.totalExpense) }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- KPI Row -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
      <div
        v-for="kpi in kpiCards"
        :key="kpi.label"
        class="card flex justify-between items-center transition-all duration-150 hover:border-white/15 hover:bg-[#171a26]"
      >
        <div class="flex flex-col gap-1">
          <span class="text-[0.72rem] text-[#9ca3af] uppercase tracking-[0.08em] font-semibold">{{ kpi.label }}</span>
          <div
            class="text-2xl font-bold tracking-tight tabular-nums"
            :class="kpi.className === 'income' ? 'text-[#10b981]' : kpi.className === 'expense' ? 'text-[#f43f5e]' : 'text-[#f3f4f6]'"
          >
            {{ formatIDR(kpi.value) }}
          </div>
        </div>
        <div
          class="w-9 h-9 rounded flex items-center justify-center shrink-0"
          :class="kpi.className === 'income'
            ? 'bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.2)] text-[#10b981]'
            : kpi.className === 'expense'
              ? 'bg-[rgba(244,63,94,0.08)] border border-[rgba(244,63,94,0.2)] text-[#f43f5e]'
              : 'bg-[#171a26] border border-[#222533] text-[#9ca3af]'"
        >
          <span v-html="kpi.icon" />
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card flex flex-col">
        <div class="mb-4">
          <h3 class="m-0 text-[0.95rem] font-semibold text-[#f3f4f6]">Laporan Bulanan</h3>
          <p class="mt-0.5 mb-0 text-[0.75rem] text-[#9ca3af]">Pemasukan vs Pengeluaran (12 Bulan)</p>
        </div>
        <div class="relative h-[260px] w-full">
          <Bar v-if="props.monthlySummary.length > 0" :data="barChartData" :options="barChartOptions" />
          <div v-else class="h-full flex items-center justify-center text-[#9ca3af] text-[0.82rem]">
            Belum ada data bulanan.
          </div>
        </div>
      </div>
      
      <div class="card flex flex-col">
        <div class="mb-4">
          <h3 class="m-0 text-[0.95rem] font-semibold text-[#f3f4f6]">Distribusi Kategori</h3>
          <p class="mt-0.5 mb-0 text-[0.75rem] text-[#9ca3af]">Persentase pengeluaran berdasarkan kategori</p>
        </div>
        <div class="relative h-[260px] w-full flex items-center justify-center">
          <Doughnut v-if="categoryBreakdown.length > 0" :data="doughnutChartData" :options="doughnutChartOptions" />
          <div v-else class="h-full flex items-center justify-center text-[#9ca3af] text-[0.82rem]">
            Belum ada data pengeluaran.
          </div>
        </div>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
      <!-- Recent Activity -->
      <div class="card flex flex-col">
        <div class="flex justify-between items-start mb-5">
          <div>
            <h3 class="m-0 text-[0.95rem] font-semibold text-[#f3f4f6]">Aktivitas Terkini</h3>
            <p class="mt-0.5 mb-0 text-[0.75rem] text-[#9ca3af]">Transaksi keuangan bulan ini</p>
          </div>
          <span class="text-[0.72rem] bg-[#171a26] border border-[#222533] text-[#9ca3af] px-2 py-0.5 rounded font-medium">
            {{ transactions.length }} total
          </span>
        </div>

        <div v-if="recentTx.length === 0" class="flex flex-col items-center justify-center py-12 text-[#9ca3af] text-[0.82rem] gap-2">
          <div class="opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <span>Belum ada aktivitas tercatat.</span>
        </div>

        <div v-else class="overflow-x-auto -mx-2">
          <table class="w-full border-collapse text-left">
            <thead>
              <tr>
                <th class="text-[0.7rem] font-semibold text-[#9ca3af] uppercase tracking-[0.08em] px-3 py-2.5 border-b border-[#222533]">Transaksi</th>
                <th class="text-[0.7rem] font-semibold text-[#9ca3af] uppercase tracking-[0.08em] px-3 py-2.5 border-b border-[#222533] hidden sm:table-cell">Kategori</th>
                <th class="text-[0.7rem] font-semibold text-[#9ca3af] uppercase tracking-[0.08em] px-3 py-2.5 border-b border-[#222533] hidden md:table-cell">Tanggal</th>
                <th class="text-[0.7rem] font-semibold text-[#9ca3af] uppercase tracking-[0.08em] px-3 py-2.5 border-b border-[#222533] text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tx in recentTx" :key="tx.id" class="group">
                <td class="px-3 py-3 text-[0.85rem] border-b border-white/[0.03] last:border-0 align-middle">
                  <div class="flex items-center gap-2.5">
                    <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="tx.type === 'income' ? 'bg-[#10b981]' : 'bg-[#f43f5e]'" />
                    <span class="font-medium text-[#f3f4f6]">{{ tx.description || tx.category }}</span>
                  </div>
                </td>
                <td class="px-3 py-3 text-[0.85rem] border-b border-white/[0.03] align-middle hidden sm:table-cell">
                  <span class="text-[#9ca3af] bg-[#171a26] border border-[#222533] px-1.5 py-0.5 rounded text-[0.75rem]">{{ tx.category }}</span>
                </td>
                <td class="px-3 py-3 text-[0.85rem] border-b border-white/[0.03] align-middle hidden md:table-cell">
                  <span class="text-[#9ca3af] text-[0.8rem]">{{ formatDate(tx.date) }}</span>
                </td>
                <td class="px-3 py-3 text-[0.85rem] border-b border-white/[0.03] align-middle text-right">
                  <span class="font-semibold tabular-nums" :class="tx.type === 'income' ? 'text-[#10b981]' : 'text-[#f3f4f6]'">
                    {{ tx.type === 'income' ? '+' : '-' }}{{ formatIDR(tx.amount) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Expense Breakdown -->
      <div class="card flex flex-col">
        <div class="mb-5">
          <h3 class="m-0 text-[0.95rem] font-semibold text-[#f3f4f6]">Rincian Pengeluaran</h3>
          <p class="mt-0.5 mb-0 text-[0.75rem] text-[#9ca3af]">Distribusi pengeluaran per kategori</p>
        </div>

        <div v-if="categoryBreakdown.length === 0" class="flex flex-col items-center justify-center py-12 text-[#9ca3af] text-[0.82rem] gap-2">
          <span>Belum ada data pengeluaran.</span>
        </div>

        <div v-else class="flex flex-col gap-4">
          <div v-for="cat in categoryBreakdown" :key="cat.name" class="flex flex-col gap-1.5">
            <div class="flex justify-between items-center text-[0.85rem]">
              <span class="font-medium text-[#f3f4f6]">{{ cat.name }}</span>
              <span class="font-semibold text-[#f3f4f6]">
                {{ formatIDR(cat.amount) }}
                <span class="font-normal text-[#9ca3af] text-[0.75rem]">({{ cat.pct.toFixed(0) }}%)</span>
              </span>
            </div>
            <div class="h-1 bg-[#171a26] rounded-sm overflow-hidden">
              <div
                class="h-full bg-[#6366f1] rounded-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                :style="{ width: cat.pct + '%' }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const props = defineProps({
  summary: { type: Object, required: true },
  transactions: { type: Array, required: true },
  walletSummary: { type: Object, required: true },
  monthlySummary: { type: Array, required: true }
});

const formatIDR = (value) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

const kpiCards = computed(() => [
  {
    label: 'Total Saldo',
    value: props.summary.balance,
    className: props.summary.balance >= 0 ? 'income' : 'expense',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>`
  },
  {
    label: 'Total Pemasukan',
    value: props.summary.totalIncome,
    className: 'income',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`
  },
  {
    label: 'Total Pengeluaran',
    value: props.summary.totalExpense,
    className: 'expense',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>`
  },
]);

const recentTx = computed(() => props.transactions.slice(0, 7));

const categoryBreakdown = computed(() => {
  const map = {};
  props.transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });

  const total = Object.values(map).reduce((s, v) => s + v, 0) || 1;
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([name, amount]) => ({ name, amount, pct: (amount / total) * 100 }));
});

const formatDate = (d) => {
  return new Date(d).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
};

// --- Chart Configurations ---

const barChartData = computed(() => {
  const sorted = [...props.monthlySummary].reverse();
  return {
    labels: sorted.map(m => {
      const d = new Date(m.month + '-01');
      return d.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
    }),
    datasets: [
      {
        label: 'Pemasukan',
        backgroundColor: '#10b981',
        data: sorted.map(m => m.income),
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.8
      },
      {
        label: 'Pengeluaran',
        backgroundColor: '#f43f5e',
        data: sorted.map(m => m.expense),
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.8
      }
    ]
  };
});

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: { labels: { color: '#9ca3af', usePointStyle: true, boxWidth: 6 } },
    tooltip: {
      backgroundColor: '#171a26',
      titleColor: '#f3f4f6',
      bodyColor: '#9ca3af',
      borderColor: '#222533',
      borderWidth: 1,
      callbacks: {
        label: (context) => ` ${context.dataset.label}: ${formatIDR(context.raw)}`
      }
    }
  },
  scales: {
    x: { grid: { color: '#222533', drawBorder: false }, ticks: { color: '#9ca3af' } },
    y: { grid: { color: '#222533', drawBorder: false }, ticks: { color: '#9ca3af' } }
  }
};

const doughnutChartData = computed(() => {
  return {
    labels: categoryBreakdown.value.map(c => c.name),
    datasets: [
      {
        backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', '#8b5cf6', '#ec4899', '#14b8a6'],
        borderColor: '#11131c',
        borderWidth: 2,
        hoverOffset: 4,
        data: categoryBreakdown.value.map(c => c.amount)
      }
    ]
  };
});

const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { 
      position: 'right', 
      labels: { color: '#9ca3af', usePointStyle: true, boxWidth: 8, padding: 15 } 
    },
    tooltip: {
      backgroundColor: '#171a26',
      titleColor: '#f3f4f6',
      bodyColor: '#9ca3af',
      borderColor: '#222533',
      borderWidth: 1,
      callbacks: {
        label: (context) => ` ${context.label}: ${formatIDR(context.raw)}`
      }
    }
  },
  cutout: '70%'
};
</script>
