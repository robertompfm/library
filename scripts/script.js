// GLOBAL VARIABLES
let myLibrary = [];
const TABLE_BODY = document.querySelector(".table").querySelector("tbody");


// ==== BOOK CLASS ====
// CONSTRUCTOR
function Book(id, title, author, pages, read) {
  // ATTRIBUTES
  this.id = id;
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

// METHODS
Book.prototype.getId = function() {
  return this.id;
}

Book.prototype.info = function() {
  let readStr = this.read ? "read" : "not read yet";
  let infoStr = `${this.title} by ${this.author}, ${this.pages} pages, ${readStr}, id=${this.id}`;
  console.log(infoStr);
}

Book.prototype.toggleReadStatus = function() {
  this.read = !this.read;
}

Book.prototype.render = function(tableBody) {
  // creating elements
  let row = document.createElement("tr");
  let title = document.createElement("td");
  let author = document.createElement("td");
  let pages = document.createElement("td");
  let read = document.createElement("td");
  let readSpan = document.createElement("span");
  let trash = document.createElement("td");
  let trashIcon = document.createElement("i");
  
  // setting the text
  title.textContent = this.title;
  author.textContent = this.author;
  pages.textContent = this.pages;
  readSpan.textContent = this.read ? "yes" : "no";
  
  // adding classes
  row.classList.add("row");
  row.classList.add("row--content");
  trashIcon.classList.add("fa");
  trashIcon.classList.add("fa-trash");
  trashIcon.classList.add("del");
  readSpan.classList.add("read");
  readSpan.classList.add(this.read ? "green-hover" : "red-hover");

  // adding data attribute
  row.setAttribute("data-id", this.id);
  readSpan
  // adding event listener
  trashIcon.addEventListener("click", removeBook);
  readSpan.addEventListener("click", toggleRead);

  // appending childs
  read.appendChild(readSpan); 
  trash.appendChild(trashIcon);
  row.appendChild(title);
  row.appendChild(author);
  row.appendChild(pages);
  row.appendChild(read);
  row.appendChild(trash);
  tableBody.appendChild(row);
}
  


// ==== LIBRARY CLASS ====
// CONSTRUCTOR
function Library() {
  // ATTRIBUTES
  this.books = [];
}

// METHODS
Library.prototype.addBook = function(book) {
  this.books.push(book);
}

Library.prototype.renderAllBooks = function(tableBody) {
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.lastChild);
  }
  this.books.forEach(book => book.render(tableBody));
}

Library.prototype.getNextId = function() {
  let nextId = 0;
  let len = this.books.length;
  if (len > 0) {
    let lastId = parseInt(this.books[this.books.length - 1].id);
    nextId = lastId + 1;
  }
  return nextId;
}

Library.prototype.removeBookById = function(id) {
  let idArrays = this.books.map(book => book.id);
  let idx = idArrays.indexOf(id);
  this.books.splice(idx, 1);
  return idx;
}

Library.prototype.toggleReadStatusOfABookById = function(id) {
  let idArrays = this.books.map(book => book.id);
  let idx = idArrays.indexOf(id);
  this.books[idx].toggleReadStatus();
  return idx;
}

// ==== PAGE ====
// Variables
let library = new Library();
const tableBody = document.querySelector(".table").querySelector("tbody");

const dialog = document.querySelector(".dialog");
const addBookBtns = document.querySelectorAll(".btn--add");
const saveBookBtn = document.querySelector(".btn--save");
const feedback = document.querySelector(".feedback");
const closeBtn = document.querySelector(".dialog__close");

const newBookForm = {
  title: document.querySelector("#title-inpt"),
  author: document.querySelector("#author-inpt"),
  pages: document.querySelector("#pages-inpt"),
  read: document.querySelector("#read-checkbox")
}

// Functions
let setEventListeners = function() {
  addBookBtns.forEach(btn => {
    btn.addEventListener("click", openDialog);
  });
  closeBtn.addEventListener("click", closeDialog);
  saveBookBtn.addEventListener("click", saveBook); 
};

let openDialog = function() {
  newBookForm["title"].value = "";
  newBookForm["author"].value = "";
  newBookForm["pages"].value = "";
  newBookForm["read"].checked = false;
  feedback.textContent = "";
  dialog.style.display = "block";
};

let closeDialog = function() {
  dialog.style.display = "none";
};

let saveBook = function() {
  // get input values
  let id = library.getNextId();
  let title = newBookForm["title"].value;
  let author = newBookForm["author"].value;
  let pages = newBookForm["pages"].value;
  let read = newBookForm["read"].checked;

  // validate values
  if (!validateTitle(title)) return;
  if (!validateAuthor(author)) return;
  if (!validatePages(pages)) return;

  // create a new book and add to library
  let newBook = new Book(id, title, author, pages, read);
  library.addBook(newBook);
  library.renderAllBooks(tableBody);
  closeDialog();
}

let removeBook = function(e) {
  let row = (e.target.parentElement.parentElement);
  let id = parseInt(row.getAttribute("data-id"));
  let bookIdx = library.removeBookById(id);
  library.renderAllBooks(tableBody);
}

let toggleRead = function(e) {
  let row = (e.target.parentElement.parentElement);
  let id = parseInt(row.getAttribute("data-id"));
  let bookIdx = library.toggleReadStatusOfABookById(id);
  library.renderAllBooks(tableBody);
}

let validateTitle = function(title) {
  if (title === "") {
    feedback.textContent = "Title field is empty"
    return false;
  } else {
    feedback.textContent = "";
    return true;
  }
}

let validateAuthor = function(author) {
  if (author === "") {
    feedback.textContent = "Author field is empty"
    return false;
  } else {
    feedback.textContent = "";
    return true;
  }
}

let validatePages = function(pages) {
  if (pages === "") {
    feedback.textContent = "Pages field requires a number"
    return false;
  } else if (pages < 1) {
    feedback.textContent = "Number of pages can't be smaller than 1"
    return false;
  } else {
    feedback.textContent = "";
    return true;
  }
}

// INITIALIZING
setEventListeners();
library.addBook(new Book(1, "Sapiens", "Yuval Noah Harari", "443", true));
library.renderAllBooks(tableBody);
