class Player {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.anim = 0;
    this.locked = false;
  }

  update() {
    if (this.locked) return;

    let speed = 4;

    if (keyIsDown(87)) this.y -= speed;
    if (keyIsDown(83)) this.y += speed;
    if (keyIsDown(65)) this.x -= speed;
    if (keyIsDown(68)) this.x += speed;
  }

  draw() {
    this.anim += 0.1;

    let bounce = sin(this.anim) * 2;

    push();

    translate(this.x, this.y + bounce);

    let state = getFocusState();

    // face outline
    stroke(state.color);
    strokeWeight(3);
    fill(0);
    ellipse(0, 0, 40);

    // eyes
    fill(state.color);
    noStroke();
    ellipse(-7, -5, 6);
    ellipse(7, -5, 6);

    // mouth
    stroke(state.color);
    strokeWeight(3);
    noFill();

    if (state.mood === "happy") {
      arc(0, 5, 20, 15, 0, PI);
    } else if (state.mood === "ok") {
      line(-8, 8, 8, 8);
    } else {
      arc(0, 12, 20, 15, PI, TWO_PI);
    }
    pop();
  }
}
