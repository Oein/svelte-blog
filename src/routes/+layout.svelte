<script lang="ts">
  import Header from "./components/Header.svelte";
  import Profile from "./components/Profile.svelte";
  import "svelte-notion-x/dist/style/notion.css";
  import "./global.css";
  import { config } from "./config";
  let scrollY = 0;
  let imageHeight = 0;

  export let data;

  function fadeAndSlide(node: any) {
    return {
      duration: 200,
      css: (t: number, u: any) => {
        return `
          transform: translateY(${(1 - t) * 0.5}rem);
          opacity: ${t};
        `;
      },
    };
  }

  function fadeAndSlideIn(node: any) {
    return {
      duration: 200,
      delay: 200,
      css: (t: number, u: any) => {
        return `
          transform: translateY(${-0.5 + t / 2}rem);
          opacity: ${t};
        `;
      },
    };
  }
</script>

<svelte:window bind:scrollY />

<svelte:head>
  <title>{config.blogName}</title>
  {#if config.api.GTAG_ID}
    <script
      async
      src={"https://www.googletagmanager.com/gtag/js?id=" + config.api.GTAG_ID}
    >
    </script>
    <script>
      window.dataLayer = window.dataLayer || [];

      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("consent", "default", {
        ad_storage: "denied",
        analytics_storage: "denied",
        ad_personalization: "denied",
        ad_user_data: "denied",
      });
      gtag("js", new Date());
      gtag("config", config.api.GTAG_ID);
    </script>
  {/if}
</svelte:head>

<Header />
<div class="banner" bind:clientHeight={imageHeight}>
  <img src={config.bannerImageURL} alt="wide view" class="cover_image" />
  <div
    class={`text`}
    style={`--innerHeight: ${imageHeight}; --scrollY: ${scrollY};`}
  >
    <h1>{config.blogName}</h1>
  </div>
</div>
<div class="view">
  <main>
    {#key data.pathname}
      <div in:fadeAndSlideIn out:fadeAndSlide>
        <slot />
      </div>
    {/key}
  </main>

  <Profile />
</div>

<style>
  .banner {
    display: flex;
    width: 100%;
    height: fit-content;
    user-select: none;
    position: relative;
  }
  .banner > .text {
    max-width: var(--page-width);
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 2rem;

    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: auto;
    padding: 0px 2rem;

    transition:
      top,
      bottom 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
  .text > h1 {
    transition: opacity 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
    --opacity: calc(
      1 - 1 / (var(--innerHeight) * 0.4) *
        (var(--scrollY) - var(--innerHeight) * 0.18)
    );
    opacity: var(--opacity);
  }
  .cover_image {
    width: 100%;
    z-index: -1;
    position: relative;

    transition: transform 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
    max-height: 40vh;
    object-fit: cover;
    object-position: center;
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
    .cover_image,
    .banner > .text {
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

    .banner > .text {
      bottom: 0.5rem;
    }
  }
</style>
