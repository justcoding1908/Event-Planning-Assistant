from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot.chatbot import generate_event_plan
from chatbot.llm_service import get_llm_response

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

        # BUG FIX 1: Removed dead `response = {...}` block that was after a return.
        # BUG FIX 2: Wrapped the result in a "data" key to match what test_integration.py expects.
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

        return jsonify({
            "generated_plan": plan,
            "status": "success",
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
