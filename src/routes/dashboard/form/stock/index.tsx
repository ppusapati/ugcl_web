import { component$, useStore, $, useVisibleTask$ } from '@builder.io/qwik';
import { P9ETable } from '~/components/table';


// const API_URL = 'http://localhost:8080/api/v1';
const API_URL = 'https://ugcl-429789556411.asia-south1.run.app/api/v1';

export default component$(() => {
  // Form state
  const form = useStore({
    error: '',
    success: '',
    loading: false,
  });

  // User table state
  const stock = useStore<{
    data: any[];
    loading: boolean;
    error: string;
    page: number;
    limit: number;
    total: number;
  }>({
    data: [],
    loading: true,
    error: '',
    page: 1,
    limit: 10,
    total: 0,
  });

  // Fetch stock with bearer token
  const fetchstock = $(async (stockStore: typeof stock, page = stockStore.page) => {
    stock.loading = true;
    stock.error = '';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/stock?page=${page+1}&limit=${stock.limit}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch: ' + res.statusText);
      const result = await res.json();
      stock.data = result.data;
      stock.page = result.page -1;
      stock.total = result.total;
      // totalCountSignal.value = result.total;
    } catch (e: any) {
      stock.error = e.message || 'Could not load stock';
    } finally {
      stock.loading = false;
    }
  });

  useVisibleTask$(async () => {
    fetchstock(stock);
  });


  return (
    <div class="mx-auto container px-4">
      <div class="flex flex-col md:flex-row gap-8 items-start">
        <div class="flex-[2] min-w-0 dark:bg-dark-800 card-shadow bg-white">
          
          <P9ETable
            header={[
 { key: 'inOut', label: 'IN / OUT' },
  { key: 'yardName', label: 'Yard Name' },
  { key: 'invoiceDate', label: 'Invoice Date' },
  { key: 'companyName', label: 'Company Name' },
  { key: 'itemDescription', label: 'Item Description' },
  { key: 'specialItemDescription', label: 'Special Item' },
  { key: 'pipeDia', label: 'Pipe Dia' },
  { key: 'totalLength', label: 'Total Length' },
  { key: 'itemQuantity', label: 'Quantity' },
  { key: 'specialsDetail', label: 'Specials Detail' },
  { key: 'defectiveMaterial', label: 'Defective Material' },
  { key: 'contractorName', label: 'Contractor Name' },
  { key: 'labelNumber', label: 'Label No.' },
  { key: 'vehicleNumber', label: 'Vehicle No.' },
  { key: 'yardInchargeName', label: 'Yard Incharge' },
  { key: 'yardInchargePhone', label: 'Incharge Phone' },
  { key: 'latitude', label: 'Latitude' },
  { key: 'longitude', label: 'Longitude' },
  { key: 'submittedAt', label: 'Submitted At' }
]}
            data={stock.data}
            defaultLimit={10}
            title="stock List"
            enableSearch
            enableSort
            serverPagination
            totalCount={stock.total}
            onPageChange$={async (page, limit) => {
              await fetchstock(stock, page); // fetch and update stock store
              return [...stock.data];
            }}
          />
          
        </div>
      </div>
    </div>
  );
});
