// 브라우저 백그라운드에서 동작하는 서비스 워커

self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json()

    const options = {
      body: data.body,
      icon: "/favicon.ico", // 블로그 파비콘 경로
      badge: "/favicon.ico",
      vibrate: [50, 50, 50], // 모바일(Termux) 수신 시 진동 패턴
      data: { url: data.url || "/" }, // 클릭 시 이동할 URL
    }

    // 알림 팝업 렌더링
    event.waitUntil(self.registration.showNotification(data.title, options))
  }
})

self.addEventListener("notificationclick", function (event) {
  event.notification.close()
  event.waitUntil(clients.openWindow(event.notification.data.url))
})
