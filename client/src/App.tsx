/**
 * WellTune — App.tsx
 * Single-file React application (Vite + Tailwind)
 * All views controlled by a `view` state string.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Leaf,
  LogIn,
  UserPlus,
  Home,
  ListMusic,
  Play,
  Users,
  BarChart2,
  PlusCircle,
  Trash2,
  Edit3,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Heart,
  MessageCircle,
  UserCheck,
  UserX,
  X,
  Clock,
  Sparkles,
  Moon,
  Zap,
  Smile,
  Frown,
  Meh,
  ThumbsUp,
  Star,
  ArrowLeft,
  Save,
  LogOut,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Sun,
} from "lucide-react";

// ─── Config ──────────────────────────────────────────────────────────────────
const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// ─── HTTP helper ─────────────────────────────────────────────────────────────
async function api(path: string, opts: RequestInit = {}, token?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: {
      ...headers,
      ...((opts.headers as Record<string, string>) || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// ─── Types ───────────────────────────────────────────────────────────────────
interface User {
  id: number;
  username: string;
  email: string;
  bio?: string;
}
interface Step {
  id?: number;
  title: string;
  duration_sec: number;
  instruction?: string;
}
interface Playlist {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  category: string;
  is_public: number;
  username: string;
  comment_count?: number;
  like_count?: number;
  liked_by_me?: boolean;
  steps?: Step[];
  comments?: Comment[];
}

interface MoodLog {
  id: number;
  mood: string;
  note?: string;
  playlist_title: string;
  logged_at: string;
}
interface Comment {
  id: number;
  user_id: number;
  username: string;
  body: string;
  created_at: string;
}

// ─── Category meta ───────────────────────────────────────────────────────────
const CATEGORIES: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  stress_relief: {
    label: "Stress Relief",
    color: "bg-sky-100 text-sky-700",
    icon: <Moon size={14} />,
  },
  strength: {
    label: "Strength",
    color: "bg-rose-100 text-rose-700",
    icon: <Zap size={14} />,
  },
  flexibility: {
    label: "Flexibility",
    color: "bg-amber-100 text-amber-700",
    icon: <Sparkles size={14} />,
  },
  mindfulness: {
    label: "Mindfulness",
    color: "bg-violet-100 text-violet-700",
    icon: <Leaf size={14} />,
  },
  energy: {
    label: "Energy",
    color: "bg-lime-100 text-lime-700",
    icon: <Zap size={14} />,
  },
  sleep: {
    label: "Sleep",
    color: "bg-indigo-100 text-indigo-700",
    icon: <Moon size={14} />,
  },
};

const MOODS = [
  {
    val: "amazing",
    label: "Amazing",
    icon: <Star size={22} />,
    color: "text-yellow-500",
  },
  {
    val: "good",
    label: "Good",
    icon: <ThumbsUp size={22} />,
    color: "text-green-500",
  },
  {
    val: "okay",
    label: "Okay",
    icon: <Smile size={22} />,
    color: "text-sky-500",
  },
  {
    val: "tired",
    label: "Tired",
    icon: <Meh size={22} />,
    color: "text-orange-400",
  },
  {
    val: "stressed",
    label: "Stressed",
    icon: <Frown size={22} />,
    color: "text-red-400",
  },
];

const DISCOVER_META: Record<
  string,
  { banner: string; emoji: string; badge: string }
> = {
  mindfulness: { banner: "bg-[#9b84f6]", emoji: "🧘", badge: "Beginner" },
  strength: { banner: "bg-[#f36f87]", emoji: "💪", badge: "Intermediate" },
  sleep: { banner: "bg-[#7d89f6]", emoji: "😴", badge: "Beginner" },
  stress_relief: { banner: "bg-[#59d7b2]", emoji: "🌿", badge: "Beginner" },
  flexibility: { banner: "bg-[#7c86ff]", emoji: "🤸", badge: "Intermediate" },
  energy: { banner: "bg-[#f49aa8]", emoji: "⚡", badge: "Intermediate" },
};

function getRoutineMeta(cat: string) {
  return (
    DISCOVER_META[cat] || {
      banner: "bg-[#8d97ff]",
      emoji: "✨",
      badge: "Routine",
    }
  );
}

function getTotalSeconds(steps?: Step[]) {
  return (steps || []).reduce((sum, s) => sum + Number(s.duration_sec || 0), 0);
}

function formatMinutes(totalSeconds: number) {
  const mins = Math.max(1, Math.round(totalSeconds / 60));
  return `${mins} min`;
}

// ═════════════════════════════════════════════════════════════════════════════
// Small UI atoms
// ═════════════════════════════════════════════════════════════════════════════

function Btn({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger" | "outline";
  className?: string;
  disabled?: boolean;
}) {
  const base =
    "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed";
  const v = {
    primary: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    outline: "border border-slate-200 text-slate-700 hover:bg-slate-50",
  };
  return (
    <button
      className={`${base} ${v[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function Input({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        {label}
      </label>
      <input
        {...props}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
      />
    </div>
  );
}

function Textarea({
  label,
  ...props
}: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        {label}
      </label>
      <textarea
        {...props}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition resize-none"
      />
    </div>
  );
}

function CategoryBadge({ cat }: { cat: string }) {
  const m = CATEGORIES[cat];
  if (!m) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${m.color}`}
    >
      {m.icon} {m.label}
    </span>
  );
}

function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-800 text-white text-sm px-5 py-3 rounded-2xl shadow-xl animate-fade-in flex items-center gap-3">
      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" /> {msg}
      <button onClick={onClose}>
        <X size={14} />
      </button>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═════════════════════════════════════════════════════════════════════════════

export default function App() {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("wt_token"),
  );
  const [me, setMe] = useState<User | null>(null);
  const [view, setView] = useState("login"); // login | signup | survey | dashboard | explore | myRoutines | player | profile | moodHistory
  const [toast, setToast] = useState("");
  const [profileUserId, setProfileUserId] = useState<number | null>(null);
  const [player, setPlayer] = useState<Playlist | null>(null);

  function openPlayer(pl: Playlist) {
    setPlayer(pl);
  }

  const showToast = useCallback((m: string) => setToast(m), []);

  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("wt_theme");
    return saved === "light" ? "light" : "dark";
  });

  useEffect(() => {
    localStorage.setItem("wt_theme", theme);
  }, [theme]);

  const isDark = theme === "dark";

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  // Bootstrap: load /me on mount if token exists
  useEffect(() => {
    if (!token) {
      setView("login");
      return;
    }
    api("/auth/me", {}, token)
      .then((u) => {
        setMe(u);
        // Check survey completion
        api("/survey", {}, token)
          .then((s) => {
            setView(s ? "dashboard" : "survey");
          })
          .catch(() => setView("survey"));
      })
      .catch(() => {
        localStorage.removeItem("wt_token");
        setToken(null);
        setView("login");
      });
  }, [token]);

  function logout() {
    localStorage.removeItem("wt_token");
    setToken(null);
    setMe(null);
    setView("login");
  }

  function openProfile(uid: number) {
    setProfileUserId(uid);
    setView("profile");
  }

  const nav = (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-40 border-t transition-colors duration-300 ${
        isDark
          ? "bg-[#2a256f] border-white/10"
          : "bg-white/90 backdrop-blur border-slate-200 shadow-[0_-8px_24px_rgba(15,23,42,0.06)]"
      }`}
    >
      <div className="max-w-3xl mx-auto px-4 py-3">
        <div className="flex items-center justify-around">
          {[
            {
              id: "dashboard",
              icon: <Sparkles size={22} />,
              label: "Discover",
            },
            { id: "explore", icon: <Home size={22} />, label: "Home" },
            { id: "myRoutines", icon: <ListMusic size={22} />, label: "Mine" },
            { id: "moodHistory", icon: <BarChart2 size={22} />, label: "Mood" },
          ].map((n) => {
            const active = view === n.id;

            return (
              <button
                key={n.id}
                onClick={() => setView(n.id)}
                className={`flex flex-col items-center gap-1 transition ${
                  active
                    ? isDark
                      ? "text-[#37d8a7]"
                      : "text-[#4f46e5]"
                    : isDark
                      ? "text-[#aeb3df] hover:text-white"
                      : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <div
                  className={`h-14 w-14 rounded-2xl flex items-center justify-center transition ${
                    active
                      ? isDark
                        ? "bg-[#3a357c] shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
                        : "bg-[#eef2ff] shadow-[0_10px_24px_rgba(79,70,229,0.10)]"
                      : ""
                  }`}
                >
                  {n.icon}
                </div>
                <span className="text-sm font-medium">{n.label}</span>
              </button>
            );
          })}

          <button
            onClick={logout}
            className={`flex flex-col items-center gap-1 transition ${
              isDark
                ? "text-[#aeb3df] hover:text-red-300"
                : "text-slate-500 hover:text-red-500"
            }`}
          >
            <div className="h-14 w-14 rounded-2xl flex items-center justify-center">
              <LogOut size={22} />
            </div>
            <span className="text-sm font-medium">Out</span>
          </button>
        </div>
      </div>
    </nav>
  );

  const shell = (children: React.ReactNode) => (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 ${
        isDark ? "bg-[#1f1b5a] text-white" : "bg-[#f4f6fb] text-slate-900"
      }`}
    >
      {me && nav}
      <main className={`${me ? "pb-24" : ""} min-h-screen`}>{children}</main>
      {toast && <Toast msg={toast} onClose={() => setToast("")} />}
    </div>
  );

  if (!me)
    return shell(
      view === "signup" ? (
        <SignupView
          setToken={setToken}
          setView={setView}
          showToast={showToast}
        />
      ) : (
        <LoginView
          setToken={setToken}
          setView={setView}
          showToast={showToast}
        />
      ),
    );

  if (player)
    return shell(
      <Player
        token={token!}
        playlist={player}
        onDone={() => setPlayer(null)}
        showToast={showToast}
      />,
    );

  if (view === "survey")
    return shell(
      <SurveyView token={token!} setView={setView} showToast={showToast} />,
    );
  if (view === "dashboard")
    return shell(
      <Dashboard
        token={token!}
        me={me}
        setView={setView}
        openPlayer={openPlayer}
        openProfile={openProfile}
        showToast={showToast}
        theme={theme}
        toggleTheme={toggleTheme}
      />,
    );
  if (view === "explore")
    return shell(
      <Explore
        token={token!}
        me={me}
        openPlayer={openPlayer}
        openProfile={openProfile}
        showToast={showToast}
        theme={theme}
        toggleTheme={toggleTheme}
      />,
    );

  if (view === "myRoutines")
    return shell(
      <MyRoutines
        token={token!}
        me={me}
        openPlayer={openPlayer}
        showToast={showToast}
        theme={theme}
        toggleTheme={toggleTheme}
      />,
    );

  if (view === "moodHistory")
    return shell(
      <MoodHistory token={token!} theme={theme} toggleTheme={toggleTheme} />,
    );

  if (view === "profile" && profileUserId)
    return shell(
      <Profile
        token={token!}
        userId={profileUserId}
        me={me}
        openPlayer={openPlayer}
        setView={setView}
        showToast={showToast}
        theme={theme}
        toggleTheme={toggleTheme}
      />,
    );

  return shell(
    <Dashboard
      token={token!}
      me={me}
      setView={setView}
      openPlayer={openPlayer}
      openProfile={openProfile}
      showToast={showToast}
      theme={theme}
      toggleTheme={toggleTheme}
    />,
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// AUTH VIEWS
// ═════════════════════════════════════════════════════════════════════════════

function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-6 py-10 bg-[radial-gradient(circle_at_top_left,#b9c0ff_0%,transparent_32%),linear-gradient(135deg,#1f1b5a_0%,#4c4a92_48%,#7fb1f8_100%)]">
      <div className="pointer-events-none absolute -top-24 -right-20 h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-indigo-300/25 blur-3xl" />

      <div className="relative w-full max-w-[430px]">
        <div className="bg-[#4c4a92]/92 backdrop-blur-xl border border-white/10 rounded-[32px] px-8 py-9 shadow-[0_30px_80px_rgba(20,18,72,0.36)] wt-card-enter">
          <div className="w-[82px] h-[82px] mx-auto mb-6 rounded-[24px] bg-gradient-to-br from-[#8d97ff] to-[#37d8a7] text-white flex items-center justify-center text-[34px] font-black shadow-[0_16px_34px_rgba(0,0,0,0.22)] wt-logo-float">
            W
          </div>

          <h1 className="text-center text-[#f8f9ff] text-[30px] font-black tracking-tight mb-2 wt-fade-up-1">
            {title}
          </h1>

          <p className="text-center text-[#c4c9ef] text-[14px] leading-6 mb-7 wt-fade-up-2">
            {subtitle}
          </p>

          {children}
        </div>
      </div>
    </div>
  );
}

function LoginView({ setToken, setView, showToast }: any) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit() {
    setLoading(true);
    try {
      const d = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password: pass }),
      });
      localStorage.setItem("wt_token", d.token);
      setToken(d.token);
    } catch (e: any) {
      showToast(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Welcome to WellTune"
      subtitle="Your AI-powered wellness companion"
    >
      <div className="space-y-4 wt-fade-up-3">
        <div>
          <label className="block text-[#f3f4ff] text-[13px] font-semibold mb-2">
            Email
          </label>
          <div className="flex items-center bg-[#2f2c6c] rounded-2xl px-4 h-[50px]">
            <Mail size={18} className="text-[#8e94c8] shrink-0 mr-3" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 bg-transparent border-none outline-none text-[#f2f4ff] text-[15px] placeholder:text-[#8f95cb]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[#f3f4ff] text-[13px] font-semibold mb-2">
            Password
          </label>
          <div className="flex items-center bg-[#2f2c6c] rounded-2xl px-4 h-[50px]">
            <Lock size={18} className="text-[#8e94c8] shrink-0 mr-3" />
            <input
              type={showPassword ? "text" : "password"}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
              onKeyDown={(e) => e.key === "Enter" && submit()}
              className="flex-1 bg-transparent border-none outline-none text-[#f2f4ff] text-[15px] placeholder:text-[#8f95cb]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="ml-2 text-[#8e94c8] hover:text-white transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <p className="text-[#b2b7df] text-[13px] leading-6 rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
          Sign in with the email and password you used when creating your
          WellTune account.
        </p>

        <button
          onClick={submit}
          disabled={loading}
          className="w-full h-[54px] rounded-2xl bg-emerald-400 hover:bg-emerald-500 hover:-translate-y-0.5 disabled:opacity-60 text-white text-[16px] font-bold flex items-center justify-center gap-2 shadow-[0_10px_24px_rgba(57,213,163,0.24)] transition wt-fade-up-4"
        >
          <span>{loading ? "Signing in…" : "Sign In"}</span>
          {!loading && <Sparkles size={16} />}
        </button>

        <p className="text-center text-[#b2b7df] text-[13px] pt-1">
          Don&apos;t have an account?{" "}
          <button
            className="text-[#8ea0ff] font-semibold hover:opacity-80"
            onClick={() => setView("signup")}
          >
            Sign up for free
          </button>
        </p>
      </div>
    </AuthCard>
  );
}

function SignupView({ setToken, setView, showToast }: any) {
  const [f, setF] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit() {
    setLoading(true);
    try {
      const d = await api("/auth/signup", {
        method: "POST",
        body: JSON.stringify(f),
      });
      localStorage.setItem("wt_token", d.token);
      setToken(d.token);
    } catch (e: any) {
      showToast(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Create account"
      subtitle="Start your wellness journey today"
    >
      <div className="space-y-4 wt-fade-up-3">
        <div>
          <label className="block text-[#f3f4ff] text-[13px] font-semibold mb-2">
            Username
          </label>
          <div className="flex items-center bg-[#2f2c6c] rounded-2xl px-4 h-[50px]">
            <UserPlus size={18} className="text-[#8e94c8] shrink-0 mr-3" />
            <input
              type="text"
              value={f.username}
              onChange={(e) => setF({ ...f, username: e.target.value })}
              placeholder="leafy_yogi"
              className="flex-1 bg-transparent border-none outline-none text-[#f2f4ff] text-[15px] placeholder:text-[#8f95cb]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[#f3f4ff] text-[13px] font-semibold mb-2">
            Email
          </label>
          <div className="flex items-center bg-[#2f2c6c] rounded-2xl px-4 h-[50px]">
            <Mail size={18} className="text-[#8e94c8] shrink-0 mr-3" />
            <input
              type="email"
              value={f.email}
              onChange={(e) => setF({ ...f, email: e.target.value })}
              placeholder="you@example.com"
              className="flex-1 bg-transparent border-none outline-none text-[#f2f4ff] text-[15px] placeholder:text-[#8f95cb]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[#f3f4ff] text-[13px] font-semibold mb-2">
            Password
          </label>
          <div className="flex items-center bg-[#2f2c6c] rounded-2xl px-4 h-[50px]">
            <Lock size={18} className="text-[#8e94c8] shrink-0 mr-3" />
            <input
              type={showPassword ? "text" : "password"}
              value={f.password}
              onChange={(e) => setF({ ...f, password: e.target.value })}
              placeholder="min 8 chars"
              onKeyDown={(e) => e.key === "Enter" && submit()}
              className="flex-1 bg-transparent border-none outline-none text-[#f2f4ff] text-[15px] placeholder:text-[#8f95cb]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="ml-2 text-[#8e94c8] hover:text-white transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          onClick={submit}
          disabled={loading}
          className="w-full h-[54px] rounded-2xl bg-emerald-400 hover:bg-emerald-500 hover:-translate-y-0.5 disabled:opacity-60 text-white text-[16px] font-bold flex items-center justify-center gap-2 shadow-[0_10px_24px_rgba(57,213,163,0.24)] transition wt-fade-up-4"
        >
          <span>{loading ? "Creating..." : "Create Account"}</span>
          {!loading && <Sparkles size={16} />}
        </button>

        <p className="text-center text-[#b2b7df] text-[13px] pt-1">
          Already have an account?{" "}
          <button
            className="text-[#8ea0ff] font-semibold hover:opacity-80"
            onClick={() => setView("login")}
          >
            Sign in
          </button>
        </p>
      </div>
    </AuthCard>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SURVEY VIEW
// ═════════════════════════════════════════════════════════════════════════════

function SurveyView({ token, setView, showToast }: any) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    goal: "",
    experience: "beginner",
    days_per_week: 3,
  });

  const questions = [
    {
      q: "What's your primary wellness goal?",
      key: "goal",
      options: Object.entries(CATEGORIES).map(([val, m]) => ({
        val,
        label: m.label,
        icon: m.icon,
      })),
    },
    {
      q: "How would you describe your experience level?",
      key: "experience",
      options: [
        { val: "beginner", label: "Beginner", icon: <Leaf size={20} /> },
        {
          val: "intermediate",
          label: "Intermediate",
          icon: <Sparkles size={20} />,
        },
        { val: "advanced", label: "Advanced", icon: <Zap size={20} /> },
      ],
    },
    {
      q: "How many days per week do you want to practice?",
      key: "days_per_week",
      options: [2, 3, 4, 5, 6, 7].map((d) => ({ val: d, label: `${d} days` })),
    },
  ];

  const cur = questions[step];

  async function finish() {
    try {
      await api(
        "/survey",
        { method: "POST", body: JSON.stringify(answers) },
        token,
      );
      showToast("Welcome to WellTune! 🌿");
      setView("dashboard");
    } catch (e: any) {
      showToast(e.message);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
            <Leaf size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800">Quick Setup</h1>
            <p className="text-xs text-slate-500">
              Step {step + 1} of {questions.length}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-1.5 mb-8">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${i <= step ? "bg-emerald-500" : "bg-slate-200"}`}
            />
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">{cur.q}</h2>
          <div className="grid grid-cols-2 gap-3">
            {cur.options.map((opt) => {
              const selected = (answers as any)[cur.key] === opt.val;
              return (
                <button
                  key={String(opt.val)}
                  onClick={() => setAnswers({ ...answers, [cur.key]: opt.val })}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left text-sm font-medium transition-all
                    ${selected ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-slate-100 hover:border-emerald-200 text-slate-700"}`}
                >
                  <span
                    className={selected ? "text-emerald-500" : "text-slate-400"}
                  >
                    {(opt as any).icon}
                  </span>
                  {opt.label}
                </button>
              );
            })}
          </div>
          <div className="flex justify-between mt-8">
            <Btn
              variant="ghost"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              <ChevronLeft size={16} /> Back
            </Btn>
            {step < questions.length - 1 ? (
              <Btn
                onClick={() => setStep((s) => s + 1)}
                disabled={!(answers as any)[cur.key]}
              >
                Next <ChevronRight size={16} />
              </Btn>
            ) : (
              <Btn onClick={finish} disabled={!(answers as any)[cur.key]}>
                <CheckCircle2 size={16} /> Let's Go!
              </Btn>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═════════════════════════════════════════════════════════════════════════════

function Dashboard({
  token,
  me,
  setView,
  openPlayer,
  openProfile,
  showToast,
  theme,
  toggleTheme,
}: any) {
  const [recs, setRecs] = useState<Playlist[]>([]);
  const [publicRoutines, setPublicRoutines] = useState<Playlist[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selected, setSelected] = useState<Playlist | null>(null);

  const isDark = theme === "dark";

  function patchRoutine(id: number, patch: Partial<Playlist>) {
    const applyPatch = (items: Playlist[]) =>
      items.map((item) => (item.id === id ? { ...item, ...patch } : item));
    setRecs(applyPatch);
    setPublicRoutines(applyPatch);
    setSelected((cur) => (cur?.id === id ? { ...cur, ...patch } : cur));
  }

  async function toggleDashboardLike(pl: Playlist) {
    try {
      const data = pl.liked_by_me
        ? await api(`/playlists/${pl.id}/like`, { method: "DELETE" }, token)
        : await api(`/playlists/${pl.id}/like`, { method: "POST" }, token);

      patchRoutine(pl.id, {
        liked_by_me: data.liked_by_me,
        like_count: data.like_count,
      });
    } catch (e: any) {
      showToast(e.message);
    }
  }

  async function loadDashboardDetail(pl: Playlist) {
    try {
      const d = await api(`/playlists/${pl.id}`, {}, token);
      setSelected(d);
      patchRoutine(pl.id, {
        comment_count: typeof d.comment_count === "number" ? d.comment_count : d.comments?.length,
        like_count: d.like_count,
        liked_by_me: d.liked_by_me,
      });
    } catch (e: any) {
      showToast(e.message);
    }
  }

  async function refreshDashboardDetail(id: number) {
    try {
      const d = await api(`/playlists/${id}`, {}, token);
      setSelected(d);
      patchRoutine(id, {
        comment_count: typeof d.comment_count === "number" ? d.comment_count : d.comments?.length,
        like_count: d.like_count,
        liked_by_me: d.liked_by_me,
      });
    } catch (e: any) {
      showToast(e.message);
    }
  }

  const filters = [
    { key: "All", label: "All" },
    { key: "stress_relief", label: "Stress Relief" },
    { key: "strength", label: "Strength" },
    { key: "flexibility", label: "Flexibility" },
    { key: "mindfulness", label: "Mindfulness" },
    { key: "energy", label: "Energy" },
  ];

  useEffect(() => {
    api("/playlists/recommended", {}, token)
      .then(setRecs)
      .catch(() => {});
    api("/playlists", {}, token)
      .then(setPublicRoutines)
      .catch(() => {});
  }, [token]);

  const source = recs.length > 0 ? recs : publicRoutines;

  const filteredRoutines =
    activeFilter === "All"
      ? source
      : source.filter((pl) => pl.category === activeFilter);

  if (selected) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-8 pb-28">
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            onClick={() => setSelected(null)}
            className={`flex items-center gap-1 text-sm transition ${
              isDark
                ? "text-[#aeb3df] hover:text-white"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <ArrowLeft size={16} /> Back to Discover
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className={`h-11 w-11 rounded-2xl flex items-center justify-center transition ${
              isDark
                ? "bg-[#332d78] text-[#37d8a7] hover:bg-[#3a3385]"
                : "bg-[#eef2ff] text-[#4f46e5] hover:bg-[#e0e7ff]"
            }`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <PlaylistDetail
          pl={selected}
          token={token}
          me={me}
          openPlayer={openPlayer}
          openProfile={openProfile || (() => {})}
          showToast={showToast}
          onRefresh={() => refreshDashboardDetail(selected.id)}
          theme={theme}
        />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-[#1f1b5a] text-white" : "bg-[#f4f6fb] text-slate-900"
      }`}
    >
      <header
        className={`border-b transition-colors duration-300 ${
          isDark
            ? "border-white/10 bg-[#2a256f]"
            : "border-slate-200 bg-white shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`h-11 w-11 rounded-2xl text-white flex items-center justify-center text-xl font-bold shadow-[0_8px_18px_rgba(0,0,0,0.18)] ${
                isDark ? "bg-[#8d97ff]" : "bg-[#5b5ce2]"
              }`}
            >
              W
            </div>

            <div>
              <h1
                className={`text-[18px] font-bold leading-tight ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                WellTune
              </h1>
              <p
                className={
                  isDark ? "text-sm text-[#aeb3df]" : "text-sm text-slate-500"
                }
              >
                Your AI wellness companion
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className={`h-11 w-11 rounded-2xl flex items-center justify-center transition ${
              isDark
                ? "bg-[#332d78] text-[#37d8a7] hover:bg-[#3a3385]"
                : "bg-[#eef2ff] text-[#4f46e5] hover:bg-[#e0e7ff]"
            }`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <section
        className={`border-b transition-colors duration-300 ${
          isDark ? "bg-[#2a256f] border-white/5" : "bg-white border-slate-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-8 md:py-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <h2
                className={`text-[28px] md:text-[34px] font-bold mb-2 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Discover Routines
              </h2>
              <p
                className={
                  isDark
                    ? "text-[17px] text-[#aeb3df]"
                    : "text-[17px] text-slate-500"
                }
              >
                AI-powered recommendations for you
              </p>
            </div>

            <button
              type="button"
              onClick={() => setView("myRoutines")}
              className="h-[44px] px-5 rounded-2xl bg-[#37d8a7] text-white font-semibold flex items-center gap-2 shadow-[0_10px_20px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 hover:opacity-95 transition"
            >
              <PlusCircle size={18} />
              Create
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mt-7">
            {filters.map((filter) => {
              const active = activeFilter === filter.key;

              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-5 h-[40px] rounded-full text-sm font-semibold transition ${
                    active
                      ? isDark
                        ? "bg-[#6d74ff] text-white shadow-[0_8px_18px_rgba(0,0,0,0.16)]"
                        : "bg-[#4f46e5] text-white shadow-[0_8px_18px_rgba(79,70,229,0.12)]"
                      : isDark
                        ? "bg-[#3a357c] text-[#d7dbff] hover:bg-[#454092]"
                        : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-8 pb-32">
        {filteredRoutines.length === 0 ? (
          <div
            className={`rounded-[28px] p-10 md:p-16 text-center shadow-[0_20px_40px_rgba(0,0,0,0.18)] transition-colors duration-300 ${
              isDark
                ? "border border-dashed border-white/15 bg-[#2a256f]"
                : "border border-dashed border-slate-300 bg-white"
            }`}
          >
            <div
              className={`mx-auto mb-5 h-16 w-16 rounded-2xl flex items-center justify-center ${
                isDark
                  ? "bg-[#8d97ff]/20 text-[#c9ceff]"
                  : "bg-[#eef2ff] text-[#4f46e5]"
              }`}
            >
              <ListMusic size={28} />
            </div>

            <h3
              className={`text-2xl md:text-3xl font-bold mb-3 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              No routines uploaded yet
            </h3>

            <p
              className={`max-w-2xl mx-auto text-[15px] md:text-[16px] leading-7 mb-7 ${
                isDark ? "text-[#aeb3df]" : "text-slate-500"
              }`}
            >
              Create a routine in My Routines, or wait for public routines to
              appear here.
            </p>

            <button
              type="button"
              onClick={() => setView("myRoutines")}
              className="h-[50px] px-6 rounded-2xl bg-[#37d8a7] text-white font-semibold shadow-[0_10px_24px_rgba(57,213,163,0.24)] hover:-translate-y-0.5 hover:opacity-95 transition"
            >
              Create your first routine
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRoutines.map((pl) => {
              const meta = getRoutineMeta(pl.category);
              const totalSeconds = getTotalSeconds(pl.steps);
              const durationLabel = formatMinutes(totalSeconds);

              return (
                <div
                  key={pl.id}
                  className={`rounded-[28px] overflow-hidden border shadow-[0_16px_32px_rgba(0,0,0,0.14)] transition hover:-translate-y-1 ${
                    isDark
                      ? "bg-[#2a256f] border-white/5"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <div
                    className={`h-40 ${meta.banner} relative flex items-center justify-center`}
                  >
                    <span
                      className={`absolute left-4 top-4 text-xs font-semibold px-3 py-1 rounded-full ${
                        isDark
                          ? "bg-white/20 text-white border border-white/20"
                          : "bg-white/40 text-white border border-white/30"
                      }`}
                    >
                      {meta.badge}
                    </span>

                    <div className="text-6xl">{meta.emoji}</div>
                  </div>

                  <div className="p-6">
                    <h3
                      className={`text-[20px] font-bold mb-3 ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {pl.title}
                    </h3>

                    {pl.username && (
                      <button
                        type="button"
                        onClick={() => openProfile?.(pl.user_id)}
                        className={`text-sm font-semibold mb-3 transition ${
                          isDark
                            ? "text-[#8ea0ff] hover:text-white"
                            : "text-[#4f46e5] hover:underline"
                        }`}
                      >
                        by @{pl.username}
                      </button>
                    )}

                    <p
                      className={`text-[15px] leading-7 min-h-[56px] ${
                        isDark ? "text-[#aeb3df]" : "text-slate-500"
                      }`}
                    >
                      {pl.description ||
                        "A guided wellness routine to help you feel better."}
                    </p>

                    <div className="flex items-center gap-2 flex-wrap mt-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-sm ${
                          isDark
                            ? "bg-[#3a357c] text-[#d7dbff]"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {CATEGORIES[pl.category]?.label || pl.category}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm ${
                          isDark
                            ? "bg-[#3a357c] text-[#d7dbff]"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        <Clock size={14} />
                        {durationLabel}
                      </span>
                    </div>

                    <div
                      className={`mt-5 pt-4 border-t flex items-center justify-between ${
                        isDark ? "border-white/10" : "border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleDashboardLike(pl)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition ${
                            pl.liked_by_me
                              ? "bg-pink-500 text-white shadow-[0_8px_18px_rgba(236,72,153,0.20)]"
                              : isDark
                                ? "bg-[#3a357c] text-[#d7dbff] hover:bg-[#454092]"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                          aria-label={pl.liked_by_me ? "Unlike routine" : "Like routine"}
                        >
                          <Heart
                            size={15}
                            fill={pl.liked_by_me ? "currentColor" : "none"}
                          />
                          {pl.like_count || 0}
                        </button>

                        <button
                          type="button"
                          onClick={() => loadDashboardDetail(pl)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition ${
                            isDark
                              ? "bg-[#3a357c] text-[#d7dbff] hover:bg-[#454092]"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                          aria-label="Open comments"
                        >
                          <MessageCircle size={15} />
                          {pl.comment_count || 0}
                        </button>
                      </div>

                      <button
                        onClick={() => openPlayer(pl)}
                        className="h-10 w-10 rounded-xl bg-[#37d8a7] text-white flex items-center justify-center hover:-translate-y-0.5 hover:opacity-90 transition shadow-[0_10px_20px_rgba(57,216,167,0.22)]"
                        aria-label="Start routine"
                      >
                        <Play size={16} fill="currentColor" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// EXPLORE
// ═════════════════════════════════════════════════════════════════════════════

function Explore({
  token,
  me,
  openPlayer,
  openProfile,
  showToast,
  theme,
  toggleTheme,
}: any) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [cat, setCat] = useState("");
  const [selected, setSelected] = useState<Playlist | null>(null);

  const isDark = theme === "dark";

  useEffect(() => {
    api(`/playlists${cat ? "?category=" + cat : ""}`, {}, token)
      .then(setPlaylists)
      .catch(() => {});
  }, [cat, token]);

  async function loadDetail(pl: Playlist) {
    const d = await api(`/playlists/${pl.id}`, {}, token);
    setSelected(d);
  }

  if (selected) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-8 pb-28">
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            onClick={() => setSelected(null)}
            className={`flex items-center gap-1 text-sm transition ${
              isDark
                ? "text-[#aeb3df] hover:text-white"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <ArrowLeft size={16} /> Back
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className={`h-11 w-11 rounded-2xl flex items-center justify-center transition ${
              isDark
                ? "bg-[#332d78] text-[#37d8a7] hover:bg-[#3a3385]"
                : "bg-[#eef2ff] text-[#4f46e5] hover:bg-[#e0e7ff]"
            }`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <PlaylistDetail
          pl={selected}
          token={token}
          me={me}
          openPlayer={openPlayer}
          openProfile={openProfile}
          showToast={showToast}
          onRefresh={() => loadDetail(selected)}
          theme={theme}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 pb-28">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1
            className={`text-[28px] font-bold mb-1 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Explore
          </h1>
          <p
            className={
              isDark ? "text-sm text-[#aeb3df]" : "text-sm text-slate-500"
            }
          >
            Discover community wellness routines
          </p>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className={`h-11 w-11 rounded-2xl flex items-center justify-center transition ${
            isDark
              ? "bg-[#332d78] text-[#37d8a7] hover:bg-[#3a3385]"
              : "bg-[#eef2ff] text-[#4f46e5] hover:bg-[#e0e7ff]"
          }`}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        <button
          onClick={() => setCat("")}
          className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
            !cat
              ? isDark
                ? "bg-[#37d8a7] text-white border-[#37d8a7]"
                : "bg-[#4f46e5] text-white border-[#4f46e5]"
              : isDark
                ? "border-white/20 text-[#d7dbff] hover:bg-white/5"
                : "border-slate-200 text-slate-700 hover:border-indigo-300"
          }`}
        >
          All
        </button>

        {Object.entries(CATEGORIES).map(([k, m]) => (
          <button
            key={k}
            onClick={() => setCat(k)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
              cat === k
                ? isDark
                  ? "bg-[#37d8a7] text-white border-[#37d8a7]"
                  : "bg-[#4f46e5] text-white border-[#4f46e5]"
                : isDark
                  ? "border-white/20 text-[#d7dbff] hover:bg-white/5"
                  : "border-slate-200 text-slate-700 hover:border-indigo-300"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {playlists.map((pl) => (
          <PlaylistCard
            key={pl.id}
            pl={pl}
            onPlay={() => openPlayer(pl)}
            onDetail={() => loadDetail(pl)}
            theme={theme}
          />
        ))}

        {playlists.length === 0 && (
          <div
            className={`rounded-[24px] border p-10 text-center ${
              isDark
                ? "bg-[#2a256f] border-white/10"
                : "bg-white border-slate-200"
            }`}
          >
            <Users
              size={34}
              className={`mx-auto mb-3 ${isDark ? "text-[#cfd4ff]" : "text-slate-400"}`}
            />
            <p
              className={`font-semibold ${isDark ? "text-white" : "text-slate-800"}`}
            >
              No routines found
            </p>
            <p
              className={`text-sm mt-1 ${isDark ? "text-[#aeb3df]" : "text-slate-500"}`}
            >
              Public community routines will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PLAYLIST DETAIL (used in Explore)
// ═════════════════════════════════════════════════════════════════════════════

function PlaylistDetail({
  pl,
  token,
  me,
  openPlayer,
  openProfile,
  showToast,
  onRefresh,
  theme,
}: any) {
  const [comment, setComment] = useState("");
  const [following, setFollowing] = useState(false);
  const [liked, setLiked] = useState(!!pl.liked_by_me);
  const [likeCount, setLikeCount] = useState(pl.like_count || 0);

  const isDark = theme === "dark";

  useEffect(() => {
    if (pl.user_id !== me.id) {
      api(`/follow/status/${pl.user_id}`, {}, token)
        .then((d) => setFollowing(d.following))
        .catch(() => {});
    }
  }, [pl.user_id, token, me.id]);

  useEffect(() => {
    setLiked(!!pl.liked_by_me);
    setLikeCount(pl.like_count || 0);
  }, [pl]);

  async function toggleFollow() {
    try {
      if (following) {
        await api(`/follow/${pl.user_id}`, { method: "DELETE" }, token);
        setFollowing(false);
      } else {
        await api(`/follow/${pl.user_id}`, { method: "POST" }, token);
        setFollowing(true);
      }
    } catch (e: any) {
      showToast(e.message);
    }
  }

  async function toggleLike() {
    try {
      const data = liked
        ? await api(`/playlists/${pl.id}/like`, { method: "DELETE" }, token)
        : await api(`/playlists/${pl.id}/like`, { method: "POST" }, token);

      setLiked(data.liked_by_me);
      setLikeCount(data.like_count);
    } catch (e: any) {
      showToast(e.message);
    }
  }

  async function sendComment() {
    if (!comment.trim()) return;

    try {
      await api(
        `/playlists/${pl.id}/comments`,
        {
          method: "POST",
          body: JSON.stringify({ body: comment }),
        },
        token,
      );
      setComment("");
      onRefresh();
    } catch (e: any) {
      showToast(e.message);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div
        className={`rounded-[28px] p-6 border shadow-sm ${
          isDark ? "bg-[#2a256f] border-white/10" : "bg-white border-slate-200"
        }`}
      >
        <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
          <div className="flex-1">
            <div className="mb-3">
              <CategoryBadge cat={pl.category} />
            </div>

            <h2
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-slate-800"
              }`}
            >
              {pl.title}
            </h2>

            {pl.description && (
              <p
                className={`text-sm mt-2 leading-7 ${
                  isDark ? "text-[#aeb3df]" : "text-slate-500"
                }`}
              >
                {pl.description}
              </p>
            )}

            <button
              onClick={() => openProfile(pl.user_id)}
              className={`text-sm font-semibold mt-3 transition ${
                isDark
                  ? "text-[#8ea0ff] hover:text-white"
                  : "text-emerald-600 hover:underline"
              }`}
            >
              by @{pl.username}
            </button>
          </div>

          <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={() => openPlayer(pl)}
              className="h-[46px] px-5 rounded-2xl bg-[#37d8a7] text-white font-semibold flex items-center justify-center gap-2 shadow-[0_10px_24px_rgba(57,213,163,0.24)] hover:-translate-y-0.5 transition"
            >
              <Play size={15} />
              Start Routine
            </button>

            {pl.user_id !== me.id && (
              <button
                onClick={toggleFollow}
                className={`h-[46px] px-5 rounded-2xl font-semibold flex items-center justify-center gap-2 transition ${
                  following
                    ? isDark
                      ? "bg-white/10 text-white hover:bg-white/15"
                      : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                    : isDark
                      ? "bg-[#3a357c] text-[#d7dbff] hover:bg-[#454092]"
                      : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {following ? (
                  <>
                    <UserX size={15} />
                    Unfollow
                  </>
                ) : (
                  <>
                    <UserCheck size={15} />
                    Follow
                  </>
                )}
              </button>
            )}
            <button
              onClick={toggleLike}
              className={`h-[46px] px-5 rounded-2xl font-semibold flex items-center justify-center gap-2 transition ${
                liked
                  ? "bg-pink-500 text-white hover:bg-pink-600"
                  : isDark
                    ? "bg-[#3a357c] text-[#d7dbff] hover:bg-[#454092]"
                    : "border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Heart size={15} fill={liked ? "currentColor" : "none"} />
              {liked ? "Liked" : "Like"} ({likeCount})
            </button>
          </div>
        </div>
      </div>

      {pl.steps?.length > 0 && (
        <div
          className={`rounded-[28px] p-5 border shadow-sm ${
            isDark
              ? "bg-[#2a256f] border-white/10"
              : "bg-white border-slate-200"
          }`}
        >
          <h3
            className={`font-semibold mb-4 ${
              isDark ? "text-white" : "text-slate-700"
            }`}
          >
            Steps ({pl.steps.length})
          </h3>

          <div className="flex flex-col gap-3">
            {pl.steps.map((s: Step, i: number) => (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${
                  isDark ? "bg-[#1f1b5a]" : "bg-slate-50"
                }`}
              >
                <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </span>

                <span
                  className={`flex-1 text-sm font-medium ${
                    isDark ? "text-white" : "text-slate-700"
                  }`}
                >
                  {s.title}
                </span>

                <span
                  className={`text-xs flex items-center gap-1 ${
                    isDark ? "text-[#aeb3df]" : "text-slate-400"
                  }`}
                >
                  <Clock size={12} />
                  {s.duration_sec}s
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        className={`rounded-[28px] p-5 border shadow-sm ${
          isDark ? "bg-[#2a256f] border-white/10" : "bg-white border-slate-200"
        }`}
      >
        <h3
          className={`font-semibold mb-4 flex items-center gap-2 ${
            isDark ? "text-white" : "text-slate-700"
          }`}
        >
          <MessageCircle size={16} />
          Comments
        </h3>

        <div className="flex flex-col gap-3 mb-4 max-h-72 overflow-y-auto">
          {(pl.comments || []).map((c: Comment) => (
            <div key={c.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-600 shrink-0">
                {c.username[0].toUpperCase()}
              </div>

              <div
                className={`flex-1 rounded-2xl px-4 py-3 ${
                  isDark ? "bg-[#1f1b5a]" : "bg-slate-50"
                }`}
              >
                <span
                  className={`text-xs font-semibold ${
                    isDark ? "text-[#cfd4ff]" : "text-slate-600"
                  }`}
                >
                  @{c.username}
                </span>
                <p
                  className={`text-sm mt-1 ${
                    isDark ? "text-white" : "text-slate-700"
                  }`}
                >
                  {c.body}
                </p>
              </div>
            </div>
          ))}

          {(pl.comments || []).length === 0 && (
            <p
              className={`text-sm ${isDark ? "text-[#aeb3df]" : "text-slate-400"}`}
            >
              Be the first to comment.
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendComment()}
            placeholder="Share encouragement..."
            className={`flex-1 rounded-2xl px-4 py-3 text-sm outline-none transition ${
              isDark
                ? "bg-[#1f1b5a] border border-white/10 text-white placeholder:text-[#8f95cb] focus:ring-2 focus:ring-[#37d8a7]"
                : "bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400"
            }`}
          />

          <button
            onClick={sendComment}
            className="h-[46px] px-5 rounded-2xl bg-[#37d8a7] text-white font-semibold hover:-translate-y-0.5 transition"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MY ROUTINES
// ═════════════════════════════════════════════════════════════════════════════

function MyRoutines({
  token,
  me,
  openPlayer,
  showToast,
  theme,
  toggleTheme,
}: any) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [editing, setEditing] = useState<Playlist | null>(null);
  const [creating, setCreating] = useState(false);

  const isDark = theme === "dark";

  useEffect(() => {
    reload();
  }, []);

  function reload() {
    api("/playlists/mine", {}, token)
      .then(setPlaylists)
      .catch(() => {});
  }

  async function deleteP(id: number) {
    try {
      await api(`/playlists/${id}`, { method: "DELETE" }, token);
      showToast("Routine deleted");
      reload();
    } catch (e: any) {
      showToast(e.message);
    }
  }

  if (creating || editing) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-8 pb-28">
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            onClick={() => {
              setCreating(false);
              setEditing(null);
            }}
            className={`flex items-center gap-1 text-sm transition ${
              isDark
                ? "text-[#aeb3df] hover:text-white"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <ArrowLeft size={16} /> Back
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className={`h-11 w-11 rounded-2xl flex items-center justify-center transition ${
              isDark
                ? "bg-[#332d78] text-[#37d8a7] hover:bg-[#3a3385]"
                : "bg-[#eef2ff] text-[#4f46e5] hover:bg-[#e0e7ff]"
            }`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <PlaylistEditor
          token={token}
          existing={editing}
          onSave={() => {
            setCreating(false);
            setEditing(null);
            reload();
            showToast(editing ? "Updated!" : "Created! 🎉");
          }}
          showToast={showToast}
          theme={theme}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 pb-28">
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1
            className={`text-[28px] font-bold ${isDark ? "text-white" : "text-slate-900"}`}
          >
            My Routines
          </h1>
          <p
            className={`text-sm mt-1 ${isDark ? "text-[#aeb3df]" : "text-slate-500"}`}
          >
            Create and manage your wellness routines
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className={`h-11 w-11 rounded-2xl flex items-center justify-center transition ${
              isDark
                ? "bg-[#332d78] text-[#37d8a7] hover:bg-[#3a3385]"
                : "bg-[#eef2ff] text-[#4f46e5] hover:bg-[#e0e7ff]"
            }`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={() => setCreating(true)}
            className="h-[44px] px-5 rounded-2xl bg-[#37d8a7] text-white font-semibold flex items-center gap-2 shadow-[0_10px_20px_rgba(0,0,0,0.18)] hover:opacity-90 transition"
          >
            <PlusCircle size={16} />
            New
          </button>
        </div>
      </div>

      {playlists.length === 0 ? (
        <div
          className={`rounded-[24px] border p-12 text-center ${
            isDark
              ? "bg-[#2a256f] border-white/10"
              : "bg-white border-slate-200"
          }`}
        >
          <ListMusic
            size={40}
            className={`mx-auto mb-3 ${isDark ? "text-[#cfd4ff]" : "text-slate-300"}`}
          />
          <p
            className={`font-semibold ${isDark ? "text-white" : "text-slate-800"}`}
          >
            No routines yet
          </p>
          <p
            className={`text-sm mt-1 ${isDark ? "text-[#aeb3df]" : "text-slate-500"}`}
          >
            Create your first routine to start building your library.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {playlists.map((pl) => (
            <PlaylistCard
              key={pl.id}
              pl={pl}
              onPlay={() => openPlayer(pl)}
              theme={theme}
              actions={
                <div className="flex gap-1">
                  <button
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
                      isDark
                        ? "text-[#cfd4ff] hover:bg-white/10"
                        : "text-slate-500 hover:bg-slate-100"
                    }`}
                    onClick={() => setEditing(pl)}
                  >
                    <Edit3 size={15} />
                  </button>

                  <button
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
                      isDark
                        ? "text-red-200 hover:bg-red-500/10"
                        : "text-red-500 hover:bg-red-50"
                    }`}
                    onClick={() => deleteP(pl.id)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Playlist Editor ─────────────────────────────────────────────────────────
function PlaylistEditor({ token, existing, onSave, showToast, theme }: any) {
  const [form, setForm] = useState({
    title: existing?.title || "",
    description: existing?.description || "",
    category: existing?.category || "mindfulness",
    is_public: existing?.is_public ?? 1,
  });

  const [steps, setSteps] = useState<Step[]>(
    existing?.steps || [{ title: "", duration_sec: 60, instruction: "" }],
  );

  const isDark = theme === "dark";

  async function save() {
    if (!form.title.trim()) return showToast("Title required");
    if (steps.some((s) => !s.title.trim()))
      return showToast("All steps need a title");

    try {
      if (existing) {
        await api(
          `/playlists/${existing.id}`,
          { method: "PUT", body: JSON.stringify({ ...form, steps }) },
          token,
        );
      } else {
        await api(
          "/playlists",
          { method: "POST", body: JSON.stringify({ ...form, steps }) },
          token,
        );
      }
      onSave();
    } catch (e: any) {
      showToast(e.message);
    }
  }

  function addStep() {
    setSteps((s) => [...s, { title: "", duration_sec: 60, instruction: "" }]);
  }

  function updateStep(i: number, k: keyof Step, v: any) {
    setSteps((s) => s.map((item, j) => (j === i ? { ...item, [k]: v } : item)));
  }

  function removeStep(i: number) {
    setSteps((s) => s.filter((_, j) => j !== i));
  }

  return (
    <div className="flex flex-col gap-6">
      <h2
        className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}
      >
        {existing ? "Edit Routine" : "New Routine"}
      </h2>

      <div
        className={`rounded-[28px] p-6 border shadow-sm flex flex-col gap-4 ${
          isDark ? "bg-[#2a256f] border-white/10" : "bg-white border-slate-200"
        }`}
      >
        <div className="flex flex-col gap-1">
          <label
            className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-[#aeb3df]" : "text-slate-500"}`}
          >
            Title
          </label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Morning Flow"
            className={`rounded-2xl px-4 py-3 text-sm transition outline-none ${
              isDark
                ? "bg-[#1f1b5a] border border-white/10 text-white placeholder:text-[#8f95cb] focus:ring-2 focus:ring-[#37d8a7]"
                : "bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400"
            }`}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-[#aeb3df]" : "text-slate-500"}`}
          >
            Description
          </label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="A gentle routine to start your day..."
            className={`rounded-2xl px-4 py-3 text-sm transition outline-none resize-none ${
              isDark
                ? "bg-[#1f1b5a] border border-white/10 text-white placeholder:text-[#8f95cb] focus:ring-2 focus:ring-[#37d8a7]"
                : "bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400"
            }`}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-[#aeb3df]" : "text-slate-500"}`}
          >
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className={`rounded-2xl px-4 py-3 text-sm transition outline-none ${
              isDark
                ? "bg-[#1f1b5a] border border-white/10 text-white focus:ring-2 focus:ring-[#37d8a7]"
                : "bg-white border border-slate-200 text-slate-800 focus:ring-2 focus:ring-emerald-400"
            }`}
          >
            {Object.entries(CATEGORIES).map(([k, m]) => (
              <option key={k} value={k}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <label
          className={`flex items-center gap-2 text-sm cursor-pointer ${isDark ? "text-[#d7dbff]" : "text-slate-700"}`}
        >
          <input
            type="checkbox"
            checked={form.is_public === 1}
            onChange={(e) =>
              setForm({ ...form, is_public: e.target.checked ? 1 : 0 })
            }
            className="w-4 h-4 accent-emerald-500"
          />
          Make public
        </label>
      </div>

      <div
        className={`rounded-[28px] p-6 border shadow-sm flex flex-col gap-4 ${
          isDark ? "bg-[#2a256f] border-white/10" : "bg-white border-slate-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <h3
            className={`font-semibold ${isDark ? "text-white" : "text-slate-800"}`}
          >
            Steps
          </h3>
          <button
            onClick={addStep}
            className={`h-[42px] px-4 rounded-2xl font-semibold flex items-center gap-2 transition ${
              isDark
                ? "bg-white/10 text-white hover:bg-white/15"
                : "border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <PlusCircle size={14} />
            Add Step
          </button>
        </div>

        {steps.map((s, i) => (
          <div
            key={i}
            className={`rounded-2xl p-4 border relative ${
              isDark
                ? "border-white/10 bg-[#1f1b5a]"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <span className="absolute top-4 left-4 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full text-xs font-bold flex items-center justify-center">
              {i + 1}
            </span>

            <div className="pl-10 flex flex-col gap-3">
              <input
                value={s.title}
                onChange={(e) => updateStep(i, "title", e.target.value)}
                placeholder="Step title"
                className={`rounded-2xl px-4 py-3 text-sm transition outline-none ${
                  isDark
                    ? "bg-[#2a256f] border border-white/10 text-white placeholder:text-[#8f95cb] focus:ring-2 focus:ring-[#37d8a7]"
                    : "bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400"
                }`}
              />

              <div className="flex gap-3 items-end">
                <div className="flex-1 flex flex-col gap-1">
                  <label
                    className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-[#aeb3df]" : "text-slate-500"}`}
                  >
                    Duration (seconds)
                  </label>
                  <input
                    type="number"
                    value={s.duration_sec}
                    onChange={(e) =>
                      updateStep(i, "duration_sec", Number(e.target.value))
                    }
                    className={`rounded-2xl px-4 py-3 text-sm transition outline-none ${
                      isDark
                        ? "bg-[#2a256f] border border-white/10 text-white focus:ring-2 focus:ring-[#37d8a7]"
                        : "bg-white border border-slate-200 text-slate-800 focus:ring-2 focus:ring-emerald-400"
                    }`}
                  />
                </div>

                {steps.length > 1 && (
                  <button
                    onClick={() => removeStep(i)}
                    className={`h-11 w-11 rounded-2xl flex items-center justify-center transition ${
                      isDark
                        ? "text-red-200 hover:bg-red-500/10"
                        : "text-red-500 hover:bg-red-50"
                    }`}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <textarea
                rows={2}
                value={s.instruction || ""}
                onChange={(e) => updateStep(i, "instruction", e.target.value)}
                placeholder="Instruction..."
                className={`rounded-2xl px-4 py-3 text-sm transition outline-none resize-none ${
                  isDark
                    ? "bg-[#2a256f] border border-white/10 text-white placeholder:text-[#8f95cb] focus:ring-2 focus:ring-[#37d8a7]"
                    : "bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400"
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={save}
        className="self-end h-[48px] px-6 rounded-2xl bg-[#37d8a7] text-white font-semibold flex items-center gap-2 shadow-[0_10px_24px_rgba(57,213,163,0.24)] hover:-translate-y-0.5 transition"
      >
        <Save size={15} />
        {existing ? "Save Changes" : "Create Routine"}
      </button>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PLAYER
// ═════════════════════════════════════════════════════════════════════════════

function Player({ token, playlist, onDone, showToast }: any) {
  const [steps, setSteps] = useState<Step[]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [introText, setIntroText] = useState<"Ready" | "Set" | "Start" | null>(
    null,
  );

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const introRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearIntroTimers() {
    introRef.current.forEach(clearTimeout);
    introRef.current = [];
  }

  function startCountdown() {
    clearIntroTimers();
    setRunning(false);
    setIntroText("Ready");

    introRef.current.push(
      setTimeout(() => setIntroText("Set"), 800),
      setTimeout(() => setIntroText("Start"), 1600),
      setTimeout(() => {
        setIntroText(null);
        setRunning(true);
      }, 2400),
    );
  }

  useEffect(() => {
    setLoading(true);
    setSteps([]);
    setStepIdx(0);
    setTimeLeft(0);
    setRunning(false);
    setDone(false);
    setMood("");
    setNote("");
    setIntroText(null);

    api(`/playlists/${playlist.id}`, {}, token)
      .then((d) => {
        const loadedSteps = d.steps || [];
        setSteps(loadedSteps);

        if (loadedSteps.length > 0) {
          setTimeLeft(loadedSteps[0].duration_sec);
          startCountdown();
        }

        setLoading(false);
      })
      .catch((e: any) => {
        showToast(e.message || "Failed to load routine");
        setLoading(false);
      });

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      clearIntroTimers();
    };
  }, [playlist.id, token]);

  useEffect(() => {
    if (!running) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          advance();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running, stepIdx, steps]);

  function advance() {
    setRunning(false);

    if (stepIdx < steps.length - 1) {
      const next = stepIdx + 1;
      setStepIdx(next);
      setTimeLeft(steps[next].duration_sec);
      startCountdown();
    } else {
      setDone(true);
    }
  }

  async function submitMood() {
    if (!mood) return showToast("Please select a mood");

    try {
      await api(
        "/mood",
        {
          method: "POST",
          body: JSON.stringify({ playlist_id: playlist.id, mood, note }),
        },
        token,
      );
      showToast("Great work today! 🌟");
      onDone();
    } catch (e: any) {
      showToast(e.message);
    }
  }

  const cur = steps[stepIdx];
  const pct =
    cur && cur.duration_sec > 0
      ? Math.round(((cur.duration_sec - timeLeft) / cur.duration_sec) * 100)
      : 0;

  const fmt = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1f1b5a] text-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full border-4 border-white/20 border-t-[#37d8a7] animate-spin mx-auto mb-4" />
          <p className="text-white/80">Loading routine...</p>
        </div>
      </div>
    );
  }

  if (!loading && steps.length === 0) {
    return (
      <div className="min-h-screen bg-[#1f1b5a] text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-[28px] bg-[#2a256f] border border-white/10 p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-5">
            <ListMusic size={28} className="text-[#cfd4ff]" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No steps in this routine</h2>
          <p className="text-[#aeb3df] mb-6">
            Add at least one step to this routine before starting it.
          </p>
          <button
            onClick={onDone}
            className="h-[46px] px-5 rounded-2xl bg-[#37d8a7] text-white font-semibold hover:opacity-90 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-emerald-500" />
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Congratulations! 🎉
          </h2>

          <p className="text-slate-500 mb-8">
            You completed <strong>{playlist.title}</strong>. How do you feel?
          </p>

          <div className="grid grid-cols-5 gap-3 mb-6">
            {MOODS.map((m) => (
              <button
                key={m.val}
                onClick={() => setMood(m.val)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition ${
                  mood === m.val
                    ? "border-emerald-400 bg-emerald-50"
                    : "border-slate-100 hover:border-emerald-200"
                }`}
              >
                <span className={m.color}>{m.icon}</span>
                <span className="text-xs text-slate-600">{m.label}</span>
              </button>
            ))}
          </div>

          <Textarea
            label="Optional note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Any thoughts on today's session…"
          />

          <Btn onClick={submitMood} className="w-full justify-center mt-4">
            <Heart size={16} /> Log Mood & Finish
          </Btn>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1f1b5a] text-white flex flex-col relative overflow-hidden">
      {introText && (
        <div className="absolute inset-0 z-50 bg-[#1f1b5a]/85 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center animate-pulse">
            <p className="text-[#37d8a7] uppercase tracking-[0.35em] text-sm mb-4">
              Get Ready
            </p>
            <h2 className="text-6xl md:text-7xl font-bold text-white drop-shadow-lg">
              {introText}
            </h2>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between p-5 border-b border-white/10">
        <button
          onClick={onDone}
          className="text-white/60 hover:text-white transition"
        >
          <X size={22} />
        </button>

        <div className="text-center">
          <p className="text-xs text-white/50 uppercase tracking-widest">
            Now playing
          </p>
          <p className="font-semibold text-sm truncate max-w-xs">
            {playlist.title}
          </p>
        </div>

        <span className="text-xs text-white/40">
          {stepIdx + 1}/{steps.length}
        </span>
      </div>

      <div className="flex gap-1 px-5 pt-4">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all ${
              i < stepIdx
                ? "bg-[#37d8a7]"
                : i === stepIdx
                  ? "bg-emerald-400"
                  : "bg-white/20"
            }`}
          />
        ))}
      </div>

      {cur && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">
          <div className="relative w-56 h-56">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="4"
              />
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="#37d8a7"
                strokeWidth="4"
                strokeDasharray={`${pct * 2.89} 289`}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold tabular-nums">
                {fmt(timeLeft)}
              </span>
              <span className="text-white/50 text-xs mt-1">remaining</span>
            </div>
          </div>

          <div className="text-center max-w-xl">
            <h2 className="text-3xl font-bold mb-3">{cur.title}</h2>
            {cur.instruction && (
              <p className="text-white/70 text-sm leading-relaxed">
                {cur.instruction}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="p-8 flex items-center justify-center gap-6">
        <button
          onClick={() => {
            const prev = Math.max(0, stepIdx - 1);
            setStepIdx(prev);
            setTimeLeft(steps[prev]?.duration_sec || 60);
            setRunning(false);
            startCountdown();
          }}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition disabled:opacity-40"
          disabled={stepIdx === 0}
        >
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={() => {
            if (introText) return;
            setRunning((r) => !r);
          }}
          className="w-16 h-16 rounded-full bg-[#37d8a7] hover:opacity-90 flex items-center justify-center shadow-lg transition"
        >
          {running ? (
            <span className="flex gap-1.5">
              <span className="w-1.5 h-5 bg-white rounded-sm" />
              <span className="w-1.5 h-5 bg-white rounded-sm" />
            </span>
          ) : (
            <Play size={24} fill="white" />
          )}
        </button>

        <button
          onClick={advance}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MOOD HISTORY
// ═════════════════════════════════════════════════════════════════════════════

function MoodHistory({ token, theme, toggleTheme }: any) {
  const [logs, setLogs] = useState<MoodLog[]>([]);
  const isDark = theme === "dark";

  useEffect(() => {
    api("/mood", {}, token)
      .then(setLogs)
      .catch(() => {});
  }, [token]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 pb-28">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1
            className={`text-[28px] font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Mood Journal
          </h1>
          <p
            className={`text-sm ${isDark ? "text-[#aeb3df]" : "text-slate-500"}`}
          >
            Your personal wellness record
          </p>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className={`h-11 w-11 rounded-2xl flex items-center justify-center transition ${
            isDark
              ? "bg-[#332d78] text-[#37d8a7] hover:bg-[#3a3385]"
              : "bg-[#eef2ff] text-[#4f46e5] hover:bg-[#e0e7ff]"
          }`}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {logs.length === 0 ? (
        <div
          className={`rounded-[24px] border p-12 text-center ${
            isDark
              ? "bg-[#2a256f] border-white/10"
              : "bg-white border-slate-200"
          }`}
        >
          <BarChart2
            size={40}
            className={`mx-auto mb-3 ${isDark ? "text-[#cfd4ff]" : "text-slate-300"}`}
          />
          <p
            className={`font-semibold ${isDark ? "text-white" : "text-slate-800"}`}
          >
            No mood history yet
          </p>
          <p
            className={`text-sm mt-1 ${isDark ? "text-[#aeb3df]" : "text-slate-500"}`}
          >
            Complete a routine to start logging how you feel.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {logs.map((l) => {
            const m = MOODS.find((x) => x.val === l.mood);

            return (
              <div
                key={l.id}
                className={`rounded-2xl p-4 border flex items-start gap-4 ${
                  isDark
                    ? "bg-[#2a256f] border-white/10 shadow-[0_10px_24px_rgba(0,0,0,0.16)]"
                    : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                <span className={`${m?.color} mt-0.5`}>{m?.icon}</span>

                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`font-semibold capitalize ${isDark ? "text-white" : "text-slate-800"}`}
                    >
                      {l.mood}
                    </span>
                    <span
                      className={
                        isDark
                          ? "text-[#8f95cb] text-xs"
                          : "text-slate-400 text-xs"
                      }
                    >
                      after
                    </span>
                    <span className="text-emerald-400 text-sm font-medium">
                      {l.playlist_title}
                    </span>
                  </div>

                  {l.note && (
                    <p
                      className={`text-sm mt-1 italic ${isDark ? "text-[#c7ccff]" : "text-slate-500"}`}
                    >
                      "{l.note}"
                    </p>
                  )}

                  <p
                    className={`text-xs mt-1 ${isDark ? "text-[#8f95cb]" : "text-slate-400"}`}
                  >
                    {new Date(l.logged_at).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PROFILE
// ═════════════════════════════════════════════════════════════════════════════

function Profile({
  token,
  userId,
  me,
  openPlayer,
  setView,
  showToast,
  theme,
  toggleTheme,
}: any) {
  const [user, setUser] = useState<User | null>(null);
  const [pls, setPls] = useState<Playlist[]>([]);
  const [following, setFollowing] = useState(false);
  const [stats, setStats] = useState({ followers: 0, following: 0 });

  const isDark = theme === "dark";

  useEffect(() => {
    if (userId === me.id) {
      setUser(me);
    }

    api(`/users/${userId}/playlists`, {}, token)
      .then(setPls)
      .catch(() => {});
    api(`/users/${userId}/followers`, {}, token)
      .then((r: any[]) => setStats((s) => ({ ...s, followers: r.length })))
      .catch(() => {});
    api(`/users/${userId}/following`, {}, token)
      .then((r: any[]) => setStats((s) => ({ ...s, following: r.length })))
      .catch(() => {});
    if (userId !== me.id) {
      api(`/follow/status/${userId}`, {}, token)
        .then((d) => setFollowing(d.following))
        .catch(() => {});
    }
  }, [userId, token, me]);

  async function toggleFollow() {
    try {
      if (following) {
        await api(`/follow/${userId}`, { method: "DELETE" }, token);
        setFollowing(false);
        setStats((s) => ({ ...s, followers: s.followers - 1 }));
      } else {
        await api(`/follow/${userId}`, { method: "POST" }, token);
        setFollowing(true);
        setStats((s) => ({ ...s, followers: s.followers + 1 }));
      }
    } catch (e: any) {
      showToast(e.message);
    }
  }

  const displayName = pls[0]?.username || me.username;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 pb-28">
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => setView("explore")}
          className={`flex items-center gap-1 text-sm transition ${
            isDark
              ? "text-[#aeb3df] hover:text-white"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          className={`h-11 w-11 rounded-2xl flex items-center justify-center transition ${
            isDark
              ? "bg-[#332d78] text-[#37d8a7] hover:bg-[#3a3385]"
              : "bg-[#eef2ff] text-[#4f46e5] hover:bg-[#e0e7ff]"
          }`}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div
        className={`rounded-[28px] p-6 border mb-6 ${
          isDark ? "bg-[#2a256f] border-white/10" : "bg-white border-slate-200"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold ${
                isDark
                  ? "bg-[#8d97ff] text-white"
                  : "bg-[#eef2ff] text-[#4f46e5]"
              }`}
            >
              {displayName[0]?.toUpperCase()}
            </div>

            <div>
              <h2
                className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-800"}`}
              >
                @{displayName}
              </h2>

              <div className="flex gap-4 mt-1">
                <span
                  className={`text-xs ${isDark ? "text-[#aeb3df]" : "text-slate-500"}`}
                >
                  <strong className={isDark ? "text-white" : "text-slate-700"}>
                    {stats.followers}
                  </strong>{" "}
                  followers
                </span>
                <span
                  className={`text-xs ${isDark ? "text-[#aeb3df]" : "text-slate-500"}`}
                >
                  <strong className={isDark ? "text-white" : "text-slate-700"}>
                    {stats.following}
                  </strong>{" "}
                  following
                </span>
              </div>
            </div>
          </div>

          {userId !== me.id && (
            <button
              onClick={toggleFollow}
              className={`h-[44px] px-5 rounded-2xl font-semibold transition ${
                following
                  ? isDark
                    ? "bg-white/10 text-white hover:bg-white/15"
                    : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                  : "bg-[#37d8a7] text-white hover:opacity-90"
              }`}
            >
              {following ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>
      </div>

      <h3
        className={`font-semibold mb-3 ${isDark ? "text-white" : "text-slate-700"}`}
      >
        Public Routines
      </h3>

      {pls.length === 0 ? (
        <p
          className={`text-sm ${isDark ? "text-[#aeb3df]" : "text-slate-400"}`}
        >
          No public routines yet.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {pls.map((pl) => (
            <PlaylistCard
              key={pl.id}
              pl={pl}
              onPlay={() => openPlayer(pl)}
              theme={theme}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// Shared: PlaylistCard
// ═════════════════════════════════════════════════════════════════════════════

function PlaylistCard({
  pl,
  onPlay,
  onDetail,
  actions,
  theme = "light",
}: {
  pl: Playlist;
  onPlay: () => void;
  onDetail?: () => void;
  actions?: React.ReactNode;
  theme?: "dark" | "light";
}) {
  const isDark = theme === "dark";
  const [liked, setLiked] = useState(!!pl.liked_by_me);
  const [likeCount, setLikeCount] = useState(pl.like_count || 0);

  useEffect(() => {
    setLiked(!!pl.liked_by_me);
    setLikeCount(pl.like_count || 0);
  }, [pl]);

  return (
    <div
      className={`rounded-2xl p-4 transition-shadow flex items-center gap-4 border ${
        isDark
          ? "bg-[#2a256f] border-white/10 shadow-[0_10px_24px_rgba(0,0,0,0.16)]"
          : "bg-white border-slate-200 shadow-sm hover:shadow-md"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
          isDark ? "bg-white/10" : "bg-emerald-50"
        }`}
      >
        {CATEGORIES[pl.category]?.icon || (
          <Leaf
            size={18}
            className={isDark ? "text-[#cfd4ff]" : "text-emerald-500"}
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`font-semibold truncate ${isDark ? "text-white" : "text-slate-800"}`}
        >
          {pl.title}
        </p>

        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
              isDark
                ? "bg-white/10 text-[#d7dbff]"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {CATEGORIES[pl.category]?.label || pl.category}
          </span>

          {pl.username && (
            <span
              className={`text-xs ${isDark ? "text-[#aeb3df]" : "text-slate-400"}`}
            >
              @{pl.username}
            </span>
          )}

          {typeof pl.comment_count === "number" && (
            <span
              className={`text-xs flex items-center gap-0.5 ${
                isDark ? "text-[#aeb3df]" : "text-slate-400"
              }`}
            >
              <MessageCircle size={11} />
              {pl.comment_count}
              {typeof pl.like_count === "number" && (
                <span
                  className={`text-xs flex items-center gap-0.5 ${
                    isDark ? "text-[#aeb3df]" : "text-slate-400"
                  }`}
                >
                  <Heart
                    size={11}
                    className={pl.liked_by_me ? "text-pink-400" : ""}
                    fill={pl.liked_by_me ? "currentColor" : "none"}
                  />
                  {pl.like_count}
                </span>
              )}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {actions}

        {onDetail && (
          <button
            onClick={onDetail}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
              isDark
                ? "text-[#cfd4ff] hover:bg-white/10"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            <MessageCircle size={15} />
          </button>
        )}

        <button
          onClick={onPlay}
          className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition shadow-sm"
        >
          <Play size={16} fill="white" />
        </button>
      </div>
    </div>
  );
}
