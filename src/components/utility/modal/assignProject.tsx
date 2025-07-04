import { component$, useStore, $ } from "@builder.io/qwik";
import { Project } from "~/types";

// AssignProjectsModal Component
type AssignProjectsModalProps = {
    projects: Project[];
    assignedProjectUuids: string[];
    onClose$: () => void;
    onSave$: (selected: string[]) => void;
  };
  
  export const AssignProjectsModal = component$<AssignProjectsModalProps>(({ projects, assignedProjectUuids, onClose$, onSave$ }) => {
    const selectedProjects = useStore<string[]>([...assignedProjectUuids]);
  
    const toggleProjectSelection = $( (uuid: string) => {
      if (selectedProjects.includes(uuid)) {
        const index = selectedProjects.indexOf(uuid);
        selectedProjects.splice(index, 1);
      } else {
        selectedProjects.push(uuid);
      }
    });
  
    return (
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg w-1/2 max-w-lg">
          <h2 class="text-xl font-bold mb-4">Assign Projects to Team</h2>
          <div class="max-h-64 overflow-y-auto mb-4">
            {projects.map((project) => (
              <div key={project.uuid} class="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={selectedProjects.includes(project.uuid)}
                  onChange$={() => toggleProjectSelection(project.uuid)}
                  class="mr-2"
                />
                <label>{project.title}</label>
              </div>
            ))}
          </div>
          <div class="flex justify-end">
            <button class="btn btn-secondary mr-2" onClick$={onClose$}>
              Cancel
            </button>
            <button class="btn btn-primary" onClick$={() => onSave$(selectedProjects)}>
              Save
            </button>
          </div>
        </div>
      </div>
    );
  });