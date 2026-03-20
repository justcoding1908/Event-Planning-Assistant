"""
LLM Service Module
------------------
Handles interaction with Groq LLM API.
"""

import os
from groq import Groq

# BUG FIX 4: Guard against missing API key — fail early with a clear message.
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise EnvironmentError(
        "GROQ_API_KEY environment variable is not set. "
        "Please set it before running the application."
    )

client = Groq(api_key=api_key)


def get_llm_response(prompt: str) -> str:
    """
    Sends a prompt to the Groq LLM and returns the response.
    """
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": """
                        You are an expert professional event planner.

                        Generate a clear structured event plan strictly based on the provided inputs.

                        Rules:
                        - Do NOT invent missing details.
                        - If information is missing, keep it generic.
                        - Follow this structure exactly:

                        1. Event Overview
                        2. Venue Suggestions
                        3. Catering Plan
                        4. Decoration & Theme
                        5. Entertainment Ideas
                        6. Timeline
                        7. Budget Breakdown
                        8. Final Checklist

                        Keep the plan practical and concise.
                        """
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=1200
        )

        import re

        raw_text = response.choices[0].message.content

        # Remove markdown bold (**text**)
        clean_text = re.sub(r"\*\*(.*?)\*\*", r"\1", raw_text)

        return clean_text

    except Exception as e:
        return f"LLM API Error: {str(e)}"
