import React, { useState } from "react";

/**
 * App.tsx – Minimal React front-end
 * - Chat UI (GPT-like): user asks → mock assistant replies
 * - Collapsible sidebar
 * - Recommended movies as cards
 * - No backend required; uses a mockReply() function
 * - Tailwind classes included (optional, see setup below)
 */

export type ChatTurn = { role: "user" | "assistant"; text: string };

export type MovieCard = {
  id: number | string;
  title: string;
  year?: number;
  country?: string;
  runtime?: number; // minutes
  poster_url?: string;
  tags?: string[];
  reason?: string[]; // why recommended
};

const MOCK_MOVIES: MovieCard[] = [
  {
    id: 1,
    title: "리틀 포레스트",
    year: 2018,
    country: "KR",
    runtime: 103,
    poster_url: "https://image.tmdb.org/t/p/w500/9lIt0b.jpg",
    tags: ["healing", "calm", "slice-of-life"],
    reason: ["힐링/잔잔 무드", "자연/요리 키워드"],
  },
  {
    id: 2,
    title: "벌새",
    year: 2018,
    country: "KR",
    runtime: 138,
    poster_url: "https://image.tmdb.org/t/p/w500/8A9cXo9kY5Qz.jpg",
    tags: ["melancholic", "drama"],
    reason: ["섬세한 성장극", "조용하고 여운 있는 톤"],
  },
  {
    id: 3,
    title: "우리들",
    year: 2016,
    country: "KR",
    runtime: 94,
    poster_url: "https://image.tmdb.org/t/p/w500/abc123.jpg",
    tags: ["calm", "drama"],
    reason: ["100분 내외", "따뜻한 감정선"],
  },
  {
    id: 4,
    title: "라이프 오브 파이",
    year: 2012,
    country: "US",
    runtime: 127,
    poster_url: "https://image.tmdb.org/t/p/w500/efg456.jpg",
    tags: ["adventure", "awe", "visual"],
    reason: ["장엄한 비주얼", "철학적 여운"],
  },
];

// helpers
const cx = (...xs: Array<string | false | undefined>) => xs.filter(Boolean).join(" ");

function mockReply(userText: string): { reply: string; picks: MovieCard[] } {
  const t = userText.toLowerCase();
  let mood: string | null = null;
  if (t.includes("잔잔") || t.includes("calm")) mood = "calm";
  if (t.includes("힐링")) mood = "healing";
  if (t.includes("우울") || t.includes("잔잔하고 여운")) mood = "melancholic";

  const picks = mood
    ? MOCK_MOVIES.filter((m) => m.tags?.includes(mood!)).slice(0, 3)
    : MOCK_MOVIES.slice(0, 3);

  const why = mood
    ? `요청하신 무드("${mood}")에 맞춰 상위 ${picks.length}편을 골랐어요.`
    : `키워드가 뚜렷하지 않아 대표 추천 ${picks.length}편을 먼저 보여드릴게요.`;

  return { reply: why, picks };
}

// atoms
function Badge({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
        className
      )}
    >
      {children}
    </span>
  );
}

