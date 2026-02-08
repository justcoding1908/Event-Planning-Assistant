"""
Chatbot Controller Module
-------------------------
This file controls the chatbot flow by:
- Selecting the correct prompt
- Formatting user inputs
- Calling the LLM service
"""

from prompts import BIRTHDAY_PROMPT, WEDDING_PROMPT, CORPORATE_PROMPT
from llm_service import get_llm_response


def select_prompt(event_type: str) -> str:
    """
    Selects the appropriate prompt template based on event type.
    """

    event_type = event_type.lower()

    if event_type == "birthday":
        return BIRTHDAY_PROMPT
    elif event_type == "wedding":
        return WEDDING_PROMPT
    else:
        return CORPORATE_PROMPT


def generate_event_plan(event_type: str, guests: int, budget: int) -> str:
    """
    Generates an event plan using the selected prompt and LLM service.

    Parameters:
    - event_type (str): Type of event
    - guests (int): Number of guests
    - budget (int): Total budget in INR

    Returns:
    - str: AI-generated event plan
    """

    prompt_template = select_prompt(event_type)

    formatted_prompt = prompt_template.format(
        guests=guests,
        budget=budget
    )

    response = get_llm_response(formatted_prompt)
    return response
