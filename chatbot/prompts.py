"""
Prompt templates for the Event Planning Chatbot.
These prompts guide the LLM to generate structured event plans.
"""

BIRTHDAY_PROMPT = """
You are a professional event planner.

Create a detailed birthday event plan using the following details:

Event Type: {event_type}
Number of Guests: {guests}
Total Budget: {budget} INR

Provide the response using the following structure:

1. Event Overview
2. Venue Suggestions suitable for {guests} guests
3. Catering Plan
4. Decoration & Theme Ideas
5. Entertainment Options
6. Preparation Timeline
7. Budget Breakdown (allocate the {budget} INR realistically)
8. Final Event Checklist

Ensure the plan is practical and suitable for the given budget.
"""

WEDDING_PROMPT = """
You are a professional wedding planner.

Create a detailed wedding event plan using the following details:

Event Type: {event_type}
Number of Guests: {guests}
Total Budget: {budget} INR

Provide the response using the following structure:

1. Wedding Overview
2. Venue Suggestions
3. Catering Plan
4. Decoration & Theme
5. Entertainment / Ceremony Arrangements
6. Preparation Timeline
7. Budget Breakdown:
- Provide estimated cost per guest
- Allocate the {budget} INR realistically
- Ensure total does not exceed budget
- Show approximate pricing in INR
8. Final Wedding Checklist

Ensure the plan is practical and realistic.
"""

CORPORATE_PROMPT = """
You are a professional corporate event planner.

Create a detailed corporate event plan using the following details:

Event Type: {event_type}
Number of Attendees: {guests}
Total Budget: {budget} INR

Provide the response using the following structure:

1. Event Overview
2. Venue Suggestions
3. Catering Plan
4. Branding & Decoration
5. Activities / Networking Ideas
6. Event Timeline
7. Budget Allocation (optimize the {budget} INR)
8. Final Checklist

Ensure the event plan is professional and cost-effective.
"""


GENERIC_EVENT_PROMPT = """
You are a professional event planner.

Create a detailed event plan using the following details:

Event Type: {event_type}
Number of Guests: {guests}
Total Budget: {budget} INR

Provide the response using the following structure:

1. Event Overview
2. Venue Suggestions
3. Catering Plan
4. Decorations / Setup
5. Activities / Entertainment
6. Timeline
7. Budget Breakdown
8. Final Checklist

Ensure the plan is practical and tailored to the event type.
"""
