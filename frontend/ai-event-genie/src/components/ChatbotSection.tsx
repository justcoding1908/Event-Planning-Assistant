import { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, Download, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Use environment variable for Grok API key (stored in .env.local as VITE_GROK_API_KEY)
const GROK_API_KEY = import.meta.env.VITE_GROK_API_KEY || "";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ParsedSection {
  title: string;
  content: string;
}

// Call Grok API directly
const callGrokAPI = async (
  messages: Message[],
  systemPrompt: string
): Promise<string> => {
  if (!GROK_API_KEY) {
    throw new Error("GROK_API_KEY not configured. Set VITE_GROK_API_KEY in .env.local");
  }

  const response = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "grok-3-latest",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      max_tokens: 2000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Grok API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

// Parse plan text into structured sections
const parsePlan = (text: string): ParsedSection[] => {
  const sections: ParsedSection[] = [];

  // Match patterns like "1. Title:" or "**1. Title**"
  const sectionRegex =
    /(?:^|\n)\s*(?:\*{0,2})(\d+)\.\s*([^:\n*]+)(?:\*{0,2})?:?\s*/gm;
  const matches: Array<{ index: number; number: string; title: string }> = [];
  let match;

  while ((match = sectionRegex.exec(text)) !== null) {
    matches.push({
      index: match.index,
      number: match[1],
      title: match[2].trim(),
    });
  }

  // Build sections
  for (let i = 0; i < matches.length; i++) {
    const currentMatch = matches[i];
    const nextMatch = matches[i + 1];
    const endIndex = nextMatch ? nextMatch.index : text.length;

    const content = text
      .substring(currentMatch.index + currentMatch[0].length, endIndex)
      .trim();

    sections.push({
      title: `${currentMatch.number}. ${currentMatch.title}`,
      content,
    });
  }

  return sections.length > 0
    ? sections
    : [{ title: "Plan", content: text }];
};

// Render markdown text (bold, italics)
const renderMarkdown = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
};

// Budget breakdown visualization
const BudgetBreakdown = ({ budget }: { budget: number }) => {
  const allocations = [
    { label: "Venue", percent: 40, color: "bg-blue-500" },
    { label: "Catering", percent: 20, color: "bg-purple-500" },
    { label: "Decorations", percent: 20, color: "bg-pink-500" },
    { label: "Contingency", percent: 20, color: "bg-gray-400" },
  ];

  return (
    <div className="space-y-3 py-4 border-t border-gray-200 mb-4">
      <h4 className="text-sm font-semibold text-gray-900">Budget Breakdown</h4>
      <div className="flex h-6 gap-1 rounded-lg overflow-hidden bg-gray-100">
        {allocations.map((item) => (
          <div
            key={item.label}
            className={`${item.color} flex-1`}
            title={`${item.label}: $${(budget * item.percent) / 100}`}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        {allocations.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${item.color}`} />
            <span className="text-gray-600">
              {item.label}: ${(budget * item.percent) / 100}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Plan section card
const PlanSection = ({
  section,
  index,
}: {
  section: ParsedSection;
  index: number;
}) => {
  // Parse bullet points and structured text
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
        <span className="flex items-center justify-center w-8 h-8 bg-indigo-500 text-white rounded-full text-sm font-bold">
          {index + 1}
        </span>
        <h3 className="font-bold text-gray-900">{section.title}</h3>
      </div>
      {paragraphs.map((p, i) => (
        <p key={i} className="text-gray-700 text-sm mb-3">
          {renderMarkdown(p)}
        </p>
      ))}
      {bulletPoints.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {bulletPoints.map((point, i) => {
            const text = point.replace(/^[•\-]\s*/, "").trim();
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

// Plan display component
const PlanDisplay = ({
  plan,
  budget,
}: {
  plan: string;
  budget: number;
}) => {
  const sections = parsePlan(plan);
  const summary = plan.split("\n")[0];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
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
          onClick={() => window.print()}
          size="sm"
          variant="outline"
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          PDF
        </Button>
      </div>

      <BudgetBreakdown budget={budget} />

      <div className="space-y-4">
        {sections.map((section, i) => (
          <PlanSection key={i} section={section} index={i} />
        ))}
      </div>
    </div>
  );
};

// Typing indicator animation
const TypingIndicator = () => (
  <div className="flex items-center gap-1 p-3">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
    <div
      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
      style={{ animationDelay: "0.1s" }}
    ></div>
    <div
      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
      style={{ animationDelay: "0.2s" }}
    ></div>
  </div>
);

// Message bubble component
const MessageBubble = ({ message }: { message: Message }) => {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-xs px-4 py-2.5 rounded-lg text-sm break-words ${
          isUser
            ? "bg-indigo-500 text-white rounded-br-none"
            : "bg-gray-200 text-gray-900 rounded-bl-none"
        }`}
      >
        {renderMarkdown(message.content)}
      </div>
    </div>
  );
};

// Quick reply suggestions
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

const ChatbotSection = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [eventType, setEventType] = useState("");
  const [guests, setGuests] = useState(0);
  const [budget, setBudget] = useState(0);
  const [userQuery, setUserQuery] = useState("");
  const [currentPlan, setCurrentPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPlanInput, setShowPlanInput] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
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

    const userMessage = `I need to plan a ${eventType} event for ${guests} guests with a budget of $${budget}`;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const systemPrompt = `You are EventAI, an expert event planning assistant. Help users create detailed, structured event plans with section numbers and actionable items. Respond in this exact format:

1. Event Overview: Brief description of the event
2. Venue Recommendations: Specific venue suggestions
3. Catering Plan: Food and beverage options
4. Decorations & Theme: Design suggestions
5. Entertainment: Activities and entertainment options
6. Timeline & Schedule: Detailed day-of schedule
7. Budget Allocation: How to allocate the budget
8. Additional Notes: Final tips and reminders

Be specific and practical in your recommendations.`;

      const response = await callGrokAPI([{ role: "user", content: userMessage }], systemPrompt);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
      setCurrentPlan(response);
      setShowPlanInput(true);
    } catch (error) {
      console.error("Error generating plan:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `❌ Error: ${error instanceof Error ? error.message : "Failed to generate plan"}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlan = async () => {
    if (!userQuery.trim() || !currentPlan) return;

    const userMessage = `Please update the event plan: ${userQuery}`;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const systemPrompt = `You are EventAI, an expert event planning assistant. The user has an existing event plan and wants to modify it. Apply the requested changes and return the complete updated plan in the EXACT same structured format with sections numbered 1-8.

Current plan:
${currentPlan}

Apply the requested changes and return the updated plan.`;

      const response = await callGrokAPI([{ role: "user", content: userMessage }], systemPrompt);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
      setCurrentPlan(response);
      setUserQuery("");
    } catch (error) {
      console.error("Error updating plan:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `❌ Error: ${error instanceof Error ? error.message : "Failed to update plan"}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChatMessage = async () => {
    if (!chatInput.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: chatInput }]);
    setChatInput("");
    setLoading(true);

    try {
      const systemPrompt = `You are EventAI, a friendly event planning assistant. Answer questions about event planning, budgeting, themes, venues, catering, decorations, entertainment, and logistics. Be helpful, specific, and encouraging.`;

      const response = await callGrokAPI([{ role: "user", content: chatInput }], systemPrompt);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `❌ Error: ${error instanceof Error ? error.message : "Failed to send message"}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

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
      setChatInput("");
      setLoading(true);

      try {
        const systemPrompt = `You are EventAI, a friendly event planning assistant. Answer questions about event planning in a helpful and specific manner.`;
        const response = await callGrokAPI([{ role: "user", content: text }], systemPrompt);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response },
        ]);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50" id="chatbot">
      <div className="container max-w-4xl">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-indigo-100 border border-indigo-300">
            <Bot className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-600">
              AI-Powered Planning
            </span>
          </div>
          <h2 className="text-4xl font-bold mb-3">EventAI Assistant</h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            Chat with your personal AI event planner or generate a complete event
            plan. Refine it with specific requests.
          </p>
        </div>

        <div className="grid gap-8">
          {/* Chat Window */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col h-96">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.map((msg, i) => (
                <MessageBubble key={i} message={msg} />
              ))}
              {loading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies on first message */}
            {messages.length <= 1 && !showChat && (
              <div className="px-4 pb-2 bg-white">
                <QuickReplies onSelect={handleQuickReply} />
              </div>
            )}

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about event planning..."
                  value={chatInput}
                  onChange={(e) => {
                    setChatInput(e.target.value);
                    setShowChat(true);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleChatMessage();
                    }
                  }}
                  disabled={loading}
                  className="flex-1 rounded-lg"
                />
                <Button
                  onClick={handleChatMessage}
                  disabled={loading || !chatInput.trim()}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg"
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

          {/* Plan Generator */}
          {!currentPlan && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Guests
                    </label>
                    <Input
                      type="number"
                      placeholder="50"
                      value={guests || ""}
                      onChange={(e) => setGuests(Number(e.target.value) || 0)}
                      className="rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget ($)
                    </label>
                    <Input
                      type="number"
                      placeholder="100000"
                      value={budget || ""}
                      onChange={(e) => setBudget(Number(e.target.value) || 0)}
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

          {/* Generated Plan */}
          {currentPlan && (
            <>
              <PlanDisplay plan={currentPlan} budget={budget} />

              {/* Refine Plan */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
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
                    placeholder="e.g., Add more vegetarian options, reduce budget by 20%, change theme to tropical..."
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleUpdatePlan();
                      }
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
