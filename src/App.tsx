import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { useMousePosition } from "@/hooks/useMousePosition";

type Service = {
  id: string;
  title: string;
  description: string;
  image: string;
  tone: string;
};

type Stat = { value: string; label: string; hint?: string; num?: number; suffix?: string };
type Step = { num: string; title: string; text: string; duration: string };
type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  url: string;
  palette: { bg: string; accent: string; text: string };
  mock: "booking" | "shop" | "landing";
};
type Tool = { name: string; category: string; letter: string; color: string };
type Faq = { q: string; a: string };

const stats: Stat[] = [
  { value: "3", label: "Проекта в портфолио", hint: "личные и учебные работы", num: 3 },
  { value: "5+", label: "Технологий в стеке", hint: "React, TS, Tailwind, Vite, Blender", num: 5, suffix: "+" },
  { value: "24ч", label: "Ответ на заявку", hint: "в будни — быстрее", num: 24, suffix: "ч" },
  { value: "∞", label: "Готовность работать", hint: "и учиться под задачу" },
];

const steps: Step[] = [
  {
    num: "01",
    title: "Знакомство",
    text: "Созвон 30 минут, разбираем задачу, цели и ограничения. Формирую понимание продукта.",
    duration: "1 день",
  },
  {
    num: "02",
    title: "Стратегия",
    text: "Готовлю карту решений: что делаем сами, что интегрируем, какие метрики измеряем.",
    duration: "2–4 дня",
  },
  {
    num: "03",
    title: "Дизайн",
    text: "Прототип, визуальная концепция, интерактивные макеты. Согласуем экран за экраном.",
    duration: "5–10 дней",
  },
  {
    num: "04",
    title: "Разработка",
    text: "React, современный стек, чистый код. Демо-сборки в конце каждой недели.",
    duration: "2–6 недель",
  },
  {
    num: "05",
    title: "Запуск и обучение",
    text: "Публикуем, подключаем аналитику, обучаю команду работать с CRM и админкой.",
    duration: "1 неделя",
  },
  {
    num: "06",
    title: "Поддержка",
    text: "На связи после запуска. Правки, обновления, развитие функционала по спринтам.",
    duration: "по запросу",
  },
];

const portfolio: PortfolioItem[] = [
  {
    id: "beauty",
    title: "Beauty Studio",
    category: "Онлайн запись",
    description:
      "Демо-сайт салона красоты с интеграцией виджета DIKIDI и адаптивной вёрсткой под мобильные.",
    url: "beauty.ddvg.demo",
    palette: { bg: "#f4e5d8", accent: "#c96a4b", text: "#2c1810" },
    mock: "booking",
  },
  {
    id: "shop",
    title: "React Store",
    category: "Интернет-магазин",
    description:
      "Учебный магазин на React с корзиной, фильтрами и оформлением заказа. Чистый UI и типографика.",
    url: "shop.ddvg.demo",
    palette: { bg: "#111", accent: "#ff9a1f", text: "#f5f5f5" },
    mock: "shop",
  },
  {
    id: "landing",
    title: "Startup Landing",
    category: "Лендинг",
    description:
      "Промо-страница для стартапа: hero-блок, форма подписки и адаптив под все экраны.",
    url: "landing.ddvg.demo",
    palette: { bg: "#e8ecff", accent: "#4a5fe8", text: "#101a3a" },
    mock: "landing",
  },
];

const tools: Tool[] = [
  { name: "React", category: "Frontend", letter: "R", color: "#0787ad" },
  { name: "TypeScript", category: "Language", letter: "TS", color: "#2f74c0" },
  { name: "Tailwind", category: "Styling", letter: "T", color: "#06b6d4" },
  { name: "Vite", category: "Build", letter: "V", color: "#8b5cf6" },
  { name: "Blender", category: "3D", letter: "B", color: "#ea7600" },
  { name: "DIKIDI", category: "CRM", letter: "D", color: "#18182d" },
  { name: "Canva", category: "Media", letter: "C", color: "#8f16ed" },
  { name: "Notion", category: "PM", letter: "N", color: "#111" },
];

