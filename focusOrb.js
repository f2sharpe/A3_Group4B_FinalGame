class FocusOrb {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    // ✅ ADD THESE TWO LINES
    this.spawnX = x;
    this.spawnY = y;

    this.anim = random(100);
  }

  update() {
    this.anim += 0.05;

    // gentle floating motion
    this.x += sin(this.anim) * 0.5;
    this.y += cos(this.anim * 1.2) * 0.5;

    // keep near spawn point
    let dx = this.x - this.spawnX;
    let dy = this.y - this.spawnY;

    let distFromHome = sqrt(dx * dx + dy * dy);

    let maxRadius = 40;

    if (distFromHome > maxRadius) {
      // pull back toward spawn
      this.x -= dx * 0.02;
      this.y -= dy * 0.02;
    }
  }

  draw() {
    let pulse = sin(this.anim) * 5;

    stroke(0, 255, 255);
    strokeWeight(3);
    noFill();

    ellipse(this.x, this.y, 35 + pulse);

    fill(0, 255, 255);
    noStroke();

    textSize(18);
    textAlign(CENTER);
    text("+", this.x, this.y + 6);

    if (dist(player.x, player.y, this.x, this.y) < 40) {
      focus = min(100, focus + 25);

      this.collected = true;

      spawnParticles(this.x, this.y);
    }
  }
}
