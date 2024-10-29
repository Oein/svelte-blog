<script lang="ts">
  import { onMount } from "svelte";
  import Post from "./components/Post.svelte";
  import SkeletonPost from "./components/SkeletonPost.svelte";
  import { config } from "./config";

  type TPost = {
    slug: string;
    title: string;
    date: string;
    category: string;
  };

  let posts: TPost[] = [];
  let loading = false;
  let lastFetched = 0;
  let hasMore = true;

  let infscroll: HTMLDivElement;

  async function fetchPosts() {
    if (loading) return;
    loading = true;
    lastFetched++;
    if (typeof (window as any).postCache[lastFetched] != "undefined") {
      console.log("cache hit", lastFetched);
      posts = [...posts, ...(window as any).postCache[lastFetched]];
      hasMore = true;
      loading = false;
      lastFetched++;
      return;
    }
    const response = await fetch("/api/posts/" + lastFetched + ".json");
    const res = await response.json();
    (window as any).postCache[lastFetched] = res.posts;
    posts = [...posts, ...res.posts];
    hasMore = res.hasMore;
    loading = false;
  }

  onMount(() => {
    if (typeof window == "undefined") return;
    (window as any).postCache = {};
    fetchPosts();
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchPosts();
      }
    });
    observer.observe(infscroll);

    return () => {
      observer.unobserve(infscroll);
    };
  });
</script>

<svelte:head>
  <title>{config.blogName}</title>
</svelte:head>

<div class="posts">
  {#each posts as post}
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

  @media (max-width: 700px) {
    .posts {
      gap: 0px;
    }
  }
</style>
