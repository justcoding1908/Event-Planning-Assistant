from budget_model import Budget
from expenses import calculate_total_spent, calculate_remaining_budget
from charts import show_category_wise_chart

budget = Budget(50000)

budget.add_expense("venue", 20000)
budget.add_expense("food", 15000)
budget.add_expense("decoration", 5000)

print("Total Budget:", budget.total_budget)
print("Total Spent:", calculate_total_spent(budget))
print("Remaining Budget:", calculate_remaining_budget(budget))

show_category_wise_chart(budget)
