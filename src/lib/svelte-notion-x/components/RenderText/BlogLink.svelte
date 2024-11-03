<script lang="ts">
  import { onMount } from "svelte";
  import HandleAnnotation from "./HandleAnnotation.svelte";
  import LoadingIcon from "./LoadingIcon.svelte";

  export let text: any;

  let link: null | Promise<string> = null;
  export let lan: any;
  export let nan: any;

  onMount(async () => {
    if (typeof window == "undefined") return;
    link = fetch(
      "/api/slug/" + text.href.replace("https://www.notion.so/", "") + ".txt"
    ).then((res) => res.text());
  });
</script>

{#if link == null}
  <span class="notion-render notion-page-link notion-link">
    <LoadingIcon />

    <HandleAnnotation
      lastAnnotations={lan}
      nextAnnotations={nan}
      annotations={text.annotations}
      text={text.plain_text}
    />
  </span>
{:else}
  {#await link}
    <span class="notion-render notion-page-link notion-link">
      <LoadingIcon />

      <HandleAnnotation
        lastAnnotations={lan}
        nextAnnotations={nan}
        annotations={text.annotations}
        text={text.plain_text}
      />
    </span>
  {:then data}
    {#if data == "null"}
      <span class="notion-render notion-page-link notion-link">
        <svg
          class="notion-render"
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          ><path
            fill="currentColor"
            d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q1.35 0 2.6-.437t2.3-1.263L5.7 7.1q-.825 1.05-1.263 2.3T4 12q0 3.35 2.325 5.675T12 20m6.3-3.1q.825-1.05 1.263-2.3T20 12q0-3.35-2.325-5.675T12 4q-1.35 0-2.6.437T7.1 5.7z"
          /></svg
        >

        <HandleAnnotation
          lastAnnotations={lan}
          nextAnnotations={nan}
          annotations={text.annotations}
          text={text.plain_text}
        />
      </span>
    {:else}
      <a class="notion-render notion-page-link notion-link" href={`/${data}`}>
        <HandleAnnotation
          lastAnnotations={lan}
          nextAnnotations={nan}
          annotations={text.annotations}
          text={text.plain_text}
        />
      </a>
    {/if}
  {/await}
{/if}
