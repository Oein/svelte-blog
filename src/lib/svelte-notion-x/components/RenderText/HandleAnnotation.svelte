<script lang="ts">
  import type { Annotation } from "../../types/Annotations";
  import HandleBold from "./HandleBold.svelte";
  import HandleCode from "./HandleCode.svelte";
  import HandleItalic from "./HandleItalic.svelte";
  import HandleStrike from "./HandleStrike.svelte";
  import HandleUnderline from "./HandleUnderline.svelte";

  export let annotations: Annotation;
  export let lastAnnotations: Annotation;
  export let nextAnnotations: Annotation;
  export let text: string;
</script>

<HandleCode {annotations} {lastAnnotations} {nextAnnotations}>
  <HandleBold {annotations}>
    <HandleItalic {annotations}>
      <HandleStrike {annotations}>
        <HandleUnderline {annotations}>
          {text}
        </HandleUnderline>
      </HandleStrike>
    </HandleItalic>
  </HandleBold>
</HandleCode>
