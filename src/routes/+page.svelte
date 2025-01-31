<script lang="ts">
  import { onMount } from "svelte";
  import Post from "./components/Post.svelte";
  import SkeletonPost from "./components/SkeletonPost.svelte";
  import { config } from "./config";
  import { disassemble } from "es-hangul";

  type TPost = {
    slug: string;
    title: string;
    date: string;
    category: string;
    search: string;
  };

  let posts: TPost[] = [];
  let loading = false;
  let lastFetched = 0;
  let hasMore = true;

  let sechkwd: string = "";

  let infscroll: HTMLDivElement;
  let infscrollShown = false;

  async function fetchPosts() {
    if (loading) return;
    loading = true;
    lastFetched++;

    const mapper = (p: any) => {
      return {
        ...p,
        search: disassemble(p.title).replace(/\s/g, ""),
      };
    };
    if (typeof (window as any).postCache[lastFetched] != "undefined") {
      console.log("cache hit", lastFetched);
      posts = [...posts, ...(window as any).postCache[lastFetched].map(mapper)];

      console.log(posts);
      hasMore = true;
      loading = false;
      lastFetched++;
      return;
    }
    const tryResponse = async () => {
      let tried = 0;
      try {
        const response = await fetch("/api/posts/" + lastFetched + ".json");
        const res = await response.json();
        return res;
      } catch (e) {
        if (tried < 3) {
          tried++;
          return tryResponse();
        }
        throw e;
      }
    };
    const res = await tryResponse();
    (window as any).postCache[lastFetched] = res.posts.map(mapper);
    posts = [...posts, ...res.posts.map(mapper)];
    hasMore = res.hasMore;

    loading = false;

    if (infscrollShown && hasMore) {
      infscrollShown = false;
      fetchPosts();
    }
  }

  onMount(() => {
    if (typeof window == "undefined") return;
    (window as any).postCache = {};
    fetchPosts();
    const observer = new IntersectionObserver((entries) => {
      infscrollShown = infscrollShown || entries[0].isIntersecting;
      if (entries[0].isIntersecting && hasMore) {
        fetchPosts();
      }
    });
    observer.observe(infscroll);

    return () => {
      observer.unobserve(infscroll);
    };
  });

  let sck = "";
  $: sck = disassemble(sechkwd).replace(/\s/g, "");
</script>

<svelte:head>
  <title>{config.blogName}</title>
</svelte:head>

<div class="posts">
  <input bind:value={sechkwd} class="schkwd" placeholder="검색어" />

  {#each posts.filter((x) => {
    return x.search.includes(sck);
  }) as post}
    <Post page={post} />
  {/each}
  {#if loading}
    <SkeletonPost />
    <SkeletonPost />
    <SkeletonPost />
    <SkeletonPost />
    <SkeletonPost />
  {/if}
  <div bind:this={infscroll} />
</div>

<style>
  .posts {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .schkwd {
    width: 100%;
    padding: 0.85rem 1rem;
    background: var(--color-bg-layer2);
    outline: none;
    color: var(--color-fg);
    border: none;
    font-size: 16px;

    border-radius: 0.5rem;
  }

  @media (max-width: 700px) {
    .posts {
      gap: 0px;
    }

    .schkwd {
      border-radius: none;
    }
  }
</style>
