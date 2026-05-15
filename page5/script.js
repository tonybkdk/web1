const drawBtn = document.getElementById("draw-btn");
const questionInput = document.getElementById("question-input");
const resultContainer = document.getElementById("result-container");

async function drawTarotCard() {
  const userQuestion = questionInput.value;

  if (userQuestion.trim() === "") {
    resultContainer.innerHTML = `
      <p class="error">Please enter a question before drawing your card.</p>
    `;
    return;
  }

  resultContainer.innerHTML = `<p>Shuffling the digital deck...</p>`;

  try {
    const tarotResponse = await fetch(
      "https://tarotapi.dev/api/v1/cards/random?n=1"
    );

    const tarotData = await tarotResponse.json();

    const card = tarotData.cards[0];

    const cardName = card.name;
    const cardType = card.type;
    const cardMeaningUp = card.meaning_up;
    const cardMeaningRev = card.meaning_rev;
    const cardDescription = card.desc;

    const isReversed = Math.random() > 0.5;

    let finalMeaning;

    if (isReversed) {
      finalMeaning = cardMeaningRev;
    } else {
      finalMeaning = cardMeaningUp;
    }

    resultContainer.innerHTML = `
      <div class="card">
        <p class="user-question">Your question: "${userQuestion}"</p>

        <h2>${cardName}</h2>
        <p><strong>Position:</strong> ${isReversed ? "Reversed" : "Upright"}</p>
        <p><strong>Type:</strong> ${cardType}</p>

        <h3>Your Divination Message</h3>
        <p>${finalMeaning}</p>

        <h3>Card Description</h3>
        <p>${cardDescription}</p>
      </div>
    `;
  } catch (error) {
    resultContainer.innerHTML = `
      <p class="error">The cards are silent. Please try again later.</p>
    `;
    console.log(error);
  }
}

drawBtn.addEventListener("click", drawTarotCard);