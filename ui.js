let stars = [];

function initStars() {
  for (let i = 0; i < 150; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      alpha: random(50, 150),
    });
  }
}

function drawStars() {
  noStroke();
  for (let s of stars) {
    fill(0, 255, 200, s.alpha);
    circle(s.x, s.y, s.size);

    // subtle flicker
    s.alpha += random(-2, 2);
    s.alpha = constrain(s.alpha, 30, 180);
  }
}

function drawBorder() {
  noFill();

  for (let i = 0; i < 3; i++) {
    stroke(0, 255, 200, 80 - i * 20);
    strokeWeight(2 + i);
    rect(40, 40, width - 80, height - 80);
  }
}

function drawUI() {
  fill(255);

  textSize(18);

  text("Level " + level, 80, 30);

  text(
    "Tasks " + tasks.filter((t) => t.done).length + "/" + tasks.length,
    220,
    30,
  );

  text("Time " + ceil(timer), 380, 30);

  text("Focus", 540, 30);

  fill(100);
  rect(600, 20, 200, 16);

  let state = getFocusState();

  fill(state.color);
  rect(600, 20, focus * 2, 16);
}

function drawTaskPanel() {
  if (!activeTask) return;

  let padding = 40;
  let wordWidth = currentWord.length * 20;
  let boxWidth = max(220, wordWidth + padding);

  let boxX = width / 2 - boxWidth / 2;
  let boxY = height / 2 - 100;
  let centerX = width / 2;

  fill(40);
  rect(boxX, boxY, boxWidth, 200, 10);

  textAlign(CENTER, CENTER);

  // build display text FIRST
  let displayText = "";
  for (let i = 0; i < currentWord.length; i++) {
    if (i < typedText.length) {
      displayText += currentWord[i] + " ";
    } else {
      displayText += "_ ";
    }
  }

  // title
  fill(255);
  textSize(18);
  text("TYPE THE WORD", centerX, boxY + 40);

  // faint word
  fill(120);
  textSize(20);
  text(currentWord, centerX, boxY + 80);

  // progress
  fill(255);
  textSize(28);
  text(displayText, centerX, boxY + 120);
}

function drawMenu() {
  background(5);

  drawStars(); // background particles
  drawBorder(); // glowing frame
  drawMenuText(); // all text
}

function drawWin() {
  background(20);

  fill(255);

  textSize(40);

  textAlign(CENTER);

  text("YOU COMPLETED ALL LEVELS!", width / 2, 300);
}

function drawLose() {
  background(0);

  fill(255);

  textAlign(CENTER);

  textSize(40);
  text("OVERWHELMED", width / 2, 260);

  textSize(20);
  text("Too many distractions drained your focus.", width / 2, 310);

  drawRetryButton();
}

function drawRetryButton() {
  fill(255);
  rect(width / 2 - 80, 360, 160, 50);

  fill(0);
  textSize(20);
  text("TRY AGAIN", width / 2, 392);
}

function drawLevelMap() {
  background(0);

  strokeWeight(4);

  if (level === 1) stroke(0, 255, 180);
  if (level === 2) stroke(255, 200, 0);
  if (level === 3) stroke(255, 80, 120);

  noFill();

  rect(40, 60, width - 80, height - 120);
}
