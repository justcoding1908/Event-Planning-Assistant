"""
LLM Service Module
------------------
This file handles interaction with the Large Language Model (LLM).
For now, it returns a simulated response based on event details.
TODO: Integrate with actual LLM provider (OpenAI, Anthropic, etc.)
"""

def get_llm_response(prompt: str) -> str:
    """
    Sends a prompt to the LLM and returns the response.
    Currently returns contextual mock responses.

    Parameters:
    - prompt (str): The formatted prompt sent to the LLM

    Returns:
    - str: AI-generated response (mock data for now)
    """

    # Mock response based on prompt content
    # TODO: Replace with actual LLM API call
    response = (
        "Here is a comprehensive event plan based on your details:\n\n"
        "PRE-EVENT PLANNING (4-6 weeks before):\n"
        "• Finalize guest list and send invitations\n"
        "• Book venue and confirm availability\n"
        "• Reserve catering service and finalize menu\n"
        "• Arrange transportation if needed\n"
        "• Book photography/videography\n\n"
        "DECORATION & THEME (2-3 weeks before):\n"
        "• Select color scheme and decoration style\n"
        "• Order flowers, balloons, and decorative items\n"
        "• Plan music/DJ arrangements\n"
        "• Create event timeline and schedule\n\n"
        "BUDGET BREAKDOWN RECOMMENDATIONS:\n"
        "• Venue: 25-30% of total budget\n"
        "• Catering: 30-35% of total budget\n"
        "• Decoration: 15-20% of total budget\n"
        "• Photography: 10-15% of total budget\n"
        "• Miscellaneous: 5-10% of total budget\n\n"
        "DAY-OF CHECKLIST:\n"
        "• Arrive early for setup\n"
        "• Do final decorations check\n"
        "• Confirm catering service arrival\n"
        "• Test music and audio equipment\n"
        "• Brief staff and volunteers\n"
        "• Enjoy and manage the event!\n\n"
        "Your event plan is ready! Start booking your vendors and sending out invitations."
    )

    return response

