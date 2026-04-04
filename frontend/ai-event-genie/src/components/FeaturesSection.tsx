import { Bot, Wallet, LayoutDashboard, Cloud, Calendar, Sparkles } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI Planning",
    description: "Get smart suggestions for venues and themes.",
    gradient: "from-primary to-primary/60",
  },
  {
    icon: Wallet,
    title: "Smart Budget",
    description: "Real-time expense tracking with visual alerts.",
    gradient: "from-accent to-accent/60",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    description: "Manage all events and tasks in one place.",
    gradient: "from-primary to-accent",
  },
  {
    icon: Cloud,
    title: "Sync Anywhere",
    description: "Access your plans from any device instantly.",
    gradient: "from-accent to-primary",
  },
  {
    icon: Calendar,
    title: "Schedule",
    description: "Keep track of deadlines and vendor bookings.",
    gradient: "from-primary/80 to-primary/40",
  },
  {
    icon: Sparkles,
    title: "Personalized",
    description: "Tailored recommendations for every event type.",
    gradient: "from-accent/80 to-accent/40",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 px-4 bg-secondary/30 border-y border-border/50" id="features">
      <div className="container max-w-6xl">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Plan Perfectly</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Compact tools built for efficiency and speed.
          </p>
        </div>

        {/* Features grid - 3x2 on desktop, 2x3 on tablet, 1x6 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group flex items-center p-4 rounded-xl bg-background/50 border border-border/40 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 active:scale-95"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-12 h-12 shrink-0 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <h3 className="text-base font-semibold font-display truncate">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-tight line-clamp-2">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
