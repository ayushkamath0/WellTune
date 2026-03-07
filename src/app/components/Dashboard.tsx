import { TrendingUp, Calendar, Target, Zap, Award, ChevronRight, Download, Filter } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, Area, AreaChart, Tooltip } from "recharts";
import { motion } from "motion/react";

const weeklyConsistency = [
  { day: "Mon", completed: 4, total: 5 },
  { day: "Tue", completed: 5, total: 5 },
  { day: "Wed", completed: 3, total: 5 },
  { day: "Thu", completed: 5, total: 5 },
  { day: "Fri", completed: 4, total: 5 },
  { day: "Sat", completed: 5, total: 5 },
  { day: "Sun", completed: 4, total: 5 },
];

const activityData = [
  { week: "Week 1", minutes: 85 },
  { week: "Week 2", minutes: 120 },
  { week: "Week 3", minutes: 150 },
  { week: "Week 4", minutes: 180 },
];

const categoryData = [
  { name: "Sleep", value: 28, color: "from-[var(--primary)] to-[var(--primary-dark)]" },
  { name: "Meditation", value: 35, color: "from-[var(--secondary)] to-[var(--secondary-light)]" },
  { name: "Fitness", value: 22, color: "from-[var(--accent-lavender)] to-[var(--accent-lavender-dark)]" },
  { name: "Wellness", value: 15, color: "from-[var(--accent-coral)] to-[var(--accent-coral-dark)]" },
];

const achievements = [
  { icon: "🔥", title: "7-Day Streak", desc: "Completed routines for a week", color: "from-[var(--accent-coral)] to-[var(--accent-coral-dark)]" },
  { icon: "🧘", title: "Meditation Master", desc: "50 meditation sessions", color: "from-[var(--accent-lavender)] to-[var(--accent-lavender-dark)]" },
  { icon: "⭐", title: "Early Bird", desc: "10 morning routines", color: "from-[var(--secondary)] to-[var(--secondary-light)]" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl px-4 py-2 shadow-xl">
        <p className="text-sm font-medium">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export function Dashboard() {
  return (
    <div className="min-h-screen pb-20">
      {/* Header - Glassmorphic */}
      <div className="bg-card/80 backdrop-blur-xl border-b border-border/50 px-4 sm:px-6 py-5 sm:py-6 sticky top-0 z-10 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl tracking-tight mb-1">Your Dashboard</h1>
              <p className="text-muted-foreground text-sm">Track your wellness journey</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2 text-sm bg-muted/50 backdrop-blur rounded-xl px-3 py-2 shadow-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <select className="bg-transparent border-none outline-none text-sm font-medium cursor-pointer">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl bg-muted/50 backdrop-blur hover:bg-accent transition-colors flex items-center justify-center shadow-sm"
              >
                <Filter className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white hover:opacity-90 transition-opacity flex items-center justify-center shadow-lg"
              >
                <Download className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Stats Cards - Enhanced with Glassmorphism */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { icon: Target, label: "Goal Progress", value: "86%", change: "+12%", color: "from-[var(--primary)] to-[var(--primary-dark)]" },
              { icon: Zap, label: "Day Streak", value: "12", change: "Active", color: "from-[var(--secondary)] to-[var(--secondary-light)]" },
              { icon: TrendingUp, label: "Minutes/Week", value: "135", change: "+8 min", color: "from-[var(--accent-lavender)] to-[var(--accent-lavender-dark)]" },
              { icon: Award, label: "Achievements", value: "8", change: "New!", color: "from-[var(--accent-coral)] to-[var(--accent-coral-dark)]" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-card/40 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-border/50 shadow-lg hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                  >
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </motion.div>
                  <span className={`text-xs px-2 py-1 rounded-lg bg-gradient-to-r ${stat.color} text-white font-medium shadow-sm`}>
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-medium mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Charts Row - Enhanced */}
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Consistency Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -4 }}
              className="bg-card/40 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-border/50 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="mb-1 flex items-center gap-2">
                    <span className="text-xl">📊</span>
                    Weekly Consistency
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Routines completed vs. planned</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>

              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={weeklyConsistency}>
                  <defs>
                    <linearGradient id="consistencyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" />
                      <stop offset="100%" stopColor="var(--secondary)" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                  <XAxis dataKey="day" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} axisLine={false} />
                  <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="total" fill="var(--muted)" radius={[8, 8, 0, 0]} opacity={0.3} />
                  <Bar dataKey="completed" fill="url(#consistencyGradient)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                <div className="text-sm text-muted-foreground">This week</div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">30/35 completed</div>
                  <span className="text-xs px-2 py-0.5 rounded bg-[var(--secondary)]/20 text-[var(--secondary)]">86%</span>
                </div>
              </div>
            </motion.div>

            {/* Activity Trend */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -4 }}
              className="bg-card/40 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-border/50 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="mb-1 flex items-center gap-2">
                    <span className="text-xl">📈</span>
                    Activity Trend
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total minutes per week</p>
                </div>
                <div className="flex items-center gap-1 text-[var(--secondary)] text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  <span>+42%</span>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--secondary)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--secondary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                  <XAxis dataKey="week" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} axisLine={false} />
                  <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="minutes"
                    stroke="var(--secondary)"
                    fill="url(#activityGradient)"
                    strokeWidth={3}
                    dot={{ fill: 'var(--secondary)', r: 4, strokeWidth: 2, stroke: 'var(--card)' }}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                <div className="text-sm text-muted-foreground">Last 4 weeks</div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">535 total minutes</div>
                  <span className="text-xs px-2 py-0.5 rounded bg-[var(--secondary)]/20 text-[var(--secondary)]">~19 hrs</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Category Breakdown - Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -4 }}
            className="bg-card/40 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-border/50 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="flex items-center gap-2">
                <span className="text-xl">🎯</span>
                Activity by Category
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm text-[var(--primary)] hover:underline"
              >
                View Details
              </motion.button>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {categoryData.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className="text-sm text-muted-foreground">{category.value}%</span>
                  </div>
                  <div className="h-3 bg-muted/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${category.value}%` }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                      className={`h-full bg-gradient-to-r ${category.color} rounded-full shadow-sm`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Achievements - Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ y: -4 }}
            className="bg-card/40 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-border/50 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="flex items-center gap-2">
                <span className="text-xl">🏆</span>
                Recent Achievements
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, type: "spring" }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className={`p-5 rounded-2xl bg-gradient-to-br ${achievement.color} text-white shadow-lg hover:shadow-xl transition-all cursor-pointer relative overflow-hidden`}
                >
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
                  <div className="relative">
                    <div className="text-4xl mb-3">{achievement.icon}</div>
                    <div className="font-medium mb-1">{achievement.title}</div>
                    <div className="text-sm text-white/80">{achievement.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
