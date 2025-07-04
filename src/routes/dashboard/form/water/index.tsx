import { component$, useStore, $, useVisibleTask$ } from '@builder.io/qwik';
import { P9ETable } from '~/components/table';


// const API_URL = 'http://localhost:8080/api/v1';
const API_URL = 'https://ugcl-429789556411.asia-south1.run.app/api/v1';

export default component$(() => {

  // User table state
  const water = useStore<{
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

  // Fetch water with bearer token
  const fetchwater = $(async (waterStore: typeof water, page = waterStore.page) => {
    water.loading = true;
    water.error = '';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/water?page=${page+1}&limit=${water.limit}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch: ' + res.statusText);
      const result = await res.json();
      water.data = result.data;
      water.page = result.page -1;
      water.total = result.total;
      // totalCountSignal.value = result.total;
    } catch (e: any) {
      water.error = e.message || 'Could not load water';
    } finally {
      water.loading = false;
    }
  });

  useVisibleTask$(async () => {
    fetchwater(water);
  });


  return (
    <div class="mx-auto container px-4">
      <div class="flex flex-col md:flex-row gap-8 items-start">
        <div class="flex-[2] min-w-0 dark:bg-dark-800 card-shadow bg-white">
          
          <P9ETable
            header={[
 { key: 'siteName', label: 'Site Name' },
  { key: 'purpose', label: 'Purpose' },
  { key: 'placeOfSupply', label: 'Place of Supply' },
  { key: 'tankerVehicleNumber', label: 'Vehicle Number' },
  { key: 'capacityInLiters', label: 'Capacity (L)' },
  { key: 'ratePerUnit', label: 'Rate/Unit (₹)' },
  { key: 'supplierName', label: 'Supplier Name' },
  { key: 'supplierPhone', label: 'Supplier Phone' },
  { key: 'siteEngineerName', label: 'Engineer Name' },
  { key: 'siteEngineerPhone', label: 'Engineer Phone' },
  { key: 'latitude', label: 'Latitude' },
  { key: 'longitude', label: 'Longitude' },
  { key: 'submittedAt', label: 'Submitted At' }
]}
            data={water.data}
            defaultLimit={10}
            title="water List"
            enableSearch
            enableSort
            serverPagination
            totalCount={water.total}
            onPageChange$={async (page) => {
              await fetchwater(water, page); // fetch and update water store
              return [...water.data];
            }}
          />
          
        </div>
      </div>
    </div>
  );
});
