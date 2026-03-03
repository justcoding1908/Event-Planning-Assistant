from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot.chatbot_api import get_chatbot_response

app = Flask(__name__)
CORS(app)  # Allows frontend to connect


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

        # Check if data exists
        if not data:
            return jsonify({"error": "No input data provided"}), 400

        event_type = data.get("event_type")
        guests = data.get("guests")
        budget = data.get("budget")

        # Validate required fields
        if not event_type or guests is None or budget is None:
            return jsonify({"error": "Missing required fields"}), 400

        response = get_chatbot_response(
            event_type,
            int(guests),
            int(budget)
        )

        return jsonify({
            "status": "success",
            "data": response
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)
