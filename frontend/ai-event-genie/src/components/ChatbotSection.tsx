import { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, Download, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { generateEventPlan } from "@/services/api";

interface ParsedSection {
  title: string;
  content: string;
}

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  isPlan?: boolean;
}

// ─── Currency helper ──────────────────────────────────────────────────────────
// Normalises any "$" or "USD" in backend-generated text to "₹" / "INR"
const toRupees = (text: string): string =>
  text.replace(/\$\s*/g, "₹").replace(/\bUSD\b/g, "INR");

// ─── parsePlan ────────────────────────────────────────────────────────────────
const parsePlan = (text: string | undefined): ParsedSection[] => {
  if (!text) return [];
  const sections: ParsedSection[] = [];

  const sectionRegex =
    /(?:^|\n)\s*(?:\*{0,2})(\d+)\.\s*([^:\n*]+)(?:\*{0,2})?:?\s*/gm;
  const matches: Array<{
    index: number;
    matchLength: number;
    number: string;
    title: string;
  }> = [];
  let match;

  while ((match = sectionRegex.exec(text)) !== null) {
    matches.push({
      index: match.index,
      matchLength: match[0].length,
      number: match[1],
      title: match[2].trim(),
    });
  }

  for (let i = 0; i < matches.length; i++) {
    const cur = matches[i];
    const next = matches[i + 1];
    const endIndex = next ? next.index : text.length;
    const content = text.substring(cur.index + cur.matchLength, endIndex).trim();
    sections.push({ title: `${cur.number}. ${cur.title}`, content });
  }

  return sections.length > 0 ? sections : [{ title: "Plan", content: text }];
};

// ─── renderMarkdown ───────────────────────────────────────────────────────────
const renderMarkdown = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*"))
      return <em key={i}>{part.slice(1, -1)}</em>;
    return part;
  });
};

