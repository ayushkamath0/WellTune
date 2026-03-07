import { Heart, Bookmark, Clock, Play, Users, Star, ChevronLeft, Share2, MoreVertical } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface RoutineDetailProps {
  onBack: () => void;
}

const routineSteps = [
  { step: 1, title: "Body Scan", duration: "3 min", description: "Release physical tension from head to toe" },
  { step: 2, title: "4-7-8 Breathing", duration: "5 min", description: "Activate parasympathetic nervous system" },
  { step: 3, title: "Guided Visualization", duration: "5 min", description: "Mental relaxation journey to peaceful place" },
  { step: 4, title: "Sleep Affirmations", duration: "2 min", description: "Build positive sleep mindset" },
];

const tags = ["Sleep", "Meditation", "Breathing", "Beginner-Friendly", "Evening Routine", "Science-Based"];

export function RoutineDetail({ onBack }: RoutineDetailProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section - Enhanced */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], x: [0, -50, 0] }}
            transition={{ duration: 12, repeat: Infinity, delay: 1 }}
            className="absolute bottom-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Back Button */}
          <motion.button
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Discover</span>
          </motion.button>

          {/* Hero Content */}
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.2 }}
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/20 backdrop-blur-xl border-2 border-white/30 flex items-center justify-center text-5xl sm:text-6xl shadow-2xl"
            >
              😴
            </motion.div>

            <div className="flex-1 text-white">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl sm:text-3xl mb-2"
              >
                Deep Sleep Protocol
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-white/80 mb-4 text-sm sm:text-base"
              >
                Science-backed wind-down routine for restorative sleep
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm"
              >
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg">
                  <Clock className="w-4 h-4" />
                  <span>15 min</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg">
                  <Users className="w-4 h-4" />
                  <span>15.6k participants</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg">
                  <Star className="w-4 h-4 fill-white" />
                  <span>4.8 rating</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-4xl mx-auto space-y-6">
        {/* Action Buttons - Enhanced */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex gap-3 sm:gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white py-4 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Start Routine</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsLiked(!isLiked)}
            className={`w-14 h-14 rounded-2xl border-2 transition-all flex items-center justify-center shadow-lg ${
              isLiked
                ? "border-[var(--accent-coral)] bg-gradient-to-br from-[var(--accent-coral)] to-[var(--accent-coral-dark)] text-white"
                : "border-border/50 hover:border-[var(--primary)] hover:bg-accent/50 backdrop-blur"
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSaved(!isSaved)}
            className={`w-14 h-14 rounded-2xl border-2 transition-all flex items-center justify-center shadow-lg ${
              isSaved
                ? "border-[var(--secondary)] bg-gradient-to-br from-[var(--secondary)] to-[var(--secondary-light)] text-white"
                : "border-border/50 hover:border-[var(--secondary)] hover:bg-accent/50 backdrop-blur"
            }`}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 rounded-2xl border-2 border-border/50 hover:border-[var(--primary)] hover:bg-accent/50 backdrop-blur transition-all flex items-center justify-center shadow-lg"
          >
            <Share2 className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 rounded-2xl border-2 border-border/50 hover:border-[var(--primary)] hover:bg-accent/50 backdrop-blur transition-all flex items-center justify-center shadow-lg"
          >
            <MoreVertical className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Tags - Enhanced */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2"
        >
          {tags.map((tag, index) => (
            <motion.span
              key={tag}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05, type: "spring" }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="px-4 py-2 rounded-xl bg-card/40 backdrop-blur-xl border border-border/50 text-sm hover:border-[var(--primary)]/50 hover:bg-accent/50 transition-all cursor-default shadow-sm"
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>

        {/* About Section - Glassmorphic */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -4 }}
          className="bg-card/40 backdrop-blur-xl rounded-2xl border border-border/50 p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all"
        >
          <h2 className="text-xl mb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white text-sm shadow-lg">
              ℹ️
            </span>
            About This Routine
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Transform your sleep quality with this evidence-based protocol designed by sleep scientists.
            This routine combines progressive muscle relaxation, guided breathing, and calming visualization
            to prepare your body and mind for deep, restorative sleep.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Best practiced 30 minutes before bed. Dim the lights, find a comfortable position, and let the
            AI guide you through each step. Over 15,000 users report falling asleep faster and waking up
            more refreshed.
          </p>
        </motion.div>

        {/* What You'll Do - Enhanced */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ y: -4 }}
          className="bg-card/40 backdrop-blur-xl rounded-2xl border border-border/50 p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all"
        >
          <h2 className="text-xl mb-5 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--secondary)] to-[var(--secondary-light)] flex items-center justify-center text-white text-sm shadow-lg">
              📋
            </span>
            What You'll Do
          </h2>
          <div className="space-y-4">
            {routineSteps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ x: 4, scale: 1.01 }}
                className="flex gap-4 items-start group p-4 rounded-xl hover:bg-accent/50 backdrop-blur transition-all cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-medium flex-shrink-0 shadow-lg"
                >
                  {item.step}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <h4 className="font-medium">{item.title}</h4>
                    <span className="text-sm text-muted-foreground flex-shrink-0">{item.duration}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats - Enhanced */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-3 sm:gap-4"
        >
          {[
            { value: "3.4k", label: "Likes", gradient: "from-[var(--accent-coral)] to-[var(--accent-coral-dark)]", icon: "❤️" },
            { value: "89%", label: "Completion", gradient: "from-[var(--primary)] to-[var(--secondary)]", icon: "✅" },
            { value: "4.8", label: "Rating", gradient: "from-[var(--secondary)] to-[var(--secondary-light)]", icon: "⭐" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
              whileHover={{ y: -4, scale: 1.05 }}
              className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-5 text-center shadow-lg hover:shadow-xl transition-all text-white`}
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl sm:text-3xl font-medium mb-1">{stat.value}</div>
              <div className="text-sm text-white/80">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
