// Constants
const THRESHOLD = 20;
const STRENGTH = 200;
const PERSPECTIVE = 1000;
const BRIGHTNESS = 1;
const SHADOW_COLOR = '#9f85ff';
const HOVER_WIDTH = '160px';
const HOVER_HEIGHT = '213.3px';
const ANGLE = 0.5;
const BLOB_MIN_SIZE = 300;
const BLOB_MAX_SIZE = 1050;
const BLOB_MIN_POSITION = -30;
const BLOB_MAX_POSITION = 100;
const LAZY_SPEED = 0.05;

// Elements
let cards = document.getElementsByClassName('card');
const wrapperElement = document.getElementById('wrapper');
const cursorElement = document.getElementById('cursor');

// Cursor object
const cursor = {
  x: 0,
  y: 0,
  lazyX: 0,
  lazyY: 0,
  lazySpeed: LAZY_SPEED,
  highlightScale: 0,
  lazyHighlightScale: 0,
};

// Helper functions
const lerp = (x, y, t) => {
  return (1 - t) * x + t * y;
};

const rotate = (cursorPosition, centerPosition, threshold = THRESHOLD) => {
  if (cursorPosition - centerPosition >= 0) {
    return cursorPosition - centerPosition >= threshold
      ? threshold
      : cursorPosition - centerPosition;
  } else {
    return cursorPosition - centerPosition <= -threshold
      ? -threshold
      : cursorPosition - centerPosition;
  }
};

const brightness = (cursorPositionY, centerPositionY, strength = STRENGTH) => {
  return 1 - rotate(cursorPositionY, centerPositionY) / strength;
};

// Event handlers
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

// Main functions
function randomizeBlobs() {
  const blobs = document.querySelectorAll('.blob1, .blob2, .blob3, .blob4, .blob5, .blob6');

  blobs.forEach((blob) => {
    const randomSize = Math.random() * (BLOB_MAX_SIZE - BLOB_MIN_SIZE) + BLOB_MIN_SIZE;
    const randomLeft = Math.random() * BLOB_MAX_POSITION;
    const randomBottom = Math.random() * BLOB_MAX_POSITION + BLOB_MIN_POSITION;

    blob.style.width = `${randomSize}px`;
    blob.style.height = `${randomSize}px`;
    blob.style.left = `${randomLeft}%`;
    blob.style.bottom = `${randomBottom}%`;
  });
}

function handleCardInteractions() {
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
}

// Initialization
window.onload = () => {
  randomizeBlobs();
  handleCardInteractions();
};
