import matplotlib.pyplot as plt
from expenses import calculate_total_spent


def show_category_wise_chart(budget):
    categories = list(budget.expenses.keys())
    values = list(budget.expenses.values())

    plt.figure()
    plt.pie(values, labels=categories, autopct="%1.1f%%", startangle=90)
    plt.title("Expense Distribution")
    plt.axis('equal')
    plt.savefig("budget_pie_chart.png")
    print("Pie chart saved as budget_pie_chart.png")


def show_bar_chart(budget):
    categories = list(budget.expenses.keys())
    values = list(budget.expenses.values())

    plt.figure()
    plt.bar(categories, values)
    plt.title("Expense Distribution (Bar Chart)")
    plt.xlabel("Categories")
    plt.ylabel("Amount (INR)")
    plt.savefig("budget_bar_chart.png")
    print("Bar chart saved as budget_bar_chart.png")
