"""
Prompt templates for the Event Planning Chatbot.
This file contains only text prompts sent to the LLM.
"""

BIRTHDAY_PROMPT = """
You are an expert event planner.
Plan a birthday event for {guests} guests within a budget of {budget} INR.

Include:
- Event checklist
- Simple timeline
- Budget distribution advice
"""

WEDDING_PROMPT = """
You are an expert wedding planner.
Plan a wedding event for {guests} guests within a budget of {budget} INR.

Include:
- Preparation checklist
- Event timeline
- Budget allocation suggestions
"""

CORPORATE_PROMPT = """
You are a professional corporate event planner.
Plan a corporate event for {guests} people within a budget of {budget} INR.

Include:
- Planning steps
- Event schedule
- Cost optimization tips
"""
