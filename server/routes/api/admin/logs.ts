import { FreshContext } from "$fresh/server.ts";
import { db } from "../../../db/client.ts";
import webpush from "npm:web-push";


webpush.setVapidDetails(
  'mailto:tls19190@gmail.com',
  `${Deno.env.get("NOTIPUBKEY")}`,
  `${Deno.env.get("NOTIPRIKEY")}`
);

export const handler = {
  async POST(_req: Request, _ctx: FreshContext) {
    // 1. DB에서 가장 최근에 저장된 푸시 구독 정보를 가져옴
    const subRecord = db.prepare("SELECT * FROM push_subscriptions ORDER BY id DESC LIMIT 1").get() as any;

    if (!subRecord) {
      return new Response(JSON.stringify({ logs: ["Error: 구독 정보가 없습니다."] }), { status: 400 });
    }

    const subscription = {
      endpoint: subRecord.endpoint,
      keys: { p256dh: subRecord.p256dh, auth: subRecord.auth }
    };

    // 2. DB에서 로그(게시글 내역 등) 읽어오기
    const logs = db.prepare("SELECT title, created_at FROM posts ORDER BY id DESC LIMIT 5").all() as any[];
    const logStrings = logs.map(l => `[${l.created_at}] Post created: ${l.title}`);

    // 3. 브라우저로 푸시 알림
    const payload = JSON.stringify({
      title: "시스템 보고",
      body: `로그 ${logs.length}건을 성공적으로 불러왔습니다.`,
      url: "/admin"
    });

    try {
      await webpush.sendNotification(subscription, payload);
    } catch (e) {
      console.error("푸시 발송 실패:", e);
    }

    // 4. 클라이언트에 로그 데이터 반환
    return new Response(JSON.stringify({ logs: logStrings }), {
      headers: { "Content-Type": "application/json" }
    });
  }
};