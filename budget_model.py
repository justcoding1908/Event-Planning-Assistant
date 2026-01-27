# budget/budget_model.py

class Budget:
    def __init__(self, total_budget):
        self.total_budget = total_budget
        
        # Expense categories
        self.expenses = {
            "venue": 0,
            "food": 0,
            "decoration": 0,
            "miscellaneous": 0
        }

    def add_expense(self, category, amount):
        if category in self.expenses:
            self.expenses[category] += amount
        else:
            print("Invalid category")

