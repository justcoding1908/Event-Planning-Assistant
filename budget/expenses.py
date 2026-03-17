def calculate_total_spent(budget):
    return sum(budget.expenses.values())


def calculate_remaining_budget(budget):
    return budget.total_budget - calculate_total_spent(budget)


def is_over_budget(budget):
    return calculate_total_spent(budget) > budget.total_budget


def get_budget_status(budget):
    remaining = calculate_remaining_budget(budget)

    if remaining > budget.total_budget * 0.3:
        return "Good"
    elif remaining > 0:
        return "Moderate"
    else:
        return "Over Budget"
