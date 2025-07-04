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
  const Material = useStore<{
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

  // Fetch Material with bearer token
  const fetchMaterial = $(async (MaterialStore: typeof Material, page = MaterialStore.page) => {
    Material.loading = true;
    Material.error = '';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/material?page=${page+1}&limit=${Material.limit}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch: ' + res.statusText);
      const result = await res.json();
      Material.data = result.data;
      Material.page = result.page -1;
      Material.total = result.total;
      // totalCountSignal.value = result.total;
    } catch (e: any) {
      Material.error = e.message || 'Could not load Material';
    } finally {
      Material.loading = false;
    }
  });

  useVisibleTask$(async () => {
    fetchMaterial(Material);
  });


  return (
    <div class="mx-auto container px-4">
      <div class="flex flex-col md:flex-row gap-8 items-start">
        <div class="flex-[2] min-w-0 dark:bg-dark-800 card-shadow bg-white">
          
          <P9ETable
            header={[
 { key: 'nameOfSite', label: 'Site Name' },
  { key: 'materialOrService', label: 'Material/Service' },
  { key: 'description', label: 'Description' },
  { key: 'qtyRequiredNow', label: 'Required Qty' },
  { key: 'qtyPresentStock', label: 'Present Stock' },
  { key: 'estimatedCost', label: 'Estimated Cost' },
  { key: 'priority', label: 'Priority' },
  { key: 'expectedCompletionDate', label: 'Expected Completion' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'siteEngineerName', label: 'Engineer Name' },
  { key: 'phoneNumber', label: 'Phone' },
  { key: 'latitude', label: 'Latitude' },
  { key: 'longitude', label: 'Longitude' },
  { key: 'submittedAt', label: 'Submitted At' }
]}
            data={Material.data}
            defaultLimit={10}
            title="Material List"
            enableSearch
            enableSort
            serverPagination
            totalCount={Material.total}
            onPageChange$={async (page, limit) => {
              await fetchMaterial(Material, page); // fetch and update Material store
              return [...Material.data];
            }}
          />
          
        </div>
      </div>
    </div>
  );
});