const heroWords = ["CRM", "Вебсайт", "Рекламу", "Айдентику", "Дизайн", "Моушн"];
const heroTicker = ["React", "TypeScript", "Tailwind", "CRM", "Motion", "Analytics", "Vite", "UX"];

const revealDelay = (index: number, step = 80): CSSProperties =>
  ({ "--reveal-delay": `${index * step}ms` } as CSSProperties);

const faqs: Faq[] = [
  {
    q: "Сколько стоит проект?",
    a: "Стоимость зависит от объёма: сайт-визитка от 45 000 ₽, внедрение онлайн-записи от 25 000 ₽, комплексный проект — по смете после короткого созвона.",
  },
  {
    q: "Как быстро вы запускаете сайт?",
    a: "Средний срок — 3–5 недель от брифа до публикации. Небольшие лендинги делаю за 10–14 дней.",
  },
  {
    q: "На кого рассчитаны ваши услуги?",
    a: "В первую очередь — малый и средний бизнес. Это сегмент, где я вижу максимальный эффект от диджитала и где могу быстро запуститься.",
  },
  {
    q: "У вас уже есть клиенты?",
    a: "Пока я собираю портфолио на своих демо-проектах и открыт к первым заказам. Готов сделать первый коммерческий проект с особыми условиями — напишите, обсудим.",
  },
  {
    q: "Что с поддержкой после запуска?",
    a: "Гарантия 30 дней на все правки, дальше — почасовая поддержка или ежемесячный пакет часов.",
  },
  {
    q: "Можно ли забрать исходники?",
    a: "Да. Весь код передаётся вам, репозиторий разворачивается на ваших доменах и аккаунтах.",
  },
];

const navLinks: { id: string; label: string; icon: string }[] = [
  { id: "about", label: "Обо мне", icon: "user" },
  { id: "services", label: "Услуги", icon: "grid" },
  { id: "process", label: "Процесс", icon: "flow" },
  { id: "portfolio", label: "Портфолио", icon: "layers" },
  { id: "stack", label: "Стек", icon: "chip" },
  { id: "faq", label: "FAQ", icon: "help" },
];

function NavIcon({ name }: { name: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
        </svg>
      );
    case "grid":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    case "flow":
      return (
        <svg {...common}>
          <circle cx="5" cy="6" r="2.2" />
          <circle cx="19" cy="12" r="2.2" />
          <circle cx="5" cy="18" r="2.2" />
          <path d="M7 7l10 4M7 17l10-4" />
        </svg>
      );
    case "layers":
      return (
        <svg {...common}>
          <path d="M12 3l9 5-9 5-9-5 9-5z" />
          <path d="M3 13l9 5 9-5" />
          <path d="M3 17l9 5 9-5" />
        </svg>
      );
    case "chip":
      return (
        <svg {...common}>
          <rect x="6" y="6" width="12" height="12" rx="2" />
          <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
        </svg>
      );
    case "help":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9a2.5 2.5 0 015 .5c0 1.5-2.5 2-2.5 4" />
          <circle cx="12" cy="17.5" r=".8" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return null;
  }
}

const services: Service[] = [
  {
    id: "booking",
    title: "Внедрение онлайн записи",
    description:
      "Вебсайт с интеграцией виджета для онлайн записи DIKIDI с последующим обучением работы с DIKIDI CRM.",
    image: "/images/service-booking.jpg",
    tone: "service-card--violet",
  },
  {
    id: "web",
    title: "Разработка вебсайта",
    description:
      "Создание брендового вебсайта на React с персональным дизайном.",
    image: "/images/service-web.jpg",
    tone: "service-card--blue",
  },
  {
    id: "design",
    title: "Дизайн рекламных баннеров",
    description:
      "Создание брендовой видео/фото рекламы для рекламных щитов и баннеров.",
    image: "/images/service-design.jpg",
    tone: "service-card--coral",
  },
];

