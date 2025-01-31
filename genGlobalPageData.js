const processors = [];

export async function retrieveBlocks(client, block_id, nested = true) {
  let all_blocks = [];
  let blocks = [];
  let start_cursor = undefined;
  let response;
  do {
    response = await client.blocks.children.list({
      block_id,
      page_size: 100,
      start_cursor,
    });
    blocks = [...blocks, ...response.results];
    start_cursor = response.next_cursor;
  } while (response.has_more);

  all_blocks = [...blocks];

  if (nested) {
    const tasks = blocks
      .filter((b) => b.has_children)
      .map(async (block) => {
        const children = await retrieveBlocks(client, block.id, nested);
        block.children = children;
        all_blocks = [...all_blocks, ...children];
      });
    await Promise.all(tasks);
  }

  await Promise.all(
    all_blocks.flatMap((b) =>
      processors.filter((p) => p.blockType == b.type).map((p) => p.process(b))
    )
  );

  return blocks;
}

/**
 *
 * @param {*} client
 * @param {*} page_id
 * @param {*} get_nested_children
 * @returns {Promise<import("./src/lib/server").CompletePage>}
 */
export async function page(client, page_id, get_nested_children = true) {
  const [page, blocks] = await Promise.all([
    client.pages.retrieve({ page_id }),
    retrieveBlocks(client, page_id, get_nested_children),
  ]);
  return { page: page, blocks };
}

/**
 *
 * @param {*} client
 * @param {*} database
 * @param {*} cursor
 * @param {*} page_size
 * @returns {Promise<import("@notionhq/client/build/src/api-endpoints").QueryDatabaseResponse>}
 */
export async function listPages(
  client,
  database,
  cursor = undefined,
  page_size = 10
) {
  let tried = 0;
  while (true) {
    try {
      await rateWait();
      const query = structuredClone(database.query);
      query.page_size = page_size;
      query.start_cursor = cursor ?? undefined;

      const res = await client.databases.query(query);
      // console.log("Fetched", res.results, "pages");
      return res;
    } catch (e) {
      tried++;
      console.error(`Failed to fetch pages, retrying... ${tried}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (tried > 3) {
        throw e;
      }
    }
  }
}

import { Client } from "@notionhq/client";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";

const rateLimitMS = 1000 / 2;

const rateWait = async () => {
  const lastFetch = existsSync("./.build/last_fetch")
    ? parseInt(await readFile("./.build/last_fetch", "utf-8"))
    : 0;
  const now = Date.now();
  const diff = now - lastFetch;
  if (diff < rateLimitMS) {
    await new Promise((resolve) => setTimeout(resolve, rateLimitMS - diff));
  }
  await writeFile("./.build/last_fetch", now.toString());
};

const client = new Client({ auth: process.env.NOTION_API_KEY });

const BlockDatabase = {
  slug_property: "Type",
  query: {
    database_id: process.env.NOTION_DB_ID,
  },
};

export const getGlobalPageData = async () => {
  let cursor = undefined;

  let pages = [];

  while (true) {
    console.log("Fetching pages from NOTION ( cursor:", cursor, ")");
    await rateWait();
    const result = await listPages(client, BlockDatabase, cursor);
    pages = [...pages, ...result.results];
    if (result.has_more) {
      cursor = result.next_cursor;
    } else break;
  }
  return pages;
};

/**
 *
 * @param {string} id
 * @returns
 */
export const getSpecificPage = async (id) => {
  let tried = 0;
  while (true) {
    try {
      await rateWait();
      const pg = await page(client, id);
      return pg;
    } catch (e) {
      tried++;
      console.error(`Failed to fetch page ${id}, retrying... ${tried}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (tried > 3) {
        throw e;
      }
    }
  }
};
