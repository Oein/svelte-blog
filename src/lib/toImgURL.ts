const defaultMapImageUrl = (
  url: string | undefined,
  blockId: string
): string | undefined => {
  if (!url) {
    return undefined;
  }

  if (url.startsWith("data:")) {
    return url;
  }

  // more recent versions of notion don't proxy unsplash images
  if (url.startsWith("https://images.unsplash.com")) {
    return url;
  }

  console.log("IMGSO", url);

  if (url.startsWith("https://prod-files-secure.")) {
    console.log("IMGSO0");
    const u = new URL(url);
    const sp = u.searchParams;
    const ur = "/image/" + sp.get("X-Amz-Signature");

    return ur;
  }

  try {
    const u = new URL(url);

    if (
      u.pathname.startsWith("/secure.notion-static.com") &&
      u.hostname.endsWith(".amazonaws.com")
    ) {
      if (
        u.searchParams.has("X-Amz-Credential") &&
        u.searchParams.has("X-Amz-Signature") &&
        u.searchParams.has("X-Amz-Algorithm")
      ) {
        // if the URL is already signed, then use it as-is

        console.log("IMGSO1");
        return url;
      }
    }
  } catch {
    // ignore invalid urls
  }

  if (url.startsWith("/images")) {
    console.log("IMGSO2");
    url = `https://www.notion.so${url}`;
  }

  if (url.startsWith("/image")) console.log("IMGSO3");
  else console.log("IMGSO4");

  url = `https://www.notion.so${
    url.startsWith("/image") ? url : `/image/${encodeURIComponent(url)}`
  }`;

  const notionImageUrlV2 = new URL(url);
  notionImageUrlV2.searchParams.set("id", blockId);
  notionImageUrlV2.searchParams.set("cache", "v2");

  url = notionImageUrlV2.toString();

  return url;
};

export const toNotionImageUrl = (url: string, blockId: string) =>
  defaultMapImageUrl(url, blockId);
