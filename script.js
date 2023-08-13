const container = document.querySelector(".container");
let mode;
let containerSize = calculateContainerSize();
let colorPicker = document.querySelector(".color-picker");
let color = colorPicker.value;
let isMousePressed = false;

const dimensions = parseInt(
  prompt("enter the number of boxes per row and per column")
);

colorPicker.addEventListener("input", (e) => {
  color = e.target.value;
  console.log(color);
});
//

// Calculate and set the container size
function calculateContainerSize() {
  const viewportWidth = window.innerWidth;
  console.log(viewportWidth);
  if (viewportWidth < 640) {
    return 350;
  } else if (viewportWidth < 1140) {
    return 400;
  } else {
    return 0.35 * viewportWidth;
  }
}

const buttons = document.querySelectorAll("button");

buttons.forEach((button) => {
  button.addEventListener("click", handleButtonClick);
});

function handleButtonClick(e) {
  const button = e.target;

  if (button.value == "OFF") {
    mode = button.className;

    if (mode == "clear") {
      button.style.backgroundColor = "blue";
      setTimeout(() => {
        button.style.backgroundColor = null;
        mode = "";
        clearing();
      }, 500);
    } else {
      button.value = "ON";
      button.style.backgroundColor = "blue";
    }
  } else if (button.value == "ON") {
    mode = "";
    button.value = "OFF";
    button.style.backgroundColor = null;
    button.removeEventListener("click", handleButtonClick);
  }

  buttons.forEach((otherButton) => {
    if (otherButton !== button) {
      otherButton.value = "OFF";
      otherButton.style.backgroundColor = null;
      otherButton.addEventListener("click", handleButtonClick);
    }
  });
}

function createGridItems() {
  containerSize = calculateContainerSize();
  container.style.width = `${containerSize}px`;
  container.style.height = `${containerSize}px`;

  for (let i = 0; i < dimensions * dimensions; i++) {
    const gridItem = document.createElement("div");
    gridItem.classList.add("grid-item");
    gridItem.draggable = false;
    gridItem.style.border = "1px solid black";
    gridItem.style.width = `${containerSize / dimensions - 2}px`;
    gridItem.style.height = `${containerSize / dimensions - 2}px`;
    container.appendChild(gridItem);
  }
}

createGridItems();

// Update container size on window resize
window.addEventListener("resize", () => {
  const newSize = calculateContainerSize();
  if (newSize !== containerSize) {
    if (newSize !== containerSize) {
      container.innerHTML = ""; // Clear existing grid items
      createGridItems(); // Recreate grid items with new size
    }
  }
});

container.addEventListener("mousedown", () => {
  isMousePressed = true;
  container.addEventListener("mouseover", handleMouseOver);
});

// Add a mouseup event listener on the window to handle stopping the actions
window.addEventListener("mouseup", () => {
  isMousePressed = false;
  container.removeEventListener("mouseover", handleMouseOver);
});

function handleMouseOver(e) {
  if (!isMousePressed) return; // Stop if mouse is not pressed
  if (mode === "color-mode") {
    coloring(e);
  } else if (mode === "rainbow-mode") {
    rainbow(e);
  } else if (mode === "darken-mode") {
    darken(e);
  } else if (mode === "lighten-mode") {
    lighten(e);
  } else if (mode === "eraser") {
    erasing(e);
  }
}
function coloring(e) {
  if (isMousePressed && e.target.classList.contains("grid-item")) {
    e.target.style.backgroundColor = color;
  }
}
function erasing(e) {
  if (isMousePressed && e.target.classList.contains("grid-item")) {
    e.target.style.backgroundColor = container.style.backgroundColor;
  }
}
function rainbow(e) {
  if (isMousePressed && e.target.classList.contains("grid-item")) {
    let letters = "0123456789ABCDEF";
    let randoColor = "#";
    for (let i = 0; i < 6; i++) {
      randoColor += letters[Math.floor(Math.random() * 16)];
    }
    e.target.style.backgroundColor = randoColor;
  }
}
function clearing() {
  const gridItems = document.querySelectorAll(".grid-item");
  gridItems.forEach((gridItem) => {
    gridItem.style.backgroundColor = null;
  });
}
