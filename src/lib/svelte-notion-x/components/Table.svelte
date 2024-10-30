<script lang="ts">
  import type { NotionTable } from "../types/Table";
  import DebugJson from "./DebugJSON.svelte";
  import RenderText from "./RenderText.svelte";

  export let block: NotionTable;

  const notypecheck = (x: any) => x;
</script>

<table class="notion-table notion-render">
  {#each block.children as row, i}
    <tr class="notion-render">
      {#each row.table_row.cells as cell, j}
        <td
          class={`notion-table-cell-wrp notion-render ${
            (i == 0 && block.table.has_column_header) ||
            (j == 0 && block.table.has_row_header)
              ? "notion-table-colored"
              : ""
          }`}
        >
          <div class="notion-table-cell-text notion-render">
            <!-- <DebugJson block={cell} name="cell" /> -->
            <RenderText block={notypecheck({ rich_text: cell })} />
          </div>
        </td>
      {/each}
    </tr>
  {/each}
</table>

<!-- <DebugJson {block} name="table" /> -->

<style>
  .notion-table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  .notion-table-cell-wrp {
    color: inherit;
    fill: inherit;
    border: 1px solid rgb(233, 233, 231);
    isolation: auto;
    position: relative;
    vertical-align: top;
    text-align: start;
  }
  .notion-table-cell-text {
    max-width: 100%;
    width: 100%;
    white-space: pre-wrap;
    word-break: break-word;
    caret-color: rgb(55, 53, 47);
    padding: 7px 9px;
    background-color: transparent;
    font-size: 14px;
    line-height: 20px;
  }
  .notion-table-colored {
    background-color: #f7f6f3;
  }
</style>
