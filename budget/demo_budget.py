from budget_model import Budget
from expenses import calculate_total_spent, calculate_remaining_budget
from charts import show_category_wise_chart, show_bar_chart
from budget_service import get_budget_summary

budget = Budget(50000)

budget.add_expense("venue", 20000)
budget.add_expense("food", 15000)
budget.add_expense("decoration", 5000)

print("Total Budget:", budget.total_budget)
print("Total Spent:", calculate_total_spent(budget))
print("Remaining Budget:", calculate_remaining_budget(budget))

print("\nFull Budget Summary:")
print(get_budget_summary(budget))

# Generate charts
show_category_wise_chart(budget)
show_bar_chart(budget)
