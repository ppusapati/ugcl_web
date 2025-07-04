/* eslint-disable @typescript-eslint/no-explicit-any */
import {component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';

interface EditorProps {
  onContentChange$: (content: any) => void;
}

export const ElementEditor = component$<EditorProps>(({ onContentChange$ }) => {
  const editorContainer = useSignal<HTMLDivElement | undefined>();


  useVisibleTask$(() => {
    if (editorContainer.value) {
      const editor = new EditorJS({
        holder: editorContainer.value,
        tools: {
          header: Header,
        },
        onChange: async () => {
          const content = await editor.save();
          onContentChange$(content);
        },
      });

      return () => {
        editor.destroy();
      };
    }
    return () => {};
  });

  return (
      <div ref={editorContainer}></div>
  );
});
