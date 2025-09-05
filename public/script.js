const pet = document.getElementById("pet");
const emojiImg = document.getElementById("emoji-img");
const toggleBtn = document.getElementById("toggleInventory");
const inventory = document.getElementById("inventory");
const inventoryGrid = document.getElementById("inventoryGrid");
const totalSlots = 16;        // 총 슬롯 수
let emojiTimeout = null;
let posX = 0; 
let animInterval = null; 
let moveInterval = null; 
let facing = 1; 
let currentAction = "idle"; // 현재 펫 상태: idle, walk, sit, jump, ex_mark 등
let actionTimeout = null;

function stopAllActions() {
  if (animInterval) { clearInterval(animInterval); animInterval = null; }
  if (moveInterval) { clearInterval(moveInterval); moveInterval = null; }
  if (actionTimeout) { clearTimeout(actionTimeout); actionTimeout = null; }
}

const itemPool = [
  { name: "사과", description: "맛있는 빨간 사과", src: "images/items/apple.png" },
  { name: "바나나", description: "노란 바나나", src: "images/items/banana.png" }
];

// 행동 목록 (자연스러운 확률 분포)
const actions = [
  { name: "walk", weight: 40 },   // 자주 걷기
  { name: "sit", weight: 20 },    // 앉기
  { name: "jump", weight: 10 },   // 점프 (드물게)
  { name: "idle", weight: 30 }    // 가만히 있기
];

// === 스프라이트 애니메이션 함수 ===
function animateSprite(imgPath, startFrame, endFrame, frameWidth, speed, loop = true) {
  if (animInterval) clearInterval(animInterval);
  pet.style.backgroundImage = `url(${imgPath})`;

  let currentFrame = startFrame;
  animInterval = setInterval(() => {
    pet.style.backgroundPosition = `-${currentFrame * frameWidth}px 0`;
    currentFrame++;
    if (currentFrame > endFrame) {
      if (loop) currentFrame = startFrame;
      else clearInterval(animInterval);
    }
  }, speed);
}

// === 걷기 ===
function walkTo(targetX) {
  if (currentAction !== "idle") return; // 다른 행동 중이면 무시
  currentAction = "walk";

  if (animInterval) clearInterval(animInterval);
  if (moveInterval) clearInterval(moveInterval);

  animateSprite("images/actions/walk.png", 0, 2, 32, 200);

  let currentX = pet.offsetLeft;
  facing = targetX > currentX ? 1 : -1;
  pet.style.transform = `scaleX(${facing})`;

  moveInterval = setInterval(() => {
    const speed = 2;
    if (Math.abs(currentX - targetX) <= speed) {
      clearInterval(moveInterval);
      currentX = targetX;
      pet.style.left = currentX + "px";

      if (animInterval) clearInterval(animInterval);
      pet.style.backgroundImage = "url(images/actions/idle.png)";
      pet.style.backgroundPosition = "0 0";
      currentAction = "idle"; // 행동 종료
      return;
    }

    currentX += currentX < targetX ? speed : -speed;
    pet.style.left = currentX + "px";
  }, 20);
}



// === 앉기 ===
function sit() {
  if (currentAction !== "idle") return;
  currentAction = "sit";

  stopAllActions(); // 이전 액션의 인터벌/타임아웃 정리
  animateSprite("images/actions/sit.png", 0, 2, 32, 300, false);

  actionTimeout = setTimeout(() => {
    if (animInterval) { clearInterval(animInterval); animInterval = null; }
    pet.style.backgroundImage = "url(images/actions/idle.png)";
    pet.style.backgroundPosition = "0 0";
    currentAction = "idle";
    actionTimeout = null;
  }, 2000 + Math.random() * 2000);
}

