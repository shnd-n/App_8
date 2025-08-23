const pet = document.getElementById("pet");

function animateSprite(startFrame, endFrame, frameWidth, speed, callback) {
  let currentFrame = startFrame;
  const interval = setInterval(() => {
    pet.style.backgroundPosition = `-${currentFrame * frameWidth}px 0`;
    currentFrame++;
    if (currentFrame > endFrame) {
      clearInterval(interval);
      if (callback) callback();
    }
  }, speed);
}

function randomAction() {
  const actions = ["walk", "sit", "jump"];
  const choice = actions[Math.floor(Math.random() * actions.length)];

  if (choice === "walk") {
    animateSprite(0, 2, 32, 200, () => {}); // 0~2번 프레임: 걷기
    let x = Math.random() * (window.innerWidth - 100);
    pet.style.transform = `translate(${x}px, 0)`;
  } 
  else if (choice === "sit") {
    animateSprite(3, 5, 32, 300, () => {}); // 3~5번 프레임: 앉기
  } 
  else if (choice === "jump") {
    animateSprite(6, 8, 32, 150, () => {   // 6~8번 프레임: 점프
      pet.style.transform = `translateY(-80px)`;
      setTimeout(() => {
        pet.style.transform = `translateY(0)`;
      }, 500);
    });
  }
}

setInterval(randomAction, 2000);
