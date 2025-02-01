import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";

import { readFile } from "fs/promises";
import { config } from "../../../config";
import { existsSync } from "fs";

export const GET: RequestHandler = async ({ params }) => {
  const page = parseInt(params["idx"] || "1");
  const LIMIT = config.api.POSTS_PER_PAGE;
  const OFFSET = (page - 1) * LIMIT;

  if (!existsSync("./.build/search.json")) {
    return json({ posts: [], hasMore: false });
  }
  const pages = JSON.parse(await readFile("./.build/search.json", "utf-8"));
  const posts = pages.slice(OFFSET, OFFSET + LIMIT);

  return json({ posts, hasMore: pages.length > OFFSET + LIMIT });
};

export const prerender = true;
