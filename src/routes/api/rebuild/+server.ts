import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import { Client } from "@notionhq/client";
import axios from "axios";

export const GET: RequestHandler = async ({ request: req }) => {
  if (process.env.STATIC === "true") return json({ error: "Static site" });
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbi = process.env.NOTION_DATABASE_ID;
  if (!dbi) return json({ error: "No database id provided" });
  const bdh = process.env.BUILD_HOOK;
  if (!bdh) return json({ error: "No build hook provided" });

  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });

  const response = (
    await notion.databases.query({
      sorts: [
        {
          timestamp: "last_edited_time",
          direction: "descending",
        },
      ],
      database_id: dbi,
    })
  ).results.filter((x) => x.object == "page");

  const rlen = response.length;
  if (rlen == 0) return json({ error: "No results found" });
  const lastEdited = (response[0] as any).last_edited_time;
  if (typeof lastEdited !== "string")
    return json({ error: "Invalid last edited time" });

  const led = await axios.get(
    `https://keyvalue.immanuel.co/api/KeyVal/GetValue/${process.env.KVCode}/LET`
  );

  try {
    if (led.data != "" && atob(led.data) == lastEdited)
      return json({ error: "No changes" });
  } catch (e) {}

  await axios.get(bdh);
  await axios.get(
    `https://keyvalue.immanuel.co/api/KeyVal/SetValue/${
      process.env.KVCode
    }/LET/${btoa(lastEdited)}`
  );

  return json({});
};

export const prerender = process.env.STATIC === "true";
