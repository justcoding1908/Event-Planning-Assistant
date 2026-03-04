"""
Budget Service Layer
This file provides a structured interface for accessing
budget calculations and summaries.
"""

from budget.expenses import calculate_total_spent, calculate_remaining_budget


def get_budget_summary(budget):
    """
    Returns a summary of the current budget status.
    """

    total_spent = calculate_total_spent(budget)
    remaining = calculate_remaining_budget(budget)

    summary = {
        "total_budget": budget.total_budget,
        "total_spent": total_spent,
        "remaining_budget": remaining,
        "expenses": budget.expenses
    }

    return summary
