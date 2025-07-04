import { component$, useStore, $, useVisibleTask$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { InitialValues } from '@modular-forms/qwik';
import { DynamicForm, FormField, P9EForm } from '~/components/form_generator';
import { P9ETable } from '~/components/table';


// const API_URL = 'http://localhost:8080/api/v1';
const API_URL = 'https://ugcl-429789556411.asia-south1.run.app/api/v1';

type UserForm = {
  name: string;
  phone: string;
  email: string;
  password: string;
  role: string;
};
export const useCandidateFormLoader = routeLoader$<InitialValues<UserForm>>(() => ({
  name: '',
  phone: '',
  email: '',
  password: '',
  role: '',
}));
export default component$(() => {
  const formSchema: FormField<UserForm>[] = [

    { type: 'text', name: 'name', label: 'Full Name', required: true, placeholder: 'Enter username' },
    { type: 'text', name: 'phone', label: 'Phone Number', required: true, placeholder: 'Enter phone' },
    { type: 'text', name: 'email', label: 'Email', required: true, placeholder: 'Enter email' },
    { type: 'password', name: 'password', label: 'Password', required: true, placeholder: 'Enter password' },
    {
      type: 'select', name: 'role', label: 'Role', required: true,
      options: [
        { label: 'Employee', value: 'Employee' },
        { label: 'Contractor', value: 'Contractor' },
        { label: 'Admin', value: 'Admin' },
      ]
    },
  ];
  // Form state
  const form = useStore({
    error: '',
    success: '',
    loading: false,
  });

  // User table state
  const users = useStore<{
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

  // Fetch users with bearer token
  const fetchUsers = $(async (usersStore: typeof users, page = usersStore.page) => {
    users.loading = true;
    users.error = '';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/users?page=${page+1}&limit=${users.limit}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch: ' + res.statusText);
      const result = await res.json();
      users.data = result.data;
      users.page = result.page -1;
      users.total = result.total;
      // totalCountSignal.value = result.total;
    } catch (e: any) {
      users.error = e.message || 'Could not load users';
    } finally {
      users.loading = false;
    }
  });

  useVisibleTask$(async () => {
    fetchUsers(users);
  });

  // Form submit handler
  const handleSubmit = $(async (data: any) => {
    // e.preventDefault();
    form.loading = true;
    form.error = '';
    form.success = '';
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to register');
      }
      form.success = 'User added!';
      await fetchUsers(users);
    } catch (e: any) {
      form.error = e.message;
      alert(e.message);
    }
  });

  const candidateLoader = useCandidateFormLoader();
  return (
    <div class="mx-auto container px-4">
      <div class="flex flex-col md:flex-row gap-8 items-start">
        <div class="flex-[2] min-w-0 dark:bg-dark-800 card-shadow bg-white">
          
          <P9ETable
            header={[
              { key: 'name', label: 'Name' },
              { key: 'email', label: 'Email' },
              { key: 'phone', label: 'Phone' },
              { key: 'role', label: 'Role' },
            ]}
            data={users.data}
            defaultLimit={10}
            title="Users List"
            enableSearch
            enableSort
            serverPagination
            totalCount={users.total}
            onPageChange$={async (page, limit) => {
              await fetchUsers(users, page); // fetch and update users store
              return [...users.data];
            }}
          />
          
        </div>

        {/* Add User Form */}
        <div class="flex-1 max-w-md card-shadow p-6 rounded-xl bg-white dark:bg-dark-800">
          <DynamicForm heading='Add User' formFields={formSchema} formLoader={candidateLoader.value} onClick$={handleSubmit} />
          {form.error && <div class="alert-danger">{form.error}</div>}
          {form.success && <div class="alert-success">{form.success}</div>}
        </div>
      </div>
    </div>
  );
});