// ─── PieChart (with hover tooltips) ──────────────────────────────────────────
const PieChart = ({ slices }: { slices: { label: string; value: number; color: string; amount: number }[] }) => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string; percent: number; amount: number } | null>(null);
  const total = slices.reduce((s, x) => s + x.value, 0);
  let cumulative = 0;
  const SIZE = 120;
  const R = 50;
  const cx = SIZE / 2, cy = SIZE / 2;

  const toXY = (angle: number) => ({
    x: cx + R * Math.cos((angle * Math.PI) / 180),
    y: cy + R * Math.sin((angle * Math.PI) / 180),
  });

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-36 h-36"
        onMouseLeave={() => setTooltip(null)}
      >
        {slices.map((slice, i) => {
          const startAngle = cumulative * 3.6 - 90;
          const slicePercent = (slice.value / total) * 100;
          cumulative += slicePercent;
          const endAngle = cumulative * 3.6 - 90;
          const largeArc = slicePercent > 50 ? 1 : 0;
          const start = toXY(startAngle);
          const end = toXY(endAngle);
          const d = `M ${cx} ${cy} L ${start.x} ${start.y} A ${R} ${R} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;

          // midpoint angle for detecting hover center
          const midAngle = ((startAngle + endAngle) / 2 * Math.PI) / 180;
          const tooltipX = cx + (R * 0.65) * Math.cos(midAngle);
          const tooltipY = cy + (R * 0.65) * Math.sin(midAngle);

          return (
            <path
              key={i}
              d={d}
              fill={slice.color}
              stroke="white"
              strokeWidth="1.5"
              className="cursor-pointer transition-opacity duration-150"
              onMouseEnter={() =>
                setTooltip({
                  x: tooltipX,
                  y: tooltipY,
                  label: slice.label,
                  percent: Math.round(slicePercent),
                  amount: slice.amount,
                })
              }
              style={{ opacity: tooltip && tooltip.label !== slice.label ? 0.6 : 1 }}
            />
          );
        })}

        {/* Donut hole */}
        <circle cx={cx} cy={cy} r={R * 0.55} fill="white" />
        <text x={cx} y={cy - 5} textAnchor="middle" fontSize="8" fill="#374151" fontWeight="bold">Budget</text>
        <text x={cx} y={cy + 7} textAnchor="middle" fontSize="7" fill="#6b7280">Split</text>
      </svg>

      {/* Tooltip — rendered outside SVG as HTML for better styling */}
      {tooltip && (
        <div
          className="absolute z-50 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl pointer-events-none"
          style={{
            // Position relative to the SVG container
            left: `${(tooltip.x / 120) * 100}%`,
            top: `${(tooltip.y / 120) * 100}%`,
            transform: "translate(-50%, -130%)",
            whiteSpace: "nowrap",
          }}
        >
          <p className="font-semibold">{tooltip.label}</p>
          <p className="text-gray-300">₹{tooltip.amount.toLocaleString("en-IN")}</p>
          <p className="text-yellow-300">{tooltip.percent}% of budget</p>
          {/* Arrow */}
          <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-3 h-3 bg-gray-900 rotate-45" />
        </div>
      )}
    </div>
  );
};

// ─── BudgetBreakdown ──────────────────────────────────────────────────────────
const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];

const BudgetBreakdown = ({
  budget,
  budgetSummary,
}: {
  budget: number;
  budgetSummary: any;
}) => {
  // If we have real data from backend, use it. Otherwise fall back to hardcoded.
  const allocations = budgetSummary?.allocated
    ? Object.entries(budgetSummary.allocated).map(([key, val]: [string, any], i) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        percent: val.percent,
        amount: val.amount,
        color: COLORS[i % COLORS.length],
      }))
    : [
        { label: "Venue",       percent: 30, amount: budget * 0.30, color: COLORS[0] },
        { label: "Food",        percent: 40, amount: budget * 0.40, color: COLORS[1] },
        { label: "Decoration",  percent: 20, amount: budget * 0.20, color: COLORS[2] },
        { label: "Misc",        percent: 10, amount: budget * 0.10, color: COLORS[3] },
      ];

  const pieSlices = allocations.map((a) => ({
    label: a.label,
    value: a.percent,
    color: a.color,
    amount: a.amount,
  }));

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-white">
      <h4 className="text-sm font-semibold text-gray-900 mb-4">
        💰 Budget Breakdown
        {budgetSummary && (
          <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
            budgetSummary.status === "healthy"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}>
            {budgetSummary.status === "healthy" ? "✓ On Track" : "⚠ Over Budget"}
          </span>
        )}
      </h4>

      <div className="flex gap-4 items-center">
        {/* Pie Chart */}
        <div className="flex-shrink-0">
          <PieChart slices={pieSlices} />
        </div>

        {/* Legend + amounts */}
        <div className="flex-1 space-y-2">
          {allocations.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-gray-600">{item.label}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-gray-800">
                  ₹{item.amount.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-gray-400 ml-1">({item.percent}%)</span>
              </div>
            </div>
          ))}

          {/* Total line */}
          <div className="border-t border-gray-100 pt-2 flex justify-between">
            <span className="text-xs font-semibold text-gray-700">Total Budget</span>
            <span className="text-xs font-bold text-indigo-600">
              ₹{budget.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── PlanSection card ─────────────────────────────────────────────────────────
const PlanSection = ({
  section,
  index,
}: {
  section: ParsedSection;
  index: number;
}) => {
  const lines = section.content.split("\n").filter((l) => l.trim());
  const bulletPoints = lines.filter(
    (l) => l.trim().startsWith("-") || l.trim().startsWith("•")
  );
  const paragraphs = lines.filter(
    (l) => !l.trim().startsWith("-") && !l.trim().startsWith("•")
  );

  return (
    <div className="bg-white border-l-4 border-indigo-500 p-4 rounded-lg mb-4">
      <div className="flex items-center gap-3 mb-2">
        <span className="flex items-center justify-center w-8 h-8 bg-indigo-500 text-white rounded-full text-sm font-bold flex-shrink-0">
          {index + 1}
        </span>
        <h3 className="font-bold text-gray-900">{section.title}</h3>
      </div>
      {paragraphs.map((p, i) => (
        <p key={i} className="text-gray-700 text-sm mb-3">
          {renderMarkdown(toRupees(p))}
        </p>
      ))}
      {bulletPoints.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {bulletPoints.map((point, i) => {
            const text = toRupees(point.replace(/^[•\-]\s*/, "").trim());
            return (
              <span
                key={i}
                className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
              >
                {text}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── PlanDisplay (full structured view below chat) ────────────────────────────
const PlanDisplay = ({
  plan,
  budget,
  budgetSummary,
  downloadPDF,
}: {
  plan: string;
  budget: number;
  budgetSummary: any;
  downloadPDF: () => void;
}) => {
  const safePlan = toRupees(plan || "");

  if (!safePlan.trim()) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-500 text-sm">
        No plan content to display yet.
      </div>
    );
  }

  const sections = parsePlan(safePlan);
  const summary = safePlan.split("\n")[0];

  return (
    <div
      className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-lg"
      id="plan-card"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <p className="text-gray-600 text-sm mb-4">{summary}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
              ✓ Plan Generated
            </span>
            <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
              Ready to Refine
            </span>
          </div>
        </div>
        <Button
          onClick={downloadPDF}
          size="sm"
          variant="outline"
          className="gap-2 ml-2 flex-shrink-0 print:hidden"
        >
          <Download className="w-4 h-4" />
          PDF
        </Button>
      </div>

      <BudgetBreakdown budget={budget} budgetSummary={budgetSummary} />

      <div className="space-y-4">
        {sections.map((section, i) => (
          <PlanSection key={i} section={section} index={i} />
        ))}
      </div>
    </div>
  );
};

// ─── ChatPlanBubble — just a success indicator, not a repeat of the plan ──────
const ChatPlanBubble = ({ content }: { content: string }) => {
  // Extract first meaningful line as a teaser only
  const firstLine = content.split("\n").find(l => l.trim()) || "";
  const teaser = toRupees(firstLine).slice(0, 80) + (firstLine.length > 80 ? "..." : "");

  return (
    <div className="w-full mb-3">
      <div className="bg-gradient-to-r from-teal-50 to-violet-50 border border-teal-200 rounded-xl p-4">
        <div className="flex items-center gap-3">
          {/* Animated success checkmark */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">Event Plan Ready! 🎉</p>
            <p className="text-xs text-gray-500 truncate mt-0.5">{teaser}</p>
          </div>
          <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full font-medium flex-shrink-0">
            ✓ Done
          </span>
        </div>
        <p className="text-xs text-violet-500 mt-3 text-center font-medium">
          ↓ Full plan with budget breakdown below
        </p>
      </div>
    </div>
  );
};

// ─── TypingIndicator ──────────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div className="flex items-center gap-1 p-3">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
    <div
      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
      style={{ animationDelay: "0.1s" }}
    />
    <div
      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
      style={{ animationDelay: "0.2s" }}
    />
  </div>
);

// ─── MessageBubble ────────────────────────────────────────────────────────────
const MessageBubble = ({ message }: { message: Message }) => {
  const isUser = message.role === "user";

  if (message.isPlan) {
    return <ChatPlanBubble content={message.content} />;
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-lg text-sm break-words ${
          isUser
            ? "bg-indigo-500 text-white rounded-br-none"
            : "bg-gray-200 text-gray-900 rounded-bl-none"
        }`}
      >
        {renderMarkdown(toRupees(message.content))}
      </div>
    </div>
  );
};

