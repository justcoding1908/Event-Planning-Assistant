import { Bot, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="container max-w-6xl">
        <div className="glass-card rounded-2xl px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-display">EventAI</span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#chatbot" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              AI Chatbot
            </a>
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#budget" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Budget
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
          </div>

          {/* CTA button */}
          <div className="hidden md:block">
            <Button className="btn-gradient rounded-xl text-white h-10 px-6">
              <span className="relative z-10">Get Started</span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden glass-card rounded-2xl mt-2 p-4">
            <div className="flex flex-col gap-4">
              <a href="#chatbot" className="text-sm font-medium py-2" onClick={() => setIsOpen(false)}>
                AI Chatbot
              </a>
              <a href="#features" className="text-sm font-medium py-2" onClick={() => setIsOpen(false)}>
                Features
              </a>
              <a href="#budget" className="text-sm font-medium py-2" onClick={() => setIsOpen(false)}>
                Budget
              </a>
              <a href="#how-it-works" className="text-sm font-medium py-2" onClick={() => setIsOpen(false)}>
                How It Works
              </a>
              <Button className="btn-gradient rounded-xl text-white w-full">
                <span className="relative z-10">Get Started</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
