class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    addBookToList(book){
        const list = document.getElementById('book-list');
        // create tr element
        const row = document.createElement('tr');
        console.log(row);
        // insert cols
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete">X</a></td>
        `;

        list.appendChild(row);
    }

    showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
    
        container.insertBefore(div, form);
    
        // timeout after 3 seconds
        setTimeout(function(){
            document.querySelector('.alert').remove();
        }, 2500);
    }

    deleteBook(target){
        const ui = new UI();
        if( target.className === 'delete'){
            target.parentElement.parentElement.remove();
            ui.showAlert('Book removed!', 'success');
        }
    }

    clearFields(){
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
}

// Local storage class
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null ){
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach(function(book){
            const ui = new UI;

            // Add book to UI
            ui.addBookToList(book);
        });
    }
    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBook(isbn) {
        console.log(isbn);
        const books = Store.getBooks();

        books.forEach(function(book, index){
            if(book.isbn === isbn){
                books.splice(index, 1)
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// DOM LOAD EVENT
document.addEventListener('DOMContentLoaded', Store.displayBooks);


// Event listener for adding book
document.getElementById('book-form').addEventListener('submit', 
    function(e){
    e.preventDefault();
    // get form values
    const title = document.getElementById('title').value,
    author = document.getElementById('author').value,
    isbn = document.getElementById('isbn').value;

    // Creating the book
    const book = new Book(title, author, isbn);

    // Creating UI
    const ui = new UI();

    if(title === '' || author === '' || isbn === ''){
        ui.showAlert('Please fill in all fields', 'error');
    } else {
    // add book to the list
    ui.addBookToList(book);

    // Add to LS
    Store.addBook(book);

    // show success
    ui.showAlert('Book added!', 'success')

    // clear input fields
    ui.clearFields();
    }
    
});

// Event listener for removing book
document.getElementById('book-list').addEventListener('click',function(e){
    e.preventDefault();
    const ui = new UI();
    ui.deleteBook(e.target);
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
});