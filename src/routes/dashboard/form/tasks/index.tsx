import { component$, useStore, $, useVisibleTask$ } from '@builder.io/qwik';
import { P9ETable } from '~/components/table';


// const API_URL = 'http://localhost:8080/api/v1';
const API_URL = 'https://ugcl-429789556411.asia-south1.run.app/api/v1';

export default component$(() => {
   // User table state
  const tasks = useStore<{
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

  // Fetch tasks with bearer token
  const fetchtasks = $(async (tasksStore: typeof tasks, page = tasksStore.page) => {
    tasks.loading = true;
    tasks.error = '';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/tasks?page=${page+1}&limit=${tasks.limit}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch: ' + res.statusText);
      const result = await res.json();
      tasks.data = result.data;
      tasks.page = result.page -1;
      tasks.total = result.total;
      // totalCountSignal.value = result.total;
    } catch (e: any) {
      tasks.error = e.message || 'Could not load tasks';
    } finally {
      tasks.loading = false;
    }
  });

  useVisibleTask$(async () => {
    fetchtasks(tasks);
  });


  return (
    <div class="mx-auto container px-4">
      <div class="flex flex-col md:flex-row gap-8 items-start">
        <div class="flex-[2] min-w-0 dark:bg-dark-800 card-shadow bg-white">
          
          <P9ETable
            header={[
    { key: 'label', label: 'Label' },
  { key: 'location', label: 'Location' },
  { key: 'measurement', label: 'Measurement' },
  { key: 'taskType', label: 'Task Type' },
  { key: 'expectedCompletionDays', label: 'Expected Days' },
  { key: 'startDate', label: 'Start Date' },
  { key: 'endDate', label: 'End Date' },
  { key: 'pipeMaterial', label: 'Pipe Material' },
  { key: 'pipeDia', label: 'Pipe Dia' },
  { key: 'workAssignedBy', label: 'Assigned By' },
  { key: 'siteEngineerName', label: 'Engineer Name' },
  { key: 'siteEngineerPhone', label: 'Engineer Phone' },
  { key: 'latitude', label: 'Latitude' },
  { key: 'longitude', label: 'Longitude' },
  { key: 'submittedAt', label: 'Submitted At' }
]}
            data={tasks.data}
            defaultLimit={10}
            title="Tasks Form"
            enableSearch
            enableSort
            serverPagination
            totalCount={tasks.total}
            onPageChange$={async (page) => {
              await fetchtasks(tasks, page); // fetch and update tasks store
              return [...tasks.data];
            }}
          />
          
        </div>
      </div>
    </div>
  );
});
