import { error } from "@sveltejs/kit";
import crypto from "crypto";
import { existsSync } from "fs";
import { readFile } from "fs/promises";

import { Redis } from "@upstash/redis";
const redis = Redis.fromEnv();

const load: import("./$types").PageServerLoad = async function ({ params }) {
  const slug = params.id;
  const hash = crypto.createHash("md5").update(btoa(slug)).digest("hex");
  if (process.env.IS_VERCEL === "true") {
    const data = await redis.get(hash);
    if (!data) return error(404, "Not found");
    return {
      data: JSON.parse(data as string),
    };
    return;
  }
  if (!existsSync(`./.build/${hash}.json`)) return error(404, "Not found");
  const data = JSON.parse(await readFile(`./.build/${hash}.json`, "utf-8"));
  return {
    data,
  };
};

export { load };
