"""
Chatbot API Interface
---------------------
This file exposes chatbot functionality in a structured format
that can be easily integrated with frontend or backend APIs.
"""

from chatbot import generate_event_plan


def get_chatbot_response(event_type: str, guests: int, budget: int) -> dict:
    """
    Returns chatbot response in structured dictionary format.
    """

    plan = generate_event_plan(event_type, guests, budget)

    return {
        "event_type": event_type,
        "guests": guests,
        "budget": budget,
        "generated_plan": plan
    }
