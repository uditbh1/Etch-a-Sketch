const container = document.querySelector(".container");
let mode;
let containerSize = calculateContainerSize();
let colorPicker = document.querySelector(".color-picker");
let color = colorPicker.value;
let isMousePressed = false;
let label = document.querySelector("label");
let slider = document.getElementById("vol");
let dimensions = slider.value;
let updateTimeout;
const buttons = document.querySelectorAll("button");

//adjusts grid on the basis of slider value by throttling
slider.addEventListener("input", (e) => {
  label.innerText = `Grid-Size(${e.target.value} x ${e.target.value})`;
  dimensions = e.target.value; //new dimensions set on event change
  if (updateTimeout) {
    //updateTimeout is used to decrease rendering pressure on browser by rendering the grid after 0.3s
    clearTimeout(updateTimeout);
  }
  updateTimeout = setTimeout(() => {
    container.innerHTML = ""; // Clear existing grid items
    createGridItems(); // Recreate grid items with new size
    updateTimeout = null;
  }, 300); // Throttle the update
});

//picks color from colorpicker input
colorPicker.addEventListener("input", (e) => {
  if (e.target.value == "#00000") color = "#0a0a0a";
  else color = e.target.value;
  console.log(color);
});

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

//toggles buttons and also changes ui on turning off and on handles clear mode separately
buttons.forEach((button) => {
  button.addEventListener("click", handleButtonClick);
});

function handleButtonClick(e) {
  const button = e.target;
  // Untoggle all buttons
  buttons.forEach((otherButton) => {
    if (otherButton !== button) {
      otherButton.value = "OFF";
      otherButton.style.backgroundColor = "white";
      otherButton.style.color = "black";
    }
  });

  if (button.value == "OFF") {
    mode = button.className;
    //clear mode handled separately
    if (mode == "clear") {
      button.style.backgroundColor = "black";
      button.style.color = "white";
      setTimeout(() => {
        button.style.backgroundColor = "white";
        button.style.color = "black";
        mode = "";
        clearing();
      }, 500);
    } else {
      button.value = "ON";
      button.style.backgroundColor = "black";
      button.style.color = "white";
    }
  } else if (button.value == "ON") {
    mode = "";
    button.value = "OFF";
    button.style.backgroundColor = "white";
    button.style.color = "black";
  }
}

//creates grid acc to the container size and dimensions specified
function createGridItems() {
  containerSize = calculateContainerSize();
  container.style.width = `${containerSize}px`;
  container.style.height = `${containerSize}px`;

  for (let i = 0; i < dimensions * dimensions; i++) {
    const gridItem = document.createElement("div");
    gridItem.classList.add("grid-item");
    gridItem.draggable = false;
    // gridItem.style.border = "1px solid #F5F5F5"; //this can be used to add grid but omitting for now
    gridItem.style.width = `${containerSize / dimensions}px`;
    gridItem.style.height = `${containerSize / dimensions}px`;
    gridItem.style.filter = "brightness(100%)";
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

// Add a mousedown event listener on the container to handle stopping the actions
container.addEventListener("mousedown", () => {
  isMousePressed = true;
  container.addEventListener("mouseover", handleMouseOver);
});

// Add a mouseup event listener on the window to handle stopping the actions
window.addEventListener("mouseup", () => {
  isMousePressed = false;
  container.removeEventListener("mouseover", handleMouseOver);
});

//for hnadling mobile touches//////////////////////////////////////////////
container.addEventListener("touchstart", () => {
  isMousePressed = true;
  container.addEventListener("touchmove", handleTouchMove);
});

// Add a touchend event listener on the window to handle stopping the actions
window.addEventListener("touchend", () => {
  isMousePressed = false;
  container.removeEventListener("touchmove", handleTouchMove);
});

function handleTouchMove(e) {
  // Touch event might have multiple touches, handle each one
  for (const touch of e.changedTouches) {
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (target && target.classList.contains("grid-item")) {
      handleMouseOver({ target });
    }
  }
}
//////////////////////////////////////////////////////////////////////////

//adds mouseover event works when mouse is pressed else returns
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

//function for coloring the grids with selected color
function coloring(e) {
  if (isMousePressed && e.target.classList.contains("grid-item")) {
    e.target.style.filter = `brightness(100%)`;
    e.target.style.backgroundColor = color;
  }
}

//function for erasing the colored griditems
function erasing(e) {
  if (isMousePressed && e.target.classList.contains("grid-item")) {
    e.target.style.filter = `brightness(100%)`;
    e.target.style.backgroundColor = container.style.backgroundColor;
  }
}

//function for coloring the grids with random color
function rainbow(e) {
  if (isMousePressed && e.target.classList.contains("grid-item")) {
    let letters = "0123456789ABCDEF";
    let randoColor = "#";
    for (let i = 0; i < 6; i++) {
      randoColor += letters[Math.floor(Math.random() * 16)]; //returns random hex value
    }
    e.target.style.filter = `brightness(100%)`;
    e.target.style.backgroundColor = randoColor;
  }
}

//function for clearing the whole grid at once
function clearing() {
  const gridItems = document.querySelectorAll(".grid-item");
  gridItems.forEach((gridItem) => {
    gridItem.style.backgroundColor = null;
    gridItem.style.filter = `brightness(100%)`;
  });
}

//function for darkening the color
function darken(e) {
  if (isMousePressed && e.target.classList.contains("grid-item")) {
    const currentBrightness = parseFloat(
      e.target.style.filter.replace(/[^\d.]/g, "")
    );
    const newBrightness = Math.max(currentBrightness - 10, 0);
    e.target.style.filter = `brightness(${newBrightness}%)`;
    //darkens 10% each time mouse is hovered min value 0;
  }
}
function lighten(e) {
  if (isMousePressed && e.target.classList.contains("grid-item")) {
    const currentBrightness = parseFloat(
      e.target.style.filter.replace(/[^\d.]/g, "")
    );
    // const newBrightness = Math.min(currentBrightness + 10, 500);
    const newBrightness = currentBrightness + 40;
    e.target.style.filter = `brightness(${newBrightness}%)`;
    //lightens 40% each time mouse is hovered no max value but when added won't make the color disappear(white);
  }
}
