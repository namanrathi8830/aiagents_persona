import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Brain,
  Calendar,
  Mail,
  Clock3,
  FileText,
  User,
  Send,
  Activity,
  MessageSquare,
  Target,
  Zap,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { MethodCard } from "./components/MethodCard";
import { usePersona } from "./hooks/usePersona";
import { LearningSignal } from "./lib/api";

const learningMethods = [
  {
    title: "Email/Message",
    description: "Parse communication tone and collaboration style",
    icon: Mail,
    type: "email_message",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Calendar",
    description: "Analyze scheduling preferences & meeting patterns",
    icon: Calendar,
    type: "calendar",
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Documents",
    description: "Extract writing style and analytical rigor",
    icon: FileText,
    type: "documents",
    color: "from-orange-500 to-amber-500",
  },
  {
    title: "Social Profile",
    description: "Identify public interests and network patterns",
    icon: Brain,
    type: "social_profile",
    color: "from-purple-500 to-violet-500",
  },
  {
    title: "Decision History",
    description: "Map risk tolerance & decision heuristics",
    icon: Target,
    type: "decision_history",
    color: "from-red-500 to-rose-500",
  },
  {
    title: "Tasks",
    description: "Track completion habits & productivity blockers",
    icon: Activity,
    type: "tasks",
    color: "from-indigo-500 to-blue-500",
  },
  {
    title: "Response Time",
    description: "Measure urgency cues & response patterns",
    icon: Clock3,
    type: "response_time",
    color: "from-teal-500 to-cyan-500",
  },
  {
    title: "Sentiment",
    description: "Detect emotional tone trends over time",
    icon: MessageSquare,
    type: "sentiment",
    color: "from-pink-500 to-rose-500",
  },
  {
    title: "Topic Interest",
    description: "Map engagement hotspots and focus areas",
    icon: Zap,
    type: "topic_interest",
    color: "from-yellow-500 to-orange-500",
  },
  {
    title: "Feedback Loop",
    description: "Incorporate user corrections and ratings",
    icon: RefreshCw,
    type: "feedback_loop",
    color: "from-violet-500 to-purple-500",
  },
];

