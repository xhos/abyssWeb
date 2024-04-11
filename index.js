const THRESHOLD = 20;
const STRENGTH = 200;
const PERSPECTIVE = 1000;
const BRIGHTNESS = 1;
const SHADOW_COLOR = 'rgba(255, 255, 255, 0.5)';
const HOVER_WIDTH = '160px';
const HOVER_HEIGHT = '213.3px';
const ANGLE = 0.5;

let cards = document.getElementsByClassName('card');

function rotate(cursorPosition, centerPosition, threshold = THRESHOLD) {
  if (cursorPosition - centerPosition >= 0) {
    return cursorPosition - centerPosition >= threshold
      ? threshold
      : cursorPosition - centerPosition;
  } else {
    return cursorPosition - centerPosition <= -threshold
      ? -threshold
      : cursorPosition - centerPosition;
  }
}

function brightness(cursorPositionY, centerPositionY, strength = STRENGTH) {
  return 1 - rotate(cursorPositionY, centerPositionY) / strength;
}

Array.from(cards).forEach((card) => {
  let rect = card.getBoundingClientRect();
  let centerX = rect.left + rect.width / 2;
  let centerY = rect.top + rect.height / 2;
  let originalWidth = getComputedStyle(card).width;
  let originalHeight = getComputedStyle(card).height;

  window.addEventListener('resize', function (event) {
    rect = card.getBoundingClientRect();
    centerX = rect.left + rect.width / 2;
    centerY = rect.top + rect.height / 2;
  });

  card.addEventListener('mousemove', function (event) {
    card.style.transform = `perspective(${PERSPECTIVE}px)
    rotateY(${ANGLE * rotate(event.x, centerX)}deg)
    rotateX(${ANGLE * -rotate(event.y, centerY)}deg) scale(1.1)`;
    card.style.filter = `brightness(${brightness(event.y, centerY)})`;
    card.style.boxShadow = `${-rotate(event.x, centerX)}px ${-rotate(
      event.y,
      centerY
    )}px 80px 0px ${SHADOW_COLOR}`;
  });

  card.addEventListener('mouseleave', function (event) {
    card.style.transform = `perspective(${PERSPECTIVE}px) scale(1)`;
    card.style.width = originalWidth;
    card.style.height = originalHeight;
    card.style.filter = `brightness(${BRIGHTNESS})`;
    card.style.boxShadow = `0 0 0 0 ${SHADOW_COLOR}`;
  });
});
