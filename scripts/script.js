// FIREBASE
// Your web app's Firebase configuration
(function() {
  let firebaseConfig = {
    apiKey: "AIzaSyBVdPTGJ7YeBgbdrH-o3z_P4Fux9uCrtxE",
    authDomain: "digitallibrary-39544.firebaseapp.com",
    databaseURL: "https://digitallibrary-39544.firebaseio.com",
    projectId: "digitallibrary-39544",
    storageBucket: "digitallibrary-39544.appspot.com",
    messagingSenderId: "881741457024",
    appId: "1:881741457024:web:3918c662758780836f2865",
    measurementId: "G-015J0EQPB7"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);  
})();


// GLOBAL VARIABLES
let myLibrary = [];
const FIREBASE_ON = true;
const LOCAL_STORAGE_ON = false;
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


// ==== LIBRARY CLASS ====
// CONSTRUCTOR
function Library() {
  // ATTRIBUTES
  this.books = [];
  this.hasLocalStorage = storageAvailable("localStorage") ? true : false;
}

// METHODS
Library.prototype.start = function() {
  this.loadBooks();
  this.renderAllBooks(TABLE_BODY);
}

Library.prototype.saveBooksOnLocalStorage = function() {
  this.localStorage.setItem("books", JSON.stringify(this.books)); 
}

Library.prototype.loadBooksFromLocalStorage = function() {
  let lsItem = this.localStorage.getItem("books");
  if (lsItem) {
    this.books = JSON.parse(lsItem);
  }
}

Library.prototype.saveBooksOnFirebase = function() {
  this.firebaseDB.set(JSON.stringify(this.books));
}

Library.prototype.loadBooksFromFirebase = function() {
  let that = this;
  this.firebaseDB.once("value").then(function(snapshot) {
    let retrieved = JSON.parse(snapshot.val());
    if (retrieved) {
      render(retrieved, TABLE_BODY);
      that.books = retrieved;
    } else {
      this.books = [];
    }
  });
}

Library.prototype.loadBooks = function() {
  if (FIREBASE_ON) {
    this.firebaseDB = firebase.database().ref("books");
    this.loadBooksFromFirebase();
  } else if (LOCAL_STORAGE_ON && this.hasLocalStorage) {
    this.localStorage = window["localStorage"];
    this.loadBooksFromLocalStorage();
  } else {
    LOCAL_STORAGE_ON = false;
  }
}

Library.prototype.saveChanges = function() {
  if (FIREBASE_ON) {
    this.saveBooksOnFirebase();
  } else if (LOCAL_STORAGE_ON) {
    this.saveBooksOnLocalStorage();
  }
}

Library.prototype.addBook = function(book) {
  this.books.push(book);
  this.saveChanges();
}

Library.prototype.renderAllBooks = function(tableBody) {
  render(this.books, TABLE_BODY);
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
  this.saveChanges();
  return idx;
}

Library.prototype.toggleReadStatusOfABookById = function(id) {
  let idArrays = this.books.map(book => book.id);
  let idx = idArrays.indexOf(id);
  this.books[idx].read = (!this.books[idx].read);
  this.saveChanges();
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

function render(books, tableBody) {
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.lastChild);
  }
    books.forEach(book => {
    renderABook(book, tableBody);
  });
}


function renderABook(book, tableBody) {
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
  title.textContent = book.title;
  author.textContent = book.author;
  pages.textContent = book.pages;
  readSpan.textContent = book.read ? "yes" : "no";

  // adding classes
  row.classList.add("row");
  row.classList.add("row--content");
  trashIcon.classList.add("fa");
  trashIcon.classList.add("fa-trash");
  trashIcon.classList.add("del");
  readSpan.classList.add("read");
  readSpan.classList.add(book.read ? "green-hover" : "red-hover");

  // adding data attribute
  row.setAttribute("data-id", book.id);
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


// function to check if storage is available
function storageAvailable(type) {
  let storage;
  try {
      storage = window[type];
      let x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
  }
  catch(e) {
      return e instanceof DOMException && (
          // everything except Firefox
          e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === 'QuotaExceededError' ||
          // Firefox
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
          // acknowledge QuotaExceededError only if there's something already stored
          (storage && storage.length !== 0);
  }
}



// INITIALIZING
setEventListeners();
library.start();
