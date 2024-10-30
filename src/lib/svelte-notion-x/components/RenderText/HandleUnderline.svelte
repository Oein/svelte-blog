<script lang="ts">
  export let annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
</script>

{#if annotations.underline}
  <u><slot /></u>
{:else}
  <slot />
{/if}
