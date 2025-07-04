import { component$, useStore, $, useVisibleTask$ } from '@builder.io/qwik';
import { P9ETable } from '~/components/table';


// const API_URL = 'http://localhost:8080/api/v1';
const API_URL = 'https://ugcl-429789556411.asia-south1.run.app/api/v1';

export default component$(() => {
  // User table state
  const vehicle_log = useStore<{
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

  // Fetch vehicle_log with bearer token
  const fetchvehicle_log = $(async (vehicle_logStore: typeof vehicle_log, page = vehicle_logStore.page) => {
    vehicle_log.loading = true;
    vehicle_log.error = '';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/vehiclelog?page=${page+1}&limit=${vehicle_log.limit}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch: ' + res.statusText);
      const result = await res.json();
      vehicle_log.data = result.data;
      vehicle_log.page = result.page -1;
      vehicle_log.total = result.total;
      // totalCountSignal.value = result.total;
    } catch (e: any) {
      vehicle_log.error = e.message || 'Could not load vehicle_log';
    } finally {
      vehicle_log.loading = false;
    }
  });

  useVisibleTask$(async () => {
    fetchvehicle_log(vehicle_log);
  });


  return (
    <div class="mx-auto container px-4">
      <div class="flex flex-col md:flex-row gap-8 items-start">
        <div class="flex-[2] min-w-0 dark:bg-dark-800 card-shadow bg-white">
          
          <P9ETable
            header={[
 { key: 'email', label: 'Email' },
  { key: 'site_location', label: 'Site Location' },
  { key: 'working_zone', label: 'Working Zone' },
  { key: 'date', label: 'Date' },
  { key: 'vehicle_type', label: 'Vehicle Type' },
  { key: 'registration_number', label: 'Vehicle No.' },
  { key: 'owner_name', label: 'Owner Name' },
  { key: 'driver_name', label: 'Driver Name' },
  { key: 'reading_total_km_hrs', label: 'KM/Hrs' },
  { key: 'total_working_hours', label: 'Working Hours' },
  { key: 'diesel_issued_litres', label: 'Diesel (Litres)' },
  { key: 'work_description', label: 'Work Description' },
  { key: 'siteEngineerName', label: 'Engineer Name' },
  { key: 'siteEngineerPhone', label: 'Engineer Phone' },
  { key: 'starting_reading_files', label: 'Start Reading Photos' },
{ key: 'closing_reading_files', label: 'End Reading Photos' },
{ key: 'work_images', label: 'Work Photos' },
  { key: 'latitude', label: 'Latitude' },
  { key: 'longitude', label: 'Longitude' },
  { key: 'submittedAt', label: 'Submitted At' }
]}
            data={vehicle_log.data}
            defaultLimit={10}
            title="vehicle_log List"
            enableSearch
            enableSort
            serverPagination
            totalCount={vehicle_log.total}
            onPageChange$={async (page) => {
              await fetchvehicle_log(vehicle_log, page); // fetch and update vehicle_log store
              return [...vehicle_log.data];
            }}
          />
          
        </div>
      </div>
    </div>
  );
});
