import { component$, useStore, $, useVisibleTask$ } from '@builder.io/qwik';
import { P9ETable } from '~/components/table';


// const API_URL = 'http://localhost:8080/api/v1';
const API_URL = 'https://ugcl-429789556411.asia-south1.run.app/api/v1';

export default component$(() => {

  // User table state
  const payment = useStore<{
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

  // Fetch payment with bearer token
  const fetchpayment = $(async (paymentStore: typeof payment, page = paymentStore.page) => {
    payment.loading = true;
    payment.error = '';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/payment?page=${page+1}&limit=${payment.limit}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch: ' + res.statusText);
      const result = await res.json();
      payment.data = result.data;
      payment.page = result.page -1;
      payment.total = result.total;
      // totalCountSignal.value = result.total;
    } catch (e: any) {
      payment.error = e.message || 'Could not load payment';
    } finally {
      payment.loading = false;
    }
  });

  useVisibleTask$(async () => {
    fetchpayment(payment);
  });


  return (
    <div class="mx-auto container px-4">
      <div class="flex flex-col md:flex-row gap-8 items-start">
        <div class="flex-[2] min-w-0 dark:bg-dark-800 card-shadow bg-white">
          
          <P9ETable
            header={[
 { key: 'nameOfSite', label: 'Site Name' },
  { key: 'requestType', label: 'Request Type' },
  { key: 'purpose', label: 'Purpose' },
  { key: 'beneficiaryName', label: 'Beneficiary Name' },
  { key: 'billValue', label: 'Bill Value (₹)' },
  { key: 'paymentType', label: 'Payment Type' },
  { key: 'priority', label: 'Priority' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'siteEngineerName', label: 'Engineer Name' },
  { key: 'siteEngineerPhone', label: 'Engineer Phone' },
  { key: 'latitude', label: 'Latitude' },
  { key: 'longitude', label: 'Longitude' },
  { key: 'submittedAt', label: 'Submitted At' }
]}
            data={payment.data}
            defaultLimit={10}
            title="payment List"
            enableSearch
            enableSort
            serverPagination
            totalCount={payment.total}
            onPageChange$={async (page) => {
              await fetchpayment(payment, page); // fetch and update payment store
              return [...payment.data];
            }}
          />
          
        </div>
      </div>
    </div>
  );
});
