class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.vx = random(-2, 2);
    this.vy = random(-2, 2);

    this.life = 60;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    this.life--;
  }

  draw() {
    stroke(0, 255, 200);
    strokeWeight(2);

    point(this.x, this.y);
  }
}

function spawnParticles(x, y) {
  for (let i = 0; i < 25; i++) {
    particles.push(new Particle(x, y));
  }
}
