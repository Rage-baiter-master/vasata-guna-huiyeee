let bat = {
  x: 0,
  y: 0
};

let boss = {
  x: 240,
  y: 180,
  active: false,
  health: 15,
  maxHealth: 15,
  spawnTime: 0,
  lastDrainTime: 0,
  lastSpawnedAtScore: 0
};

let score = 1;
let spawnTime = 0;
let batDuration = 1500; // 1.5 seconds per bat

function setup() {
  createCanvas(480, 360);
  spawnNewBat();
}

function spawnNewBat() {
  bat.x = random(60, 420);
  bat.y = random(60, 220);
  spawnTime = millis();
}

function spawnBoss() {
  boss.active = true;
  boss.health = boss.maxHealth;
  boss.x = width / 2;
  boss.y = height / 2 - 20;
  boss.spawnTime = millis();
  boss.lastDrainTime = millis();
  boss.lastSpawnedAtScore = score;
}

function draw() {
  // --- 1. BACKGROUND ---
  background(10, 5, 25);

  // --- 2. CUSTOM ENVIRONMENT (Stars, Moon, Graveyard) ---
  fill(255, 255, 200, 150);
  noStroke();
  ellipse(80, 50, 3, 3);
  ellipse(150, 90, 2, 2);
  ellipse(300, 40, 3, 3);
  ellipse(380, 110, 2, 2);
  ellipse(60, 140, 2, 2);

  fill(255, 240, 180);
  ellipse(400, 60, 60, 60);

  fill(30, 20, 45);
  rect(0, 280, 480, 80);

  fill(60, 50, 75);
  rect(100, 250, 30, 40, 10, 10, 0, 0);
  rect(240, 240, 35, 50, 10, 10, 0, 0);
  rect(360, 260, 25, 30, 10, 10, 0, 0);

  // --- 3. GAME OVER SCREEN ---
  if (score < 0) {
    fill(255, 50, 50);
    textSize(40);
    textFont('Georgia');
    textAlign(CENTER, CENTER);
    text('GAME OVER', width / 2, height / 2 - 20);
    
    fill(255);
    textSize(16);
    text('Click anywhere to try again', width / 2, height / 2 + 30);
    return; 
  }

  // --- 4. CHECK FOR BOSS ---
  // Only spawn when score is positive, divisible by 10, and hasn't already spawned for this score
  if (!boss.active && score > 0 && score % 10 === 0 && boss.lastSpawnedAtScore !== score) {
    spawnBoss();
  }

  // --- 5. GAMEPLAY LOGIC (Boss vs Normal Bat) ---
  if (boss.active) {
    // Every second the boss is on screen, lose 2 points
    if (millis() - boss.lastDrainTime > 1000) {
      score -= 2;
      boss.lastDrainTime = millis();
    }

    // Draw Boss
    drawBoss(boss.x, boss.y);

  } else {
    // Normal Bat Timer
    if (millis() - spawnTime > batDuration) {
      score--; 
      spawnNewBat();
    }
    // Draw Normal Bat
    drawBat(bat.x, bat.y);
  }

  // --- 6. UI & SCOREBOARD ---
  fill(255);
  textSize(18);
  textFont('Georgia');
  textAlign(LEFT, BASELINE);
  text('Bats Caught: ' + score, 15, 30);
}

// Custom Bat Creature Function
function drawBat(x, y) {
  fill(20, 15, 25);
  stroke(255, 200, 0);
  strokeWeight(2);
  
  triangle(x, y, x - 30, y - 15, x - 10, y + 10);
  triangle(x, y, x + 30, y - 15, x + 10, y + 10);
  
  noStroke();
  fill(20, 15, 25);
  ellipse(x, y, 16, 26);
  
  fill(255, 0, 0);
  ellipse(x - 3, y - 5, 3, 3);
  ellipse(x + 3, y - 5, 3, 3);
}

// Custom Boss Creature Function
function drawBoss(x, y) {
  // Boss Glow Effect
  noStroke();
  fill(150, 0, 255, 80);
  ellipse(x, y, 130, 130);

  // Boss Body
  fill(120, 20, 200);
  stroke(255, 255, 0);
  strokeWeight(3);
  ellipse(x, y, 100, 100);

  // Boss Face / Eyes
  noStroke();
  fill(255, 255, 0);
  ellipse(x - 20, y - 10, 20, 10);
  ellipse(x + 20, y - 10, 20, 10);

  // Health Bar Background
  fill(50);
  rect(x - 50, y - 75, 100, 12, 5);

  // Health Bar Fill
  fill(0, 255, 0);
  let healthWidth = map(boss.health, 0, boss.maxHealth, 0, 100);
  rect(x - 50, y - 75, healthWidth, 12, 5);

  // Boss Health Text
  fill(255);
  textSize(12);
  textAlign(CENTER, CENTER);
  text('BOSS HP: ' + boss.health, x, y - 92);
}

function mousePressed() {
  // Restart the game if on Game Over screen
  if (score < 0) {
    score = 1;
    boss.active = false;
    boss.lastSpawnedAtScore = 0;
    spawnNewBat();
    return;
  }

  // If Boss is active, clicks damage the boss
  if (boss.active) {
    if (dist(mouseX, mouseY, boss.x, boss.y) < 55) {
      boss.health--;
      
      // Check if Boss is defeated
      if (boss.health <= 0) {
        score = score * 2; // Double current score reward
        boss.active = false; // Boss defeated
        spawnNewBat();
      }
    } else {
      // Missing the boss costs a point
      score--;
    }
  } 
  // Normal Bat gameplay
  else {
    if (dist(mouseX, mouseY, bat.x, bat.y) < 30) {
      score++; 
      spawnNewBat();
    } else {
      score--; 
      spawnNewBat();
    }
  }
}