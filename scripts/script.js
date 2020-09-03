// GLOBAL VARIABLES
let myLibrary = [];
const TABLE_BODY = document.querySelector(".table").querySelector("tbody");


// ==== BOOK CLASS ====
// CONSTRUCTOR
function Book(title, author, pages, read) {
  // ATTRIBUTES
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

// METHODS
Book.prototype.info = function() {
  let readStr = this.read ? "read" : "not read yet";
  let infoStr = `${this.title} by ${this.author}, ${this.pages} pages, ${readStr}`;
  console.log(infoStr);
}

Book.prototype.render = function(tableBody) {
  // creating elements
  let row = document.createElement("tr");
  let title = document.createElement("td");
  let author = document.createElement("td");
  let pages = document.createElement("td");
  let read = document.createElement("td");
  let read_span = document.createElement("span");
  let trash = document.createElement("td");
  let trash_icon = document.createElement("i");
  
  // setting the text
  title.textContent = this.title;
  author.textContent = this.author;
  pages.textContent = this.pages;
  read_span.textContent = this.read ? "yes" : "no";
  
  // adding classes
  row.classList.add("row");
  row.classList.add("row--content");
  trash_icon.classList.add("fa");
  trash_icon.classList.add("fa-trash");
  trash_icon.classList.add("del");
  read_span.classList.add("read");
  read_span.classList.add(this.read ? "green-hover" : "red-hover");

  // adding event listener
  trash_icon.addEventListener("click", removeBook);

  // appending childs
  read.appendChild(read_span); 
  trash.appendChild(trash_icon);
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



// ==== PAGE ====
// elements
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

// METHODS
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
  let title = newBookForm["title"].value;
  let author = newBookForm["author"].value;
  let pages = newBookForm["pages"].value;
  let read = newBookForm["read"].checked;

  // validate values
  if (!validateTitle(title)) return;
  if (!validateAuthor(author)) return;
  if (!validatePages(pages)) return;

  // create a new book and add to library
  let newBook = new Book(title, author, pages, read);
  library.addBook(newBook);
  library.renderAllBooks(tableBody);
  closeDialog();
}

let removeBook = function(e) {
  console.log(e.target.parentElement.parentElement);
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
library.addBook(new Book("Sapiens", "Yuval Noah Harari", "443", true));
library.renderAllBooks(tableBody);
