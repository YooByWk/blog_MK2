import AdminDashboard from "../islands/AdminNoti.tsx";
import { useState } from 'preact/hooks';


export default function AdminPage() {
  const publicKey = Deno.env.get("FRESH_PUBLIC_NOTIPUBKEY") || "";
  return (
    <>
      <AdminDashboard vapidPublicKey={publicKey} />
    </>
  );

}