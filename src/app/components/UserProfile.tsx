import { User, Lock, Bell, Shield, ChevronRight, Edit2, Share2, Settings } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, Tooltip } from "recharts";
import { Switch } from "@/app/components/ui/switch";
import { motion } from "motion/react";

const sleepData = [
  { day: "Mon", hours: 6.5 },
  { day: "Tue", hours: 7.2 },
  { day: "Wed", hours: 7.8 },
  { day: "Thu", hours: 6.9 },
  { day: "Fri", hours: 8.1 },
  { day: "Sat", hours: 7.5 },
  { day: "Sun", hours: 7.0 },
];

const stressData = [
  { day: "Mon", level: 65 },
  { day: "Tue", level: 59 },
  { day: "Wed", level: 45 },
  { day: "Thu", level: 52 },
  { day: "Fri", level: 38 },
  { day: "Sat", level: 30 },
  { day: "Sun", level: 35 },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl px-4 py-2 shadow-xl">
        <p className="text-sm font-medium">{payload[0].value} {payload[0].dataKey === 'hours' ? 'hrs' : '%'}</p>
      </div>
    );
  }
  return null;
};

export function UserProfile() {
  return (
    <div className="min-h-screen pb-20">
      {/* Header with Glassmorphic Effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
            className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Profile Header */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6"
          >
            <div className="relative group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center text-white text-2xl border-2 border-white/30 shadow-xl cursor-pointer"
              >
                <User className="w-10 h-10" />
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg"
              >
                <Edit2 className="w-4 h-4 text-[var(--primary)]" />
              </motion.button>
            </div>

            <div className="flex-1 text-white">
              <h1 className="text-2xl sm:text-3xl mb-1">Sarah Anderson</h1>
              <p className="text-white/80 text-sm mb-3">Member since Jan 2026</p>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md text-white text-sm font-medium hover:bg-white/30 transition-colors flex items-center gap-2 shadow-lg"
                >
                  <Share2 className="w-4 h-4" />
                  Share Profile
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors flex items-center justify-center shadow-lg"
                >
                  <Settings className="w-5 h-5 text-white" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards with Glassmorphism */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {[
              { label: "Streak", value: "12 days", icon: "🔥" },
              { label: "Routines", value: "8 active", icon: "⚡" },
              { label: "Score", value: "87/100", icon: "⭐" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-lg"
              >
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-white/70 text-xs mb-1">{stat.label}</div>
                <div className="text-white text-lg sm:text-xl font-medium">{stat.value}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-4xl mx-auto space-y-6">
        {/* Health Charts with Enhanced Design */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          {/* Sleep Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -4 }}
            className="bg-card/40 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-border/50 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="mb-1 flex items-center gap-2">
                  <span className="text-xl">😴</span>
                  Sleep Quality
                </h3>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/10 flex items-center justify-center">
                <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-pulse" />
              </div>
            </div>

            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={sleepData}>
                <defs>
                  <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis dataKey="day" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} domain={[0, 10]} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="var(--primary)"
                  fill="url(#sleepGradient)"
                  strokeWidth={3}
                  dot={{ fill: 'var(--primary)', r: 4 }}
                  activeDot={{ r: 6, stroke: 'var(--primary)', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
              <span className="text-sm text-muted-foreground">Average</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">7.3 hours/night</span>
                <span className="text-xs text-[var(--secondary)]">↑ 5%</span>
              </div>
            </div>
          </motion.div>

          {/* Stress Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -4 }}
            className="bg-card/40 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-border/50 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="mb-1 flex items-center gap-2">
                  <span className="text-xl">🧘</span>
                  Stress Levels
                </h3>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--secondary)]/20 to-[var(--secondary)]/10 flex items-center justify-center">
                <div className="w-2 h-2 bg-[var(--secondary)] rounded-full animate-pulse" />
              </div>
            </div>

            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={stressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis dataKey="day" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} domain={[0, 100]} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="level"
                  stroke="var(--secondary)"
                  strokeWidth={3}
                  dot={{ fill: 'var(--secondary)', r: 4 }}
                  activeDot={{ r: 6, stroke: 'var(--secondary)', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
              <span className="text-sm text-muted-foreground">Trend</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Improving</span>
                <span className="text-xs text-[var(--secondary)]">↓ 23%</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Privacy Settings - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/40 backdrop-blur-xl rounded-2xl border border-border/50 overflow-hidden shadow-lg"
        >
          <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-border/50 bg-gradient-to-r from-[var(--primary)]/5 to-[var(--secondary)]/5">
            <h3 className="mb-1">Privacy & Security</h3>
            <p className="text-sm text-muted-foreground">Manage your data and privacy preferences</p>
          </div>

          <div className="divide-y divide-border/50">
            {[
              {
                icon: Lock,
                title: "Health Data Encryption",
                description: "End-to-end encrypted",
                gradient: "from-[var(--accent-lavender)] to-[var(--accent-lavender-dark)]",
                defaultChecked: true,
              },
              {
                icon: Bell,
                title: "Smart Notifications",
                description: "AI-powered reminders",
                gradient: "from-[var(--accent-coral)] to-[var(--accent-coral-dark)]",
                defaultChecked: true,
              },
              {
                icon: Shield,
                title: "Anonymous Analytics",
                description: "Help improve WellTune",
                gradient: "from-[var(--secondary-light)] to-[var(--secondary)]",
                defaultChecked: false,
              },
            ].map((setting, index) => (
              <motion.div
                key={setting.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ backgroundColor: "var(--accent)" }}
                className="px-5 sm:px-6 py-4 flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 flex-1">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${setting.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}
                  >
                    <setting.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium mb-0.5">{setting.title}</div>
                    <div className="text-sm text-muted-foreground">{setting.description}</div>
                  </div>
                </div>
                <Switch defaultChecked={setting.defaultChecked} />
              </motion.div>
            ))}

            <motion.button
              whileHover={{ backgroundColor: "var(--accent)" }}
              className="w-full px-5 sm:px-6 py-4 flex items-center justify-between transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center">
                  <User className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <div className="font-medium mb-0.5">Account Settings</div>
                  <div className="text-sm text-muted-foreground">Email, password, preferences</div>
                </div>
              </div>
              <motion.div whileHover={{ x: 4 }}>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </motion.div>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