// ─── QuickReplies ─────────────────────────────────────────────────────────────
const QuickReplies = ({ onSelect }: { onSelect: (text: string) => void }) => {
  const suggestions = [
    "Plan a birthday 🎂",
    "Corporate event 💼",
    "Wedding planning 💍",
    "More budget info 💰",
  ];
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {suggestions.map((text) => (
        <button
          key={text}
          onClick={() => onSelect(text)}
          className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full border border-gray-300 transition-colors"
        >
          {text}
        </button>
      ))}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const ChatbotSection = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [eventType, setEventType] = useState("");
  const [guests, setGuests] = useState(0);
  const [budget, setBudget] = useState(0);
  const [userQuery, setUserQuery] = useState("");
  const [currentPlan, setCurrentPlan] = useState("");
  const [budgetSummary, setBudgetSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showPlanInput, setShowPlanInput] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "👋 Hello! I'm your AI Event Planner. I'll help you create the perfect event plan. What would you like to plan today?",
        },
      ]);
    }
  }, []);

  // ── handleGeneratePlan ──────────────────────────────────────────────────────
  const handleGeneratePlan = async () => {
    if (!eventType.trim() || guests <= 0 || budget <= 0) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚠️ Please fill in all fields: Event Type, Number of Guests, and Budget.",
        },
      ]);
      return;
    }

    const userMessage = `I need to plan a ${eventType} event for ${guests} guests with a budget of ₹${budget}`;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const result = await generateEventPlan({
        event_type: eventType,
        guests: Number(guests),
        budget: Number(budget),
      });

      const plan: string =
        result?.generated_plan || result?.data?.generated_plan || "";

      if (!plan) {
        throw new Error(
          "Backend returned an empty plan. Check that the Flask server is running."
        );
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: plan, isPlan: true },
      ]);
      setCurrentPlan(plan);
      setShowPlanInput(true);
      if (result?.budget_summary) {
        setBudgetSummary(result.budget_summary);
      }
    } catch (error) {
      console.error("Error generating plan:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `❌ Error: ${
            error instanceof Error ? error.message : "Failed to generate plan"
          }`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ── handleUpdatePlan ────────────────────────────────────────────────────────
  const handleUpdatePlan = async () => {
    if (!userQuery.trim() || !currentPlan) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: `Please update the event plan: ${userQuery}` },
    ]);
    setLoading(true);

    try {
      const result = await generateEventPlan({
        event_type: eventType,
        guests: Number(guests),
        budget: Number(budget),
        user_query: userQuery,
      });

      const plan: string =
        result?.generated_plan || result?.data?.generated_plan || "";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: plan || "Plan updated.",
          isPlan: !!plan,
        },
      ]);
      if (plan) setCurrentPlan(plan);
      if (result?.budget_summary) {
        setBudgetSummary(result.budget_summary);
      }
      setUserQuery("");
    } catch (error) {
      console.error("Error updating plan:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `❌ Error: ${
            error instanceof Error ? error.message : "Failed to update plan"
          }`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ── handleChatMessage ───────────────────────────────────────────────────────
  const handleChatMessage = async () => {
    if (!chatInput.trim()) return;
    const message = chatInput;
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setChatInput("");
    setLoading(true);

    try {
      const result = await generateEventPlan({
        event_type: eventType,
        guests: Number(guests) || 50,
        budget: Number(budget) || 10000,
        user_query: message,
      });

      const plan: string =
        result?.generated_plan || result?.data?.generated_plan || "";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            plan || "Sorry, I couldn't get a response. Is the backend running?",
          isPlan: !!plan,
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `❌ Error: ${
            error instanceof Error ? error.message : "Failed to send message"
          }`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ── handleQuickReply ────────────────────────────────────────────────────────
  const handleQuickReply = async (text: string) => {
    if (text.includes("birthday")) {
      setEventType("Birthday party");
      setGuests(50);
      setBudget(100000);
    } else if (text.includes("Corporate")) {
      setEventType("Corporate event");
      setGuests(150);
      setBudget(300000);
    } else if (text.includes("Wedding")) {
      setEventType("Wedding");
      setGuests(200);
      setBudget(500000);
    } else {
      setMessages((prev) => [...prev, { role: "user", content: text }]);
      setLoading(true);
      try {
        const result = await generateEventPlan({
          event_type: eventType,
          guests: Number(guests) || 50,
          budget: Number(budget) || 10000,
          user_query: text,
        });
        const plan: string =
          result?.generated_plan || result?.data?.generated_plan || "";
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: plan || "Sorry, no response from backend.",
            isPlan: !!plan,
          },
        ]);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `❌ Error: ${
              error instanceof Error ? error.message : "Failed"
            }`,
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
  };

  /* 🔥 ADD YOUR FUNCTION HERE */
const downloadPDF = () => {
  const element = document.getElementById("plan-card");

  if (!element) {
    console.error("Plan card not found");
    return;
  }

  const opt = {
    margin: 0.5,
    filename: "event-plan.pdf",
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  };

  import("html2pdf.js").then((html2pdf: any) => {
    html2pdf.default().set(opt).from(element).save();
  });
};
  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <section
      className="py-8 sm:py-16 px-3 sm:px-6 bg-gradient-to-b from-white to-gray-50"
      id="chatbot"
    >
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-indigo-100 border border-indigo-300">
            <Bot className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-600">
              AI-Powered Planning
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold mb-3">
            EventAI Assistant
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 text-sm sm:text-base">
            Chat with your personal AI event planner or generate a complete
            event plan. Refine it with specific requests.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* ── Chat Window ── */}
          <div
            className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col"
            style={{ minHeight: "380px", maxHeight: "60vh" }}
          >
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.map((msg, i) => (
                <MessageBubble key={i} message={msg} />
              ))}
              {loading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies */}
            {messages.length <= 1 && !showChat && (
              <div className="px-4 pb-2 bg-white">
                <QuickReplies onSelect={handleQuickReply} />
              </div>
            )}

            {/* Chat Input */}
            <div className="p-3 sm:p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about event planning..."
                  value={chatInput}
                  onChange={(e) => {
                    setChatInput(e.target.value);
                    setShowChat(true);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleChatMessage();
                  }}
                  disabled={loading}
                  className="flex-1 rounded-lg"
                />
                <Button
                  onClick={handleChatMessage}
                  disabled={loading || !chatInput.trim()}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg flex-shrink-0"
                >
                  {loading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* ── Plan Generator form ── */}
          {!currentPlan && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Generate Event Plan
                  </h3>
                  <p className="text-xs text-gray-600">
                    Create a detailed plan in seconds
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type
                  </label>
                  <Input
                    placeholder="e.g., birthday, wedding, corporate..."
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Guests
                    </label>
                    <Input
                      type="number"
                      placeholder="50"
                      value={guests || ""}
                      onChange={(e) =>
                        setGuests(Number(e.target.value) || 0)
                      }
                      className="rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget (₹)
                    </label>
                    <Input
                      type="number"
                      placeholder="100000"
                      value={budget || ""}
                      onChange={(e) =>
                        setBudget(Number(e.target.value) || 0)
                      }
                      className="rounded-lg"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleGeneratePlan}
                  disabled={loading}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg h-11 font-medium"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Plan
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* ── Generated Plan ── */}
          {currentPlan && (
            <>
              <PlanDisplay
                plan={currentPlan}
                budget={budget}
                budgetSummary={budgetSummary}
                downloadPDF={downloadPDF}
              />

              {/* Refine */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Send className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Refine Your Plan
                    </h3>
                    <p className="text-xs text-gray-600">
                      Ask for specific changes or adjustments
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Input
                    placeholder="e.g., Add more vegetarian options, reduce budget by 20%..."
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleUpdatePlan();
                    }}
                    disabled={loading}
                    className="rounded-lg"
                  />
                  <Button
                    onClick={handleUpdatePlan}
                    disabled={loading || !userQuery.trim()}
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg h-11 font-medium"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Update Plan
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ChatbotSection;
