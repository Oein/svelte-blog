import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import { readFile } from "fs/promises";
import { existsSync } from "fs";

export const GET: RequestHandler = async ({ params }) => {
  const { id } = params;
  if (!id) return json({ error: "Missing parameters" });

  const path = `./.build/${id}.webp`;
  if (existsSync(path)) {
    const buffer = await readFile(path);
    return new Response(buffer, {
      headers: {
        "Content-Type": "image/webp",
        "Content-Length": buffer.length.toString(),
      },
    });
  }

  return json({ error: "Not implemented" });
};

export const prerender =
  process.env.STATIC === "true" || process.env.IS_VERCEL === "true";
