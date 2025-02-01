import { json, text } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";

import { readFile } from "fs/promises";
import { config } from "../../../config";
import { existsSync } from "fs";

export const GET: RequestHandler = async ({ params }) => {
  const page = params["idx"];

  if (!existsSync("./.build/searchplus.json")) {
    return text("null", { status: 404 });
  }
  const pages = JSON.parse(await readFile("./.build/searchplus.json", "utf-8"));
  const post = pages.filter((x: { slug: string; id: string }) => x.id == page);
  if (post.length === 0) {
    return text("null", { status: 404 });
  }
  return text(post[0].slug);
};

export const prerender = true;
