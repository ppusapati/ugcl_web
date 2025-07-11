import { component$, useStore, $, useVisibleTask$ } from '@builder.io/qwik';
import { P9ETable } from '~/components/table';


// const API_URL = 'http://localhost:8080/api/v1';
const API_URL = 'https://ugcl-429789556411.asia-south1.run.app/api/v1';

export default component$(() => {
  // Form state
   // User table state
  const Diesel = useStore<{
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

  // Fetch Diesel with bearer token
  const fetchDiesel = $(async (DieselStore: typeof Diesel, page = DieselStore.page) => {
    Diesel.loading = true;
    Diesel.error = '';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/diesel?page=${page+1}&limit=${Diesel.limit}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch: ' + res.statusText);
      const result = await res.json();
      Diesel.data = result.data;
      Diesel.page = result.page -1;
      Diesel.total = result.total;
      // totalCountSignal.value = result.total;
    } catch (e: any) {
      Diesel.error = e.message || 'Could not load Diesel';
    } finally {
      Diesel.loading = false;
    }
  });

  useVisibleTask$(async () => {
    fetchDiesel(Diesel);
  });


  return (
    <div class="mx-auto container px-4">
      <div class="flex flex-col md:flex-row gap-8 items-start">
        <div class="flex-[2] min-w-0 dark:bg-dark-800 card-shadow bg-white">
          
          <P9ETable
            header={[
   { key: 'nameOfSite', label: 'Site Name' },
  { key: 'toWhom', label: 'To Whom' },
  { key: 'item', label: 'Item' },
  { key: 'cardNumber', label: 'Card Number' },
  { key: 'vehicleNumber', label: 'Vehicle Number' },
  { key: 'quantityInLiters', label: 'Quantity (Liters)' },
  { key: 'amountPaid', label: 'Amount Paid (₹)' },
  { key: 'meterReadingPhotos', label: 'Meter Photos' },
{ key: 'billPhotos', label: 'Bill Photos' },
  { key: 'contractorName', label: 'Contractor Name' },
  { key: 'contractorPhone', label: 'Contractor Phone' },
  { key: 'personFilled', label: 'Filled By' },
  { key: 'personPhone', label: 'Filled By (Phone)' },
  { key: 'latitude', label: 'Latitude' },
  { key: 'longitude', label: 'Longitude' },
  { key: 'submittedAt', label: 'Submitted At' }
]}
            data={Diesel.data}
            defaultLimit={10}
            title="Diesel Form"
            enableSearch
            enableSort
            serverPagination
            totalCount={Diesel.total}
            onPageChange$={async (page) => {
              await fetchDiesel(Diesel, page); // fetch and update Diesel store
              return [...Diesel.data];
            }}
          />
          
        </div>
      </div>
    </div>
  );
});
