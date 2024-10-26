<script lang="ts">
  import { onMount } from "svelte";
  import Post from "./components/Post.svelte";

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
    const response = await fetch("/api/posts?page=" + lastFetched);
    const res = await response.json();
    posts = [...posts, ...res.posts];
    hasMore = res.hasMore;
    loading = false;
  }

  onMount(() => {
    if (typeof window == "undefined") return;
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

<div class="posts">
  {#each posts as post}
    <Post page={post} />
  {/each}
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
