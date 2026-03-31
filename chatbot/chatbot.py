"""
Chatbot Controller Module
-------------------------
This file controls the chatbot flow by:
- Selecting the correct prompt
- Formatting user inputs
- Calling the LLM service
"""

from chatbot.prompts import GENERIC_EVENT_PROMPT
from chatbot.llm_service import get_llm_response

def is_valid_event(event_type: str) -> bool:
    prompt = f"""
You are a strict validator.

Decide if the input is a REAL event type.

Valid examples:
- birthday party
- wedding ceremony
- business conference
- music concert
- college fest

Invalid examples:
- asdasd
- vnfkjkgj
- 123123
- random nonsense

Rules:
- Respond ONLY with "yes" or "no"
- Be strict: if unsure → say "no"

Input: {event_type}
"""

    response = get_llm_response(prompt).strip().lower()
    return response == "yes"



    






def generate_event_plan(event_type: str, guests: int, budget: int) -> str:
    """
    Generates an event plan using the selected prompt and LLM service.
    Includes basic input validation and budget intelligence.
    """

    # Validation
    if not event_type:
        return "Error: Event type is required."
    if not is_valid_event(event_type):
        raise ValueError(f"Invalid event type: '{event_type}'")

    if guests <= 0:
        return "Error: Number of guests must be greater than zero."

    if budget <= 0:
        return "Error: Budget must be greater than zero."

    
    prompt_template = GENERIC_EVENT_PROMPT

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


