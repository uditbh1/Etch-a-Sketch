const container = document.querySelector(".container");
let containerSize = calculateContainerSize();
const dimensions = parseInt(
  prompt("enter the number of boxes per row and per column")
);
for (let i = 0; i < dimensions * dimensions; i++) {
  const gridItem = document.createElement("div");
  gridItem.classList.add("grid-item");
  gridItem.style.border = "1px solid black";
  container.appendChild(gridItem);
  gridItem.style.width = `${containerSize / dimensions - 2}px`;
  gridItem.style.height = `${containerSize / dimensions - 2}px`;
}

// Calculate and set the container size
function calculateContainerSize() {
  const viewportWidth = window.innerWidth;
  console.log(viewportWidth);
  return 0.5 * viewportWidth;
}

// Update container size on window resize
window.addEventListener("resize", () => {
  const newSize = calculateContainerSize();
  if (newSize !== containerSize) {
    container.style.width = `${newSize}px`;
    container.style.height = `${newSize}px`;
    containerSize = newSize;
    const gridItems = document.querySelectorAll(".grid-item");
    gridItems.forEach((gridItem) => {
      gridItem.style.width = `${newSize / dimensions - 2}px`;
      gridItem.style.height = `${newSize / dimensions - 2}px`;
    });
  }
});
