import { PageProps } from "$fresh/server.ts";

export default function Layout({ Component }: PageProps) {
  return (
    <>
      <style>{`
        /* --- 1. 글로벌 및 데스크탑 기본 스타일 --- */
        .hacker-layout {
          display: grid;
          grid-template-columns: 250px 1fr;
          min-height: 100vh;
          background-color: #121212;
          color: #c9d1d9;
          font-family: 'JetBrains Mono', 'Courier New', monospace;
        }
        
        .hacker-sidebar {
          border-right: 1px solid #30363d;
          padding: 2rem;
          background-color: #0d1117;
          display: flex;
          flex-direction: column;
        }

        .hacker-nav {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 2rem;
        }

        .hacker-main {
          padding: 3rem;
          overflow-y: auto;
        }

        /* --- 2. 모바일 반응형 스타일 (768px 이하) --- */
        @media (max-width: 768px) {
          .hacker-layout {
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr;
          }
          
          .hacker-sidebar {
            border-right: none;
            border-bottom: 1px solid #30363d;
            padding: 1rem;
            flex-direction: row; 
            align-items: center;
            justify-content: space-between;
          }

          .hacker-sidebar h2 {
            font-size: 1.2rem;
            margin: 0;
            white-space: nowrap;
          }

          .hacker-nav {
            margin-top: 0;
            flex-direction: row;
            overflow-x: auto; 
            white-space: nowrap;
            padding-left: 1rem;
          }
          
          .hacker-main {
            padding: 1.5rem 1rem; 
          }
        }
      `}</style>

      <div class="hacker-layout">
        {/* --- 사이드바 (모바일에서는 상단 헤더) --- */}
        <aside class="hacker-sidebar">
          <h2 style={{ color: "#58a6ff", margin: 0 }}>~/yoo/blog</h2>
          <nav class="hacker-nav">
            <a href="/" style={{ color: "#c9d1d9", textDecoration: "none" }}>[0] /home</a>
            <a href="/admin" style={{ color: "#ff7b72", textDecoration: "none" }}>[1] sudo (Admin)</a>
          </nav>
        </aside>

        {/* --- 메인 뷰어 --- */}
        <main class="hacker-main">
          <Component />
        </main>
      </div>
    </>
  );
}