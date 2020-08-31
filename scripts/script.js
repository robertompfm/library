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
};

let openDialog = function() {
  newBookForm["title"].value = "";
  newBookForm["author"].value = "";
  newBookForm["pages"].value = "";
  newBookForm["read"].checked = false;
  dialog.style.display = "block";
};

let closeDialog = function() {
  dialog.style.display = "none";
};

setEventListeners();
