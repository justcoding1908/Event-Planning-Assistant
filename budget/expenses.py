from budget_model import Budget

def calculate_total_spent(budget: Budget):
    return sum(budget.expenses.values())

def calculate_remaining_budget(budget: Budget):
    return budget.total_budget - calculate_total_spent(budget)

def is_over_budget(budget: Budget):
    return calculate_total_spent(budget) > budget.total_budget
