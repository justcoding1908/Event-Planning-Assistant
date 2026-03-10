import { useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateEventPlan } from "@/services/api";

interface Message {
  type: "ai" | "user";
  text: string;
}

const ChatbotSection = () => {
  const [messages, setMessages] = useState<Message[]>([
    { type: "ai", text: "Hello! 👋 I'm your AI Event Planner. Let me help you create the perfect event plan!\n\nPlease provide your event details below:" },
  ]);
  const [eventType, setEventType] = useState("");
  const [guests, setGuests] = useState("");
  const [budget, setBudget] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGeneratePlan = async () => {
    // Validate inputs
    if (!eventType.trim()) {
      setMessages((prev) => [...prev, { type: "ai", text: "⚠️ Please specify the event type (e.g., birthday, wedding, corporate)" }]);
      return;
    }

    if (!guests.trim() || isNaN(Number(guests)) || Number(guests) <= 0) {
      setMessages((prev) => [...prev, { type: "ai", text: "⚠️ Please enter a valid number of guests" }]);
      return;
    }

    if (!budget.trim() || isNaN(Number(budget)) || Number(budget) <= 0) {
      setMessages((prev) => [...prev, { type: "ai", text: "⚠️ Please enter a valid budget amount" }]);
      return;
    }

    // Add user message to chat
    const userMessage = `I need to plan a ${eventType} event for ${guests} guests with a budget of ₹${budget}`;
    setMessages((prev) => [...prev, { type: "user", text: userMessage }]);

    setIsLoading(true);

    try {
      const result = await generateEventPlan({
        event_type: eventType,
        guests: Number(guests),
        budget: Number(budget),
      });

      if (result.status === "success") {
        // Extract the plan from the response
        const planData = result.data;
        const formattedPlan = `
📋 Event Plan Summary:

Event Type: ${planData.event_type}
Guests: ${planData.guests}
Budget: ₹${planData.budget}

💡 Generated Plan:
${planData.generated_plan}

Would you like me to adjust anything about this plan?
`;
        setMessages((prev) => [...prev, { type: "ai", text: formattedPlan }]);
      } else {
        setMessages((prev) => [...prev, { type: "ai", text: "⚠️ Backend returned an error. Please try again." }]);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { type: "ai", text: "⚠️ Error connecting to AI backend. Please ensure the backend is running on http://127.0.0.1:5000" }]);
    } finally {
      setIsLoading(false);
      // Clear form inputs
      setEventType("");
      setGuests("");
      setBudget("");
    }
  };

  return (
    <section className="py-24 px-4 bg-background" id="chatbot">
      <div className="container max-w-6xl">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20">
            <Bot className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Meet Your AI Event Planner 🤖
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Powered by Large Language Models, our chatbot helps you with themes, venues, schedules, and planning tips in real time.
          </p>
        </div>

        {/* Chat interface */}
        <div className="max-w-3xl mx-auto">
          <div className="feature-card border border-border/50">
            {/* Chat header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center glow-effect">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">EventAI Assistant</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Always online
                </p>
              </div>
              <Sparkles className="w-5 h-5 text-accent" />
            </div>

            {/* Messages */}
            <div className="space-y-4 max-h-96 overflow-y-auto mb-6 pr-2">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`chat-bubble ${
                      message.type === "ai" ? "chat-bubble-ai" : "chat-bubble-user"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Event Details Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Event Type*</label>
                <Input
                  placeholder="e.g., birthday, wedding, corporate..."
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="h-10 rounded-lg bg-secondary/50 border-border/50 focus-visible:ring-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Number of Guests*</label>
                  <Input
                    type="number"
                    placeholder="e.g., 100"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="h-10 rounded-lg bg-secondary/50 border-border/50 focus-visible:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Budget (₹)*</label>
                  <Input
                    type="number"
                    placeholder="e.g., 500000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="h-10 rounded-lg bg-secondary/50 border-border/50 focus-visible:ring-primary"
                  />
                </div>
              </div>
              <Button 
                onClick={handleGeneratePlan}
                disabled={isLoading}
                className="btn-gradient w-full h-12 rounded-xl text-white"
              >
                {isLoading ? "Generating plan..." : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Event Plan
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Quick Start Suggestions */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-3">💡 Quick start examples:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { type: "Birthday", guests: "50", budget: "100000" },
                { type: "Wedding", guests: "200", budget: "500000" },
                { type: "Corporate", guests: "150", budget: "300000" },
              ].map((example) => (
                <button
                  key={example.type}
                  onClick={() => {
                    setEventType(example.type.toLowerCase());
                    setGuests(example.guests);
                    setBudget(example.budget);
                  }}
                  className="px-3 py-1.5 rounded-full text-sm bg-secondary hover:bg-secondary/80 transition-colors border border-border/50"
                >
                  {example.type} ({example.guests} guests)
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatbotSection;
