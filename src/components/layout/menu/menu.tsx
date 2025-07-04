import { component$} from '@builder.io/qwik';

interface MenuItem {
  name: string;
  link: string;
  icon: string;
}

interface MenuProps {
  items: MenuItem[];
}

export const Menu = component$((props: MenuProps) => {
  return (
    
      <ul space-y-2 font-medium list-none p-4>
        {props.items.map((item) => (
          <li key={item.name}>
            <a class='flex items-center p-2 text-primary-900 rounded-lg hover:text-secondary-500 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 no-underline' href={item.link}>
            <span class={item.icon}/> 
            <span class='ms-3'>{item.name}</span>
            </a>
          </li>
        ))}
      </ul>
  );
});
