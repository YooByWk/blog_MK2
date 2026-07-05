import { FreshContext } from "$fresh/server.ts";
import { db } from "../../db/client.ts";
import init, { heartbeat } from "../../static/wasm/blog_core.js";

await init();

export const handler = {
  async POST(req: Request, _ctx: FreshContext) {
    try {
      const { title, raw_content } = await req.json();
      const processedHtml = heartbeat(raw_content);
      const query = db.prepare(
        "INSERT INTO posts (title, content_raw, content_html) VALUES (?, ?, ?)"
      );
      query.run(title, raw_content, processedHtml);
    } catch (error) {
      console.error(error);
      return new Response("Server Error", { status : 500})
    }
  }
};