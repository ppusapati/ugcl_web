import type { QRL, JSXNode,  JSXOutput } from "@builder.io/qwik";
import { $ } from "@builder.io/qwik";

// Utility function to wrap image components imported with `?jsx`
export function wrapImageWithQRL (
    ImageComponent: (props: { class: string; alt: string }) => JSXNode
  ): QRL<(props: { class: string; alt: string }) => JSXNode> {
    return $((props: { class: string; alt: string }) => <ImageComponent {...props} /> as JSXNode);
  }

// Function to create a QRL-wrapped image component
export function createQRLImageComponent(
    ImageComponent: (props: { class: string; alt: string }) => JSXOutput
  ): QRL<(props: { class: string; alt: string }) => JSXOutput> {
    return $(function ImageQRL(props: { class: string; alt: string }) {
      return <ImageComponent {...props} />;
    });
  }


  export function createFunc(ImageComponent: (props: { class: string; alt: string }) => JSXOutput): QRL<(props: { class: string; alt: string }) => JSXOutput> {
    return $(function ImageQRL(props: { class: string; alt: string }) {
        return <ImageComponent {...props} />;
      });
  }
