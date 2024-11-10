import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import { Client } from "@notionhq/client";
import axios from "axios";

export const GET: RequestHandler = async ({ url }) => {
  if (process.env.STATIC === "true") return json({ error: "Static site" });
  const auth = url.searchParams.get("auth");

  if (
    !auth ||
    typeof process.env.AUTH !== "string" ||
    auth !== process.env.AUTH
  ) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbi = process.env.NOTION_DB_ID;
  if (!dbi) return json({ error: "No database id provided" });
  const bdh = process.env.BUILD_HOOK;
  if (!bdh) return json({ error: "No build hook provided" });

  const notion = new Client({
    auth: process.env.NOTION_API_KEY,
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
    if (
      led.data != "" &&
      atob(led.data) == lastEdited &&
      new Date().getHours() != 5 // force build at 5am to prevent image expiry
    )
      return json({ error: "No changes" });
  } catch (e) {}

  await axios.get(bdh);
  await axios.post(
    `https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/${
      process.env.KVCode
    }/LET/${btoa(lastEdited)}`
  );

  return json({});
};

export const prerender = process.env.STATIC === "true";
