import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import axios from "axios";
import sharp from "sharp";

export const GET: RequestHandler = async ({ params }) => {
  const { region, id1, id2, name, algo, sha, cre, date, exp, sig, hed, id } =
    params;
  if (
    !region ||
    !id1 ||
    !id2 ||
    !name ||
    !algo ||
    !sha ||
    !cre ||
    !date ||
    !exp ||
    !sig ||
    !hed ||
    !id
  )
    return json({ error: "Missing parameters" });

  const AMZURL =
    `https://prod-files-secure.s3.${atob(region)}.amazonaws.com/` +
    [id1, id2, name].map((x) => atob(x)).join("/") +
    "?" +
    [
      `X-Amz-Algorithm=${atob(algo)}`,
      `X-Amz-Content-Sha256=${atob(sha)}`,
      `X-Amz-Credential=${atob(cre)}`,
      `X-Amz-Date=${atob(date)}`,
      `X-Amz-Expires=${atob(exp)}`,
      `X-Amz-Signature=${atob(sig)}`,
      `X-Amz-SignedHeaders=${atob(hed)}`,
      `x-id=${atob(id)}`,
    ].join("&");

  try {
    console.log(AMZURL);
    const response = await axios.get(AMZURL, {
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
    return new Response(webp, {
      headers: {
        "Content-Type": "image/webp",
        "Content-Length": response.headers["content-length"],
      },
    });
  } catch (e) {}

  return json({ error: "Not implemented" });
};

export const prerender =
  process.env.STATIC === "true" || process.env.IS_VERCEL === "true";
