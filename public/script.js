const pet = document.getElementById('pet');
let dx = 2, dy = 1;
let isDragging = false, offsetX, offsetY;

// 점프 상태
let isJumping = false;
let jumpHeight = 50;
let jumpSpeed = 5;
let jumpDirection = 1; // 1: 올라감, -1: 내려감

function movePet() {
  const rect = pet.getBoundingClientRect();
  let x = rect.left + dx;
  let y = rect.top + dy;

  // 화면 경계 반전
  if (x < 0 || x + rect.width > window.innerWidth) dx *= -1;
  if (y < 0 || y + rect.height > window.innerHeight) dy *= -1;

  // 랜덤 방향 변경 (1% 확률)
  if (!isDragging && Math.random() < 0.01) {
    dx = (Math.random() - 0.5) * 4;
    dy = (Math.random() - 0.5) * 4;
  }

  // 점프 처리
  if (isJumping) {
    y -= jumpSpeed * jumpDirection;
    if (jumpDirection === 1 && rect.top - jumpHeight <= 0) jumpDirection = -1;
    if (jumpDirection === -1 && rect.top >= window.innerHeight - rect.height) {
      isJumping = false;
      jumpDirection = 1;
    }
  }

  pet.style.left = x + "px";
  pet.style.top = y + "px";

  requestAnimationFrame(movePet);
}

movePet();

// 드래그 기능
pet.addEventListener('mousedown', e => {
  isDragging = true;
  offsetX = e.clientX - pet.offsetLeft;
  offsetY = e.clientY - pet.offsetTop;
});

document.addEventListener('mousemove', e => {
  if (isDragging) {
    pet.style.left = e.clientX - offsetX + "px";
    pet.style.top = e.clientY - offsetY + "px";
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});

// 클릭하면 점프
pet.addEventListener('click', () => {
  if (!isJumping) isJumping = true;
});
