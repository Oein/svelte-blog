import adapter from "@sveltejs/adapter-auto";
import adapterStatic from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

import { writeFile, mkdir, readFile } from "node:fs/promises";
import { existsSync } from "fs";

import axios from "axios";
import sharp from "sharp";

import "dotenv/config";

// Fetch pages from API
import { getGlobalPageData, getSpecificPage } from "./genGlobalPageData.js";
import crypto from "crypto";

// MARK: - Ensure build directory
if (!existsSync("./.build")) {
  await mkdir("./.build");
}

const fetchPagesList = async () => {
  const LAST_CONFIG_READTIME = await (async () => {
    if (!existsSync("./.build/last_config_readtime")) {
      return "";
    }
    return await readFile("./.build/last_config_readtime", "utf-8");
  })();

  await writeFile("./.build/last_config_readtime", CONFIG_READTIME);

  // MARK: - Fetch pages from Notion

  if (
    !(
      (!existsSync("./.build/pages.json") ||
        CONFIG_READTIME !== LAST_CONFIG_READTIME) &&
      process.env.FETCHFALSE !== "true"
    )
  )
    return;

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

  // MARK: - Map all files

  await writeFile("./.build/pages.json", JSON.stringify(pages));
  const sch = pages.map((x) => {
    return {
      slug: x.properties.slug.rich_text.map((x) => x.plain_text).join(""),
      title: x.properties.title.title.map((x) => x.plain_text).join(""),
      date: x.properties.date.date.start,
      category:
        "select" in x.properties.category &&
        x.properties.category.select != null &&
        "name" in x.properties.category.select
          ? x.properties.category.select.name
          : "Uncategorized",
    };
  });

  const schplus = pages.map((x) => {
    return {
      slug: x.properties.slug.rich_text[0].plain_text,
      id: x.id.replace(/-/g, ""),
    };
  });
  await writeFile("./.build/search.json", JSON.stringify(sch));
  await writeFile("./.build/searchplus.json", JSON.stringify(schplus));

  console.log("Got", pages.length, "pages");

  const pagesfilter = pages.filter((page) => page.object == "page");

  let last_edited_date = 0;
  let last_edited_datestr = "";

  // MARK: - Fetch all pages
  for (let i = 0; i < pagesfilter.length; i++) {
    console.log("Fetching page", i + 1, "of", pagesfilter.length);
    const page = pagesfilter[i];
    try {
      const slug = page.properties.slug.rich_text[0].plain_text;
      const hash = crypto.createHash("md5").update(btoa(slug)).digest("hex");
      const recordMap = await getSpecificPage(page.id);
      await writeFile(`./.build/${hash}.json`, JSON.stringify(recordMap));
      const led = pagesfilter[i].last_edited_time;
      if (typeof led == "string") {
        const ledF = Date.parse(led);
        if (ledF > last_edited_date) {
          last_edited_date = ledF;
          last_edited_datestr = led;
        }
      }
    } catch (e) {
      console.error("Error fetching page", page.id, e);
    }
  }

  // MARK: - Update latest edit time
  console.log("Latest edit time", last_edited_datestr);
  await axios.post(
    `https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/${
      process.env.KVCode
    }/LET/${last_edited_datestr == "" ? "" : btoa(last_edited_datestr)}`
  );
};

// MARK: - Fetch pages list

const CONFIG_READTIME = process.env.GT;
if (typeof CONFIG_READTIME == "undefined")
  console.warn("CONFIG_READTIME(process.env.GT) is not defined");
else await fetchPagesList();

// MARK: - Blog post paths

const pages = existsSync("./.build/search.json")
  ? JSON.parse(await readFile("./.build/search.json", "utf-8"))
  : [];
let paths = pages.map((page) => "/" + page.slug);

const redipaths = existsSync("./.build/searchplus.json")
  ? JSON.parse(await readFile("./.build/searchplus.json", "utf-8"))
  : [];

paths = paths.concat(redipaths.map((page) => "/api/slug/" + page.id + ".txt"));

import { config as cfg } from "./src/routes/config.js";
let idxes = Math.ceil(pages.length / cfg.api.POSTS_PER_PAGE);
for (let i = 0; i < idxes; i++) {
  paths.push(`/api/posts/${i + 1}.json`);
}

// MARK: - Static API

if (process.env.STATIC === "true") {
  paths.push("/api/files");
  paths.push("/api/rebuild");
}

// MARK: - Fetch images
if (process.env.FETCHIMGFALSE !== "true") {
  // MARK: - Images dfs

  /**
   * @type {Array<string>}
   */
  const images = [];

  for (let i = 0; i < pages.length; i++) {
    const pageSlug = pages[i].slug;
    const hash = crypto.createHash("md5").update(btoa(pageSlug)).digest("hex");
    const pageFile = `./.build/${hash}.json`;
    if (!existsSync(pageFile)) continue;

    const pageData = JSON.parse(await readFile(pageFile, "utf-8"));

    try {
      const thumbnail = pageData.page.properties.thumbnail.files;
      if (thumbnail.length > 0) {
        images.push(thumbnail[0].file.url);
      }
    } catch (e) {}

    const dfs = (obj) => {
      for (let i = 0; i < obj.length; i++) {
        const block = obj[i];
        if ("children" in block) {
          dfs(block.children);
        }
        if (!("image" in block)) continue;
        images.push(block.image.file.url);
      }
    };
    dfs(pageData.blocks);
  }

  console.log("Got Images", images.length);

  // MARK: - Prefetch images
  for (let i = 0; i < images.length; i++) {
    console.log("Prefetching image", i + 1, "of", images.length);
    const url = images[i];
    const urlVal = new URL(url);
    const sign = urlVal.searchParams.get("X-Amz-Signature");
    if (sign == null) continue;
    if (existsSync(`./.build/${sign}.webp`)) continue;

    const response = await axios.get(url, {
      responseType: "arraybuffer",
    });
    const buffer = Buffer.from(response.data, "binary");
    // to webp
    const webp = await sharp(buffer)
      .webp({
        quality: 90,
        alphaQuality: 90,
      })
      .toBuffer();

    await writeFile(`./.build/${sign}.webp`, webp);
  }
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: process.env.STATIC === "true" ? adapterStatic() : adapter(),

    prerender: {
      crawl: true,
      entries: ["*", ...paths],
    },
  },
};

export default config;
