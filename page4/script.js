function saveAnswer(questionName) {
  const selected = document.querySelector(`input[name="${questionName}"]:checked`);
  if (selected) {
    localStorage.setItem(questionName, selected.value);
    return true;
  }
  return false;
}

function loadAnswer(questionName) {
  const saved = localStorage.getItem(questionName);
  if (saved) {
    const radio = document.querySelector(`input[name="${questionName}"][value="${saved}"]`);
    if (radio) {
      radio.checked = true;
    }
  }
}

function goNext(questionName, nextPage) {
  const answered = saveAnswer(questionName);
  if (!answered) {
    alert("Please select an answer before continuing.");
    return;
  }
  window.location.href = nextPage;
}

function goBack(prevPage) {
  window.location.href = prevPage;
}

function showResult() {
  const answers = [
    localStorage.getItem("q1"),
    localStorage.getItem("q2"),
    localStorage.getItem("q3"),
    localStorage.getItem("q4"),
    localStorage.getItem("q5"),
    localStorage.getItem("q6"),
    localStorage.getItem("q7"),
    localStorage.getItem("q8"),
    localStorage.getItem("q9"),
    localStorage.getItem("q10")
  ];

  if (answers.includes(null)) {
    document.getElementById("result-title").textContent = "Incomplete Quiz";
    document.getElementById("result-description").textContent =
      "Please complete all questions before viewing your result.";
    return;
  }

  let scores = {
    A: 0,
    B: 0,
    C: 0,
    D: 0
  };

  answers.forEach(answer => {
    scores[answer]++;
  });

  let resultType = "A";
  let maxScore = scores.A;

  for (let key in scores) {
    if (scores[key] > maxScore) {
      maxScore = scores[key];
      resultType = key;
    }
  }

  const resultTitle = document.getElementById("result-title");
  const resultDescription = document.getElementById("result-description");

  if (resultType === "A") {
    resultTitle.textContent = "You are an Explorer";
    resultDescription.textContent =
      "You enjoy freedom, discovery, and exploring large worlds. You like games that let you wander, experiment, and find hidden content on your own.";
  } else if (resultType === "B") {
    resultTitle.textContent = "You are a Competitor";
    resultDescription.textContent =
      "You care most about challenge, skill, and winning. You enjoy games where performance, strategy, and competition are the core experience.";
  } else if (resultType === "C") {
    resultTitle.textContent = "You are a Story-Driven Player";
    resultDescription.textContent =
      "You value plot, characters, and emotional experience. A strong narrative is what keeps you engaged in a game.";
  } else if (resultType === "D") {
    resultTitle.textContent = "You are a Casual Player";
    resultDescription.textContent =
      "You play games mainly to relax and have fun. You prefer low-pressure experiences that feel enjoyable and easy to pick up.";
  }
}

function restartQuiz() {
  localStorage.clear();
  window.location.href = "page1.html";
}

window.onload = function () {
  const path = window.location.pathname;

  if (path.includes("page1.html")) loadAnswer("q1");
  if (path.includes("page2.html")) loadAnswer("q2");
  if (path.includes("page3.html")) loadAnswer("q3");
  if (path.includes("page4.html")) loadAnswer("q4");
  if (path.includes("page5.html")) loadAnswer("q5");
  if (path.includes("page6.html")) loadAnswer("q6");
  if (path.includes("page7.html")) loadAnswer("q7");
  if (path.includes("page8.html")) loadAnswer("q8");
  if (path.includes("page9.html")) loadAnswer("q9");
  if (path.includes("page10.html")) loadAnswer("q10");

  if (path.includes("result.html")) showResult();
};