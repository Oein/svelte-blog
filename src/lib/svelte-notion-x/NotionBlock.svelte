<script lang="ts">
  import DotList from "./components/DotList.svelte";
  import RenderText from "./components/RenderText.svelte";
  import Table from "./components/Table.svelte";
  import Todo from "./components/Todo.svelte";
  import Image from "./components/Image.svelte";
  import Code from "./components/Code.svelte";
  import EquationBlock from "./components/EquationBlock.svelte";
  import DebugJson from "./components/DebugJSON.svelte";
  import Divider from "./components/Divider.svelte";
  import Toggle from "./components/Toggle.svelte";
  import Quote from "./components/Quote.svelte";
  import Callout from "./components/Callout.svelte";
  import NumList from "./components/NumList.svelte";

  export let block: {
    type: string;
    [key: string]: any;
  };
  export let customRenderer: { [key: string]: any } = {};

  const notypecheck = (x: any) => x;
</script>

<div class="notion-content notion-render">
  {#if block.type in customRenderer}
    <svelte:component
      this={customRenderer[block.type]}
      {block}
      {customRenderer}
    />
  {:else if block.type == "heading_1"}
    <h2 class="notion-heading-1 notion-render">
      <RenderText block={block["heading_1"]} />
    </h2>
  {:else if block.type == "heading_2"}
    <h3 class="notion-heading-2 notion-render">
      <RenderText block={block["heading_2"]} />
    </h3>
  {:else if block.type == "heading_3"}
    <h4 class="notion-heading-3 notion-render">
      <RenderText block={block["heading_3"]} />
    </h4>
  {:else if block.type == "paragraph"}
    <div class="notion-paragraph notion-render">
      <RenderText block={block["paragraph"]} />
    </div>
  {:else if block.type == "equation"}
    <EquationBlock block={block.equation} />
  {:else if block.type == "table"}
    <Table block={notypecheck(block)} />
  {:else if block.type == "image"}
    <Image {block} />
  {:else if block.type == "code"}
    <Code {block} />
  {:else if block.type == "divider"}
    <Divider />
  {:else if block.type == "toggle"}
    <Toggle {block} {customRenderer} />
  {:else if block.type == "quote"}
    <Quote {block} />
  {:else if block.type == "callout"}
    <Callout {block} {customRenderer} />
  {:else if block.type == "to_do"}
    {#if block.to_do}
      <Todo block={notypecheck(block)} />
    {/if}
  {:else if block.type == "bulleted_list_item"}
    <DotList block={notypecheck(block)} {customRenderer} />
  {:else if block.type == "numbered_list_item"}
    <NumList
      block={notypecheck(block)}
      number={block.custom && block.custom.number ? block.custom.number : 1}
      {customRenderer}
    />
  {:else}
    <DebugJson {block} name={`Unhandled / ${block.type}`} />
  {/if}
</div>

<style>
  .notion-content {
    width: 100%;
    padding: 3px 2px;
    margin: 1px 0;
  }

  .notion-heading-1 {
    font-weight: 600;
    font-size: 1.875em;

    margin-top: calc(var(--notion-default-font-size) * 2);
    margin-bottom: 4px;
  }

  .notion-heading-2 {
    font-weight: 600;
    font-size: 1.5em;

    margin-top: var(--notion-default-font-size);
    margin-bottom: 1px;
  }

  .notion-heading-3 {
    font-weight: 600;
    font-size: 1.25em;

    margin-top: var(--notion-default-font-size);
    margin-bottom: 1px;
  }

  .notion-heading-1,
  .notion-heading-2,
  .notion-heading-3 {
    max-width: 100%;
    width: 100%;
    white-space: pre-wrap;
    word-break: break-word;
    caret-color: rgb(55, 53, 47);
    padding: 3px 2px;
    font-family:
      ui-sans-serif,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI Variable Display",
      "Segoe UI",
      Helvetica,
      "Apple Color Emoji",
      Arial,
      sans-serif,
      "Segoe UI Emoji",
      "Segoe UI Symbol";
    line-height: 1.3;
  }

  .notion-paragraph {
    max-width: 100%;
    width: 100%;
    white-space: pre-wrap;
    word-break: break-word;
    caret-color: rgb(55, 53, 47);
    padding: 3px 2px;
  }
</style>
