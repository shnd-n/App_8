const pet = document.getElementById("pet");

function randomAction() {
  const actions = ["walk", "jump", "sit"];
  const choice = actions[Math.floor(Math.random() * actions.length)];

  if (choice === "walk") {
    // 화면 너비 내에서 무작위 위치로 이동
    let x = Math.random() * (window.innerWidth - 50); // 여백 빼줌
    pet.style.transform = `translate(${x}px, 0)`;
  } 
  else if (choice === "jump") {
    // 점프 애니메이션
    pet.style.transform = `translateY(-80px)`;
    setTimeout(() => {
      pet.style.transform = `translateY(0)`;
    }, 500);
  } 
  else if (choice === "sit") {
    // 앉은 상태 (표정 변경)
    pet.textContent = "😺"; 
    setTimeout(() => {
      pet.textContent = "🐱"; 
    }, 1500);
  }
}

// 2초마다 랜덤 행동 실행
setInterval(randomAction, 2000);
