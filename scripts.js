let myLibrary = [];

function Book(title, author, pages, isRead) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead ? true : false;
}

Book.prototype.render = function(index){
    this.index = index;

    this.bookContainer = document.createElement("div");
    this.bookContainer.classList.add("book");
    this.bookContainer.dataset['id'] = index;

    const elements = {
        title: document.createElement("h6"),
        author: document.createElement("p"),
        pages: document.createElement("p"),
        isRead: document.createElement("p")
    }

    for(key in elements){
        if(key == "isRead"){
            elements[key].textContent = this.renderReadText();
            elements[key].classList.add("read-text");
        } else{
            elements[key].textContent = this[key];
        }
        this.bookContainer.appendChild(elements[key]);
    }

    this.renderDeleteBtn();
        
    this.bookContainer.appendChild(this.renderEditBtn());

    return this.bookContainer;
}

Book.prototype.edit = function(){
    this.isRead = !this.isRead;
    const bookElem = document.querySelector(`.book[data-id='${this.index}']`);
    const newEditBtn = this.renderEditBtn();

    bookElem.querySelector("button").replaceWith(newEditBtn);
    bookElem.querySelector(".read-text").textContent = this.renderReadText();

    localStorage.save();
}

Book.prototype.get = function(){
    return {
        title: this.title,
        author: this.author,
        pages: this.pages,
        isRead: this.isRead
    }
}


Book.prototype.delete = function(){
    myLibrary.splice(this.index, 1);
    renderLibrary();
}

Book.prototype.renderEditBtn = function(){
    let textContent;
    const btn = document.createElement("button");
    btn.classList.add("btn", "btn-primary", "read-button");

    btn.addEventListener('click', () => this.edit());

    if(this.isRead){
        textContent = "Not read";
    } else{
        textContent = "Read";
    }

    btn.textContent = textContent;

    return btn;
}

Book.prototype.renderDeleteBtn = function(){
    const trashIcon = document.createElement("i");
    trashIcon.classList.add("fas", "fa-trash", "delete-book");
    trashIcon.addEventListener('click', () => this.delete());
    
    this.bookContainer.appendChild(trashIcon);
}

Book.prototype.renderReadText = function(){
    let text;
    this.isRead ? text ="Finished reading" : text = "Not read yet"
    return text;
}

let shelf = {
    container: document.querySelector("#book-shelf"),
    add: function(book){
        this.container.appendChild(book);
        localStorage.save();
    },
    clear: function(){
        this.container.innerHTML = "";
    }
}


function addBookToLibrary(book) {
    var index = myLibrary.push(book) - 1;
    shelf.add(book.render(index));
}

function renderLibrary(){
    shelf.clear();
    myLibrary.forEach((book, index) => {
        shelf.add(book.render(index));
    });

    if(myLibrary.length == 0){
        localStorage.save();
    }
}

function submitBookForm(e){
    e.preventDefault();
    const bookForm = new FormData(document.querySelector("#addBookForm"));
    const newBook = new Book(bookForm.get("title"), bookForm.get("author"), bookForm.get("pages"), bookForm.get("read"));
   
    addBookToLibrary(newBook);
}

let localStorage = {
    localStorage: window.localStorage,
    getBooks: function(){
        if(this.localStorage['books']){
            let books = JSON.parse(this.localStorage['books']);
            books.forEach((book) => {
                myLibrary.push(new Book(book.title, book.author, book.pages, book.isRead));
            })
        }
    },
    save: function(){
        this.localStorage['books'] = JSON.stringify(myLibrary);
    }
}

function init(){
    localStorage.getBooks();
    renderLibrary();
}

init();
