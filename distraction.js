class Distraction {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.anim = random(100);
  }

  update() {
    this.anim += 0.1;

    let speed = 0.004;

    // speed up if player doing task
    if (activeTask) {
      speed = 0.015;
    }

    let dx = player.x - this.x;
    let dy = player.y - this.y;

    // reverse direction if in safe zone
    if (playerInSafeZone) {
      dx *= -1;
      dy *= -1;
    }

    this.x += dx * speed;
    this.y += dy * speed;
  }

  draw() {
    let pulse = sin(this.anim) * 4;

    stroke(255, 80, 80);
    strokeWeight(3);
    noFill();

    ellipse(this.x, this.y, 50 + pulse);

    noStroke();
    fill(255);
    textAlign(CENTER);
    textSize(16);
    text("!", this.x, this.y + 5);

    if (dist(player.x, player.y, this.x, this.y) < 50) {
      focus -= 0.15;

      shake = 8;
    }
  }
}
