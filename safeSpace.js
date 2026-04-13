class SafeSpace {
  constructor(tasks) {
    // keep away from edges
    let margin = 100;
    let valid = false;
    let tries = 0;

    while (!valid && tries < 50) {
      this.x = random(margin, width - margin);
      this.y = random(margin, height - margin);

      valid = true;

      for (let t of tasks) {
        if (dist(this.x, this.y, t.x, t.y) < 120) {
          valid = false;
          break;
        }
      }

      tries++;
    }

    this.maxSize = 80;
    this.size = this.maxSize;
    this.triggered = false;
    this.duration = 10000; // 10 seconds inside
    this.timeInside = 0;

    this.active = true;
    this.playerInside = false;
  }

  update(player) {
    if (!this.active) return;

    // check if player is inside
    this.playerInside =
      player.x > this.x - this.size / 2 &&
      player.x < this.x + this.size / 2 &&
      player.y > this.y - this.size / 2 &&
      player.y < this.y + this.size / 2;

    // 🚀 ONCE player enters → trigger permanently
    if (this.playerInside && !this.triggered) {
      this.triggered = true;
      if (safeZoneSound) safeZoneSound.play();
    }

    // ⏳ IF triggered → timer ALWAYS runs
    if (this.triggered) {
      this.timeInside += deltaTime;

      let progress = this.timeInside / this.duration;
      this.size = this.maxSize * (1 - progress);

      // optional heal ONLY while inside
      if (this.playerInside) {
        if (player.focus !== undefined && player.maxFocus !== undefined) {
          player.focus = min(player.focus + 0.05, player.maxFocus);
        }
      }

      if (this.timeInside >= this.duration) {
        this.active = false;
      }
    }
  }

  display() {
    if (!this.active) return;

    push();
    rectMode(CENTER);
    noStroke();
    fill(0, 150, 255, 180);
    // glow outline
    stroke(0, 200, 255);
    strokeWeight(3);
    noFill();
    rect(this.x, this.y, this.size + 10);
    if (this.triggered) {
      fill(0, 200 + sin(frameCount * 0.2) * 55, 255);
    }
    // main square
    noStroke();
    fill(0, 150, 255, 180);
    rect(this.x, this.y, this.size);

    // TIMER TEXT
    let secondsLeft = max(0, ceil((this.duration - this.timeInside) / 1000));

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(16);
    text(secondsLeft, this.x, this.y);

    pop();
  }

  isDone() {
    return !this.active;
  }
}
