import { component$ } from "@builder.io/qwik";
import styles from "./footer.module.css";

export default component$(() => {

  return (
    <footer class="w-full z-9999 bg-primary-600 sticky">
      <div class="justify-center py-2">
        <a href="https://www.aries.in/" target="_blank" class={styles.anchor}>
          <span>Made with ♡ by Aries</span>
          <span class={styles.spacer}>|</span>
        </a>
      </div>
    </footer>
  );
});
