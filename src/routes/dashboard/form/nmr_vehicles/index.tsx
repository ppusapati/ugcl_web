import { component$, useStore, $, useVisibleTask$ } from '@builder.io/qwik';
import { P9ETable } from '~/components/table';


// const API_URL = 'http://localhost:8080/api/v1';
const API_URL = 'https://ugcl-429789556411.asia-south1.run.app/api/v1';

export default component$(() => {
    // User table state
  const nmr_vehicle = useStore<{
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

  // Fetch nmr_vehicle with bearer token
  const fetchnmr_vehicle = $(async (nmr_vehicleStore: typeof nmr_vehicle, page = nmr_vehicleStore.page) => {
    nmr_vehicle.loading = true;
    nmr_vehicle.error = '';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/nmr_vehicle?page=${page+1}&limit=${nmr_vehicle.limit}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch: ' + res.statusText);
      const result = await res.json();
      nmr_vehicle.data = result.data;
      nmr_vehicle.page = result.page -1;
      nmr_vehicle.total = result.total;
      // totalCountSignal.value = result.total;
    } catch (e: any) {
      nmr_vehicle.error = e.message || 'Could not load nmr_vehicle';
    } finally {
      nmr_vehicle.loading = false;
    }
  });

  useVisibleTask$(async () => {
    fetchnmr_vehicle(nmr_vehicle);
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
  { key: 'vehicleType', label: 'Vehicle Type' },
  { key: 'workedHoursPerDay', label: 'Worked Hours/Day' },
  { key: 'uom', label: 'Unit of Measure' },
  { key: 'contractorName', label: 'Contractor Name' },
  { key: 'attendanceTakenBy', label: 'Taken By' },
  { key: 'attendancePhone', label: 'Phone' },
  { key: 'latitude', label: 'Latitude' },
  { key: 'longitude', label: 'Longitude' },
  { key: 'submittedAt', label: 'Submitted At' }
]}
            data={nmr_vehicle.data}
            defaultLimit={10}
            title="nmr_vehicle List"
            enableSearch
            enableSort
            serverPagination
            totalCount={nmr_vehicle.total}
            onPageChange$={async (page) => {
              await fetchnmr_vehicle(nmr_vehicle, page); // fetch and update nmr_vehicle store
              return [...nmr_vehicle.data];
            }}
          />
          
        </div>
      </div>
    </div>
  );
});
