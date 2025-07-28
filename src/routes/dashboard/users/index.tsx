import {
  component$,
  useStore,
  $,
  useVisibleTask$,
  useSignal
} from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { InitialValues } from '@modular-forms/qwik';
import { DynamicForm, FormField } from '~/components/form_generator';
import { P9ETable } from '~/components/table';

// const API_URL = 'https://ugcl-429789556411.asia-south1.run.app/api/v1';
const API_URL = 'http://localhost:8080/api/v1'; // Use local API for development
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
  const showModal = useSignal(false);

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

  const form = useStore({
    error: '',
    success: '',
    loading: false,
  });

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

  const fetchUsers = $(async (page = users.page, limit = users.limit) => {
    users.loading = true;
    users.error = '';
    console.log(limit);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/users?page=${page + 1}&limit=${users.limit}`, {
       headers: {
  Authorization: `Bearer ${token}`,
  'x-api-key': '87339ea3-1add-4689-ae57-3128ebd03c4f'
}
      });
      if (!res.ok) throw new Error('Failed to fetch: ' + res.statusText);

      const result = await res.json();
      const list = Array.isArray(result.data)
        ? result.data
        : result.data?.users ?? result.users ?? [];

      users.data = list;
      users.page = (result.page ?? result.data?.page ?? 1) - 1;
      users.total = result.total ?? result.data?.total ?? list.length;

      return list;
    } catch (e: any) {
      users.error = e.message || 'Could not load users';
    } finally {
      users.loading = false;
    }
  });

  useVisibleTask$(async () => {
    await fetchUsers(users.page, users.limit);
  });

  const handleSubmit = $(async (data: any) => {
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
      await fetchUsers(users.page, users.limit);
      showModal.value = false;
    } catch (e: any) {
      form.error = e.message;
      alert(e.message);
    } finally {
      form.loading = false;
    }
  });

  const candidateLoader = useCandidateFormLoader();

  return (
    <div class="mx-auto container px-4">
      <div class="flex flex-col md:flex-row gap-8 items-start">
        <div class="flex-[2] min-w-0 w-full">

          {/* 🔘 Add User Button */}
          <div class="flex justify-end mb-2">
            <button
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick$={() => showModal.value = true}
            >
              + Add User
            </button>
          </div>

          {/* ✅ Users Table */}
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
            serverPagination={true}
            totalCount={users.total}
            onPageChange$={$((p, l) => fetchUsers(p, l))}
          />
        </div>

        {/* Modal */}
        {showModal.value && (
          <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div class="bg-white dark:bg-dark-800 p-6 rounded-xl max-w-md w-full shadow-lg relative">
              {/* ❌ Close Button */}
              <button
                class="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                onClick$={() => showModal.value = false}
              >
                ✕
              </button>

              {/* 🧾 Add User Form */}
              <DynamicForm
                heading="Add User"
                formFields={formSchema}
                formLoader={candidateLoader.value}
                onClick$={handleSubmit}
              />
              {form.error && <div class="alert-danger">{form.error}</div>}
              {form.success && <div class="alert-success">{form.success}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
