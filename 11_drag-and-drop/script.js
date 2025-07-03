const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const listColumns = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// Items
let updatedOnLoad = false; // Flag to check if items are loaded

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let currentColumn; // Track the column where the item is currently located

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ["Release the course", "Sit back and relax"];
    progressListArray = ["Work on projects", "Listen to music"];
    completeListArray = ["Being cool", "Getting stuff done"];
    onHoldListArray = ["Being uncool"];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];
  const arrayNames = ["backlog", "progress", "complete", "onHold"];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(
      `${arrayName}Items`,
      JSON.stringify(listArrays[index])
    );
  });
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  //   console.log("columnEl:", columnEl);
  //   console.log("column:", column);
  //   console.log("item:", item);
  //   console.log("index:", index);
  // List Item
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");

  listEl.textContent = item;
  listEl.draggable = true; // Make the item draggable
  listEl.setAttribute("ondragstart", "drag(event)");
  // Append List Item
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }

  // Backlog Column
  backlogList.textContent = ""; // Reset HTML
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, "0", backlogItem, index);
  });

  // Progress Column
  progressList.textContent = ""; // Reset HTML
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, "1", progressItem, index);
  });

  // Complete Column
  completeList.textContent = ""; // Reset HTML
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, "2", completeItem, index);
  });

  // On Hold Column
  onHoldList.textContent = ""; // Reset HTML
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, "3", onHoldItem, index);
  });

  // Run getSavedColumns only once, Update Local Storage
}

// Drag Functions
function drag(event) {
  draggedItem = event.target; // Store the dragged item
  console.log("draggedItem:", draggedItem);
}

// Drop Function
function allowDrop(event) {
  event.preventDefault(); // Prevent default behavior to allow drop
}

// When an item is dragged over a column, highlight the column
function dragEnter(column) {
  // Highlight the column
  listColumns[column].classList.add("over");
  correctColumn = column; // Store the current column index
}

// Drop Item in the correct column
function drop(event) {
  event.preventDefault();
  // Remove highlight from all columns
  listColumns.forEach((column) => {
    column.classList.remove("over");
  });
  // Add Item to the correct column (array)
  const parent = listColumns[correctColumn];
  parent.appendChild(draggedItem); // Append the dragged item to the column
}

// on Load
updateDOM();
