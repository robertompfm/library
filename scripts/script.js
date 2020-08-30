// GLOBAL VARIABLES
let myLibrary = [];
const TABLE_BODY = document.querySelector(".table").querySelector("tbody");

// BOOK CLASS
// Constructor
function Book(title, author, pages, read) {
  // attributes
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

// methods
Book.prototype.info = function() {
  let readStr = this.read ? "read" : "not read yet";
  let infoStr = `${this.title} by ${this.author}, ${this.pages} pages, ${readStr}`;
  console.log(infoStr);
}
  

// FUNCTIONS
// add book function
function addBookToLibrary(title, author, pages, read) {
  myLibrary.push(new Book(title, author, pages, read));
}

// render all books
function render() {

  myLibrary.forEach(book => {
    renderABook(book);
  });
}

// render a book
function renderABook(book) {
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
  title.textContent = book.title;
  author.textContent = book.author;
  pages.textContent = book.pages;
  read_span.textContent = book.read ? "yes" : "no";
  
  // adding classes
  row.classList.add("row");
  row.classList.add("row--content");
  trash_icon.classList.add("fa");
  trash_icon.classList.add("fa-trash");
  trash_icon.classList.add("del");
  read_span.classList.add("read");
  read_span.classList.add(book.read ? "green-hover" : "red-hover");

  // appending childs
  read.appendChild(read_span); 
  trash.appendChild(trash_icon);
  row.appendChild(title);
  row.appendChild(author);
  row.appendChild(pages);
  row.appendChild(read);
  row.appendChild(trash);
  TABLE_BODY.appendChild(row);
}

// test
theHobbit = new Book("The Hobbit", "J.R.R. Tolkien", 295, false);
sapiens = new Book("Sapians", "Yuval Noah Harari", 443, true);
addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 295, false);
addBookToLibrary("Sapiens", "Yuval Noah Harari", 443, true);
// theHobbit.info();
// console.log(myLibrary)
render();
console.log(TABLE_BODY);