from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
answers = []

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/add_answer", methods=["POST"])
def add_answer():
    data = request.get_json()
    answer = data.get("answer", "").strip()
    if answer and answer not in answers:
        answers.append(answer)
    return jsonify({"answers": answers})

@app.route("/get_answers")
def get_answers():
    return jsonify({"answers": answers})

@app.route("/remove_answer", methods=["POST"])
def remove_answer():
    data = request.get_json()
    answer = data.get("answer")
    if answer in answers:
        answers.remove(answer)
    return jsonify({"answers": answers})

if __name__ == "__main__":
    app.run(debug=True)
