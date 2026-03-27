"""
Budget Service Layer
Handles structured output for backend
"""

from expenses import (
    calculate_total_spent,
    calculate_remaining_budget,
    get_budget_status
)


def get_budget_suggestions(total_budget):
    return {
        "venue": f"₹{int(total_budget*0.25)} - ₹{int(total_budget*0.35)}",
        "food": f"₹{int(total_budget*0.30)} - ₹{int(total_budget*0.40)}",
        "decoration": f"₹{int(total_budget*0.10)} - ₹{int(total_budget*0.20)}",
        "miscellaneous": f"₹{int(total_budget*0.05)} - ₹{int(total_budget*0.10)}"
    }


def get_budget_summary(budget):
    total_spent = calculate_total_spent(budget)
    remaining = calculate_remaining_budget(budget)
    status = get_budget_status(budget)

    summary = {
        "total_budget": budget.total_budget,
        "total_spent": total_spent,
        "remaining_budget": remaining,
        "expenses": budget.expenses,
        "status": status,
        "suggestions": get_budget_suggestions(budget.total_budget)
    }

    # User-friendly message
    if remaining > 0:
        summary["message"] = f"You still have ₹{remaining} remaining."
    else:
        summary["message"] = "You have exceeded your budget!"

    return summary

def auto_allocate_budget(budget):
    budget.add_expense("venue", int(budget.total_budget * 0.3))
    budget.add_expense("food", int(budget.total_budget * 0.4))
    budget.add_expense("decoration", int(budget.total_budget * 0.2))
    return budget
