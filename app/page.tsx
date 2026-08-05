"use client";

import { useEffect, useMemo, useState } from "react";

type Task = { id: string; zh: string; mnc: string; ko: string };
type Category = { id: string; name: string; mncName: string; koName: string; items: Task[] };
type CheckinStore = Record<string, string[]>;

const categories: Category[] = [
  {
    id: "regular",
    name: "常规打卡",
    mncName: "ᡝᡨᡝᠩᡤᡳ ᠴᡝᡴᡝᡵᡝᠮᠪᡳ",
    koName: "일반 체크인",
    items: [
      { id: "douyin", zh: "抖音打卡", mnc: "ᡩᠣᠣᠶᡳᠩ ᠴᡝᡴᡝᡵᡝᠮᠪᡳ", ko: "도우인 체크인" },
      { id: "douyin-book", zh: "抖音预约", mnc: "ᡩᠣᠣᠶᡳᠩ ᠠᠯᡳᠶᠠᠮᠪᡳ", ko: "도우인 예약" },
      { id: "speed", zh: "极速打卡", mnc: "ᡤᡳᠶᠣᠣᠰᡠ ᠴᡝᡴᡝᡵᡝᠮᠪᡳ", ko: "속도 체크인" },
      { id: "volcano", zh: "火山打卡", mnc: "ᡥᡠᠸᠣᡧᠠᠨ ᠴᡝᡴᡝᡵᡝᠮᠪᡳ", ko: "화산 체크인" },
      { id: "douyin-shop", zh: "抖音商城", mnc: "ᡩᠣᠣᠶᡳᠩ ᡧᠠᠩᠴᡝᠩ", ko: "도우인 쇼핑몰" },
      { id: "kuaishou", zh: "快手打卡", mnc: "ᡴᡠᠠᡳᡧᠣᡠ ᠴᡝᡴᡝᡵᡝᠮᠪᡳ", ko: "콰이쇼우 체크인" },
      { id: "kuaishou-coin", zh: "快手投币", mnc: "ᡴᡠᠠᡳᡧᠣᡠ ᠵᡳᡥᠠ ᡩᠠᠪᡠᠮᠪᡳ", ko: "콰이쇼우 코인 투입" },
      { id: "alipay", zh: "支付宝打卡", mnc: "ᠴᡳ᠌ᡶᡠᠪᠠᠣ ᠴᡝᡴᡝᡵᡝᠮᠪᡳ", ko: "즈푸바오 체크인" },
      { id: "sesame", zh: "芝麻打卡", mnc: "ᠴᡳ᠌ᠮᠠ ᠴᡝᡴᡝᡵᡝᠮᠪᡳ", ko: "즈마 체크인" },
      { id: "taobao", zh: "淘宝打卡", mnc: "ᡨᠠᠣᠪᠠᠣ ᠴᡝᡴᡝᡵᡝᠮᠪᡳ", ko: "타오바오 체크인" },
      { id: "yingyongbao", zh: "应用宝打卡", mnc: "ᠶᡳᠩᠶᡠᠩᠪᠠᠣ ᠴᡝᡬᡝᡵᡝᠮᠪᡳ", ko: "잉용바오 체크인" },
      { id: "huolong", zh: "火龙打卡", mnc: "ᡥᡠᠸᠣᠯᡠᠩ ᠴᡝᡴᡝᡵᡝᠮᠪᡳ", ko: "화룽 체크인" },
      { id: "xifan", zh: "喜番打卡", mnc: "ᡧᡳ᠌ᡶᠠᠨ ᠴᡝᡭᡝᡵᡝᠮᠪᡳ", ko: "시판 체크인" },
      { id: "jianying", zh: "剪映双卡", mnc: "ᠵᡳᠠᠨᠶᡳᠩ ᠵᡠᠸᡝ ᠴᡝᡴᡝᡵᡝᠮᠪᡳ", ko: "젠잉 더블 체크인" },
      { id: "qishui", zh: "汽水打卡", mnc: "ᠴᡳ᠌ᡧᡠᡳ ᠴᡝᡩᡝᡵᡝᠮᠪᡳ", ko: "치수이 체크인" },
      { id: "aliyun-drive", zh: "阿里云盘", mnc: "ᠠᠯᡳ ᠶᡠᠨ ᡦᠠᠨ", ko: "알리윈판" },
      { id: "hema-listen", zh: "河马畅听", mnc: "ᡥᡝᠮᠠ ᠴᡝᠠᡩ ᡨᡳᠩ", ko: "허마 창팅" },
      { id: "haima-listen", zh: "海马畅听", mnc: "ᡥᠠᡳᠮᠠ ᠴᡝᠠᡩ ᡨᡳᠩ", ko: "하이마 창팅" },
      { id: "today-news", zh: "今日看点", mnc: "ᡤᡳᠨ ᡵᡳ ᡴᠠᠨ ᡩᡳᠠᠨ", ko: "진르 꿀디앤" },
      { id: "uc", zh: "UC打卡", mnc: "UC ᠴᡝᡎᡝᡵᡝᠮᠪᡳ", ko: "UC 체크인" },
      { id: "hema", zh: "河马打卡", mnc: "ᡥᡝᠮᠠ ᠴᡝᡎᡝᡵᡝᠮᠪᡳ", ko: "허마 체크인" },
      { id: "longhu", zh: "龙湖打卡", mnc: "ᠯᡠᠩᡥᡠ ᠴᡝᡎᡝᡵᡝᠮᠪᡳ", ko: "롱후 체크인" },
    ],
  },
  {
    id: "pad",
    name: "PAD专区",
    mncName: "ᡦᠠᡩ ᡤᡝᠰᡝ",
    koName: "태블릿 전용",
    items: [
      { id: "pad-volcano", zh: "火山打卡（Pad）", mnc: "ᡥᡠᠸᠣᡧᠠᠨ ᠴᡝᡎᡝᡵᡝᠮᠪᡳ (ᡦᠠᡩ)", ko: "화산 체크인 (태블릿)" },
      { id: "pad-kuaishou", zh: "快手打卡（Pad）", mnc: "ᡴᡠᠠᡳᡧᠣᡠ ᠴᡝᡎᡝᡵᡝᠮᠪᡳ (ᡦᠠᡩ)", ko: "콰이쇼우 체크인 (태블릿)" },
      { id: "pad-kuaishou-coin", zh: "快手投币（Pad）", mnc: "ᡴᡠᠠᡳᡧᠣᡠ ᠵᡳᡥᠠ ᡩᠠᠪᡠᠮᠪᡳ (ᡦᠠᡩ)", ko: "콰이쇼우 코인 투입 (태블릿)" },
      { id: "pad-xifan", zh: "喜番打卡（Pad）", mnc: "ᡧᡳ᠌ᡶᠠᠨ ᠴᡝᡎᡝᡵᡝᠮᠪᡳ (ᡦᠠᡩ)", ko: "시판 체크인 (태블릿)" },
      { id: "pad-jianying", zh: "剪映双卡（Pad）", mnc: "ᠵᡳᠠᠨᠶᡳᠩ ᠵᡠᠸᡝ ᠴᡝᡎᡝᡵᡝᠮᠪᡳ (ᡦᠠᡩ)", ko: "젠잉 더블 체크인 (태블릿)" },
      { id: "pad-hema", zh: "河马打卡（Pad）", mnc: "ᡥᡝᠮᠠ ᠴᡝᡎᡝᡵᡝᠮᠪᡳ (ᡦᠠᡩ)", ko: "허마 체크인 (태블릿)" },
      { id: "pad-dejian-listen", zh: "得间畅听（Pad）", mnc: "ᡩᡝ ᡤᡳᠠᠨ ᠴᡝᠠᡩ ᡨᡳᠩ (ᡦᠠᡩ)", ko: "더젠 창팅 (태블릿)" },
      { id: "pad-uc", zh: "UC打卡（Pad）", mnc: "UC ᠴᡝᡎᡝᡵᡝᠮᠪᡳ (ᡦᠠᡩ)", ko: "UC 체크인 (태블릿)" },
      { id: "tomato-listen", zh: "番茄畅听（Pad）", mnc: "ᡶᠠᠨᠴᡳᡝ ᠴᠠᠩᡨᡳᠩ (ᡦᠠᡩ)", ko: "판치에 창팅 (태블릿)" },
      { id: "tomato-novel", zh: "番茄小说（Pad）", mnc: "ᡶᠠᠨᠴᡳᡝ ᡧᡳᠠᠣᡧᡠᠣ (ᡦᠠᡩ)", ko: "판치에 소설 (태블릿)" },
      { id: "hongguo", zh: "红果打卡（Pad）", mnc: "ᡥᡠᠩᡤᡠᠣ ᠴᡝᡎᡝᡵᡝᠮᠪᡳ (ᡦᠠᡩ)", ko: "홍궈 체크인 (태블릿)" },
    ],
  },
  {
    id: "company",
    name: "公司打卡",
    mncName: "ᡴᡠᠩᠰᡳ ᠴᡝᡴᡝᡵᡝᠮᠪᡳ",
    koName: "회사 체크인",
    items: [{ id: "company-checkin", zh: "公司打卡", mnc: "ᡴᡠᠩᠰᡳ ᠴᡝᡎᡝᡵᡝᠮᠪᡳ", ko: "회사 체크인" }],
  },
];