function BrandMark() {
  return (
    <a className="brand-mark" href="#top" aria-label="DDVG, на главную">
      <span>DD</span>
      <span>VG<span className="brand-dot">.</span></span>
    </a>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className={`menu-icon${open ? " is-open" : ""}`} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

function ReactMark() {
  return (
    <span className="service-logo service-logo--react" aria-hidden="true">
      <svg viewBox="0 0 120 120" role="presentation">
        <ellipse cx="60" cy="60" rx="52" ry="20" />
        <ellipse cx="60" cy="60" rx="52" ry="20" transform="rotate(60 60 60)" />
        <ellipse cx="60" cy="60" rx="52" ry="20" transform="rotate(120 60 60)" />
        <circle cx="60" cy="60" r="9" />
      </svg>
    </span>
  );
}

function ServiceMark({ id }: { id: string }) {
  if (id === "booking") {
    return <span className="service-logo service-logo--booking" aria-hidden="true">D</span>;
  }
  if (id === "web") return <ReactMark />;
  return <span className="service-logo service-logo--canva" aria-hidden="true">Canva</span>;
}

function AnimatedStatValue({ to, suffix = "" }: { to: number; suffix?: string }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCurrent(to);
      return;
    }

    let frameId = 0;
    let started = false;
    let startTime: number | null = null;
    const duration = 1350;

    const animate = (time: number) => {
      if (startTime === null) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(to * eased));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    const start = () => {
      if (started) return;
      started = true;
      frameId = window.requestAnimationFrame(animate);
    };

    if (!("IntersectionObserver" in window)) {
      start();
      return () => window.cancelAnimationFrame(frameId);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
          observer.disconnect();
        }
      },
      { threshold: 0.45 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frameId);
    };
  }, [to]);

  return <span ref={nodeRef}>{current}{suffix}</span>;
}

function StatCard({ stat, index }: { stat: Stat; index: number }) {
  return (
    <div className="stat-card" data-reveal style={revealDelay(index)}>
      <p className="stat-card__value">
        {typeof stat.countTo === "number" ? (
          <AnimatedStatValue to={stat.countTo} suffix={stat.suffix} />
        ) : (
          <span className="stat-card__infinity">{stat.value}</span>
        )}
      </p>
      <p className="stat-card__label">{stat.label}</p>
      {stat.hint && <p className="stat-card__hint">{stat.hint}</p>}
    </div>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const handlePointerMove = (event: MouseEvent<HTMLElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 7;
    const rotateX = (0.5 - y / rect.height) * 7;

    card.style.setProperty("--mx", `${x}px`);
    card.style.setProperty("--my", `${y}px`);
    card.style.setProperty("--rx", `${rotateX}deg`);
    card.style.setProperty("--ry", `${rotateY}deg`);
  };

  const handlePointerLeave = (event: MouseEvent<HTMLElement>) => {
    const card = event.currentTarget;
    card.style.setProperty("--mx", "50%");
    card.style.setProperty("--my", "50%");
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  };

  return (
    <article
      className={`service-card ${service.tone}`}
      data-reveal
      style={revealDelay(index)}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
    >
      <img src={service.image} alt="" />
      <div className="service-card__veil" />
      <ServiceMark id={service.id} />
      <div className="service-card__copy">
        <h2>{service.title}</h2>
        <p>{service.description}</p>
      </div>
      <span className="service-card__index" aria-hidden="true">0{index + 1}</span>
    </article>
  );
}

function PortfolioMock({
  kind,
  palette,
}: {
  kind: "booking" | "shop" | "landing";
  palette: { bg: string; accent: string; text: string };
}) {
  if (kind === "booking") {
    return (
      <div className="mock mock--booking">
        <div className="mock__title" style={{ color: palette.text }}>
          Запись
        </div>
        <div className="mock__row">
          {["10", "11", "12", "13", "14", "15"].map((h, i) => (
            <span
              key={h}
              className="mock__slot"
              style={{
                background: i === 2 ? palette.accent : "rgba(0,0,0,.06)",
                color: i === 2 ? "#fff" : palette.text,
              }}
            >
              {h}:00
            </span>
          ))}
        </div>
        <div className="mock__card" style={{ background: "rgba(0,0,0,.05)" }}>
          <div className="mock__avatar" style={{ background: palette.accent }} />
          <div className="mock__lines">
            <span style={{ background: palette.text, opacity: .8 }} />
            <span style={{ background: palette.text, opacity: .35 }} />
          </div>
        </div>
        <div
          className="mock__button"
          style={{ background: palette.accent, color: "#fff" }}
        >
          Забронировать
        </div>
      </div>
    );
  }

  if (kind === "shop") {
    return (
      <div className="mock mock--shop">
        <div className="mock__grid">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="mock__tile"
              style={{
                background: i % 2 === 0 ? "rgba(255,255,255,.08)" : palette.accent,
              }}
            >
              <span style={{ background: "rgba(255,255,255,.35)" }} />
              <span style={{ background: "rgba(255,255,255,.2)" }} />
            </div>
          ))}
        </div>
        <div className="mock__foot">
          <span style={{ color: palette.text }}>Корзина</span>
          <span
            className="mock__badge"
            style={{ background: palette.accent, color: "#fff" }}
          >
            3
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mock mock--landing">
      <div className="mock__hero">
        <div className="mock__lines">
          <span style={{ background: palette.text, width: "80%" }} />
          <span style={{ background: palette.text, width: "55%", opacity: .5 }} />
        </div>
        <div className="mock__pill" style={{ background: palette.accent }} />
      </div>
      <div className="mock__blocks">
        <div style={{ background: "rgba(255,255,255,.7)" }} />
        <div style={{ background: "rgba(255,255,255,.7)" }} />
        <div style={{ background: palette.accent }} />
      </div>
    </div>
  );
}

