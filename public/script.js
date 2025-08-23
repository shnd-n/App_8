const pet = document.getElementById("pet");
let posX = 0; // 현재 위치 X
let animInterval = null; // 현재 스프라이트 애니메이션
let moveInterval = null; // 이동용 인터벌

// 스프라이트 애니메이션 실행
function animateSprite(startFrame, endFrame, frameWidth, speed) {
  if (animInterval) clearInterval(animInterval);
  let currentFrame = startFrame;
  animInterval = setInterval(() => {
    pet.style.backgroundPosition = `-${currentFrame * frameWidth}px 0`;
    currentFrame++;
    if (currentFrame > endFrame) currentFrame = startFrame; // 루프
  }, speed);
}

// 이동하면서 걷기
function walkTo(targetX) {
  animateSprite(0, 2, 32, 200); // 걷기 프레임
  const speed = 2;

  if (moveInterval) clearInterval(moveInterval);
  moveInterval = setInterval(() => {
    if (Math.abs(posX - targetX) <= speed) {
      clearInterval(moveInterval);
      posX = targetX;
      pet.style.left = posX + "px";
      clearInterval(animInterval); // 걷기 애니멈추기
      return;
    }

    if (posX < targetX) posX += speed;
    else posX -= speed;

    pet.style.left = posX + "px";
  }, 20);
}

// 앉기
function sit() {
  animateSprite(3, 5, 32, 300);
  setTimeout(() => clearInterval(animInterval), 2000); // 2초 후 멈춤
}

// 점프
function jump() {
  animateSprite(6, 8, 32, 150);
  pet.style.transition = "transform 0.5s";
  pet.style.transform = "translateY(-80px)";
  setTimeout(() => {
    pet.style.transform = "translateY(0)";
    clearInterval(animInterval);
  }, 500);
}

// 랜덤 동작
function randomAction() {
  const actions = ["walk", "sit", "jump"];
  const choice = actions[Math.floor(Math.random() * actions.length)];

  if (choice === "walk") {
    const targetX = Math.random() * (window.innerWidth - 100);
    walkTo(targetX);
  } else if (choice === "sit") {
    sit();
  } else if (choice === "jump") {
    jump();
  }
}

setInterval(randomAction, 4000);