// === 점프 ===
function jump() {
  if (currentAction !== "idle") return;
  currentAction = "jump";

  stopAllActions();
  animateSprite("images/actions/jump.png", 0, 2, 32, 150, false);

  pet.style.transition = "transform 0.5s";
  pet.style.transform = `scaleX(${facing}) translateY(-80px)`;

  actionTimeout = setTimeout(() => {
    pet.style.transform = `scaleX(${facing}) translateY(0)`;
    if (animInterval) { clearInterval(animInterval); animInterval = null; }
    pet.style.backgroundImage = "url(images/actions/idle.png)";
    pet.style.backgroundPosition = "0 0";
    currentAction = "idle";
    actionTimeout = null;
  }, 500);
}


// === 느낌표 ===
function ex_mark() {
  if (currentAction === "ex_mark") return; // 이미 실행 중이면 무시

  // 진행 중인 어떤 행동이든 즉시 중단
  stopAllActions();
  currentAction = "ex_mark";

  animateSprite("images/actions/ex_mark.png", 0, 2, 32, 150); // 루프는 clear로 정리
  pet.style.transition = "transform 0.5s";
  pet.style.transform = `scaleX(${facing}) translateY(-80px)`;

  actionTimeout = setTimeout(() => {
    pet.style.transform = `scaleX(${facing}) translateY(0)`;
    if (animInterval) { clearInterval(animInterval); animInterval = null; }
    pet.style.backgroundImage = "url(images/actions/idle.png)";
    pet.style.backgroundPosition = "0 0";
    currentAction = "idle";
    actionTimeout = null;
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
    renderInventory(); // 버튼 눌렀을 때 렌더링도 함께
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
  inventoryGrid.innerHTML = "";
  for (let i = 0; i < totalSlots; i++) {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");

    const item = inventoryItems[i];
    if (item) {
      const img = document.createElement("img");
      img.src = item.imgSrc;
      img.alt = item.name;

      // 드래그 가능하게 설정
      img.draggable = true;
      img.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("application/json", JSON.stringify(item));
      });

      // 아이템 클릭 시 인벤토리 드래그 막기
      img.addEventListener("mousedown", (e) => e.stopPropagation());

      // 툴팁 요소 추가
      const tooltip = document.createElement("div");
      tooltip.classList.add("tooltip");
      tooltip.innerHTML = `<strong>${item.name}</strong><br>${item.description}`;

      itemDiv.appendChild(img);
      itemDiv.appendChild(tooltip);

      // **우클릭으로 아이템 삭제 (id 기준)**
      itemDiv.addEventListener("contextmenu", (e) => {
        e.preventDefault(); // 기본 우클릭 메뉴 방지
        inventoryItems = inventoryItems.filter(it => it.id !== item.id);
        saveInventory();
        renderInventory();
      });
    } else {
      itemDiv.classList.add("empty");
    }

    inventoryGrid.appendChild(itemDiv);
  }
}
// 랜덤 아이템 뽑기
function getRandomItem() {
  const randomIndex = Math.floor(Math.random() * itemPool.length);
  return itemPool[randomIndex];
}


// 아이템 추가
function addItemToInventory(name, description, imgSrc) {
  if (inventoryItems.length >= totalSlots) {
    alert("인벤토리가 가득 찼습니다!");
    return;
  }

  const newItem = {
    id: Date.now() + Math.random().toString(16).slice(2), // 고유 id
    name,
    description,
    imgSrc
  };

  inventoryItems.push(newItem);
  saveInventory();
  renderInventory();
}

// === 펫 먹이기 ===
function feedPet(item) {
  // 인벤토리에서 제거
  inventoryItems = inventoryItems.filter(it => it.id !== item.id);
  saveInventory();
  renderInventory();

  // 먹는 애니메이션 (eat.png 필요)
  animateSprite("images/actions/eat.png", 0, 2, 32, 200, false);

  // 하트 이모지 표시
  showEmojiImage("images/icons/heart.png", 1000);

  // 일정 시간 후 idle로 복귀
  setTimeout(() => {
    pet.style.backgroundImage = "url(images/actions/idle.png)";
    pet.style.backgroundPosition = "0 0";
    currentAction = "idle";
  }, 1500);
}

