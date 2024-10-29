import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import { Client } from "@notionhq/client";
import axios from "axios";

interface Parent {
  type: string;
  block_id: string;
}
interface Createdby {
  object: string;
  id: string;
}
interface File {
  url: string;
  expiry_time: string;
}
interface File2 {
  caption: any[];
  type: string;
  file: File;
  name: string;
}
interface FileBlock {
  object: string;
  id: string;
  parent: Parent;
  created_time: string;
  last_edited_time: string;
  created_by: Createdby;
  last_edited_by: Createdby;
  has_children: boolean;
  archived: boolean;
  in_trash: boolean;
  type: string;
  file: File2;
}

export const GET: RequestHandler = async ({ url }) => {
  if (process.env.STATIC === "true")
    return json({
      support: false,
    });
  const bid = url.searchParams.get("bid");
  if (!bid) return json({ support: true, error: "No bid provided" });
  // check bid is like d62e61bf-98a8-4b72-90f4-07d3408f27b1
  const regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
  if (!regex.test(bid))
    return json({ support: true, error: "Invalid block id" });
  const kvf = await axios.get(
    `https://keyvalue.immanuel.co/api/KeyVal/GetValue/${process.env.KVCode}/T-${bid}`
  );
  console.log(`GET T-${bid}\t: ${kvf.data}`);
  if (kvf.data != ``) {
    if (kvf.data == `nf`)
      return json({ support: true, error: "File not found" });
    const DT = new Date(atob(kvf.data));
    const now = new Date();
    if (DT.getTime() > now.getTime()) {
      console.log(`GET T-${bid}\t: ${kvf.data}`);
      const chunksSize = await axios.get(
        `https://keyvalue.immanuel.co/api/KeyVal/GetValue/${process.env.KVCode}/FL-${bid}`
      );
      console.log(`GET F-${bid}\t: ${chunksSize.data}`);
      const chunks = [];
      for (let i = 0; i < chunksSize.data; i++) {
        const chunk = await axios.get(
          `https://keyvalue.immanuel.co/api/KeyVal/GetValue/${process.env.KVCode}/F${i}-${bid}`
        );
        console.log(`GET F${i}-${bid}\t: ${chunk.data}`);
        chunks.push(chunk.data);
      }
      const href = atob(chunks.join("").replace(/!/g, "/").replace(/@/g, "+"));
      return json({ support: true, href: href });
    }
  }
  const client = new Client({ auth: process.env.NOTION_API_KEY });
  const blk = (await client.blocks.retrieve({
    block_id: bid,
  })) as FileBlock;
  if (blk.object != "block") {
    console.log(`SET T-${bid}\t: nf`);
    await axios.post(
      `https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/${process.env.KVCode}/T-${bid}/nf`
    );
    return json({ support: true, error: "Invalid block id" });
  }
  if (blk.type != "file") {
    console.log(`SET T-${bid}\t: nf`);
    await axios.post(
      `https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/${process.env.KVCode}/T-${bid}/nf`
    );
    return json({ support: true, error: "Invalid block id" });
  }

  const href = blk.file.file.url;
  const expiry_time = blk.file.file.expiry_time;
  //   console.log(`SET F-${bid}\t: ${href}`);
  const fullDATA = btoa(href).replace(/\//g, "!").replace(/\+/g, "@");
  // slice by 1023 chars
  const chunks = [];
  const CHSIZE = 127;
  for (let i = 0; i < fullDATA.length; i += CHSIZE) {
    chunks.push(fullDATA.slice(i, i + CHSIZE));
  }

  for (let i = 0; i < chunks.length; i++) {
    console.log(`SET F${i}-${bid}\t: ${chunks[i]}`);
    await axios.post(
      `https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/${process.env.KVCode}/F${i}-${bid}/${chunks[i]}`
    );
  }

  console.log(`SET FL-${bid}\t: ${chunks.length}`);
  await axios.post(
    `https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/${process.env.KVCode}/FL-${bid}/${chunks.length}`
  );

  console.log(`SET T-${bid}\t: ${expiry_time}`);
  await axios.post(
    `https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/${
      process.env.KVCode
    }/T-${bid}/${btoa(expiry_time)}`
  );

  return json({ support: true, href: blk.file.file.url });
};

export const prerender = process.env.STATIC === "true";
