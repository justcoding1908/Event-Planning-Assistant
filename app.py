from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot.chatbot import generate_event_plan
from chatbot.llm_service import get_llm_response

# NEW IMPORT — we're pulling in the bridge function we just created
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), "budget"))
from budget_service import get_budget_summary

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return "AI Event Planning Assistant Backend is Running"


@app.route("/health")
def health():
    return jsonify({"status": "Backend is healthy"})


@app.route("/generate-plan", methods=["POST"])
def generate_plan():
    try:
        data = request.get_json()
        print(data)

        if not data:
            return jsonify({"error": "No input data provided"}), 400

        event_type = data.get("event_type")
        guests = data.get("guests")
        budget = data.get("budget")
        user_query = data.get("user_query", "")

        if not event_type or guests is None or budget is None:
            return jsonify({"error": "Missing required fields"}), 400

        try:
            if user_query:
                modified_prompt = f"""
    Event Type: {event_type}
    Guests: {guests}
    Budget: {budget}

    User wants changes:
    {user_query}

    Update the plan accordingly.
        """
                plan = get_llm_response(modified_prompt)
            else:
                try:
                    plan = generate_event_plan(event_type, int(guests), int(budget))
                except ValueError as ve:
                    return jsonify({
                        "status": "error",
                        "message": str(ve)
                    }), 400
        except Exception as e:
            import traceback
            traceback.print_exc()
            return jsonify({"status": "error", "message": str(e)}), 500

        # NEW — generate budget summary using the budget module
        budget_summary = get_budget_summary(
            total_budget=float(budget),
            event_type=event_type
        )

        return jsonify({
            "generated_plan": plan,
            "status": "success",
            "budget_summary": budget_summary,   # <-- NEW key added to response
            "data": {
                "event_type": event_type,
                "guests": int(guests),
                "budget": int(budget),
                "generated_plan": plan
            }
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)