import { component$, useStore, $, useVisibleTask$ } from '@builder.io/qwik';
import { P9ETable } from '~/components/table';


// const API_URL = 'http://localhost:8080/api/v1';
const API_URL = 'https://ugcl-429789556411.asia-south1.run.app/api/v1';

export default component$(() => {
  // Form state
  // User table state
  const DairySite = useStore<{
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

  // Fetch DairySite with bearer token
  const fetchDairySite = $(async (DairySiteStore: typeof DairySite, page = DairySiteStore.page) => {
    DairySite.loading = true;
    DairySite.error = '';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/dairysite?page=${page+1}&limit=${DairySite.limit}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch: ' + res.statusText);
      const result = await res.json();
     DairySite.data = result.data;
     console.log("sdjkfha:", result.data)
      DairySite.page = result.page -1;
      DairySite.total = result.total;
      // totalCountSignal.value = result.total;
    } catch (e: any) {
      DairySite.error = e.message || 'Could not load DairySite';
    } finally {
      DairySite.loading = false;
    }
  });

  useVisibleTask$(async () => {
    fetchDairySite(DairySite);
  });


  return (
    <div class="mx-auto container px-4">
      <div class="flex flex-col md:flex-row gap-8 items-start">
        <div class="flex-[2] min-w-0 dark:bg-dark-800 card-shadow overflow-x: auto; width: 100%; bg-white">
          
          <P9ETable
            header={[
  { key: 'nameOfSite', label: 'Site Name' },
  { key: 'todaysWork', label: "Today's Work" },
  { key: 'siteEngineerName', label: 'Engineer Name' },
  { key: 'siteEngineerPhone', label: 'Engineer Phone' },
  { key: 'latitude', label: 'Latitude' },
  { key: 'longitude', label: 'Longitude' },
  { key: 'submittedAt', label: 'Submitted At' },
]}
            data={DairySite.data}
            defaultLimit={10}
            title="DairySite List"
            enableSearch
            enableSort
            serverPagination
            totalCount={DairySite.total}
            onPageChange$={async (page) => {
              await fetchDairySite(DairySite, page);
              console.log('🔁 Page', page, 'returned'); // fetch and update DairySite store
              return [...DairySite.data];
            }}
          />
          
        </div>
      </div>
    </div>
  );
});
