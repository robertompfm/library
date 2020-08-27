let myLibrary = [];

// BOOK CLASS
// Constructor
function Book(title, author, pages, read) {
  // attributes
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

// Methods
Book.prototype.info = function() {
  let readStr = this.read ? "read" : "not read yet";
  let infoStr = `${this.title} by ${this.author}, ${this.pages} pages, ${readStr}`;
  console.log(infoStr);
}
  

// 
function addBookToLibrary(title, author, pages, read) {
  myLibrary.push(new Book(title, author, pages, read));
}


// test
theHobbit = new Book("The Hobbit", "J.R.R. Tolkien", 295, false);
addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 295, false);
theHobbit.info();
console.log(myLibrary)