function App() {
  const [userId, setUserId] = useState("demo-user");
  const [feedback, setFeedback] = useState("");
  const [textSignal, setTextSignal] = useState("");
  const [activeType, setActiveType] = useState<string>(learningMethods[0].type);
  const { personaQuery, learnMutation } = usePersona(userId);

  const activeMethod = learningMethods.find((m) => m.type === activeType);

  const personaData = useMemo(() => {
    if (!personaQuery.data?.persona) return null;
    return personaQuery.data.persona;
  }, [personaQuery.data]);

  const handleSend = () => {
    if (!textSignal.trim()) return;
    const signals: LearningSignal[] = [
      { type: activeType, payload: { text: textSignal } },
    ];
    learnMutation.mutate(
      { user_id: userId, signals, feedback: feedback || undefined },
      {
        onSuccess: () => {
          setTextSignal("");
          setFeedback("");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-[120px] animate-pulse-glow" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-white/70">Powered by Gemini 3.0 Pro</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            <span className="gradient-text">AI Persona</span>{" "}
            <span className="gradient-text-accent">Learning Engine</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Build your AI twin through 10+ learning methods across conversations,
            documents, calendars, and behavioral patterns.
          </p>
        </motion.header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Persona Display Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 glass-strong rounded-2xl p-6 glow"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider">Active Persona</p>
                  <h2 className="text-xl font-semibold">{userId}</h2>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`status-dot ${
                    personaQuery.isLoading
                      ? "status-dot-loading"
                      : personaQuery.isError
                      ? "status-dot-error"
                      : ""
                  }`}
                />
                <span className="text-xs text-white/60">
                  {personaQuery.isLoading
                    ? "Syncing..."
                    : personaQuery.isError
                    ? "Error"
                    : "Connected"}
                </span>
              </div>
            </div>

            {/* Persona Content */}
            <div className="space-y-4">
              {personaQuery.isLoading ? (
                <div className="h-48 rounded-xl bg-white/5 shimmer flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-white/30 animate-spin" />
                </div>
              ) : personaData ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <PersonaSection
                    title="Traits"
                    items={personaData.traits}
                    icon={<Brain className="w-4 h-4" />}
                  />
                  <PersonaSection
                    title="Preferences"
                    items={personaData.preferences}
                    icon={<Target className="w-4 h-4" />}
                  />
                  <PersonaSection
                    title="Interests"
                    items={personaData.interests}
                    icon={<Zap className="w-4 h-4" />}
                  />
                  <PersonaSection
                    title="Notes"
                    items={personaData.notes}
                    icon={<FileText className="w-4 h-4" />}
                  />
                </div>
              ) : (
                <div className="h-48 rounded-xl bg-white/5 flex flex-col items-center justify-center text-white/40">
                  <Sparkles className="w-8 h-8 mb-3 opacity-50" />
                  <p className="text-sm">No persona data yet</p>
                  <p className="text-xs mt-1">Send a learning signal to get started</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Input Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-strong rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Send className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Learning Signal</h3>
                <p className="text-xs text-white/50">Train your AI twin</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">
                  User ID
                </label>
                <input
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 transition-all"
                  placeholder="Enter user ID"
                />
              </div>

              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">
                  Signal Type
                </label>
                <select
                  value={activeType}
                  onChange={(e) => setActiveType(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition-all appearance-none cursor-pointer"
                >
                  {learningMethods.map((m) => (
                    <option key={m.type} value={m.type} className="bg-[#1a1a1a]">
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">
                  Content
                </label>
                <textarea
                  value={textSignal}
                  onChange={(e) => setTextSignal(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 transition-all resize-none"
                  placeholder={`Paste ${activeMethod?.title.toLowerCase()} content here...`}
                />
              </div>

              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">
                  Feedback (Optional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 transition-all resize-none"
                  placeholder="Add corrections or context..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSend}
                disabled={learnMutation.isPending || !textSignal.trim()}
                className="w-full btn-primary rounded-xl px-4 py-3 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {learnMutation.isPending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Send to Learning Engine
                  </>
                )}
              </motion.button>

              <AnimatePresence>
                {learnMutation.isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-sm text-green-400"
                  >
                    ✓ Persona updated successfully!
                  </motion.div>
                )}
                {learnMutation.isError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-sm text-red-400"
                  >
                    ✗ Error updating persona
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Learning Methods Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Learning Methods</h2>
              <p className="text-white/50 text-sm mt-1">
                Click any method to learn more about how it works
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-white/50 text-sm">
              <Activity className="w-4 h-4" />
              <span>{learningMethods.length} methods available</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {learningMethods.map((method, index) => (
              <MethodCard
                key={method.type}
                title={method.title}
                description={method.description}
                icon={method.icon}
                color={method.color}
                isActive={activeType === method.type}
                onClick={() => setActiveType(method.type)}
                delay={index * 0.05}
              />
            ))}
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 pt-8 border-t border-white/5 text-center"
        >
          <p className="text-white/30 text-sm">
            Built with React, FastAPI, and Gemini 3.0 Pro •{" "}
            <span className="text-white/50">Hackathon Agents</span>
          </p>
        </motion.footer>
      </div>
    </div>
  );
}

// Persona Section Component
function PersonaSection({
  title,
  items,
  icon,
}: {
  title: string;
  items: string[] | null | undefined;
  icon: React.ReactNode;
}) {
  const displayItems = Array.isArray(items) ? items : [];

  return (
    <div className="rounded-xl bg-white/5 p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="text-white/60">{icon}</div>
        <h4 className="text-sm font-medium text-white/80">{title}</h4>
        <span className="ml-auto text-xs text-white/40">{displayItems.length}</span>
      </div>
      {displayItems.length > 0 ? (
        <div className="space-y-2">
          {displayItems.slice(0, 4).map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-2 text-sm text-white/60"
            >
              <ChevronRight className="w-3 h-3 mt-1 text-white/30 flex-shrink-0" />
              <span className="line-clamp-2">{item}</span>
            </div>
          ))}
          {displayItems.length > 4 && (
            <p className="text-xs text-white/40 mt-2">
              +{displayItems.length - 4} more
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-white/30 italic">No data yet</p>
      )}
    </div>
  );
}

export default App;