function MovieCardView({ m }: { m: MovieCard }) {
  const poster = m.poster_url || "https://placehold.co/200x300?text=No+Image";
  return (
    <div className="overflow-hidden transition bg-white border border-gray-200 shadow-sm rounded-2xl dark:border-gray-700 dark:bg-gray-900 hover:shadow-md">
      <div className="flex">
        <img src={poster} alt={m.title} className="flex-shrink-0 object-cover h-40 w-28" />
        <div className="flex-1 min-w-0 p-4">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate dark:text-gray-100">{m.title}</h3>
            {m.year ? <Badge>{m.year}</Badge> : null}
            {m.country ? <Badge>{m.country}</Badge> : null}
            {m.runtime ? <Badge>{m.runtime}m</Badge> : null}
          </div>
          {m.reason && (
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {m.reason.join(" · ")}
            </p>
          )}
          {m.tags && (
            <div className="flex flex-wrap gap-1 mt-2">
              {m.tags.slice(0, 4).map((t) => (
                <Badge
                  key={t}
                  className="text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  {t}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div className={cx("fixed inset-0 z-40", open ? "pointer-events-auto" : "pointer-events-none")}>
      {/* backdrop */}
      <div
        className={cx("absolute inset-0 bg-black/40 transition-opacity", open ? "opacity-100" : "opacity-0")}
        onClick={onClose}
      />
      {/* panel */}
      <div
        className={cx(
          "absolute left-0 top-0 h-full w-[300px] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800",
          "transition-transform",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="font-semibold">메뉴</div>
          <button onClick={onClose} className="text-sm opacity-70 hover:opacity-100">
            닫기
          </button>
        </div>
        <nav className="p-4 space-y-2 text-sm">
          <a className="block hover:underline" href="#">
            홈
          </a>
          <a className="block hover:underline" href="#">
            추천 기록
          </a>
          <a className="block hover:underline" href="#">
            즐겨찾기
          </a>
          <a className="block hover:underline" href="#">
            설정
          </a>
        </nav>
        <div className="p-4 text-xs opacity-70">Data: IMDb / MovieLens / CMU / TMDB (demo)</div>
      </div>
    </div>
  );
}

function ChatTurns({ turns }: { turns: ChatTurn[] }) {
  return (
    <div className="space-y-3">
      {turns.map((t, i) => (
        <div key={i} className={cx("flex", t.role === "user" ? "justify-end" : "justify-start")}>
          <div
            className={cx(
              "max-w-[80%] rounded-2xl px-3 py-2 text-sm",
              t.role === "user"
                ? "bg-blue-600 text-white rounded-br-sm"
                : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm"
            )}
          >
            {t.text}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [turns, setTurns] = useState<ChatTurn[]>([
    { role: "assistant", text: "무드/국가/러닝타임을 말해보세요. 예) 잔잔하고 100분 이내 한국 영화" },
  ]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommended, setRecommended] = useState<MovieCard[]>([]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setTurns((ts) => [...ts, { role: "user", text: q }]);
    setQuery("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 280)); // mock latency
    const { reply, picks } = mockReply(q);
    setTurns((ts) => [...ts, { role: "assistant", text: reply }]);
    setRecommended(picks);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0c10] text-gray-900 dark:text-gray-100">
      {/* top bar */}
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-black/30 border-b border-gray-200/60 dark:border-gray-800">
        <div className="flex items-center max-w-6xl gap-3 px-4 py-3 mx-auto">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-3 py-2 border border-gray-300 rounded-xl dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            ☰ 메뉴
          </button>
          <div className="font-bold tracking-tight">🎬 Movie Chat</div>
        </div>
      </header>

      {/* sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* main content */}
      <main className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-1 lg:grid-cols-[minmax(380px,42%)_1fr] gap-6">
        {/* Chat column */}
        <section className="lg:h-[calc(100vh-120px)] lg:sticky lg:top-[84px] flex flex-col gap-4">
          <div className="p-4 bg-white border border-gray-200 rounded-2xl dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-3 font-semibold">Conversation</h2>
            <div className="pr-1 overflow-y-auto h-72">
              <ChatTurns turns={turns} />
            </div>
            <form onSubmit={onSubmit} className="flex gap-2 mt-3">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="예) 잔잔하고 100분 이내 한국 영화"
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-xl dark:border-gray-700 dark:bg-gray-950"
              />
              <button className="px-4 py-2 text-white bg-blue-600 rounded-xl">Send</button>
            </form>
          </div>
        </section>

        {/* Results column */}
        <section className="space-y-4">
          <div className="flex items-baseline gap-3">
            <h2 className="text-lg font-semibold">Recommended</h2>
            {loading && <span className="text-sm opacity-70">추천 중…</span>}
          </div>

          {!loading && recommended.length === 0 && (
            <div className="text-sm text-gray-500">
              아직 추천이 없어요. 왼쪽에서 <b>무드/국가/길이</b>를 포함해 질문해 보세요.
            </div>
          )}

          <div className="grid gap-4">
            {recommended.map((m) => (
              <MovieCardView key={m.id} m={m} />
            ))}
          </div>
        </section>
      </main>

      <footer className="max-w-6xl px-4 py-6 mx-auto text-xs opacity-70">
        Data sources (demo): IMDb non-commercial datasets, MovieLens, CMU Movie Summary, live TMDB images.
      </footer>
    </div>
  );
}
