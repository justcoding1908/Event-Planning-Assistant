import { useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ChatbotSection = () => {
  const [messages, setMessages] = useState([
    { type: "ai", text: "Hello! 👋 I'm your AI Event Planner. Ask me anything about planning your perfect event!" },
    { type: "user", text: "Plan a wedding for 200 guests under ₹5,00,000" },
    { type: "ai", text: "Great choice! For a wedding of 200 guests under ₹5,00,000, I recommend:\n\n🏛️ Venue: Community hall or farmhouse (₹80,000-1,20,000)\n🍽️ Catering: Buffet style (₹800-1000/person)\n💐 Decor: Elegant florals (₹50,000-80,000)\n📸 Photography: Professional package (₹40,000-60,000)\n\nWould you like me to elaborate on any of these?" },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { type: "user", text: inputValue }]);
      setInputValue("");
      // Simulate AI response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          type: "ai", 
          text: "I'm processing your request! In a full implementation, I would provide detailed suggestions based on your query. 🎉" 
        }]);
      }, 1000);
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

            {/* Input area */}
            <div className="flex gap-3">
              <Input
                placeholder="Ask me to plan your event..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 h-12 rounded-xl bg-secondary/50 border-border/50 focus-visible:ring-primary"
              />
              <Button 
                onClick={handleSend}
                className="btn-gradient h-12 w-12 rounded-xl text-white"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Suggestion chips */}
          <div className="flex flex-wrap gap-2 mt-6 justify-center">
            {[
              "Plan a corporate event",
              "Birthday party ideas",
              "Wedding checklist",
              "Budget breakdown"
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInputValue(suggestion)}
                className="px-4 py-2 rounded-full text-sm bg-secondary hover:bg-secondary/80 transition-colors border border-border/50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatbotSection;
