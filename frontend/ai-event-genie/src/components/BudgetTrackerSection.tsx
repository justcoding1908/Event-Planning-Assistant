import { useState } from "react";
import { Plus, TrendingUp, Wallet, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categories = ["Venue", "Catering", "Decoration", "Photography", "Entertainment", "Other"];

const BudgetTrackerSection = () => {
  const [expenses, setExpenses] = useState([
    { category: "Venue", amount: 50000 },
    { category: "Catering", amount: 35000 },
    { category: "Decoration", amount: 15000 },
  ]);
  const [newCategory, setNewCategory] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const totalBudget = 150000;
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = totalBudget - totalSpent;
  const spentPercentage = (totalSpent / totalBudget) * 100;

  const handleAddExpense = () => {
    if (newCategory && newAmount) {
      setExpenses([...expenses, { category: newCategory, amount: parseFloat(newAmount) }]);
      setNewCategory("");
      setNewAmount("");
    }
  };

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
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Smart budget tracking that keeps your event finances in check. Visualize spending and stay on track.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Budget overview */}
          <div className="feature-card border border-border/50">
            <h3 className="text-xl font-semibold font-display mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Budget Overview
            </h3>

            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Spent</span>
                <span className="font-medium">{spentPercentage.toFixed(0)}%</span>
              </div>
              <div className="h-4 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full gradient-bg rounded-full transition-all duration-500"
                  style={{ width: `${spentPercentage}%` }}
                />
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-secondary/50">
                <p className="text-2xl font-bold text-foreground">₹{totalBudget.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Budget</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-accent/10">
                <p className="text-2xl font-bold text-accent">₹{totalSpent.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Spent</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-primary/10">
                <p className="text-2xl font-bold text-primary">₹{remaining.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Remaining</p>
              </div>
            </div>

            {/* Expense list */}
            <div className="mt-6 space-y-3">
              {expenses.map((expense, index) => (
                <div key={index} className="flex justify-between items-center p-3 rounded-xl bg-secondary/30">
                  <span className="font-medium">{expense.category}</span>
                  <span className="text-muted-foreground">₹{expense.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Add expense form */}
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
                  className="h-12 rounded-xl bg-secondary/50"
                />
              </div>

              <Button 
                onClick={handleAddExpense}
                className="w-full btn-gradient h-12 rounded-xl text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Expense
              </Button>
            </div>

            {/* Visual chart placeholder */}
            <div className="mt-8 p-6 rounded-xl bg-secondary/30 border border-border/30">
              <p className="text-center text-muted-foreground text-sm mb-4">Expense Distribution</p>
              <div className="flex items-end justify-center gap-2 h-32">
                {expenses.map((expense, index) => (
                  <div 
                    key={index}
                    className="w-12 gradient-bg rounded-t-lg transition-all duration-300 hover:opacity-80"
                    style={{ height: `${(expense.amount / totalBudget) * 200}%` }}
                    title={`${expense.category}: ₹${expense.amount.toLocaleString()}`}
                  />
                ))}
              </div>
              <div className="flex justify-center gap-4 mt-4 flex-wrap">
                {expenses.map((expense, index) => (
                  <span key={index} className="text-xs text-muted-foreground">{expense.category}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BudgetTrackerSection;
