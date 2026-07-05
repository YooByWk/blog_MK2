import { useState } from "preact/hooks";

interface Props {
  vapidPublicKey: string;
}

export default function AdminDashboard({ vapidPublicKey }: Props) {
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState("대기 중...");

  // VAPID 키 변환 함수 (브라우저 규격)
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = globalThis.atob(base64);
    return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
  };

  const subscribeToPush = async () => {
    setStatus("Service Worker 등록 중...");
    const registration = await navigator.serviceWorker.register('/sw.js');

    setStatus("Push 권한 요청 중...");
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
    });

    await fetch("/api/push/subscribe", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: { "Content-Type": "application/json" }
    });
    setStatus("Push 구독 완료!");
  };

  // 2. 로그 열람 및 푸시 발송 트리거
  const fetchLogsAndNotify = async () => {
    setStatus("로그 불러오는 중 & 알림 발송 중...");
    const response = await fetch("/api/admin/logs", { method: "POST" });
    const data = await response.json();

    setLogs(data.logs);
    setStatus("완료.");
  };

  return (
    <div style={{ border: "1px dashed #30363d", padding: "2rem" }}>
      <h1 style={{ color: "#ff7b72" }}>System Administrator</h1>
      <p>Status: <span style={{ color: "#79c0ff" }}>{status}</span></p>

      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        <button
          onClick={subscribeToPush}
          style={{ padding: "0.5rem 1rem", background: "#238636", color: "white", border: "none", cursor: "pointer" }}
        >
          [초기 세팅] 시스템 알림 구독하기
        </button>

        <button
          onClick={fetchLogsAndNotify}
          style={{ padding: "0.5rem 1rem", background: "#1f6feb", color: "white", border: "none", cursor: "pointer" }}
        >
          $ cat /var/log/db (로그 열람 + 푸시)
        </button>
      </div>

      <div style={{ marginTop: "2rem", background: "#000", padding: "1rem", borderRadius: "5px" }}>
        {logs.length === 0 ? <p>로그가 없습니다.</p> : logs.map((log, i) => (
          <div key={i}> &gt; {log}</div>
        ))}
      </div>
    </div>
  );

}