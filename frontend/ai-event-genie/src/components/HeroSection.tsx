import { Bot, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen gradient-hero-bg overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 animate-fade-in">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-white/90">AI-Powered Event Planning</span>
        </div>

        {/* Main headline */}
        <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl animate-slide-up font-display text-balance">
          Plan Your Perfect Event{" "}
          <span className="gradient-text">with AI</span>
        </h1>

        {/* Subtext */}
        <p className="max-w-2xl mt-6 text-lg text-white/70 md:text-xl animate-slide-up text-balance" style={{ animationDelay: '0.2s' }}>
          Your personal AI event planner that helps you organize, budget, and execute events stress-free. From weddings to corporate meetups.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <Button className="btn-gradient h-14 px-8 text-lg rounded-xl text-white border-0">
            <span className="relative z-10 flex items-center gap-2">
              Start Planning with AI
              <ArrowRight className="w-5 h-5" />
            </span>
          </Button>
          <Button 
            variant="outline" 
            className="h-14 px-8 text-lg rounded-xl bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm"
          >
            <Bot className="w-5 h-5 mr-2" />
            Try the AI Chatbot
          </Button>
        </div>

        {/* Floating chat preview */}
        <div className="relative mt-16 w-full max-w-lg animate-scale-in" style={{ animationDelay: '0.6s' }}>
          <div className="glass-card rounded-3xl p-6 animate-float">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-foreground">EventAI Assistant</p>
                <p className="text-sm text-muted-foreground">Online • Ready to help</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="chat-bubble chat-bubble-ai">
                <p className="text-sm">Hi! 👋 I'm your AI event planner. How can I help you today?</p>
              </div>
              <div className="chat-bubble chat-bubble-user">
                <p className="text-sm">Plan a birthday party for 50 guests!</p>
              </div>
              <div className="chat-bubble chat-bubble-ai">
                <p className="text-sm">Great! Let me help you create the perfect birthday celebration. What's your budget range? 🎂</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