function AnimatedStat({ stat, isActive }: { stat: Stat; isActive: boolean }) {
  const counter = useAnimatedCounter(stat.num ?? 0, isActive);

  if (stat.value === "∞") {
    return <>{stat.value}</>;
  }

  return (
    <>
      <span className="count-animate" key={counter}>
        {counter}
      </span>
      {stat.suffix && <span className="stat-card__value-suffix">{stat.suffix}</span>}
    </>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [wordIndex, setWordIndex] = useState(0);

  const [scrolled, setScrolled] = useState(false);
  const scrollProgress = useScrollProgress();
  const mousePos = useMousePosition();

  const aboutView = useInView<HTMLElement>({ threshold: 0.08 });
  const servicesView = useInView<HTMLElement>({ threshold: 0.06 });
  const statsView = useInView<HTMLElement>({ threshold: 0.25 });
  const processView = useInView<HTMLElement>({ threshold: 0.06 });
  const portfolioView = useInView<HTMLElement>({ threshold: 0.05 });
  const stackView = useInView<HTMLElement>({ threshold: 0.08 });
  const ctaView = useInView<HTMLElement>({ threshold: 0.1 });
  const faqView = useInView<HTMLElement>({ threshold: 0.06 });

  useEffect(() => {
    document.documentElement.style.setProperty("--mx", `${mousePos.x}%`);
    document.documentElement.style.setProperty("--my", `${mousePos.y}%`);
  }, [mousePos]);

  useEffect(() => {
    const id = window.setInterval(
      () => setWordIndex((value) => (value + 1) % heroWords.length),
      2400
    );
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    const onPointerMove = (event: PointerEvent) => {
      root.style.setProperty("--cursor-x", `${event.clientX}px`);
      root.style.setProperty("--cursor-y", `${event.clientY}px`);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.documentElement.classList.add("motion-ready");
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const revealTimers: number[] = [];
    const reveal = (target: Element) => {
      const delay = Number.parseFloat(
        window.getComputedStyle(target as HTMLElement).getPropertyValue("--reveal-delay")
      ) || 0;
      const timer = window.setTimeout(() => target.classList.add("is-visible"), delay);
      revealTimers.push(timer);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => {
      observer.disconnect();
      revealTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", menuOpen || contactOpen);
    return () => document.body.classList.remove("no-scroll");
  }, [menuOpen, contactOpen]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setContactOpen(false);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const goTo = (target: string) => {
    setMenuOpen(false);
    window.setTimeout(() => {
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    }, 120);
  };

  return (
    <main id="top">
      <div className="scroll-progress" style={{ width: `${scrollProgress * 100}%` }} aria-hidden="true" />
      <div className={`header-bar${scrolled ? " is-stuck" : ""}`}>
      <header className="site-header shell">
        <button
          className="menu-button menu-button--mobile"
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          aria-label="Открыть меню"
        >
          <MenuIcon open={menuOpen} />
          <span>Меню</span>
        </button>

        <nav className="nav-dock" aria-label="Основная навигация">
          {navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              className="nav-dock__item"
              onClick={() => goTo(`#${link.id}`)}
            >
              <span className="nav-dock__icon" aria-hidden="true">
                <NavIcon name={link.icon} />
              </span>
              <span className="nav-dock__label">{link.label}</span>
            </button>
          ))}
        </nav>

        <BrandMark />
        <button className="project-button" type="button" onClick={() => setContactOpen(true)}>
          Начать проект
        </button>
      </header>
      </div>

      <nav
        id="site-navigation"
        className={`menu-panel${menuOpen ? " is-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className="menu-panel__inner shell">
          <p>Навигация</p>
          <button type="button" onClick={() => goTo("#about")}>Обо мне</button>
          <button type="button" onClick={() => goTo("#services")}>Услуги</button>
          <button type="button" onClick={() => goTo("#process")}>Процесс</button>
          <button type="button" onClick={() => goTo("#portfolio")}>Портфолио</button>
          <button type="button" onClick={() => goTo("#stack")}>Стек</button>
          <button type="button" onClick={() => goTo("#faq")}>Вопросы</button>
          <button type="button" onClick={() => goTo("#contact")}>Обсудить проект</button>
        </div>
      </nav>

      <section className="hero shell" aria-labelledby="hero-title">
        <div
          className="hero__image-wrap hero__parallax-layer"
          style={{ transform: `translate(${(mousePos.x - 50) * -0.03}px, ${(mousePos.y - 50) * -0.03}px)` }}
        >
          <img className="hero__image" src="/images/hero-ocean.jpg" alt="Спокойное синее море до горизонта" />
        </div>
        <div className="hero__wash" />
        <div className="hero__tech-grid" aria-hidden="true" />
        <div className="hero__orb hero__orb--one" aria-hidden="true" />
        <div className="hero__orb hero__orb--two" aria-hidden="true" />
        <div className="hero__hud" aria-hidden="true">
          <div className="hero__hud-top">
            <span className="hero__status-dot" />
            <span>Live build</span>
            <strong>DDVG</strong>
          </div>
          <div className="hero__terminal">
            <span><i />npm run build</span>
            <span><i />React + TypeScript</span>
            <span><i />Motion-ready UI</span>
          </div>
          <div className="hero__hud-metrics">
            <span>Typed UI</span>
            <span>Fast build</span>
          </div>
        </div>
        <div className="hero__marquee" aria-hidden="true">
          <div className="hero__ticker-track">
            {[...heroTicker, ...heroTicker].map((item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
        </div>
        <p className="hero__quality">Комплексность</p>
        <h1 id="hero-title">
          <span className="hero__line">Давай</span>
          <span className="hero__line hero__line--action">
            <span className="hero__static">
              сделаем<span className="orange">:</span>
            </span>
            <span className="hero__slot">
              <span className="hero__word" key={heroWords[wordIndex]}>
                {heroWords[wordIndex]}
              </span>
            </span>
          </span>
        </h1>
        <p className="hero__tag">#Диджитал развитие м/с бизнеса<span className="orange">.</span></p>
      </section>

      <section className={`about shell reveal${aboutView.isInView ? " is-visible" : ""}`} id="about" aria-labelledby="about-title" ref={aboutView.ref}>
        <div className="about__panel">
          <div>
            <h2 id="about-title">DDVG—</h2>
            <p className="about__name">Digital<br />Development by<br />Vlad Gusarenko</p>
            <p className="about__intro">
              Первые два слова говорят чем я занимаюсь, а именно цифровым развитием бизнеса.
            </p>
          </div>
          <p className="about__copy">
            Я специализируюсь на малом и среднем бизнесе и предлагаю вам услуги развития не только своего бренда, но и внедрения технологий для автоматизации бизнеса.
          </p>
        </div>
        <button className="section-label about__label" type="button" onClick={() => goTo("#about")}>О мне</button>
        <button className="section-label about__services" type="button" onClick={() => goTo("#services")}>Услуги</button>
        <div className="about__monogram" aria-hidden="true">DD<span>VG</span></div>
      </section>

      <section className={`services shell reveal${servicesView.isInView ? " is-visible" : ""}`} id="services" aria-label="Услуги" ref={servicesView.ref}>
        {services.map((service, index) => (
          <article className={`service-card ${service.tone} reveal reveal--d${index + 1}${servicesView.isInView ? " is-visible" : ""}`} key={service.id}>
            <img src={service.image} alt="" />
            <div className="service-card__veil" />
            <ServiceMark id={service.id} />
            <div className="service-card__copy">
              <h2>{service.title}</h2>
              <p>{service.description}</p>
            </div>
            <span className="service-card__index" aria-hidden="true">0{index + 1}</span>
          </article>
        ))}
      </section>

      <section className={`stats shell reveal${statsView.isInView ? " is-visible" : ""}`} aria-label="Цифры" ref={statsView.ref}>
        {stats.map((stat) => (
          <div className={`stat-card reveal reveal--d${stats.indexOf(stat) + 1}${statsView.isInView ? " is-visible" : ""}`} key={stat.label}>
            <p className="stat-card__value">
              {stat.num !== undefined ? (
                <AnimatedStat stat={stat} isActive={statsView.isInView} />
              ) : (
                stat.value
              )}
            </p>
            <p className="stat-card__label">{stat.label}</p>
            {stat.hint && <p className="stat-card__hint">{stat.hint}</p>}
          </div>
        ))}
      </section>

      <section className={`process shell reveal${processView.isInView ? " is-visible" : ""}`} id="process" aria-labelledby="process-title" ref={processView.ref}>
        <header className="process__head">
          <span className="section-label section-label--static">Процесс</span>
          <h2 id="process-title">
            Как я веду проект<span className="orange">.</span>
          </h2>
          <p>Прозрачный ритм: каждую неделю — демо, каждую задачу — статус в общем канале.</p>
        </header>
        <div className="process__grid">
          {steps.map((step) => (
            <article className={`process-card reveal reveal--d${+step.num}${processView.isInView ? " is-visible" : ""}`} key={step.num}>
              <div className="process-card__top">
                <span className="process-card__num">{step.num}</span>
                <span className="process-card__duration">{step.duration}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`portfolio shell reveal${portfolioView.isInView ? " is-visible" : ""}`} id="portfolio" aria-labelledby="portfolio-title" ref={portfolioView.ref}>
        <header className="portfolio__head">
          <span className="section-label section-label--static">Портфолио</span>
          <h2 id="portfolio-title">
            Три моих сайта<span className="orange">.</span>
          </h2>
          <p>
            Пока это демо-проекты, на которых я оттачиваю подход и стек.<br />
            Ваш проект может стать первым в этом списке.
          </p>
        </header>
        <div className="portfolio__grid">
          {portfolio.map((item, index) => (
            <article className={`portfolio-card reveal reveal--d${index + 1}${portfolioView.isInView ? " is-visible" : ""}`} key={item.id}>
            <article className="portfolio-card" key={item.id} data-reveal style={revealDelay(index, 90)}>
              <div
                className="portfolio-card__preview"
                style={{ background: item.palette.bg, color: item.palette.text }}
              >
                <div className="portfolio-card__bar">
                  <span />
                  <span />
                  <span />
                  <span className="portfolio-card__url">{item.url}</span>
                </div>
                <div className="portfolio-card__viewport">
                  <PortfolioMock kind={item.mock} palette={item.palette} />
                </div>
              </div>
              <div className="portfolio-card__meta">
                <span className="portfolio-card__index">0{index + 1}</span>
                <span className="portfolio-card__category">{item.category}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="stack shell" id="stack" aria-labelledby="stack-title">
        <div className="stack__intro" data-reveal>
          <span className="section-label section-label--static">Стек</span>
          <h2 id="stack-title">
            Работаю на современных<br />инструментах<span className="orange">.</span>
          </h2>
          <p>Технологии выбираю под задачу, а не под моду. Ниже — то, что использую чаще всего.</p>
        </div>
        <div className="stack__grid">
          {tools.map((tool, index) => (
            <article className="tool-card" key={tool.name} data-reveal style={revealDelay(index, 45)}>
              <span
                className="tool-card__badge"
                style={{ background: tool.color }}
                aria-hidden="true"
              >
                {tool.letter}
              </span>
              <p className="tool-card__name">{tool.name}</p>
              <p className="tool-card__category">{tool.category}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`cta-note shell reveal${ctaView.isInView ? " is-visible" : ""}`} aria-label="Первый клиент" ref={ctaView.ref}>
      <section className="cta-note shell" aria-label="Первый клиент" data-reveal>
        <div className="cta-note__inner">
          <span className="cta-note__badge">Первый клиент</span>
          <h2>
            Ищу первый коммерческий проект<span className="orange">.</span>
          </h2>
          <p>
            Готов сделать первый заказ по особой цене — в обмен на подробный кейс, отзыв и право показать
            работу в портфолио. Пишите, если хотите обсудить.
          </p>
          <button
            className="cta-note__button"
            type="button"
            onClick={() => setContactOpen(true)}
          >
            Обсудить условия →
          </button>
        </div>
      </section>

      <section className={`faq shell reveal${faqView.isInView ? " is-visible" : ""}`} id="faq" aria-labelledby="faq-title" ref={faqView.ref}>
        <header className="faq__head">
      <section className="faq shell" id="faq" aria-labelledby="faq-title">
        <header className="faq__head" data-reveal>
          <span className="section-label section-label--static">FAQ</span>
          <h2 id="faq-title">
            Частые вопросы<span className="orange">.</span>
          </h2>
        </header>
        <div className="faq__list">
          {faqs.map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <button
                key={item.q}
                type="button"
                className={`faq-item reveal reveal--d${index + 1}${faqView.isInView ? " is-visible" : ""}${isOpen ? " is-open" : ""}`}
                className={`faq-item${isOpen ? " is-open" : ""}`}
                data-reveal
                style={revealDelay(index, 55)}
                onClick={() => setOpenFaq(isOpen ? null : index)}
                aria-expanded={isOpen}
              >
                <span className="faq-item__q">
                  <span className="faq-item__num">0{index + 1}</span>
                  <span>{item.q}</span>
                </span>
                <span className="faq-item__toggle" aria-hidden="true">
                  <i />
                  <i />
                </span>
                <span className="faq-item__a">{item.a}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="contact shell" id="contact" aria-labelledby="contact-title">
        <div
          className="contact__canvas"
          data-reveal
          role="button"
          tabIndex={0}
          onClick={() => setContactOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setContactOpen(true);
            }
          }}
          aria-label="Открыть форму нового проекта"
        >
          <div className="contact__headline">
            <h2 id="contact-title">Обсудить проект</h2>
            <p>и вывести свой бизнес на<br />новый уровень</p>
          </div>
          <span className="contact__cta" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M7 17L17 7M9 7h8v8" />
            </svg>
          </span>
          <p className="contact__hint">
            Нажмите в любом месте блока — откроется форма заявки
          </p>
        </div>
      </section>

      <footer className="footer shell">
        <BrandMark />
        <p>Digital Development by Vlad Gusarenko</p>
        <p>{new Date().getFullYear()}</p>
      </footer>

      <div
        className={`dialog-backdrop${contactOpen ? " is-open" : ""}`}
        role="presentation"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) setContactOpen(false);
        }}
      >
        <section
          className="contact-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          aria-hidden={!contactOpen}
        >
          <button className="dialog-close" type="button" onClick={() => setContactOpen(false)} aria-label="Закрыть">
            <span />
            <span />
          </button>
          <p className="dialog-kicker">Новый проект</p>
          <h2 id="dialog-title">Расскажите<br />о вашей задаче</h2>
          <p className="dialog-copy">
            Выберите удобный способ — отвечу в течение 24 часов, уточню детали и предложу следующий шаг.
          </p>
          <div className="dialog-actions">
            <a className="dialog-actions__btn dialog-actions__btn--mail" href="mailto:hello@ddvg.digital?subject=Новый проект">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="3" />
                <path d="m2 7 10 6L22 7" />
              </svg>
              Написать на почту
            </a>
            <a className="dialog-actions__btn dialog-actions__btn--tg" href="https://t.me/" target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
              Открыть Telegram
            </a>
            <a className="dialog-actions__btn dialog-actions__btn--wa" href="https://wa.me/" target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
              </svg>
              Написать в WhatsApp
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;