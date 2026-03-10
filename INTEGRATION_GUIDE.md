# Frontend-Backend Integration Guide

## Overview
The Event Planning Assistant frontend is now fully integrated with the backend chatbot. Users can input event details (event type, number of guests, and budget) to generate AI-powered event planning recommendations.

## How It Works

### User Flow
1. **User opens the chatbot section** on the frontend at http://localhost:8080
2. **User fills in the form with:**
   - Event Type (e.g., "birthday", "wedding", "corporate")
   - Number of Guests (numeric value)
   - Budget in ₹ (numeric value)
3. **User clicks "Generate Event Plan"** button
4. **Frontend sends request** to `POST /generate-plan` endpoint on the backend
5. **Backend processes the request:**
   - Selects the appropriate prompt template based on event type
   - Formats the prompt with guest count and budget
   - Calls the LLM service (currently mock, returns contextual recommendations)
   - Returns structured response with the generated plan
6. **Frontend receives and displays** the AI-generated event plan in the chat interface

### API Endpoint

**POST** `http://127.0.0.1:5000/generate-plan`

**Request Body:**
```json
{
  "event_type": "birthday|wedding|corporate",
  "guests": 50,
  "budget": 100000
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "event_type": "birthday",
    "guests": 50,
    "budget": 100000,
    "generated_plan": "Here is a comprehensive event plan..."
  }
}
```

## Running the System

### 1. Start the Backend
```bash
cd Event-Planning-Assistant
python app.py
```
Backend will run on `http://127.0.0.1:5000`

### 2. Start the Frontend
```bash
cd frontend/ai-event-genie
npm run dev
```
Frontend will run on `http://localhost:8080`

### 3. Use the Chatbot
- Open http://localhost:8080 in your browser
- Scroll to the "Meet Your AI Event Planner" section
- Fill in the form with:
  - **Event Type**: birthday, wedding, or corporate
  - **Guests**: Number of attendees
  - **Budget**: Total budget in rupees
- Click "Generate Event Plan"
- View the AI-generated recommendations in the chat

## Quick Start Examples

Use the quick-start buttons to pre-populate the form:
- **Birthday (50 guests)** - ₹100,000
- **Wedding (200 guests)** - ₹500,000
- **Corporate (150 guests)** - ₹300,000

## Features Implemented

✅ **Frontend Integration**
- Form-based input for event details
- Input validation (non-empty, numeric values, positive numbers)
- Loading state during API call
- Error handling with user-friendly messages
- Chat interface to display responses
- Quick-start suggestion buttons

✅ **Backend Integration**
- `/generate-plan` API endpoint with proper validation
- CORS enabled for frontend-backend communication
- Support for birthday, wedding, and corporate events
- Structured event plan generation
- Error handling and HTTP status codes

✅ **Testing**
- Integration test script (`test_integration.py`) validates all event types
- All tests passing ✅

## Next Steps & Improvements

### Phase 1: Real LLM Integration
- [ ] Choose LLM provider (OpenAI, Anthropic, etc.)
- [ ] Update `chatbot/llm_service.py` with actual API calls
- [ ] Add `.env` file for API keys (don't commit secrets)
- [ ] Create `.env.example` with required variables

### Phase 2: Expense Tracking Integration
- [ ] Add budget tracker API endpoints in `app.py`
- [ ] Wire `BudgetTrackerSection` component to backend
- [ ] Implement expense persistence (CSV, JSON, or database)

### Phase 3: Enhanced Chatbot
- [ ] Add conversation history (multiple messages in one session)
- [ ] Support follow-up questions
- [ ] Add event-specific tips and recommendations
- [ ] Implement chat message streaming for better UX

### Phase 4: Testing & Deployment
- [ ] Add unit tests for chatbot logic
- [ ] Add E2E tests for the full flow
- [ ] Create Docker compose file for easy deployment
- [ ] Set up CI/CD pipeline

## Troubleshooting

### "Error connecting to AI backend"
- Ensure backend is running: `python app.py`
- Check that backend is on `http://127.0.0.1:5000`
- Check browser console for CORS errors

### "Field validation errors"
- Event type must not be empty
- Guests must be a valid positive number
- Budget must be a valid positive number

### Port already in use
- Backend (5000): `netstat -ano | findstr :5000`
- Frontend (8080): `netstat -ano | findstr :8080`
- Kill the process and restart

## File Changes Summary

### Modified Files
- `frontend/ai-event-genie/src/components/ChatbotSection.tsx` - Complete rewrite with form-based input
- `frontend/ai-event-genie/src/services/api.ts` - Enhanced error handling
- `chatbot/llm_service.py` - Improved mock responses with event planning details

### New Files
- `test_integration.py` - Integration test script

## Architecture

```
User Browser (Frontend)
         ↓
   ChatbotSection.tsx
     (Form Input)
         ↓
   api.ts (POST /generate-plan)
         ↓
   Flask Backend (app.py)
         ↓
   chatbot_api.py
         ↓
   chatbot.py (event planning logic)
         ↓
   prompts.py (select template)
         ↓
   llm_service.py (generate response)
         ↓
   Response sent back to Frontend
         ↓
   Display in Chat Interface
```

---

**Status:** ✅ Frontend-Backend integration complete and tested!
