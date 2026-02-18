import { Heart, Bookmark, Clock, TrendingUp, Sparkles, Plus } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { UploadModal } from "@/app/components/UploadModal";

interface Routine {
  id: number;
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: string;
  color: string;
  icon: string;
  likes: number;
  participants: number;
}

const routines: Routine[] = [
  {
    id: 1,
    title: "Morning Mindfulness",
    description: "Start your day with calm and clarity through guided meditation",
    category: "Meditation",
    duration: "10 min",
    difficulty: "Beginner",
    color: "bg-[var(--accent-lavender)]",
    icon: "🧘",
    likes: 1240,
    participants: 8420,
  },
  {
    id: 2,
    title: "Power Morning Workout",
    description: "High-energy routine to boost metabolism and strengthen core",
    category: "Fitness",
    duration: "25 min",
    difficulty: "Intermediate",
    color: "bg-[var(--accent-coral)]",
    icon: "💪",
    likes: 2150,
    participants: 12300,
  },
  {
    id: 3,
    title: "Deep Sleep Protocol",
    description: "Science-backed wind-down routine for restorative sleep",
    category: "Sleep",
    duration: "15 min",
    difficulty: "Beginner",
    color: "bg-[var(--primary)]",
    icon: "😴",
    likes: 3420,
    participants: 15600,
  },
  {
    id: 4,
    title: "Breathwork for Stress",
    description: "Reduce anxiety with proven breathing techniques",
    category: "Wellness",
    duration: "8 min",
    difficulty: "Beginner",
    color: "bg-[var(--secondary)]",
    icon: "🌬️",
    likes: 980,
    participants: 5200,
  },
  {
    id: 5,
    title: "Focus Flow State",
    description: "Enter deep work with binaural beats and productivity rituals",
    category: "Productivity",
    duration: "45 min",
    difficulty: "Advanced",
    color: "bg-[var(--primary)]",
    icon: "🎯",
    likes: 1560,
    participants: 7800,
  },
  {
    id: 6,
    title: "Gratitude Practice",
    description: "Cultivate positivity with daily reflection exercises",
    category: "Mental Health",
    duration: "5 min",
    difficulty: "Beginner",
    color: "bg-[var(--accent-coral)]",
    icon: "✨",
    likes: 2890,
    participants: 11200,
  },
];

interface RoutinesFeedProps {
  onSelectRoutine: (id: number) => void;
}

export function RoutinesFeed({ onSelectRoutine }: RoutinesFeedProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <div className="min-h-screen pb-20">
      <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
      
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-xl border-b border-border/50 px-4 sm:px-6 py-5 sm:py-6 sticky top-0 z-10 shadow-lg">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl tracking-tight mb-1">Discover Routines</h1>
              <p className="text-muted-foreground text-sm">AI-powered recommendations for you</p>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-[var(--primary)] text-white shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">Personalized</span>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsUploadModalOpen(true)}
                className="w-10 h-10 rounded-xl bg-[var(--secondary)] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                title="Upload routine or playlist"
              >
                <Plus className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
          
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {["All", "Meditation", "Fitness", "Sleep", "Wellness", "Productivity"].map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all font-medium shadow-sm ${
                  cat === "All"
                    ? "bg-[var(--primary)] text-white shadow-lg"
                    : "bg-muted/50 backdrop-blur text-foreground hover:bg-accent hover:shadow-md"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Routines Grid */}
      <div className="px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {routines.map((routine, index) => (
              <motion.div
                key={routine.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => onSelectRoutine(routine.id)}
                className="bg-card/40 backdrop-blur-xl rounded-2xl border border-border/50 overflow-hidden hover:shadow-2xl hover:border-[var(--primary)]/30 transition-all cursor-pointer group"
              >
                {/* Card Header */}
                <div className={`h-32 sm:h-36 ${routine.color} flex items-center justify-center text-4xl sm:text-5xl relative overflow-hidden`}>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring" }}
                  >
                    {routine.icon}
                  </motion.div>
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                  
                  {/* Difficulty Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-lg bg-white/20 backdrop-blur-md text-white text-xs font-medium border border-white/30 shadow-lg">
                      {routine.difficulty}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium leading-snug flex-1 group-hover:text-[var(--primary)] transition-colors">{routine.title}</h3>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                    {routine.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 rounded-lg bg-muted/50 backdrop-blur text-xs text-muted-foreground font-medium">
                      {routine.category}
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-muted/50 backdrop-blur text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {routine.duration}
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{routine.likes.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>{(routine.participants / 1000).toFixed(1)}k</span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-8 h-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
                    >
                      <Bookmark className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}