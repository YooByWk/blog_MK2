import { Handlers, PageProps } from "$fresh/server.ts";
import { db } from "../db/client.ts";

// - 포스트 타입 인터페이스 정의 #todo (추후 이동)
interface Post {
  id: number;
  title: string;
  content_html: string;
  created_at: string;
}

// - 서버 단독 실행 영역 (데이터 Fetch)
export const handler: Handlers<Post[]> = {
  async GET(_req, ctx) {
    // - 최신순 정렬 쿼리 실행
    const posts = db.prepare("SELECT * FROM posts ORDER BY id DESC").all() as Post[];
    // - UI 컴포넌트로 데이터 전달
    return ctx.render(posts);
  },
};

// - UI 렌더링 영역 (정적 HTML)
export default function Home({ data }: PageProps<Post[]>) {
  return (
    <div style="padding: 2rem; font-family: monospace;">
      <h1>~/blog $ ls -la posts</h1>
      <ul>
        {data.map((post) => (
          <li key={post.id} style="margin-bottom: 2rem; border-bottom: 1px solid #ccc;">
            <h2>{post.title}</h2>
            <small>{post.created_at}</small>
            {/* - WASM이 변환한 HTML 안전 주입 - 위지윅 대비 (#todo XSS 대응) */}
            <div dangerouslySetInnerHTML={{ __html: post.content_html }} />
          </li>
        ))}
      </ul>
    </div>
  );
}