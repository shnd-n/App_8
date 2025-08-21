const pet = document.getElementById('pet');
let dx = 2, dy = 1;

function movePet() {
  const rect = pet.getBoundingClientRect();
  let x = rect.left + dx;
  let y = rect.top + dy;

  if (x < 0 || x + rect.width > window.innerWidth) dx *= -1;
  if (y < 0 || y + rect.height > window.innerHeight) dy *= -1;

  pet.style.left = x + "px";
  pet.style.top = y + "px";

  requestAnimationFrame(movePet);
}

movePet();

// 드래그 기능 추가
let isDragging = false, offsetX, offsetY;

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
