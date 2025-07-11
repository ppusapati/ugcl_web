import { component$, useStore, $, useVisibleTask$ } from '@builder.io/qwik';
import { P9ETable } from '~/components/table';


// const API_URL = 'http://localhost:8080/api/v1';
const API_URL = 'https://ugcl-429789556411.asia-south1.run.app/api/v1';

export default component$(() => {


  // User table state
  const wrapping = useStore<{
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

  // Fetch wrapping with bearer token
  const fetchwrapping = $(async (wrappingStore: typeof wrapping, page = wrappingStore.page) => {
    wrapping.loading = true;
    wrapping.error = '';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/wrapping?page=${page+1}&limit=${wrapping.limit}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch: ' + res.statusText);
      const result = await res.json();
      wrapping.data = result.data;
      wrapping.page = result.page -1;
      wrapping.total = result.total;
      // totalCountSignal.value = result.total;
    } catch (e: any) {
      wrapping.error = e.message || 'Could not load wrapping';
    } finally {
      wrapping.loading = false;
    }
  });

  useVisibleTask$(async () => {
    fetchwrapping(wrapping);
  });


  return (
    <div class="mx-auto container px-4">
      <div class="flex flex-col md:flex-row gap-8 items-start">
        <div class="flex-[2] min-w-0 dark:bg-dark-800 card-shadow bg-white">
          
          <P9ETable
            header={[
 { key: 'yardName', label: 'Yard Name' },
  { key: 'contractorName', label: 'Contractor Name' },
  { key: 'activity', label: 'Activity' },
  { key: 'pipeNo', label: 'Pipe No.' },
  { key: 'lengthOfPipe', label: 'Pipe Length' },
  { key: 'squareMeters', label: 'Area (Sq. m)' },
  { key: 'siteEngineerName', label: 'Engineer Name' },
  { key: 'siteEngineerPhone', label: 'Engineer Phone' },
  { key: 'latitude', label: 'Latitude' },
  { key: 'longitude', label: 'Longitude' },
  { key: 'submittedAt', label: 'Submitted At' }
]}
            data={wrapping.data}
            defaultLimit={10}
            title="Wrapping Form"
            enableSearch
            enableSort
            serverPagination
            totalCount={wrapping.total}
            onPageChange$={async (page) => {
              await fetchwrapping(wrapping, page); // fetch and update wrapping store
              return [...wrapping.data];
            }}
          />
          
        </div>
      </div>
    </div>
  );
});