// === 드래그 앤 드롭: 펫이 드롭 영역 ===
pet.addEventListener("dragover", (e) => {
  e.preventDefault(); // 드롭 허용
});

pet.addEventListener("drop", (e) => {
  e.preventDefault();
  const data = JSON.parse(e.dataTransfer.getData("application/json"));
  feedPet(data);
});

function spawnRandomItem() {
  const gameArea = document.getElementById("gameArea"); // 맵 영역 (div 필요)
  
  // 랜덤 아이템 선택
  const randomItem = getRandomItem();

  // DOM 생성
  const item = document.createElement("img");
  item.src = randomItem.src;
  item.classList.add("world-item");

  // 객체 속성 붙이기
  item.dataset.name = randomItem.name;
  item.dataset.description = randomItem.description;

  // 화면 내 랜덤 위치 계산
  const x = Math.random() * (window.innerWidth - 40);
  const y = gameArea.clientHeight - 40;           // 바닥에 고정

  item.style.left = `${x}px`;
  item.style.top = `${y}px`;

  gameArea.appendChild(item);
}

// 페이지 로드 시 실행
window.onload = () => {
  loadInventory();
};

// === 랜덤 행동 ===
function chooseAction() {
  const total = actions.reduce((sum, a) => sum + a.weight, 0);
  let rand = Math.random() * total;
  for (let action of actions) {
    if (rand < action.weight) return action.name;
    rand -= action.weight;
  }
}

// 자연스러운 행동 실행
function randomAction() {
  if (currentAction !== "idle") {
    // 현재 행동이 진행 중이면 대기 후 재시도
    setTimeout(randomAction, 500);
    return;
  }

  const choice = chooseAction();

  if (choice === "walk") {
    const targetX = Math.random() * (window.innerWidth - 100);
    walkTo(targetX);

  } else if (choice === "sit") {
    sit();
    // 앉기 상태 유지 2~4초
    setTimeout(() => {
      if (animInterval) clearInterval(animInterval);
    }, 2000 + Math.random() * 2000);

  } else if (choice === "jump") {
    jump();

  } else if (choice === "idle") {
    // 그냥 가만히 있기 (Idle)
    if (animInterval) clearInterval(animInterval);
    pet.style.backgroundImage = "url(images/actions/idle.png)";
    pet.style.backgroundPosition = "0 0";
    currentAction = "idle";
  }

  // 다음 행동까지 대기 시간 (2~6초 랜덤)
  const nextDelay = 2000 + Math.random() * 4000;
  setTimeout(randomAction, nextDelay);
}

// 초기 실행
setTimeout(randomAction, 2000);

// 일정 시간마다 랜덤 아이템 생성
setInterval(spawnRandomItem, 100000); // 100초마다

function checkCollision() {
  const petRect = pet.getBoundingClientRect();
  const items = document.querySelectorAll(".world-item");

  items.forEach(item => {
    const itemRect = item.getBoundingClientRect();

    // AABB 충돌 체크
    if (
      petRect.left < itemRect.right &&
      petRect.right > itemRect.left &&
      petRect.top < itemRect.bottom &&
      petRect.bottom > itemRect.top
    ) {
      // 충돌 시 인벤토리에 추가
      addItemToInventory(item.dataset.name, item.dataset.description, item.src); // 기존 addItemToInventory 사용
      item.remove(); // 화면에서 제거
    }
  });
}

// 일정 간격마다 충돌 체크
setInterval(checkCollision, 50);


// 인벤토리 드래그 이동 기능
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

inventory.addEventListener("mousedown", (e) => {
  
  // 아이템 클릭 시는 무시
  if (e.target.tagName.toLowerCase() === "img") return;

  isDragging = true;
  offsetX = e.clientX - inventory.offsetLeft;
  offsetY = e.clientY - inventory.offsetTop;
});

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    inventory.style.left = e.clientX - offsetX + "px";
    inventory.style.top = e.clientY - offsetY + "px";
    inventory.style.right = "auto"; // 드래그하면 right 속성 무시
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});
