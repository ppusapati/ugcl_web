import { component$, useStore, $, useVisibleTask$ } from '@builder.io/qwik';
import { P9ETable } from '~/components/table';


// const API_URL = 'http://localhost:8080/api/v1';
const API_URL = 'https://ugcl-429789556411.asia-south1.run.app/api/v1';

export default component$(() => {
  // User table state
  const Contractor = useStore<{
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

  // Fetch Contractor with bearer token
  const fetchContractor = $(async (ContractorStore: typeof Contractor, page = ContractorStore.page) => {
    Contractor.loading = true;
    Contractor.error = '';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/contractor?page=${page+1}&limit=${Contractor.limit}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch: ' + res.statusText);
      const result = await res.json();
      Contractor.data = result.data;
      Contractor.page = result.page -1;
      Contractor.total = result.total;
      // totalCountSignal.value = result.total;
    } catch (e: any) {
      Contractor.error = e.message || 'Could not load Contractor';
    } finally {
      Contractor.loading = false;
    }
  });

  useVisibleTask$(async () => {
    fetchContractor(Contractor);
  });


  return (
    <div class="mx-auto container px-4">
      <div class="flex flex-col md:flex-row gap-8 items-start">
        <div class="flex-[2] min-w-0 dark:bg-dark-800 card-shadow bg-white">
          
          <P9ETable
            header={[
   { key: 'siteName', label: 'Site Name' },
  { key: 'contractorName', label: 'Contractor Name' },
  { key: 'contractorPhone', label: 'Contractor Phone' },
  { key: 'chainageFrom', label: 'Chainage From' },
  { key: 'chainageTo', label: 'Chainage To' },
  { key: 'actualMeters', label: 'Actual Meters' },
  { key: 'dieselTaken', label: 'Diesel Taken' },
  { key: 'vehicleType', label: 'Vehicle Type' },
  { key: 'woringHours', label: 'Working Hours' },
  { key: 'cardNumber', label: 'Card Number' },
  { key: 'siteEngineerName', label: 'Site Engineer' },
  { key: 'siteEngineerPhone', label: 'Engineer Phone' },
  { key: 'latitude', label: 'Latitude' },
  { key: 'longitude', label: 'Longitude' },
  { key: 'submittedAt', label: 'Submitted At' }
]}
            data={Contractor.data}
            defaultLimit={10}
            title="Contractor Form"
            enableSearch
            enableSort
            serverPagination
            totalCount={Contractor.total}
            onPageChange$={async (page) => {
              await fetchContractor(Contractor, page); // fetch and update Contractor store
              return [...Contractor.data];
            }}
          />
          
        </div>
      </div>
    </div>
  );
});
