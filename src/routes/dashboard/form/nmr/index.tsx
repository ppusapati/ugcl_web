import { component$, useStore, $, useVisibleTask$ } from '@builder.io/qwik';
import { P9ETable } from '~/components/table';


// const API_URL = 'http://localhost:8080/api/v1';
const API_URL = 'https://ugcl-429789556411.asia-south1.run.app/api/v1';

export default component$(() => {
    // User table state
  const nmr = useStore<{
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

  // Fetch nmr with bearer token
  const fetchnmr = $(async (nmrStore: typeof nmr, page = nmrStore.page) => {
    nmr.loading = true;
    nmr.error = '';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/mnr?page=${page+1}&limit=${nmr.limit}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch: ' + res.statusText);
      const result = await res.json();
      nmr.data = result.data;
      nmr.page = result.page -1;
      nmr.total = result.total;
      // totalCountSignal.value = result.total;
    } catch (e: any) {
      nmr.error = e.message || 'Could not load nmr';
    } finally {
      nmr.loading = false;
    }
  });

  useVisibleTask$(async () => {
    fetchnmr(nmr);
  });


  return (
    <div class="mx-auto container px-4">
      <div class="flex flex-col md:flex-row gap-8 items-start">
        <div class="flex-[2] min-w-0 dark:bg-dark-800 card-shadow bg-white">
          
          <P9ETable
            header={[
 { key: 'nameOfSite', label: 'Site Name' },
  { key: 'zoneName', label: 'Zone' },
  { key: 'workDescription', label: 'Work Description' },
  { key: 'skilledLabourCount', label: 'Skilled Labour' },
  { key: 'unskilledLabourCount', label: 'Unskilled Labour' },
  { key: 'womenCount', label: 'Women Count' },
  { key: 'labourType', label: 'Labour Type' },
  { key: 'startTime', label: 'Start Time' },
  { key: 'endTime', label: 'End Time' },
  { key: 'contractorName', label: 'Contractor Name' },
  { key: 'attendanceTakenBy', label: 'Taken By' },
  { key: 'attendancePhone', label: 'Phone' },
  { key: 'latitude', label: 'Latitude' },
  { key: 'longitude', label: 'Longitude' },
  { key: 'submittedAt', label: 'Submitted At' }
]}
            data={nmr.data}
            defaultLimit={10}
            title="nmr List"
            enableSearch
            enableSort
            serverPagination
            totalCount={nmr.total}
            onPageChange$={async (page) => {
              await fetchnmr(nmr, page); // fetch and update nmr store
              return [...nmr.data];
            }}
          />
          
        </div>
      </div>
    </div>
  );
});
