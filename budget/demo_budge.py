"""
Demo script to test the budget module
"""

from budget.budget_model import Budget
from budget.expenses import calculate_total_spent, calculate_remaining_budget
from budget.charts import show_expense_chart
from budget.budget_service import get_budget_summary


# Create budget
budget = Budget(50000)

# Add expenses
budget.add_expense("Venue", 20000)
budget.add_expense("Food", 15000)
budget.add_expense("Decoration", 5000)

# Print calculations
print("Total Budget:", budget.total_budget)
print("Total Spent:", calculate_total_spent(budget))
print("Remaining Budget:", calculate_remaining_budget(budget))

# Print structured summary
print("\nBudget Summary:")
print(get_budget_summary(budget))

# Show chart
show_expense_chart(budget)
