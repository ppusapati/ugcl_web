import { component$, useStore, $ } from "@builder.io/qwik";
import { Team } from "~/types";

// AssignTeamsModal Component
type AssignTeamsModalProps = {
    teams: Team[];
    assignedTeamUuids: string[];
    onClose$: () => void;
    onSave$: (selected: string[]) => void;
  };
  
  export const AssignTeamsModal = component$<AssignTeamsModalProps>(({ teams, assignedTeamUuids, onClose$, onSave$ }) => {
    const selectedTeams = useStore<string[]>([...assignedTeamUuids]);
  
    const toggleTeamSelection = $( (uuid: string) => {
      if (selectedTeams.includes(uuid)) {
        const index = selectedTeams.indexOf(uuid);
        selectedTeams.splice(index, 1);
      } else {
        selectedTeams.push(uuid);
      }
    });
  
    return (
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg w-1/2 max-w-lg">
          <h2 class="text-xl font-bold mb-4">Assign Teams to Project</h2>
          <div class="max-h-64 overflow-y-auto mb-4">
            {teams.map((team) => (
              <div key={team.uuid} class="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={selectedTeams.includes(team.uuid)}
                  onChange$={() => toggleTeamSelection(team.uuid)}
                  class="mr-2"
                />
                <label>{team.name}</label>
              </div>
            ))}
          </div>
          <div class="flex justify-end">
            <button class="btn btn-secondary mr-2" onClick$={onClose$}>
              Cancel
            </button>
            <button class="btn btn-primary" onClick$={() => onSave$(selectedTeams)}>
              Save
            </button>
          </div>
        </div>
      </div>
    );
  });