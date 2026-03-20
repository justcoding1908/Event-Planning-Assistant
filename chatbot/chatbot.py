"""
Chatbot Controller Module
-------------------------
This file controls the chatbot flow by:
- Selecting the correct prompt
- Formatting user inputs
- Calling the LLM service
"""

from chatbot.prompts import BIRTHDAY_PROMPT, WEDDING_PROMPT, CORPORATE_PROMPT
from chatbot.llm_service import get_llm_response


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
    Includes basic input validation and budget intelligence.
    """

    # Validation
    if not event_type:
        return "Error: Event type is required."

    if guests <= 0:
        return "Error: Number of guests must be greater than zero."

    if budget <= 0:
        return "Error: Budget must be greater than zero."

    # Select prompt
    prompt_template = select_prompt(event_type)

    formatted_prompt = prompt_template.format(
        event_type=event_type,
        guests=guests,
        budget=budget
    )

    response = get_llm_response(formatted_prompt)

    # NEW: Budget intelligence logic
    if budget < 20000:
        response += "\n\n⚠ Warning: Your budget is quite low. Consider reducing guest count or simplifying arrangements."
    elif budget > 200000:
        response += "\n\n✨ You have a comfortable budget. You can consider premium venue and catering options."

    return response


