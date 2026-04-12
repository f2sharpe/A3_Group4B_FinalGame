class Task {
  constructor(x, y, icon) {
    this.x = x;
    this.y = y;
    this.icon = icon;
    this.done = false;
  }

  draw() {
    if (this.done) return;

    stroke(0, 255, 150);
    strokeWeight(3);
    noFill();

    rect(this.x, this.y, 40, 40);

    line(this.x, this.y, this.x + 40, this.y + 40);
    line(this.x + 40, this.y, this.x, this.y + 40);
  }

  checkHover() {
    if (this.done) return;
    if (activeTask) return;

    let centerX = this.x + 20;
    let centerY = this.y + 20;

    if (dist(player.x, player.y, centerX, centerY) < 40) {
      startTask(this);
    }
  }
}

function startTask(task) {
  if (activeTask) return;

  activeTask = task;
  player.locked = true;

  currentWord = random(wordLists[level]);
  typedText = "";
}

function randomSequence() {
  let keys = ["W", "A", "S", "D"];

  let seq = [];

  for (let i = 0; i < 3 + level; i++) {
    seq.push(random(keys));
  }

  return seq;
}
