import {
  component$,
  useStore,
  $,
  useVisibleTask$
} from '@builder.io/qwik';
import { P9ETable } from '~/components/table';

const API_URL = 'https://ugcl-429789556411.asia-south1.run.app/api/v1';

// 🔁 Map internal form keys to display labels
const formLabelMap: Record<string, string> = {
  dairysite: 'Dairy Site',
  diesel: 'Diesel',
  painting: 'Painting',
  contractor: 'Contractor',
  material: 'Material',
  mnr: 'NMR',
  nmr_vehicle: 'NMR Vehicle',
  vehiclelog: 'Vehicle Log',
  tasks: 'Tasks',
  payment: 'Payment',
  stock: 'Stock',
  water: 'Water',
  eway: 'E-Way',
  wrapping: 'Wrapping',
  dprsite: 'DPR Site'
};

export default component$(() => {
  const formState = useStore({
    selectedForm: 'dairysite',
    forms: [
      'dairysite', 'diesel', 'painting', 'contractor', 'material',
      'mnr', 'nmr_vehicle', 'vehiclelog', 'tasks', 'payment',
      'stock', 'water', 'eway', 'wrapping', 'dprsite'
    ],
    headers: [] as { key: string; label: string }[],
    data: [] as any[],
    loading: false,
    error: '',
    page: 1,
    limit: 10,
    total: 0
  });

  const fetchData = $(async (store: typeof formState, page = store.page) => {
    store.loading = true;
    store.error = '';

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${API_URL}/admin/${store.selectedForm}?page=${page + 1}&limit=${store.limit}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (!res.ok) throw new Error('Failed to fetch: ' + res.statusText);

      const result = await res.json();
      const firstRow = result.data[0] || {};

      // Auto-generate headers from first row keys
     store.headers = Object.entries(firstRow)
  .filter(([key]) => key.toLowerCase() !== 'id') // ⛔ Exclude ID
  .map(([key, value]) => ({
    key,
    label: key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim(),
    type:
      typeof value === 'string' && value.includes('T') && value.includes('Z')
        ? 'date'
        : undefined
  }));

      // Preprocess data
      store.data = result.data.map((row: any) => {
  const newRow: Record<string, any> = {};
  for (const [key, value] of Object.entries(row)) {
    if (key.toLowerCase() === 'id') continue; // ⛔ Skip ID field
    if (Array.isArray(value)) {
      newRow[key] = value;
    } else if (typeof value === 'string' && value.includes('T') && value.includes('Z')) {
      const date = new Date(value);
      newRow[key] = isNaN(date.getTime()) ? value : date.toISOString();
    } else {
      newRow[key] = value;
    }
  }
  return newRow;
});

      // Force table refresh if page = 0
      if (store.page === 0) {
        const tableData = document.querySelector('[data-p9e-table]');
        if (tableData) tableData.dispatchEvent(new CustomEvent('refreshTable'));
      }

      store.page = result.page - 1;
      store.total = result.total;
    } catch (e: any) {
      store.error = e.message || 'Failed to load data';
    } finally {
      store.loading = false;
    }
  });

  useVisibleTask$(async () => {
    formState.page = 0;
    await fetchData(formState, 0);
  });

  return (
    <div class="mx-auto container px-4">
      <div class="flex flex-col gap-6">

        {/* 🔽 Dropdown to select form */}
        <select
          class="border p-2 w-fit"
          onChange$={async (e) => {
            formState.selectedForm = (e.target as HTMLSelectElement).value;
            formState.page = 1;
            await fetchData(formState, 0);
          }}
        >
          {formState.forms.map((formName) => (
            <option key={formName} value={formName}>
              {formLabelMap[formName] ?? (formName.charAt(0).toUpperCase() + formName.slice(1))}
            </option>
          ))}
        </select>

        {/* ✅ Table */}
        <P9ETable
          header={formState.headers}
          data={formState.data}
          defaultLimit={formState.limit}
          title={`${formLabelMap[formState.selectedForm] ?? formState.selectedForm} Form`}
          enableSearch
          enableSort
          serverPagination
          totalCount={formState.total}
          selectedForm={formState.selectedForm}
          onPageChange$={async (page) => {
            await fetchData(formState, page);
            return [...formState.data];
          }}
        />
      </div>
    </div>
  );
});
