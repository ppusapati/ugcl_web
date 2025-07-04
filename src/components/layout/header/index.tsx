import { component$, $, useSignal, useContext } from '@builder.io/qwik';
import { Link, useNavigate } from '@builder.io/qwik-city';
import { P9EThemeToggle } from '~/components/utility';

import Image from "/public/images/logo.jpg?jsx";
import { GlobalStoreContext } from '~/globalStore';


export default component$(({ toggleSidebar, sidebarVisible }: { toggleSidebar: () => void, sidebarVisible: { value: boolean } }) => {
  const dropdownVisible = useSignal(false);
  const nav = useNavigate();
  const ctx = useContext(GlobalStoreContext);
  const handleSubmit = $(() => {
    ctx.isAuth = false;
    nav('/auth');
  });
  const handleDropdownToggle = $(() => {
    dropdownVisible.value = !dropdownVisible.value;
  });
  return (
    <nav class="fixed top-0 z-50 w-full border-b border-gray-200 bg-white border-solid dark:bg-gray-800 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div class="flex items-center justify-start rtl:justify-end">
        <button
            data-drawer-target="logo-sidebar"
            data-drawer-toggle="logo-sidebar"
            aria-controls="logo-sidebar"
            type="button"
            onClick$={toggleSidebar}
            class="contents items-center p-0 text-sm md:hidden hover:bg-gray-100 border-none focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >        
            <span class="sr-only">Open sidebar</span>
            {sidebarVisible.value ? <span class='i-tabler-layout-sidebar-right-expand-filled h-6 w-6' /> : <span class='i-tabler-layout-sidebar-left-expand-filled h-6 w-6' /> }
          </button>
          <a href="/" class="flex ms-2 md:me-24 no-underline">
           <Image class='h-auto w-30 me-3' />
          </a>
        </div>
        <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          <li>
            <Link class='block py-2 px-3 text-xl text-white bg-primary-700 rounded md:bg-transparent md:text-primary-700 md:p-0 dark:text-white md:dark:text-primary-500 no-underline' href='/dashboard/'>Home</Link>
          </li>
          <li>
            <Link class='block py-2 px-3 text-xl text-white bg-primary-700 rounded md:bg-transparent md:text-primary-700 md:p-0 dark:text-white md:dark:text-primary-500 no-underline' href='/admin/recruitments/'>Recruitments</Link>
          </li><li>
            <Link class='block py-2 px-3 text-xl text-white bg-primary-700 rounded md:bg-transparent md:text-primary-700 md:p-0 dark:text-white md:dark:text-primary-500 no-underline' href='/admin/projects/'>Projects</Link>
          </li><li>
            <Link class='block py-2 px-3 text-xl text-white bg-primary-700 rounded md:bg-transparent md:text-primary-700 md:p-0 dark:text-white md:dark:text-primary-500 no-underline' href='#'>Document System</Link>
          </li><li>
            <Link class='block py-2 px-3 text-xl text-white bg-primary-700 rounded md:bg-transparent md:text-primary-700 md:p-0 dark:text-white md:dark:text-primary-500 no-underline' href='#'>Content Managment</Link>
          </li>
          <li>
            <Link class='block py-2 px-3 text-xl text-white bg-primary-700 rounded md:bg-transparent md:text-primary-700 md:p-0 dark:text-white md:dark:text-primary-500 no-underline' href='/admin/settings/'>System Settings</Link>
          </li>
        </ul>
        <div class="flex items-center">
          <div class="inline-flex gap-col-5">
   <span class='pt-1.5'><P9EThemeToggle /></span>

              <button
                type="button"
                onClick$={handleDropdownToggle}
                class="flex text-sm bg-dark-100 rounded-full p-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-dark-100"
                aria-expanded="false"
                data-dropdown-toggle="dropdown-user"
              >
                <span class="sr-only">Open user menu</span>
                <img
                  class="w-8 h-8 rounded-full"
                  src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                  alt="user photo"
                />
              </button>
            {dropdownVisible.value &&(
           <div id="dropdownAvatar" class="flex flex-col items-center absolute right-0 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
           <div class="px-4 py-3 text-sm text-gray-900 dark:text-white">
             <div>Bonnie Green</div>
             <div class="font-medium truncate">name@flowbite.com</div>
           </div>
           <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownUserAvatarButton">
             <li>
               <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
             </li>
             <li>
               <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
             </li>
             <li>
               <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
             </li>
           </ul>
           <div class="py-2">
             <Link onClick$={handleSubmit}  class="btn btn-success btns-lg">Sign out</Link>
           </div>
       </div>
            )}
          </div>
        </div>
      </div>
  </nav>

  );
});
