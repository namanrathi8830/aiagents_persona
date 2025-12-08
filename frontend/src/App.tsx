import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Brain, Calendar, Mail, Clock3, FileText } from "lucide-react";
import { MethodCard } from "./components/MethodCard";
import { usePersona } from "./hooks/usePersona";
import { LearningSignal } from "./lib/api";

const learningMethods: { title: string; description: string; icon: any; type: string }[] = [
  { title: "Email/Message", description: "Parse tone and collaboration style", icon: Mail, type: "email_message" },
  { title: "Calendar", description: "Scheduling preferences & meeting style", icon: Calendar, type: "calendar" },
  { title: "Documents", description: "Writing style and rigor", icon: FileText, type: "documents" },
  { title: "Social", description: "Public profile interests", icon: Brain, type: "social_profile" },
  { title: "Decision History", description: "Risk tolerance & heuristics", icon: Sparkles, type: "decision_history" },
  { title: "Tasks", description: "Completion habits & blockers", icon: Sparkles, type: "tasks" },
  { title: "Response Time", description: "Urgency cues & speed", icon: Clock3, type: "response_time" },
  { title: "Sentiment", description: "Emotional tone trends", icon: Sparkles, type: "sentiment" },
  { title: "Topic Interest", description: "Engagement hotspots", icon: Sparkles, type: "topic_interest" },
  { title: "Feedback Loop", description: "User ratings and corrections", icon: Sparkles, type: "feedback_loop" },
];

function App() {
  const [userId, setUserId] = useState("demo-user");
  const [feedback, setFeedback] = useState("");
  const [textSignal, setTextSignal] = useState("");
  const [activeType, setActiveType] = useState<string>(learningMethods[0].type);
  const { personaQuery, learnMutation } = usePersona(userId);

  const personaSummary = useMemo(() => {
    if (!personaQuery.data?.persona) return "No persona yet.";
    const traits = personaQuery.data.persona.traits ?? [];
    return Array.isArray(traits) ? traits.join("\n") : traits;
  }, [personaQuery.data]);

  const handleSend = () => {
    const signals: LearningSignal[] = [
      { type: activeType, payload: { text: textSignal || "Quick sample text." } },
    ];
    learnMutation.mutate({ user_id: userId, signals, feedback });
  };

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12">
        <header className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Hackathon Agents</p>
          <h1 className="text-3xl font-semibold">Persona Learning with Gemini 3.0 Pro Preview</h1>
          <p className="text-white/70">
            10+ learning methods across conversations, docs, calendars, social, and feedback to keep your AI twin up to date.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <motion.div
            className="glass col-span-2 rounded-2xl p-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/50">Persona</p>
                <h2 className="text-xl font-semibold">{userId}</h2>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
                Gemini 3.0 Pro Preview
              </span>
            </div>
            <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-black/40 p-4 text-sm text-white/80">
              {personaQuery.isLoading ? "Loading..." : personaSummary}
            </pre>
          </motion.div>

          <motion.div
            className="glass rounded-2xl p-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <p className="text-sm text-white/70">Try a learning signal</p>
            <input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="mt-3 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
              placeholder="user id"
            />
            <select
              value={activeType}
              onChange={(e) => setActiveType(e.target.value)}
              className="mt-3 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
            >
              {learningMethods.map((m) => (
                <option key={m.type} value={m.type}>
                  {m.title}
                </option>
              ))}
            </select>
            <textarea
              value={textSignal}
              onChange={(e) => setTextSignal(e.target.value)}
              rows={4}
              className="mt-3 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
              placeholder="Paste a snippet (email, doc, etc.)"
            />
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={2}
              className="mt-3 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
              placeholder="Optional feedback to refine persona"
            />
            <button
              onClick={handleSend}
              disabled={learnMutation.isPending}
              className="mt-4 w-full rounded-lg bg-white text-black px-3 py-2 text-sm font-semibold transition hover:bg-white/90"
            >
              {learnMutation.isPending ? "Learning..." : "Send to Learning Engine"}
            </button>
          </motion.div>
        </section>

        <section className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {learningMethods.map((method) => (
            <MethodCard
              key={method.type}
              title={method.title}
              description={method.description}
              icon={method.icon}
            />
          ))}
        </section>
      </div>
    </div>
  );
}

export default App;

