"""
Budget Visualization Module
----------------------------
This file handles visual representation of budget data.
Charts are generated using matplotlib.
"""

import matplotlib.pyplot as plt
from expenses import calculate_total_spent, calculate_remaining_budget


def show_category_wise_chart(budget):
    """
    Displays a pie chart showing expense distribution.
    """

    categories = list(budget.expenses.keys())
    values = list(budget.expenses.values())

    plt.figure()
    plt.pie(values, labels=categories, autopct="%1.1f%%")
    plt.title("Category-wise Expense Distribution")
    plt.show()


def show_budget_summary_chart(budget):
    """
    Displays planned vs actual budget.
    """

    planned = budget.total_budget
    actual = calculate_total_spent(budget)

    plt.figure()
    plt.bar(["Planned Budget", "Spent Amount"], [planned, actual])
    plt.title("Planned vs Actual Budget")
    plt.ylabel("Amount (INR)")
    plt.show()

