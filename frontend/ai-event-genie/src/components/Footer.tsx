import { Bot, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 px-4 bg-foreground text-background">
      <div className="container max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-display">EventAI</span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-6 justify-center">
            <a href="#chatbot" className="text-sm text-background/70 hover:text-background transition-colors">
              AI Chatbot
            </a>
            <a href="#features" className="text-sm text-background/70 hover:text-background transition-colors">
              Features
            </a>
            <a href="#budget" className="text-sm text-background/70 hover:text-background transition-colors">
              Budget Tracker
            </a>
            <a href="#how-it-works" className="text-sm text-background/70 hover:text-background transition-colors">
              How It Works
            </a>
          </nav>

          {/* Credit */}
          <p className="text-sm text-background/50 flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-accent fill-accent" /> for event planners
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-background/10 text-center">
          <p className="text-sm text-background/50">
            © 2025 EventAI - Your AI-Powered Event Planning Assistant
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
