import { component$, useStore, $, useVisibleTask$ } from '@builder.io/qwik';
import { P9ETable } from '~/components/table';


// const API_URL = 'http://localhost:8080/api/v1';
const API_URL = 'https://ugcl-429789556411.asia-south1.run.app/api/v1';

export default component$(() => {
  // Form state
  // User table state
  const Paintings = useStore<{
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

  // Fetch Paintings with bearer token
  const fetchPaintings = $(async (PaintingsStore: typeof Paintings, page = PaintingsStore.page) => {
    Paintings.loading = true;
    Paintings.error = '';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/painting?page=${page+1}&limit=${Paintings.limit}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch: ' + res.statusText);
      const result = await res.json();
      Paintings.data = result.data;
      Paintings.page = result.page -1;
      Paintings.total = result.total;
      // totalCountSignal.value = result.total;
    } catch (e: any) {
      Paintings.error = e.message || 'Could not load Paintings';
    } finally {
      Paintings.loading = false;
    }
  });

  useVisibleTask$(async () => {
    fetchPaintings(Paintings);
  });


  return (
    <div class="mx-auto container px-4">
      <div class="flex flex-col md:flex-row gap-8 items-start">
        <div class="flex-[2] min-w-0 dark:bg-dark-800 card-shadow bg-white">
          
          <P9ETable
            header={[
              { key: 'nameOfYard', label: 'Yard Name' },
  { key: 'contractorName', label: 'Contractor Name' },
  { key: 'workDoneActivity', label: 'Work Done' },
  { key: 'numberOfCoats', label: 'No. of Coats' },
  { key: 'diaOfPipe', label: 'Pipe Dia' },
  { key: 'pipeNo', label: 'Pipe No.' },
  { key: 'lengthOfPipe', label: 'Length' },
  { key: 'squareMeters', label: 'Area (Sq. m)' },
  { key: 'siteEngineerName', label: 'Engineer Name' },
  { key: 'phoneNumber', label: 'Phone' },
  { key: 'latitude', label: 'Latitude' },
  { key: 'longitude', label: 'Longitude' },
  { key: 'submittedAt', label: 'Submitted At' }
            ]}
            data={Paintings.data}
            defaultLimit={10}
            title="Paintings List"
            enableSearch
            enableSort
            serverPagination
            totalCount={Paintings.total}
            onPageChange$={async (page) => {
              await fetchPaintings(Paintings, page); // fetch and update Paintings store
              return [...Paintings.data];
            }}
          />
          
        </div>
      </div>
    </div>
  );
});
