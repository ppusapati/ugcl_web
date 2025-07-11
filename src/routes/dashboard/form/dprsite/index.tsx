import { component$, useStore, $, useVisibleTask$ } from '@builder.io/qwik';
import { P9ETable } from '~/components/table';


// const API_URL = 'http://localhost:8080/api/v1';
const API_URL = 'https://ugcl-429789556411.asia-south1.run.app/api/v1';

export default component$(() => {
   // User table state
  const DPRSite = useStore<{
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

  // Fetch DPRSite with bearer token
  const fetchDPRSite = $(async (DPRSiteStore: typeof DPRSite, page = DPRSiteStore.page) => {
    DPRSite.loading = true;
    DPRSite.error = '';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/dprsite?page=${page+1}&limit=${DPRSite.limit}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch: ' + res.statusText);
      const result = await res.json();
      DPRSite.data = result.data;
      DPRSite.page = result.page -1;
      DPRSite.total = result.total;
      // totalCountSignal.value = result.total;
    } catch (e: any) {
      DPRSite.error = e.message || 'Could not load DPRSite';
    } finally {
      DPRSite.loading = false;
    }
  });

  useVisibleTask$(async () => {
    fetchDPRSite(DPRSite);
  });


  return (
    <div class="mx-auto container px-4">
      <div class="flex flex-col md:flex-row gap-8 items-start">
        <div class="flex-[2] min-w-0 dark:bg-dark-800 card-shadow bg-white">
          
          <P9ETable
            header={[
   { key: 'nameOfSite', label: 'Site Name' },
  { key: 'labelNumber', label: 'Label No.' },
  { key: 'classOfPipes', label: 'Class of Pipes' },
  { key: 'materialOfPipe', label: 'Pipe Material' },
  { key: 'pipeDia', label: 'Pipe Diameter' },
  { key: 'typeOfWorks', label: 'Work Type' },
  { key: 'chainageFrom', label: 'Chainage From' },
  { key: 'chainageTo', label: 'Chainage To' },
  { key: 'actualMetersLaidOnDay', label: 'Meters Laid Today' },
  { key: 'width', label: 'Width' },
  { key: 'lineType', label: 'Line Type' },
  { key: 'dieselIssuedInLitres', label: 'Diesel' },
  { key: 'amountInRs', label: 'Amount (₹)' },
  { key: 'cardNumber', label: 'Diesel Card No.' },
  { key: 'nameOfContractor', label: 'Contractor Name' },
  { key: 'phoneNumberOfContractor', label: 'Contractor Phone' },
  { key: 'nameOfSiteEngineer', label: 'Site Engineer' },
  { key: 'phoneNumberOfSiteEngineer', label: 'Engineer Phone' },
  { key: 'latitude', label: 'Latitude' },
  { key: 'longitude', label: 'Longitude' },
  { key: 'submittedAt', label: 'Submitted At' },
]}
            data={DPRSite.data}
            defaultLimit={10}
            title="DPRSite Form"
            enableSearch
            enableSort
            serverPagination
            totalCount={DPRSite.total}
            onPageChange$={async (page) => {
              await fetchDPRSite(DPRSite, page); // fetch and update DPRSite store
              return [...DPRSite.data];
            }}
          />
          
        </div>
      </div>
    </div>
  );
});
