<script lang="ts">
  export let block: any;
  export let name: string;
</script>

<details class="notion-render">
  <summary class="notion-render">{name}</summary>
  <pre class="notion-debug notion-render">{JSON.stringify(block, null, 2)}</pre>
</details>

<style>
  pre.notion-debug {
    background-color: #f4f4f4;
    padding: 20px;
    border-left: 10px solid #ff0000;
    font-size: 10px;
  }
</style>
