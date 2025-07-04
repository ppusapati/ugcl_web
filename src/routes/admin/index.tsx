import { component$ } from '@builder.io/qwik';

export default component$(() => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>You're logged in. Protected content will appear here.</p>
    </div>
  );
});
