import { $, component$, Slot } from "@builder.io/qwik";

interface ModalProps {
  showModal: boolean;
  onClose: () => void;
}

export const Modal = component$(({ showModal, onClose }: ModalProps) => {
  if (!showModal) return null; // Return null if modal is hidden

  // Handle backdrop click to close modal
  const handleBackdropClick = $((event: MouseEvent) => {
    // Check if the click happened on the backdrop (not inside the modal content)
    if ((event.target as HTMLElement).classList.contains("modal-backdrop")) {
      onClose(); // Close the modal
    }
  });

  return (
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 modal-backdrop"
      onClick$={handleBackdropClick}
    >
      <div class="bg-white p-6 rounded-md shadow-md w-full max-w-lg relative">
        {/* Close button */}
        <button
          class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick$={onClose}
        >
          &times;
        </button>

        {/* Slot for modal content */}
        <Slot />
      </div>
    </div>
  );
});
