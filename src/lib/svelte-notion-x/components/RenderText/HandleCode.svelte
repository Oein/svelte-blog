<script lang="ts">
  import type { Annotation } from "../../types/Annotations";

  export let annotations: Annotation;
  export let lastAnnotations: Annotation | null;
  export let nextAnnotations: Annotation | null;
</script>

{#if annotations.code}
  <span
    class={`notion-inline-code ${lastAnnotations?.code ? "notion-inline-code-keep" : ""} ${lastAnnotations?.code === false || !lastAnnotations ? "notion-inline-code-start" : ""} ${!nextAnnotations?.code ? "notion-inline-code-end" : ""}`}
  >
    <slot />
  </span>
{:else}
  <span
    style={`${(() => {
      if (annotations.color.includes("_background")) {
        return `background-color: var(--notion-back-${annotations.color.replace("_background", "")});`;
      }
      return `color: var(--notion-fore-${annotations.color});`;
    })()}`}
  >
    <slot />
  </span>
{/if}

<style>
  .notion-inline-code {
    background: rgba(135, 131, 120, 0.15);
    color: #eb5757;
    font-size: 85%;
    padding: 0.2em 0.4em;
  }
  .notion-inline-code-keep {
    border-radius: 0;
    padding-left: 0px;
    padding-right: 0px;
  }
  .notion-inline-code-start {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  .notion-inline-code-end {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    padding-right: 0.4em;
  }
</style>
