import { $, component$, PropFunction } from "@builder.io/qwik";

type UploadModalProps = {
  onClose$: () => void;
  onUpload$: PropFunction<(file: File) => void>; // Callback function for handling uploaded files
  acceptTypes: string; // MIME types that are accepted (e.g., ".json, .csv, .xlsx, .png, .jpg")
  title?: string; // Optional title for the modal
  description?: string; // Optional description for the modal
  buttonText?: string; // Optional text for the upload button
};

// Modal Component for Uploading Files
export const UploadModal = component$<UploadModalProps>(
  ({ onClose$, onUpload$, acceptTypes, title, description, buttonText }) => {
    
    const handleFileUpload = $((event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        // Pass the uploaded file to the parent component for handling
        onUpload$(file);
        onClose$(); // Close the modal after file upload
      }
    });

    return (
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-96">
          <h2 class="text-lg font-bold mb-4">{title}</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            {description}
          </p>
          <label
            for="dropzone-file"
            class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
              <span class="i-tabler-cloud-upload" />
              <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span class="font-semibold">{buttonText}</span> or drag and drop
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {acceptTypes.replace(/,/g, ', ')}
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              class="hidden"
              accept={acceptTypes}
              onChange$={handleFileUpload}
            />
          </label>
          <div class="mt-4 flex justify-end">
            <button class="btn btn-danger px-4 py-2" onClick$={onClose$}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
);
