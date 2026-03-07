import { useState, useEffect } from "react";
import { Home, Compass, User, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SignIn } from "@/app/components/SignIn";
import { OnboardingSurvey } from "@/app/components/OnboardingSurvey";
import { UserProfile } from "@/app/components/UserProfile";
import { RoutinesFeed } from "@/app/components/RoutinesFeed";
import { RoutineDetail } from "@/app/components/RoutineDetail";
import { Dashboard } from "@/app/components/Dashboard";

type Screen = "signin" | "onboarding" | "dashboard" | "discover" | "profile" | "routine-detail";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("signin");
  const [isDark, setIsDark] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const handleSignIn = () => {
    setIsAuthenticated(true);
    // For demo purposes, skip onboarding and go straight to discover
    // In production, you might check if user has completed onboarding
    setCurrentScreen("discover");
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setCurrentScreen("discover");
  };

  const handleSelectRoutine = () => {
    setCurrentScreen("routine-detail");
  };

  const handleBackFromRoutineDetail = () => {
    setCurrentScreen("discover");
  };

  // Show sign-in if not authenticated
  if (!isAuthenticated) {
    return <SignIn onSignIn={handleSignIn} />;
  }

  // Show onboarding if needed
  if (showOnboarding) {
    return (
      <div className="relative">
        <OnboardingSurvey onComplete={handleOnboardingComplete} />
        {/* Dark Mode Toggle - Floating */}
        <motion.button
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, type: "spring" }}
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsDark(!isDark)}
          className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-card/80 backdrop-blur-xl border-2 border-border/50 shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center z-50"
          aria-label="Toggle dark mode"
        >
          <AnimatePresence mode="wait">
            {isDark ? (
              <motion.div
                key="sun"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
              >
                <Sun className="w-6 h-6 text-[var(--secondary)]" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: -180 }}
              >
                <Moon className="w-6 h-6 text-[var(--primary)]" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    );
  }

  const navigationItems = [
    { id: "discover" as Screen, icon: Compass, label: "Discover", color: "var(--secondary)" },
    { id: "dashboard" as Screen, icon: Home, label: "Home", color: "var(--primary)" },
    { id: "profile" as Screen, icon: User, label: "Profile", color: "var(--primary)" },
  ];

  // Main app with navigation
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top Bar - Glassmorphic */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-card/80 backdrop-blur-xl border-b border-border/50 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center shadow-lg"
          >
            <span className="text-white font-bold text-lg">W</span>
          </motion.div>
          <div>
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight">WellTune</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Your AI wellness companion</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, rotate: 10 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsDark(!isDark)}
          className="w-10 h-10 rounded-xl bg-muted/50 backdrop-blur hover:bg-accent transition-colors flex items-center justify-center relative overflow-hidden"
          aria-label="Toggle dark mode"
        >
          <AnimatePresence mode="wait">
            {isDark ? (
              <motion.div
                key="sun"
                initial={{ y: 20, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: -20, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <Sun className="w-5 h-5 text-[var(--secondary)]" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ y: -20, opacity: 0, rotate: 90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 20, opacity: 0, rotate: -90 }}
                transition={{ duration: 0.2 }}
              >
                <Moon className="w-5 h-5 text-[var(--primary)]" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {currentScreen === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Dashboard />
            </motion.div>
          )}
          {currentScreen === "discover" && (
            <motion.div
              key="discover"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <RoutinesFeed onSelectRoutine={handleSelectRoutine} />
            </motion.div>
          )}
          {currentScreen === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <UserProfile />
            </motion.div>
          )}
          {currentScreen === "routine-detail" && (
            <motion.div
              key="routine-detail"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <RoutineDetail onBack={handleBackFromRoutineDetail} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation - Glassmorphic */}
      {currentScreen !== "routine-detail" && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="bg-card/80 backdrop-blur-xl border-t border-border/50 px-4 sm:px-6 py-3 sm:py-4 safe-area-inset-bottom shadow-lg"
        >
          <div className="max-w-md mx-auto flex items-center justify-around">
            {navigationItems.map((item) => {
              const isActive = currentScreen === item.id;
              const Icon = item.icon;

              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentScreen(item.id)}
                  className="relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all"
                  style={{
                    color: isActive ? item.color : "var(--muted-foreground)",
                  }}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-[var(--primary)]/10 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}

                  <div className="relative">
                    <Icon
                      className={`w-6 h-6 transition-all ${isActive ? "fill-current" : ""}`}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--secondary)] rounded-full"
                      />
                    )}
                  </div>

                  <span
                    className={`text-xs font-medium transition-all ${
                      isActive ? "opacity-100" : "opacity-70"
                    }`}
                  >
                    {item.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}