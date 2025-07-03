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
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");

  // List Item Attributes
  listEl.textContent = item;
  listEl.draggable = true; // Make the item draggable
  listEl.setAttribute("ondragstart", "drag(event)");
  listEl.contentEditable = true; // Make the item editable

  //   set ID
  listEl.id = index;
  listEl.setAttribute("onfocusout", `updatedItem(${index}, ${column})`);
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
  updatedOnLoad = true; // Set flag to true after first load
  updateSavedColumns();
}

// Update Item in Array - Delete Item from Array, Update localStorage
function updatedItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children; // Get the children of the column
  if (!selectedColumnEl[id].textContent) {
    selectedArray.splice(id, 1);
  }
  updateDOM(); // Update the DOM to reflect changes
}

//Add to Column, Reset Textarea
function addToColumn(column) {
  const itemText = addItems[column].textContent.trim(); // Get the text from the input box
  const selectedArray = listArrays[column]; // Get the corresponding array for the column
  selectedArray.push(itemText); // Add the item to the array
  addItems[column].textContent = ""; // Clear the input box
  updateDOM(); // Update the DOM to reflect changes
}

// Show Add Input Box
function showInputBox(column) {
  addBtns[column].style.visibility = "hidden"; // Hide the add button
  saveItemBtns[column].style.display = "flex"; // Show the save button
  addItemContainers[column].style.display = "flex"; // Show the input box
}

// Hide Add Input Box
function hideInputBox(column) {
  addBtns[column].style.visibility = "visible"; // Show the add button
  saveItemBtns[column].style.display = "none"; // Hide the save button
  addItemContainers[column].style.display = "none"; // Hide the input box
  addToColumn(column); // Add item to the column
}

// Allow arrays to reflect changes (Drag and Drop)
function rebuildArrays() {
  backlogListArray = [];
  progressListArray = [];
  completeListArray = [];
  onHoldListArray = [];
  for (let i = 0; i < backlogList.children.length; i++) {
    backlogListArray.push(backlogList.children[i].textContent);
  }
  for (let i = 0; i < progressList.children.length; i++) {
    progressListArray.push(progressList.children[i].textContent);
  }
  for (let i = 0; i < completeList.children.length; i++) {
    completeListArray.push(completeList.children[i].textContent);
  }
  for (let i = 0; i < onHoldList.children.length; i++) {
    onHoldListArray.push(onHoldList.children[i].textContent);
  }
  updateDOM();
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
  rebuildArrays();
}

// on Load
updateDOM();
