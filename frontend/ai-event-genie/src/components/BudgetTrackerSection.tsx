import { useState, useEffect } from "react";
import { Plus, TrendingUp, Wallet, PiggyBank, AlertTriangle, ArrowUpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categories = ["Venue", "Catering", "Decoration", "Photography", "Entertainment", "Other"];

const BudgetTrackerSection = () => {
  const [expenses, setExpenses] = useState<{ category: string; amount: number }[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [newAmount, setNewAmount] = useState("");

  // NEW — read from localStorage
  const [totalBudget, setTotalBudget] = useState(0);
  const [eventType, setEventType] = useState("");
  const [hasPlan, setHasPlan] = useState(false);

  // WHY useEffect? We want to read localStorage AFTER the component mounts.
  // localStorage isn't available during server-side rendering, and we also
  // want it to update if the user generates a new plan while on the page.
 useEffect(() => {
  const readFromStorage = () => {
    const savedBudget = localStorage.getItem('eventai_budget');
    const savedEventType = localStorage.getItem('eventai_event_type');
    if (savedBudget) {
      setTotalBudget(parseFloat(savedBudget));
      setHasPlan(true);
    }
    if (savedEventType) {
      setEventType(savedEventType);
    }
  };

  // Read immediately on mount
  readFromStorage();

  // Also listen for storage changes (fires when another component writes to localStorage)
  window.addEventListener('eventai_plan_saved', readFromStorage);
  return () => window.removeEventListener('eventai_plan_saved', readFromStorage);
}, []);

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = totalBudget - totalSpent;
  const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const isOverBudget = totalSpent > totalBudget;

  const handleAddExpense = () => {
    if (newCategory && newAmount && parseFloat(newAmount) > 0) {
      setExpenses([...expenses, { category: newCategory, amount: parseFloat(newAmount) }]);
      setNewCategory("");
      setNewAmount("");
    }
  };

  const handleRemoveExpense = (index: number) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  // ── NO PLAN STATE ──────────────────────────────────────────────────────────
  // WHY? If user lands on this section without generating a plan first,
  // we guide them instead of showing confusing hardcoded numbers.
  if (!hasPlan) {
    return (
      <section className="py-24 px-4 bg-background" id="budget">
        <div className="container max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-accent/10 border border-accent/20">
              <Wallet className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">Budget Manager</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
              Track Every Rupee 💰
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Smart budget tracking that keeps your event finances in check.
            </p>
          </div>

          {/* Empty state */}
          <div className="max-w-md mx-auto text-center feature-card border border-border/50 py-16">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">No Event Plan Yet</h3>
            <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
              Generate an event plan first and your budget will automatically appear here for tracking.
            </p>
            <Button
              className="btn-gradient text-white rounded-xl h-12 px-8"
              onClick={() => document.getElementById('chatbot')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <ArrowUpCircle className="w-4 h-4 mr-2" />
              Generate a Plan First
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // ── MAIN TRACKER (plan exists) ─────────────────────────────────────────────
  return (
    <section className="py-24 px-4 bg-background" id="budget">
      <div className="container max-w-6xl">

        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-accent/10 border border-accent/20">
            <Wallet className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Budget Manager</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Track Every Rupee 💰
          </h2>
          {/* WHY show eventType? Makes it feel personal — "your wedding budget" */}
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Tracking actual expenses for your{" "}
            <span className="text-primary font-medium capitalize">{eventType}</span>{" "}
            against your planned budget of{" "}
            <span className="text-primary font-medium">₹{totalBudget.toLocaleString('en-IN')}</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">

          {/* ── Budget Overview ── */}
          <div className="feature-card border border-border/50">
            <h3 className="text-xl font-semibold font-display mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Budget Overview
            </h3>

            {/* Over budget warning */}
            {isOverBudget && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-500 font-medium">
                  You're ₹{Math.abs(remaining).toLocaleString('en-IN')} over budget!
                </p>
              </div>
            )}

            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Spent</span>
                <span className={`font-medium ${isOverBudget ? 'text-red-500' : ''}`}>
                  {Math.min(spentPercentage, 100).toFixed(0)}%
                  {isOverBudget && ' ⚠'}
                </span>
              </div>
              <div className="h-4 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : 'gradient-bg'}`}
                  style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                />
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-secondary/50">
                <p className="text-xl font-bold text-foreground">
                  ₹{totalBudget.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Planned Budget</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-accent/10">
                <p className="text-xl font-bold text-accent">
                  ₹{totalSpent.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Spent</p>
              </div>
              <div className={`text-center p-4 rounded-xl ${isOverBudget ? 'bg-red-500/10' : 'bg-primary/10'}`}>
                <p className={`text-xl font-bold ${isOverBudget ? 'text-red-500' : 'text-primary'}`}>
                  {isOverBudget ? '-' : ''}₹{Math.abs(remaining).toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {isOverBudget ? 'Over Budget' : 'Remaining'}
                </p>
              </div>
            </div>

            {/* Expense list */}
            {expenses.length > 0 && (
              <div className="mt-6 space-y-2">
                {expenses.map((expense, index) => (
                  <div key={index} className="flex justify-between items-center p-3 rounded-xl bg-secondary/30 group">
                    <span className="font-medium text-sm">{expense.category}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground text-sm">
                        ₹{expense.amount.toLocaleString('en-IN')}
                      </span>
                      {/* WHY remove button? User might add wrong expense */}
                      <button
                        onClick={() => handleRemoveExpense(index)}
                        className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs hover:text-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {expenses.length === 0 && (
              <div className="mt-6 text-center py-8 text-muted-foreground text-sm border border-dashed border-border/50 rounded-xl">
                No expenses added yet. Add your first expense →
              </div>
            )}
          </div>

          {/* ── Add Expense + Chart ── */}
          <div className="feature-card border border-border/50">
            <h3 className="text-xl font-semibold font-display mb-6 flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-accent" />
              Add New Expense
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger className="h-12 rounded-xl bg-secondary/50">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Amount (₹)</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddExpense()}
                  className="h-12 rounded-xl bg-secondary/50"
                />
              </div>

              <Button
                onClick={handleAddExpense}
                disabled={!newCategory || !newAmount}
                className="w-full btn-gradient h-12 rounded-xl text-white disabled:opacity-50"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Expense
              </Button>
            </div>

            {/* Bar chart */}
            <div className="mt-8 p-6 rounded-xl bg-secondary/30 border border-border/30">
              <p className="text-center text-muted-foreground text-sm mb-6 font-semibold">
                {expenses.length > 0 ? 'Expense Distribution' : 'Chart will appear as you add expenses'}
              </p>
              {expenses.length > 0 ? (
                <>
                  <div className="flex items-end justify-center gap-4 h-48 px-4">
                    {expenses.map((expense, index) => {
                      const maxAmount = Math.max(...expenses.map(e => e.amount));
                      const barHeight = Math.max((expense.amount / maxAmount) * 100, 15);
                      return (
                        <div key={index} className="flex flex-col items-center gap-2 flex-1">
                          <div
                            className="w-full bg-gradient-to-t from-primary via-accent to-accent rounded-lg transition-all duration-500 hover:shadow-lg hover:scale-105 cursor-pointer min-h-[20px]"
                            style={{ height: `${barHeight}%`, minHeight: '40px' }}
                            title={`${expense.category}: ₹${expense.amount.toLocaleString('en-IN')}`}
                          />
                          <span className="text-xs font-medium text-foreground text-center truncate w-full">
                            ₹{(expense.amount / 1000).toFixed(0)}k
                          </span>
                          <span className="text-xs text-muted-foreground text-center truncate w-full">
                            {expense.category}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="h-48 flex items-center justify-center text-muted-foreground/40 text-sm">
                  No expenses added yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BudgetTrackerSection;