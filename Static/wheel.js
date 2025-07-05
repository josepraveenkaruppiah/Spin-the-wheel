let answers = [];
let currentResult = "";
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");

function fetchAnswers() {
    fetch("/get_answers")
        .then(res => res.json())
        .then(data => {
            answers = data.answers;
            drawWheel();
        });
}

function addAnswer() {
    const input = document.getElementById("answerInput");
    const answer = input.value.trim();
    if (!answer) return;
    fetch("/add_answer", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ answer })
    }).then(() => {
        input.value = "";
        fetchAnswers();
    });
}

function removeResult() {
    if (!currentResult) return;
    fetch("/remove_answer", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ answer: currentResult })
    }).then(() => {
        document.getElementById("resultText").textContent = "";
        document.getElementById("removeBtn").style.display = "none";
        currentResult = "";
        fetchAnswers();
    });
}

function drawWheel() {
    const radius = canvas.width / 2;
    const angleStep = 2 * Math.PI / answers.length;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    answers.forEach((text, i) => {
        const angle = i * angleStep;
        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.arc(radius, radius, radius, angle, angle + angleStep);
        ctx.fillStyle = `hsl(${i * 360 / answers.length}, 80%, 70%)`;
        ctx.fill();
        ctx.stroke();

        // Text
        ctx.save();
        ctx.translate(radius, radius);
        ctx.rotate(angle + angleStep / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#000";
        ctx.font = "16px Arial";
        ctx.fillText(text, radius - 10, 10);
        ctx.restore();
    });
}

function spin() {
    if (answers.length === 0) return;

    let angle = 0;
    let velocity = Math.random() * 0.1 + 0.2;
    const friction = 0.995;

    const spinning = setInterval(() => {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angle);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
        drawWheel();
        ctx.restore();

        angle += velocity;
        velocity *= friction;

        if (velocity < 0.002) {
            clearInterval(spinning);
            const index = Math.floor(((2 * Math.PI - (angle % (2 * Math.PI))) / (2 * Math.PI)) * answers.length) % answers.length;
            currentResult = answers[index];
            document.getElementById("resultText").textContent = `Result: ${currentResult}`;
            document.getElementById("removeBtn").style.display = "inline-block";
        }
    }, 16);
}

fetchAnswers();
