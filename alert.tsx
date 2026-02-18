import { Check, ChevronLeft } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface OnboardingSurveyProps {
  onComplete: () => void;
}

const steps = [
  { id: 1, title: "Basic Info", completed: true },
  { id: 2, title: "Health Goals", completed: true },
  { id: 3, title: "Sleep Habits", completed: false },
  { id: 4, title: "Activity Level", completed: false },
];

const healthGoals = [
  { emoji: "😴", label: "Better Sleep", color: "lavender", description: "Improve sleep quality" },
  { emoji: "🧘", label: "Reduce Stress", color: "mint", description: "Find inner calm" },
  { emoji: "💪", label: "More Energy", color: "coral", description: "Feel energized daily" },
  { emoji: "🎯", label: "Improve Focus", color: "indigo", description: "Enhance concentration" },
  { emoji: "❤️", label: "Heart Health", color: "coral", description: "Strengthen cardiovascular" },
  { emoji: "🏃", label: "Stay Active", color: "mint", description: "Build healthy habits" },
];

export function OnboardingSurvey({ onComplete }: OnboardingSurveyProps) {
  const [selectedGoals, setSelectedGoals] = useState<number[]>([]);

  const toggleGoal = (index: number) => {
    setSelectedGoals((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with Progress - Glassmorphic */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-card/80 backdrop-blur-xl border-b border-border/50 px-4 sm:px-6 py-6 sticky top-0 z-50 shadow-lg"
      >
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl tracking-tight mb-1">Health Survey</h1>
              <p className="text-sm text-muted-foreground">Help us personalize your experience</p>
            </div>
            <span className="text-sm text-muted-foreground">Step 2 of 4</span>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted/50 rounded-full" style={{ zIndex: 0 }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "50%" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full shadow-sm"
              />
            </div>
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring" }}
                className="flex flex-col items-center relative z-10"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg ${
                    step.completed
                      ? "bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white"
                      : "bg-card/80 backdrop-blur border-2 border-border/50 text-muted-foreground"
                  }`}
                >
                  {step.completed ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }}>
                      <Check className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <span>{step.id}</span>
                  )}
                </motion.div>
                <span className="text-xs mt-2 text-muted-foreground whitespace-nowrap hidden sm:block">
                  {step.title}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Survey Content */}
      <div className="flex-1 px-4 sm:px-6 py-8 sm:py-10 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-xl sm:text-2xl mb-2">What are your primary health goals?</h2>
            <p className="text-muted-foreground text-sm">Select all that apply to personalize your experience</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {healthGoals.map((goal, index) => {
              const isSelected = selectedGoals.includes(index);
              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleGoal(index)}
                  className={`p-5 rounded-2xl border-2 transition-all text-left group relative overflow-hidden ${
                    isSelected
                      ? "border-[var(--primary)] bg-gradient-to-br from-[var(--primary)]/10 to-[var(--secondary)]/10 shadow-lg shadow-primary/10"
                      : "border-border/50 bg-card/40 backdrop-blur-xl hover:border-[var(--primary)]/50 hover:bg-accent/50"
                  }`}
                >
                  {/* Selection indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center shadow-lg"
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}

                  <div className="text-3xl sm:text-4xl mb-3">{goal.emoji}</div>
                  <div className="font-medium mb-1">{goal.label}</div>
                  <div className="text-sm text-muted-foreground">{goal.description}</div>

                  {/* Hover effect gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/0 to-[var(--secondary)]/0 group-hover:from-[var(--primary)]/5 group-hover:to-[var(--secondary)]/5 transition-all rounded-2xl pointer-events-none" />
                </motion.button>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="pt-6 flex justify-between items-center gap-4"
          >
            <motion.button
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-xl text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onComplete}
              disabled={selectedGoals.length === 0}
              className={`px-8 py-3 rounded-xl font-medium transition-all shadow-lg ${
                selectedGoals.length > 0
                  ? "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white hover:shadow-xl shadow-primary/20"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              Continue
            </motion.button>
          </motion.div>

          {/* Progress indicator */}
          {selectedGoals.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-sm text-muted-foreground"
            >
              {selectedGoals.length} goal{selectedGoals.length !== 1 ? "s" : ""} selected
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
