const THRESHOLD = 20;
const STRENGTH = 200;
const PERSPECTIVE = 1000;
const BRIGHTNESS = 1;
const SHADOW_COLOR = 'rgba(255, 255, 255, 0.5)';
const HOVER_WIDTH = '160px';
const HOVER_HEIGHT = '213.3px';
const ANGLE = 0.5;

let cards = document.getElementsByClassName('card');


function randomizeBlobs() {
  const blobs = document.querySelectorAll(".blob1, .blob2, .blob3, .blob4, .blob5, .blob6");

  blobs.forEach(blob => {
    // Randomize size (adjust ranges as needed)
    const randomSize = Math.random() * 750 + 300;

    // Randomize position
    const randomLeft = Math.random() * 100;
    const randomBottom = Math.random() * 100 - 30; 

    // Apply styles
    blob.style.width = randomSize + "px";
    blob.style.height = randomSize + "px";
    blob.style.left = randomLeft + "%";
    blob.style.bottom = randomBottom + "%";
  });
}
window.onload = randomizeBlobs;
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

const wrapperElement = document.getElementById('wrapper');
const cursorElement = document.getElementById('cursor');

const cursor = {
  x: 0,
  y: 0,
  lazyX: 0,
  lazyY: 0,
  // Configure speed in a 0 to 1 range.
  lazySpeed: 0.05,

  highlightScale: 0,
  lazyHighlightScale: 0,
};

const lerp = (x, y, t) => {
  return (1 - t) * x + t * y;
};

const onMouseEnter = () => {
  cursorElement.classList.remove('hidden');

  cursor.highlightScale = 1;
};

const onMouseLeave = () => {
  cursorElement.classList.add('hidden');

  cursor.highlightScale = 0;
};

const onMouseMove = (e) => {
  cursor.x = e.clientX;
  cursor.y = e.clientY;
};

const animate = () => {
  requestAnimationFrame(animate);

  cursor.lazyX = lerp(cursor.lazyX, cursor.x, cursor.lazySpeed);
  cursor.lazyY = lerp(cursor.lazyY, cursor.y, cursor.lazySpeed);

  cursor.lazyHighlightScale = lerp(cursor.lazyHighlightScale, cursor.highlightScale, 0.1);

  wrapperElement.style.setProperty('--cursorX', `${cursor.x}px`);
  wrapperElement.style.setProperty('--cursorY', `${cursor.y}px`);
  wrapperElement.style.setProperty('--lazyCursorX', `${cursor.lazyX}px`);
  wrapperElement.style.setProperty('--lazyCursorY', `${cursor.lazyY}px`);

  wrapperElement.style.setProperty('--cursorHighlightScale', cursor.lazyHighlightScale);
};

animate();

wrapperElement.addEventListener('mouseenter', onMouseEnter);
wrapperElement.addEventListener('mouseleave', onMouseLeave);
wrapperElement.addEventListener('mousemove', onMouseMove);
