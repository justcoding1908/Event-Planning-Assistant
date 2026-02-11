"""
Local Demo Script for Event Planning Chatbot
This file is used to test the chatbot module locally.
"""

from chatbot import generate_event_plan

if __name__ == "__main__":
    event_type = "Birthday"
    guests = 50
    budget = 50000

    result = generate_event_plan(event_type, guests, budget)

    print("AI Event Plan Output:\n")
    print(result)
