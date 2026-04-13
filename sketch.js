let state = "menu";
let level = 1;

let player;

let tasks = [];
let distractions = [];

let focus = 100;
let timer = 60;

let activeTask = null;
let sequence = [];
let progress = 0;

let particles = [];
let focusOrbs = [];
let shake = 0;
let safeSpace = null;
let lastSafeSpawn = -15000; // so first one can spawn immediately
let safeCooldown = 15000; // 15 seconds after one disappears
let playerInSafeZone = false;

let menuMusic;
let taskCompleteSound;
let taskFailSound;
let safeZoneSound;
let wordLists = {
  1: [
    // EASY (3–5 letters)
    "cat",
    "joe",
    "dog",
    "pen",
    "book",
    "desk",
    "lamp",
    "chair",
    "phone",
    "water",
    "clock",
    "mouse",
    "paper",
    "light",
    "plant",
    "table",
    "bag",
    "cup",
    "door",
    "floor",
    "wall",
    "glass",
    "shirt",
    "shoes",
    "bread",
    "toast",
    "juice",
    "apple",
    "grape",
    "peach",
    "snack",
    "notes",
    "study",
    "learn",
    "write",
    "draw",
    "think",
    "focus",
    "start",
    "begin",
    "again",
    "sofia",
    "karen",
    "david",
  ],

  2: [
    // MEDIUM (5–8 letters)
    "focus",
    "brain",
    "energy",
    "memory",
    "effort",
    "mental",
    "typing",
    "allison",
    "reading",
    "writing",
    "working",
    "balance",
    "control",
    "routine",
    "process",
    "problem",
    "project",
    "deadline",
    "meeting",
    "message",
    "reminder",
    "organize",
    "prepare",
    "improve",
    "develop",
    "practice",
    "analyze",
    "reflect",
    "connect",
    "support",
    "progress",
    "schedule",
    "priority",
    "attention",
    "disrupt",
    "mistake",
    "restart",
    "attempt",
    "complete",
    "continue",
    "struggle",
    "fintan",
  ],

  3: [
    // HARD (8–14 letters)
    "attention",
    "distraction",
    "overwhelm",
    "mercedes",
    "concentration",
    "productivity",
    "organization",
    "responsibility",
    "procrastination",
    "interruption",
    "multitasking",
    "forgetfulness",
    "restlessness",
    "hyperactivity",
    "inconsistency",
    "frustration",
    "motivation",
    "stimulation",
    "prioritization",
    "decisionmaking",
    "selfregulation",
    "cognitive",
    "processing",
    "performance",
    "persistence",
    "management",
    "adaptation",
    "expectation",
    "limitation",
    "accountability",
    "environment",
    "commitment",
    "evaluation",
    "implementation",
    "optimization",
    "coordination",
    "complexity",
  ],
};
let currentWord = "";
let typedText = "";

function setup() {
  createCanvas(windowWidth, windowHeight);
  player = new Player();
  initLevel();
  initStars();
}

function isTooClose(x, y, others, minDist) {
  for (let o of others) {
    let d = dist(x, y, o.x, o.y);
    if (d < minDist) return true;
  }
  return false;
}

function drawMenuText() {
  textAlign(CENTER, CENTER);

  // glowing title
  for (let i = 0; i < 5; i++) {
    fill(0, 255, 200, 30);
    textSize(70);
    text("FOCUS FRENZY", width / 2, 180);
  }

  // instructions
  textSize(22);
  fill(220);

  let y = height / 2 - 60;
  let lineSpacing = 35;

  let instructions = [
    "Move with WASD",
    "Hover character over tasks to start them",
    "Type the correct word to finish",
    "Distractions will chase you",
    "Safe spaces will spawn to protect you from enemies",
    "",
    "Complete all tasks before your focus runs out",
  ];

  for (let i = 0; i < instructions.length; i++) {
    text(instructions[i], width / 2, y + i * lineSpacing);
  }

  // glowing SPACE text
  let pulse = sin(frameCount * 0.05) * 50 + 150;

  fill(0, 255, 200, pulse);
  textSize(26);
  text("Press SPACE to start", width / 2, height - 120);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  let sx = width / 1000;
  let sy = height / 650;
  if (state === "menu") {
    drawMenu();
    if (!menuMusic.isPlaying()) {
      menuMusic.loop();
      menuMusic.setVolume(0.4);
    }
  }
  if (state === "game") {
    runGame();
    if (menuMusic.isPlaying()) {
      menuMusic.stop();
    }
  }
  if (state === "win") {
    drawWin();
    if (menuMusic.isPlaying()) {
      menuMusic.stop();
    }
  }
  if (state === "lose") {
    drawLose();
    if (menuMusic.isPlaying()) {
      menuMusic.stop();
    }
  }
  if (state === "levelStart") {
    drawLevelStartScreen();
    if (menuMusic.isPlaying()) {
      menuMusic.stop();
    }
  }
  if (state === "game") {
    if (menuMusic.isPlaying()) {
      menuMusic.stop();
    }
    // RESET FLAG
    playerInSafeZone = false;

    // ONLY LEVEL 2+
    if (level >= 2) {
      // spawn ONLY if none exists AND cooldown passed
      if (!safeSpace && millis() - lastSafeSpawn > safeCooldown) {
        safeSpace = new SafeSpace(tasks);
      }

      // update if exists
      if (safeSpace) {
        safeSpace.update(player);
        safeSpace.display();

        if (safeSpace.playerInside) {
          playerInSafeZone = true;
        }

        // remove when done + start cooldown
        if (safeSpace.isDone()) {
          safeSpace = null;
          lastSafeSpawn = millis();
        }
      }
    }
  }
}

