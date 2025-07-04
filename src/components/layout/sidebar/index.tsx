import { component$ } from '@builder.io/qwik';
import { Menu } from '../../utility/menu';
import { useLocation } from '@builder.io/qwik-city';


export const Sidebar = component$(({ sidebarRef }: { sidebarVisible: { value: boolean }, sidebarRef: { value: Element | undefined } }) => {
  const location = useLocation();

  const recruitments = [
    { name: 'Dashboard', link: '/admin/recruitments', icon:'i-mdi-view-dashboard'  },
    { name: 'Job Listings', link: '/admin/recruitments/listings',  icon:'i-mdi-list-box'  },
    { name: 'Candidate Profiles', link: '/admin/recruitments/search',  icon:'i-mdi-account-supervisor'  },
    { name: 'Approved Candidates', link: '/admin/recruitments/applications',  icon:'i-mdi-application'  },
    { name: 'Interview Management', link: '/admin/recruitments/interview',  icon:'i-mdi-chat-processing'  },
    { name: 'Assessment Evaluation', link: '/admin/recruitments/assessment',  icon:'i-mdi-chart-box-multiple'  },
    { name: 'Reports', link: '#',  icon:'i-mdi-chart-scatter-plot'  },
  ];
  
  const projects = [
    { name: 'Dashboard', link: '/admin/projects', icon:'i-mdi-view-dashboard'  },
    { name: 'Add Projects', link: '/admin/projects/add',  icon:'i-carbon-ibm-cloud-projects'  },
    { name: 'Assign Teams', link: '/admin/projects/assign',  icon:'i-carbon-group-objects'  },
    { name: 'Tasks', link: '/admin/projects/tasks',  icon:'i-clarity-tasks-solid'  },
    { name: 'Status', link: '/admin/projects/status',  icon:'i-carbon-ai-status'  },
    { name: 'Reports', link: '#',  icon:'i-mdi-chart-scatter-plot'  },
  ];

  // Determine which menu to display based on the route
  const currentMenu = location.url.pathname.startsWith('/admin/recruitments') ? recruitments : projects;

  return (

    <aside ref={sidebarRef} id="logo-sidebar" class={[
      'fixed top-0 left-0 z-40 w-64 h-screen pt-30  transition-transform',
      'bg-white border-r border-gray-200 border-solid  lg:translate-x-0 dark:bg-gray-800 dark:border-gray-700',
    ]}
    aria-label="Sidebar"
  >
    <div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
     <Menu items={currentMenu} />
     
    </div>
  </aside>
  );
});
