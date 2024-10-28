import adapter from "@sveltejs/adapter-auto";
import adapterStatic from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

import { writeFile, mkdir, readFile } from "node:fs/promises";
import { existsSync } from "fs";

import "dotenv/config";

// Fetch pages from API
import { getGlobalPageData, getSpecificPage } from "./genGlobalPageData.js";
import crypto from "crypto";

if (!existsSync("./.build")) {
  await mkdir("./.build");
}

const CONFIG_READTIME = process.env.GT;
if (typeof CONFIG_READTIME == "undefined") {
  console.warn("CONFIG_READTIME(process.env.GT) is not defined");
} else {
  const LAST_CONFIG_READTIME = await (async () => {
    if (!existsSync("./.build/last_config_readtime")) {
      return "";
    }
    return await readFile("./.build/last_config_readtime", "utf-8");
  })();

  await writeFile("./.build/last_config_readtime", CONFIG_READTIME);

  if (
    (!existsSync("./.build/pages.json") ||
      CONFIG_READTIME !== LAST_CONFIG_READTIME) &&
    process.env.FETCHFALSE !== "true"
  ) {
    console.log("Fetching pages from NOTION");
    const pages = (await getGlobalPageData()).filter(
      (x) =>
        "properties" in x &&
        "slug" in x.properties &&
        "rich_text" in x.properties.slug &&
        "status" in x.properties &&
        x.properties.status.select != null &&
        x.properties.status.select.name == "Public"
    );
    await writeFile("./.build/pages.json", JSON.stringify(pages));
    const sch = pages.map((x) => {
      return {
        slug: x.properties.slug.rich_text[0].plain_text,
        title: x.properties.title.title[0].plain_text,
        date: x.properties.date.date.start,
        category:
          "select" in x.properties.category &&
          x.properties.category.select != null &&
          "name" in x.properties.category.select
            ? x.properties.category.select.name
            : "Uncategorized",
      };
    });
    await writeFile("./.build/search.json", JSON.stringify(sch));

    console.log("Got", pages.length, "pages");

    const pgs = pages.filter((page) => page.object == "page");

    // fetch record map
    for (let i = 0; i < pgs.length; i++) {
      console.log("Fetching page", i + 1, "of", pgs.length);
      const page = pgs[i];
      try {
        const slug = page.properties.slug.rich_text[0].plain_text;
        const hash = crypto.createHash("md5").update(btoa(slug)).digest("hex");
        const recordMap = await getSpecificPage(page.id);
        await writeFile(`./.build/${hash}.json`, JSON.stringify(recordMap));
      } catch (e) {
        console.error("Error fetching page", page.id, e);
      }
    }
  }
}

const pages = existsSync("./.build/search.json")
  ? JSON.parse(await readFile("./.build/search.json", "utf-8"))
  : [];
let paths = pages.map((page) => "/" + page.slug);
import { config as cfg } from "./src/routes/config.js";
let idxes = Math.ceil(pages.length / cfg.api.POSTS_PER_PAGE);
for (let i = 0; i < idxes; i++) {
  paths.push(`/api/posts/${i + 1}.json`);
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: process.env.STATIC === "true" ? adapterStatic() : adapter(),

    prerender: {
      crawl: true,
      entries: ["*", ...paths],
    },
  },
};

export default config;