const STORAGE_KEY = "yuyuan-trilingual-checkins-v1";
const allTasks = categories.flatMap((category) => category.items);

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}

function CheckIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>;
}

function CalendarIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" /></svg>;
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("regular");
  const [store, setStore] = useState<CheckinStore>({});
  const [ready, setReady] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(2000, 0, 1));
  const [historyOpen, setHistoryOpen] = useState(false);
  const [rippleTask, setRippleTask] = useState<string | null>(null);

  const today = currentDate ? dateKey(currentDate) : "";
  const completedToday = store[today] ?? [];
  const currentCategory = categories.find((category) => category.id === activeCategory) ?? categories[0];
  const categoryComplete = currentCategory.items.filter((item) => completedToday.includes(item.id)).length;
  const progress = allTasks.length ? (completedToday.length / allTasks.length) * 100 : 0;

  useEffect(() => {
    queueMicrotask(() => {
      const current = new Date();
      setCurrentDate(current);
      setCalendarMonth(new Date(current.getFullYear(), current.getMonth(), 1));
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setStore(JSON.parse(saved) as CheckinStore);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
      setReady(true);
    });
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentDate(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }, [store, ready]);

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const result: Array<{ day: number; key: string } | null> = Array(firstWeekday).fill(null);
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      result.push({ day, key: dateKey(date) });
    }
    while (result.length % 7) result.push(null);
    return result;
  }, [calendarMonth]);

  function toggleTask(taskId: string) {
    const wasComplete = completedToday.includes(taskId);
    if (!wasComplete) {
      setRippleTask(taskId);
      window.setTimeout(() => setRippleTask(null), 650);
    }
    setStore((previous) => {
      const current = previous[today] ?? [];
      const next = current.includes(taskId) ? current.filter((id) => id !== taskId) : [...current, taskId];
      const updated = { ...previous };
      if (next.length) updated[today] = next;
      else delete updated[today];
      return updated;
    });
  }

  function moveMonth(offset: number) {
    setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  }

  const now = currentDate ?? new Date(2000, 0, 1);
  const isCurrentMonth = calendarMonth.getFullYear() === now.getFullYear() && calendarMonth.getMonth() === now.getMonth();
  const monthLabel = new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "long" }).format(calendarMonth);
  const todayLabel = currentDate
    ? new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "long" }).format(currentDate)
    : "今日";

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="noise" />

      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><span>安</span></div>
          <div>
            <div className="brand-name">煜安 · 每日修行</div>
            <div className="brand-subtitle">DAILY RITUAL</div>
          </div>
        </div>
        <button className="history-button" onClick={() => setHistoryOpen(true)} aria-label="打开打卡历史">
          <CalendarIcon />
          <span>打卡历史</span>
        </button>
      </header>

      <section className="hero">
        <div className="date-line"><span className="date-dot" />{todayLabel}</div>
        <div className="hero-row">
          <div>
            <p className="eyebrow">DAILY PROGRESS</p>
            <h1>今日打卡</h1>
            <p className="hero-copy">日拱一卒，功不唐捐。完成每一个微小的约定。</p>
          </div>
          <div className="progress-orb" style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}>
            <div className="progress-inner">
              <strong>{completedToday.length}</strong>
              <span>/ {allTasks.length}</span>
            </div>
          </div>
        </div>
        <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
      </section>

      <nav className="category-tabs" aria-label="打卡分类">
        {categories.map((category, index) => {
          const done = category.items.filter((item) => completedToday.includes(item.id)).length;
          return (
            <button key={category.id} className={activeCategory === category.id ? "active" : ""} onClick={() => setActiveCategory(category.id)}>
              <span className="tab-index">0{index + 1}</span>
              <span className="tab-copy"><strong>{category.name}</strong><small>{category.koName}</small></span>
              <span className="tab-count">{done}/{category.items.length}</span>
            </button>
          );
        })}
      </nav>

      <section className="task-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{currentCategory.koName.toUpperCase()}</p>
            <h2>{currentCategory.name}</h2>
          </div>
          <div className="section-meta"><span>{categoryComplete}</span> / {currentCategory.items.length} 已完成</div>
        </div>

        <div className={`task-grid ${currentCategory.items.length === 1 ? "single" : ""}`}>
          {currentCategory.items.map((task, index) => {
            const complete = completedToday.includes(task.id);
            return (
              <button
                key={task.id}
                className={`task-card ${complete ? "complete" : ""} ${rippleTask === task.id ? "rippling" : ""}`}
                onClick={() => toggleTask(task.id)}
                style={{ "--delay": `${Math.min(index, 8) * 45}ms` } as React.CSSProperties}
                aria-pressed={complete}
              >
                <span className="card-shine" />
                <span className="task-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="task-content">
                  <span className="task-zh">{task.zh}</span>
                  <span className="task-ko">{task.ko}</span>
                </span>
                <span className="task-mnc" lang="mnc-Mong">{task.mnc}</span>
                <span className="check-circle"><CheckIcon /></span>
                <span className="ripple" />
              </button>
            );
          })}
        </div>
      </section>

      <footer>
        <span />
        <p>今日之事 · 今日毕</p>
        <span />
      </footer>

      {historyOpen && (
        <div className="modal-backdrop" onMouseDown={() => setHistoryOpen(false)}>
          <section className="history-panel" onMouseDown={(event) => event.stopPropagation()} aria-modal="true" role="dialog">
            <div className="modal-handle" />
            <div className="history-header">
              <div><p className="eyebrow">CHECK-IN ARCHIVE</p><h2>打卡历史</h2></div>
              <button className="close-button" onClick={() => setHistoryOpen(false)} aria-label="关闭">×</button>
            </div>
            <div className="month-nav">
              <button onClick={() => moveMonth(-1)} aria-label="上个月"><Chevron direction="left" /></button>
              <strong>{monthLabel}</strong>
              <button onClick={() => moveMonth(1)} disabled={isCurrentMonth} aria-label="下个月"><Chevron direction="right" /></button>
            </div>
            <div className="calendar-weekdays">{["日", "一", "二", "三", "四", "五", "六"].map((day) => <span key={day}>{day}</span>)}</div>
            <div className="calendar-grid">
              {calendarDays.map((entry, index) => {
                if (!entry) return <span key={`blank-${index}`} className="calendar-day empty" />;
                const count = store[entry.key]?.length ?? 0;
                const isToday = entry.key === today;
                const isFuture = entry.key > today;
                return (
                  <div key={entry.key} className={`calendar-day ${count ? "has-checkin" : ""} ${count === allTasks.length ? "all-done" : ""} ${isToday ? "today" : ""} ${isFuture ? "future" : ""}`}>
                    <span>{entry.day}</span>
                    {count > 0 && <i title={`${count} 项已完成`} />}
                  </div>
                );
              })}
            </div>
            <div className="history-legend">
              <span><i className="legend-dot" />有打卡记录</span>
              <span><i className="legend-ring" />今日</span>
            </div>
            <div className="history-summary">
              <div><strong>{Object.values(store).filter((items) => items.length > 0).length}</strong><span>累计打卡天数</span></div>
              <div><strong>{Object.values(store).reduce((sum, items) => sum + items.length, 0)}</strong><span>累计完成项目</span></div>
              <div><strong>{Object.values(store).filter((items) => items.length === allTasks.length).length}</strong><span>完美达成天数</span></div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
