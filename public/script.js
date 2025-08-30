const pet = document.getElementById("pet");
const emojiImg = document.getElementById("emoji-img");
const toggleBtn = document.getElementById("toggleInventory");
const inventory = document.getElementById("inventory");
const inventoryGrid = document.getElementById("inventoryGrid");
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

toggleBtn.addEventListener("click", () => {
  if (inventory.style.display === "block") {
    inventory.style.display = "none";
  } else {
    inventory.style.display = "block";
  }
});

// 인벤토리 데이터 (배열)
let inventoryItems = [];

// 저장 함수
function saveInventory() {
  localStorage.setItem("inventory", JSON.stringify(inventoryItems));
}

// 불러오기 함수
function loadInventory() {
  const data = localStorage.getItem("inventory");
  if (data) {
    inventoryItems = JSON.parse(data);
    renderInventory();
  }
}

// 인벤토리 렌더링
function renderInventory() {
  inventoryGrid.innerHTML = ""; // 기존 UI 비우기
  inventoryItems.forEach(itemSrc => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");

    const img = document.createElement("img");
    img.src = itemSrc;

    itemDiv.addEventListener("click", () => {
      inventoryItems.splice(index, 1);
      saveInventory();
      renderInventory();
    });

    itemDiv.appendChild(img);
    inventoryGrid.appendChild(itemDiv);
  });
}

// 아이템 추가
function addItemToInventory(itemSrc) {
  if (inventoryItems.length >= 16) {
    alert("인벤토리가 가득 찼습니다!");
    return;
  }
  
  inventoryItems.push(itemSrc);
  saveInventory();
  renderInventory();
}

// 예시: 펫이 사과를 먹음
function petEatApple() {
  addItemToInventory("images/items/apple.png");
}

// 페이지 로드 시 실행
window.onload = () => {
  loadInventory();
};

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
