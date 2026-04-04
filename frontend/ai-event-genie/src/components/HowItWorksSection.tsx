import { ClipboardList, MessageSquare, BarChart3, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Enter Event Details",
    description: "Tell us about your event - type, date, guest count, and budget. We'll tailor everything to your needs.",
  },
  {
    icon: MessageSquare,
    step: "02",
    title: "Chat with AI Planner",
    description: "Our AI assistant provides personalized recommendations for venues, vendors, themes, and more.",
  },
  {
    icon: BarChart3,
    step: "03",
    title: "Track & Manage Budget",
    description: "Monitor expenses in real-time, get alerts, and ensure your event stays within budget.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 px-4 bg-secondary/30" id="how-it-works">
      <div className="container max-w-6xl">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Three simple steps to plan your perfect event with AI assistance.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-20 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-primary via-accent to-primary opacity-30" />

          {steps.map((step, index) => (
            <div key={step.step} className="relative pt-8">
              <div className="feature-card text-center group p-8">
                {/* Icon */}
                <div className="w-20 h-20 mx-auto mt-10 mb-8 rounded-2xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-10 h-10 text-primary" />
                </div>

                <h3 className="text-xl font-semibold font-display mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>

              {/* Step number - positioned outside card */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-bg text-white text-sm font-bold z-20">
                Step {step.step}
              </div>

              {/* Arrow between steps */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="w-8 h-8 text-primary/30" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