function runGame() {
  push();

  // screen shake
  translate(random(-shake, shake), random(-shake, shake));

  drawLevelMap();

  // player
  player.update();
  player.draw();

  // tasks
  for (let t of tasks) {
    t.draw();
    t.checkHover();
  }

  // distractions spawn
  spawnDistractions();

  // distractions
  for (let d of distractions) {
    d.update();
    d.draw();
  }

  // UI
  drawTaskPanel();
  drawUI();

  // timer + lose condition
  timer -= deltaTime / 1000;

  if (timer <= 0 || focus <= 0) {
    state = "lose";
    safeSpace = null;
    lastSafeSpawn = -15000;
  }

  // win / next level
  if (tasks.every((t) => t.done)) {
    level++;

    if (level > 3) {
      state = "win";
    } else {
      initLevel();
      state = "levelStart";
    }
  }

  // particles
  for (let p of particles) {
    p.update();
    p.draw();
  }

  particles = particles.filter((p) => p.life > 0);

  // focus orbs
  if (frameCount % 900 === 0) {
    focusOrbs.push(
      new FocusOrb(random(100, width - 100), random(100, height - 100)),
    );
  }

  for (let o of focusOrbs) {
    o.update();
    o.draw();
  }

  focusOrbs = focusOrbs.filter((o) => !o.collected);

  pop();

  // decay screen shake
  shake *= 0.9;
}
function getFocusState() {
  if (focus > 66) {
    return {
      color: color(0, 255, 150), // green
      mood: "happy",
    };
  } else if (focus > 33) {
    return {
      color: color(255, 200, 0), // yellow
      mood: "ok",
    };
  } else {
    return {
      color: color(255, 80, 80), // red
      mood: "sad",
    };
  }
}

function initLevel() {
  tasks = [];
  distractions = [];

  timer = 70;
  focus = 100;

  for (let i = 0; i < 3 + level; i++) {
    let x, y;
    let tries = 0;

    do {
      x = random(100, width - 100);
      y = random(100, height - 100);
      tries++;
    } while (isTooClose(x, y, tasks, 120) && tries < 50);

    tasks.push(new Task(x, y));
  }
}

function spawnDistractions() {
  if (frameCount % 300 === 0) {
    distractions.push(new Distraction(random(width), random(height)));
  }
}

function mousePressed() {
  if (state === "lose") {
    if (
      mouseX > width / 2 - 80 &&
      mouseX < width / 2 + 80 &&
      mouseY > 360 &&
      mouseY < 410
    ) {
      level = 1;
      state = "menu";
      initLevel();
    }
  }
}

function keyPressed() {
  userStartAudio();
  if (state === "menu" && !menuMusic.isPlaying()) {
    menuMusic.loop();
    menuMusic.setVolume(0.4);
  }
  // typing system
  if (activeTask) {
    if (key.length === 1) {
      typedText += key.toLowerCase();
    }

    // reset if wrong
    if (!currentWord.startsWith(typedText)) {
      if (!taskFailSound.isPlaying()) {
        taskFailSound.play();
      }
      typedText = "";
    }

    // completed word
    if (typedText === currentWord) {
      if (!taskCompleteSound.isPlaying()) {
        taskCompleteSound.play();
      }
      activeTask.done = true;
      spawnParticles(activeTask.x + 20, activeTask.y + 20);

      activeTask = null;
      player.locked = false;

      typedText = "";
    }
  }

  // start game
  if (keyCode === 32 && state === "menu") {
    state = "game";
  }
  if (keyCode === 32 && state === "levelStart") {
    state = "game";
  }
}

function drawLevelStartScreen() {
  safeSpace = null;
  background(5);

  drawStars(); // background particles
  drawBorder(); // glowing frame
  textAlign(CENTER, CENTER);
  fill(0, 255, 200, 30);
  textSize(40);
  text("Level " + level, width / 2, height / 2 - 40);
  fill(0, 255, 200, 30);
  textSize(24);
  text("Press SPACE to start", width / 2, height / 2 + 20);
}

function preload() {
  menuMusic = loadSound("Velvet Romance.mp3");

  taskCompleteSound = loadSound(
    "ES_User Interface, Misc, Completions, Xylophone - Epidemic Sound - 0000-0383.wav",
  );
  taskFailSound = loadSound(
    "ES_User Interface, Beep, Button Interaction, Deny, Error, Medium, Futuristic, Scifi, Variations 01 - Epidemic Sound - 0000-0385.wav",
  );
  safeZoneSound = loadSound(
    "Games, Video, Retro, 8 Bit, Level Complete Tone.mp3",
  );
}
