const pet = document.getElementById("pet");
const emojiImg = document.getElementById("emoji-img");
let emojiTimeout = null;
let posX = 0; 
let animInterval = null; 
let moveInterval = null; 
let facing = 1; 

// 스프라이트 애니메이션 실행 (이미지 경로 포함)
function animateSprite(imgPath, startFrame, endFrame, frameWidth, speed) {
  if (animInterval) clearInterval(animInterval);

  // 스프라이트 이미지 교체
  pet.style.backgroundImage = `url(${imgPath})`;

  let currentFrame = startFrame;
  animInterval = setInterval(() => {
    pet.style.backgroundPosition = `-${currentFrame * frameWidth}px 0`;
    currentFrame++;
    if (currentFrame > endFrame) currentFrame = startFrame; // 루프
  }, speed);
}

// 이동하면서 걷기
function walkTo(targetX) {
  animateSprite("images/actions/walk.png", 0, 2, 32, 200); // 걷기 시트
  const speed = 2;

  if (targetX < posX) facing = -1;
  else facing = 1;

  pet.style.transform = `scaleX(${facing})`;

  if (moveInterval) clearInterval(moveInterval);
  moveInterval = setInterval(() => {
    if (Math.abs(posX - targetX) <= speed) {
      clearInterval(moveInterval);
      posX = targetX;
      pet.style.left = posX + "px";
      clearInterval(animInterval);
      return;
    }

    if (posX < targetX) posX += speed;
    else posX -= speed;

    pet.style.left = posX + "px";
  }, 20);
}

// 앉기
function sit() {
  animateSprite("images/actions/sit.png", 0, 2, 32, 300); // 앉기 시트
  setTimeout(() => clearInterval(animInterval), 2000);
}

// 점프
function jump() {
  animateSprite("images/actions/jump.png", 0, 2, 32, 150); // 점프 시트
  pet.style.transition = "transform 0.5s";
  pet.style.transform = `scaleX(${facing}) translateY(-80px)`;
  setTimeout(() => {
    pet.style.transform = `scaleX(${facing}) translateY(0)`;
    clearInterval(animInterval);
  }, 500);
}

function ex_mark() {
  // 애니메이션 반복 멈추기
  if (animInterval) clearInterval(animInterval);

  // 이동 멈추기
  if (moveInterval) clearInterval(moveInterval);

  animateSprite("images/actions/ex_mark.png", 0, 2, 32, 150); // ! 시트
  pet.style.transition = "transform 0.5s";
  pet.style.transform = `scaleX(${facing}) translateY(-80px)`;
  setTimeout(() => {
    pet.style.transform = `scaleX(${facing}) translateY(0)`;
    clearInterval(animInterval);
  }, 500);
}

// 이모지 표시 함수
function showEmojiImage(src, duration = 1000) {
  emojiImg.src = src;
  emojiImg.style.display = "block";
  emojiImg.style.opacity = 1;

  // 이모지가 사라지는 시간 설정
  if (emojiTimeout) clearTimeout(emojiTimeout);
  emojiTimeout = setTimeout(() => {
    emojiImg.style.opacity = 0;
    setTimeout(() => {
      emojiImg.style.display = "none";
    }, 300);
  }, duration);

  // 위치 업데이트 시작
  updateEmojiPosition();
}

// 펫 위치에 따라 이모지 위치 업데이트
function updateEmojiPosition() {
  const petRect = pet.getBoundingClientRect();
  emojiImg.style.left = petRect.left + petRect.width / 2 - emojiImg.width / 2 + "px";
  emojiImg.style.top = petRect.top - 10 + "px";

  emojiImg.style.transform = `scaleX(${facing})`;

  // 이모지가 사라지기 전까지 계속 갱신
  if (emojiImg.style.display === "block") {
    requestAnimationFrame(updateEmojiPosition);
  }
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
