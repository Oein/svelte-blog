<script lang="ts">
  export let block: any;
  let state = "";
  let hrf = "";
  const dl = async () => {
    if (state != "" && state != "Downloaded!") return;
    if (hrf != "") {
      const a = document.createElement("a");
      a.href = hrf;
      a.download = block.file.name;
      a.click();
      state = "Downloaded!";
      setTimeout(() => {
        if (state == "Downloaded!") state = "";
      }, 2000);
      return;
    }
    state = "Getting URL...";
    const r = await fetch("/api/files?bid=" + block.id);
    const b:
      | { support: false }
      | {
          support: true;
          error: string;
        }
      | {
          support: true;
          href: string;
        } = await r.json();

    if (!b.support) {
      state = "File downloading is not supported for this site.";
      return;
    }

    if ("error" in b) {
      state = b.error;
      return;
    }

    const a = document.createElement("a");
    a.href = b.href;
    a.download = block.file.name;
    hrf = b.href;
    a.click();
    state = "Downloaded!";
    setTimeout(() => {
      if (state == "Downloaded!") state = "";
    }, 2000);
  };
</script>

<!-- {JSON.stringify(block, null, 2)} -->

<button on:click={() => dl()} disabled={state != ""}>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    ><path
      fill="currentColor"
      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm4 18H6V4h7v5h5z"
    /></svg
  >
  {block.file.name}
  {state}
</button>

<style>
  button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    border-radius: 4px;
    color: var(--color-text);
    cursor: pointer;

    border: none;
    outline: none;
    width: 100%;

    transition: background 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
    background: transparent;
  }

  button:hover {
    background: var(--color-accent-2-hover);
  }
</style>
