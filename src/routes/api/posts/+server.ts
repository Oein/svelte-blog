import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";

import { readFile } from "fs/promises";

export const GET: RequestHandler = async ({ url }) => {
  const page = parseInt(url.searchParams.get("page") || "1");
  const LIMIT = 20;
  const OFFSET = (page - 1) * LIMIT;

  const pages = JSON.parse(await readFile("./.build/search.json", "utf-8"));
  const posts = pages.slice(OFFSET, OFFSET + LIMIT);

  return json({ posts, hasMore: pages.length > OFFSET + LIMIT });
};
