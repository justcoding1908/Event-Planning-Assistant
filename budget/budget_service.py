<<<<<<< HEAD
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
=======
# budget/budget_service.py
# This file acts as the bridge between the Budget model and the Flask API.
# It takes raw numbers (total budget) and returns a clean summary dict
# that can be sent as JSON to the frontend.

import sys
import os
sys.path.append(os.path.dirname(__file__))  # so it can find budget_model, expenses

from budget_model import Budget
from expenses import calculate_total_spent, calculate_remaining_budget, is_over_budget


# These are default allocation percentages per event type.
# Think of it like: "for a wedding, roughly how much goes to each category?"
ALLOCATION_RULES = {
    "wedding":      {"venue": 0.30, "food": 0.40, "decoration": 0.20, "miscellaneous": 0.10},
    "birthday":     {"venue": 0.20, "food": 0.45, "decoration": 0.25, "miscellaneous": 0.10},
    "conference":   {"venue": 0.40, "food": 0.30, "decoration": 0.10, "miscellaneous": 0.20},
    "corporate":    {"venue": 0.35, "food": 0.30, "decoration": 0.15, "miscellaneous": 0.20},
    "party":        {"venue": 0.20, "food": 0.40, "decoration": 0.25, "miscellaneous": 0.15},
    "default":      {"venue": 0.25, "food": 0.40, "decoration": 0.20, "miscellaneous": 0.15},
}


def get_budget_summary(total_budget: float, event_type: str = "default") -> dict:
    """
    Creates a Budget object, allocates money across categories based on event type,
    and returns a clean dictionary summary for the API to return as JSON.
    
    Why return a dict and not the Budget object?
    Because Flask's jsonify() can't serialize custom Python objects — only dicts/lists.
    """

    # Pick the right allocation rule, fall back to "default" if event type unknown
    event_key = event_type.lower() if event_type.lower() in ALLOCATION_RULES else "default"
    allocations = ALLOCATION_RULES[event_key]

    # Create the budget object
    b = Budget(total_budget)

    # Add the suggested/allocated amounts as expenses
    # This represents the PLANNED spend per category
    for category, percent in allocations.items():
        allocated_amount = total_budget * percent
        b.add_expense(category, allocated_amount)

    # Now build the summary using expenses.py utility functions
    total_spent = calculate_total_spent(b)      # = total_budget (since we allocated all of it)
    remaining = calculate_remaining_budget(b)    # = 0 initially (fully planned)
    over = is_over_budget(b)

    return {
        "total_budget": total_budget,
        "allocated": {
            # Show each category with both % and ₹ amount
            category: {
                "percent": int(percent * 100),
                "amount": round(total_budget * percent, 2)
            }
            for category, percent in allocations.items()
        },
        "total_allocated": round(total_spent, 2),
        "remaining": round(remaining, 2),
        "is_over_budget": over,
        "status": "warning" if over else "healthy"
    }
>>>>>>> f1772210bb733f5379f2ec4d1978f922a252c170
