import { Bot, Wallet, LayoutDashboard, Cloud } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI-Powered Planning",
    description: "Get intelligent suggestions for venues, themes, and vendors based on your preferences and budget.",
    gradient: "from-primary to-primary/60",
  },
  {
    icon: Wallet,
    title: "Smart Budget Tracking",
    description: "Real-time expense tracking with visual breakdowns. Never go over budget again.",
    gradient: "from-accent to-accent/60",
  },
  {
    icon: LayoutDashboard,
    title: "Easy-to-Use Dashboard",
    description: "Intuitive interface to manage all your events, tasks, and deadlines in one place.",
    gradient: "from-primary to-accent",
  },
  {
    icon: Cloud,
    title: "Cloud-Based Access",
    description: "Access your event plans from anywhere. Collaborate with team members in real-time.",
    gradient: "from-accent to-primary",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 px-4 bg-secondary/30" id="features">
      <div className="container max-w-6xl">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Plan Perfectly</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            From AI assistance to budget management, we've got all the tools you need for successful event planning.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="feature-card group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold font-display mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
