from flask import Flask, request, jsonify
from chatbot.chatbot_api import get_chatbot_response

app = Flask(__name__)


@app.route("/")
def home():
    return "AI Event Planning Assistant Backend is Running"


@app.route("/generate-plan", methods=["POST"])
def generate_plan():
    try:
        data = request.get_json()

        event_type = data.get("event_type")
        guests = int(data.get("guests"))
        budget = int(data.get("budget"))

        response = get_chatbot_response(event_type, guests, budget)

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(debug=True)
