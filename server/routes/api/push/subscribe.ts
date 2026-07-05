import { FreshContext } from '$fresh/server.ts';
import { db } from "../../../db/client.ts";


export const handler = {
  async POST(req: Request, _ctx: FreshContext) {
    try {
      const subscription = await req.json();

      const endpoint = subscription.endpoint;
      const p256dh = subscription.keys.p256dh;
      const auth = subscription.keys.auth;

      db.prepare(`
        INSERT OR IGNORE INTO push_subscriptions (endpoint, p256dh, auth) 
        VALUES (?, ?, ?)
      `).run(endpoint, p256dh, auth);
      return new Response("Subscribed", { status: 201 });
    } catch (error) {
      console.error(error);
      return new Response("Server Error", { status: 500 });
    }
  }

};