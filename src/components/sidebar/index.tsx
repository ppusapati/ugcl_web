import { component$, useStore, useVisibleTask$, PropFunction } from '@builder.io/qwik';


const menuData = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: 'i-heroicons-home',
    href: '/dashboard',
    roles: ['super_admin', 'project_coordinator', 'engineer', 'other'], // Everyone
  },
  {
    key: 'Users',
    label: 'User Profile',
    icon: 'i-heroicons-user',
    href: '/dashboard/users',
    roles: ['super_admin'], // Only Super Admin
  },
  {
    key: 'report builder',
    label: 'Report Builder',
    icon: 'i-heroicons-chat-bubble-left-right',
    href: '/dashboard/report_builder',
    roles: ['super_admin'],
  },
  {
    key: 'form builder',
    label: 'Form Builder',
    icon: 'i-heroicons-envelope',
    href: '/dashboard/form_builder',
    roles: ['super_admin',],
  },
  {
    key: 'form',
    label: 'Reports',
    icon: 'i-formkit-filedoc',
    href: '/dashboard/form',
    roles: ['super_admin', 'project_coordinator'], // Only these roles
  },
];

export default component$((props: {
  collapsed: boolean;
  onToggle$: PropFunction<() => void>;
}) => {
  const state = useStore({
    userRole: '', // e.g., 'super_admin', 'project_coordinator'
  });

  useVisibleTask$(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        state.userRole = user.role; // adapt if your user object is nested
      }
    } catch (e) {
      console.error('Error reading user role from localStorage:', e);
      state.userRole = '';
    }
  });

  return (
    <aside class={[
      "fixed left-0 top-0 z-40 h-screen flex flex-col overflow-y-hidden",
      // GLASSY BORDER
      "border-r border-white/30 dark:border-white/10",
      // GLASSY BACKGROUND
      "bg-white/60 dark:bg-dark-800/70 backdrop-blur-md",
      // DROP SHADOW
      "shadow-lg",
      // WIDTH AND TRANSITION
      props.collapsed ? "w-20" : "w-64",
      "duration-300 ease-linear",
    ].join(' ')}>
      {/* Sidebar header/logo/collapse btn */}
      <div class="flex items-center justify-center pt-4 pb-4">
        <a href="/" class="flex flex-col items-center w-full  no-underline">
          {/* Large logo for expanded sidebar */}
          <img
            src="/logo.png"
            alt="Logo"
            class={[
              props.collapsed ? 'hidden' : 'block',
              'h-20 w-auto mb-2 transition-all dark:bg-white duration-200',
            ].join(' ')}
          />
          {/* Company name below logo (only when expanded) */}
          <span
            class={[
              props.collapsed ? 'hidden' : 'block',
              'text-lg font-bold text-center text-dark-900 dark:text-white',
            ].join(' ')}
          >
            Sree UGCL Projects Limited
          </span>
          {/* Small logo for collapsed sidebar */}
          <img
            src="/logo.png"
            alt="Logo Icon"
            class={[
              props.collapsed ? 'block' : 'hidden',
              'w-10',
            ].join(' ')}
          />
        </a>
      </div>
      <div class="block h-px mb-2 bg-gradient-to-b 
      from-black/40 via-black/10 to-transparent dark:from-white/20 dark:to-transparent rounded"></div>

      <nav class="flex-1 overflow-y-auto no-scrollbar">
      <ul class="flex flex-col gap-2 list-none p-2 m-0">
      {menuData
        .filter(item => item.roles.includes(state.userRole))
        .map((item) => (
          <li key={item.key}>
            <a
              href={item.href}
              class={[
                "flex px-4 py-2 rounded-lg transition-all no-underline text-dark-800 dark:text-white",
                "hover:bg-primary-50 dark:hover:bg-primary-900 dark:hover:text-light-100",
              ].join(' ')}
            >
              <span class={[item.icon, "w-5 h-5 text-black mr-3 dark:text-white"].join(' ')} />
              <span class={props.collapsed ? "hidden" : "block"}>{item.label}</span>
            </a>
          </li>
      ))}
    </ul>

      </nav>
    </aside>
  );
});
