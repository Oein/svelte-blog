<script lang="ts">
  import Header from "./components/Header.svelte";
  import Profile from "./components/Profile.svelte";
  import "svelte-notion-x/dist/style/notion.css";
  import "./global.css";
</script>

<Header />
<img src="/wideBackgroundImage.png" alt="wide view" class="cover_image" />
<div class="view">
  <main>
    <slot />
  </main>

  <Profile />
</div>

<style>
  .cover_image {
    width: 100%;
    z-index: -1;
    position: relative;

    transition: transform 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .view {
    transition: padding-top 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);

    max-width: var(--page-width);
    margin: 0px auto;

    display: flex;
    flex-direction: row;
    gap: 1rem;

    transform: translateY(-2rem);
    position: relative;
    z-index: 3;

    padding: 0px 1rem;
  }

  .view::before {
    content: "";
    width: 100%;
    height: 100%;
    background: var(--color-bg);
    position: absolute;
    z-index: -1;
    left: 0px;
    top: calc(4.5rem + 1rem);
  }

  @media (max-width: 75rem) {
    .cover_image {
      transform: translateY(calc(4.5rem - 1rem));
    }

    .view {
      padding-top: calc(4.5rem - 1rem);
    }
  }

  main {
    flex-grow: 1;
    overflow: hidden;
  }

  @media (max-width: 700px) {
    .view {
      flex-direction: column;
      padding-left: 0px;
      padding-right: 0px;

      transform: translateY(-1rem);
    }
  }
</style>
