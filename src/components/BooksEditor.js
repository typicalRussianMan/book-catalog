import React from "react";
import { Loading } from "./Loading.js";
import { BookEdit } from "./BookEdit.js";
import { Header } from "./Header.js";
import { ValidateBook } from "../classes/ValidateBook.js";

export class BooksEditor extends React.Component {

    constructor(props) {
        super(props);

        /**
         * books: all books in the firebase / added by the user
         */
        this.state = {
            books: null
        }

        this.db = props.database;

        this.changeBook = this.changeBook.bind(this);
        this.deleteBook = this.deleteBook.bind(this);
    }

    /**
     * when rendering a component, data is received from firebase
     */
    componentDidMount() {
        this.getBooks();
    }

    /**
     * getting books from firebase
     */
    async getBooks() {
        let bookData = await this.db.get("books");

        bookData = this.JSONToArray(bookData);
        this.setState({
            books: bookData
        })
    }

    /**
     * adding a new book to existing ones
     */
    addBook() {
        let books = this.state.books;
        const id = this.generateId();
        books.push({id : id});
        this.setState({
            books: books
        })
    }

    /**
     *  remove book from array by index
     */
    async deleteBook(index) {
        let books = this.state.books;
        await this.setState({books: []});

        this.db.delete("books/"+books[index].id);

        books.splice(index, 1);
        this.setState({
            books: books
        })
    }

    /**
     * changing a field in a workbook to a new value
     */
    async changeBook(index, field, newValue) {
        let books = this.state.books;
        
        books[index][field] = newValue;

        await this.setState({
            books: books
        })
        return newValue;   
    }

    /**
     * saves all books in firebase
     */
    async saveBooks() {
        let books = this.state.books;

        for (const book of books) {
            if (!ValidateBook(book)) return false;
        }

        await this.setState({
            books: null
        })

        books = books.map(({year, rating, ISBN, ...otherData}) => {
            return {
                year: +year ? year : null,
                rating: rating || null,
                ISBN : ISBN || null,
                ...otherData
            }
        })

        await this.db.push("/", this.arrayToJSON(books, "books"))

        this.getBooks()
    }

    /**
     * converting an JSON object to an array
     */
    JSONToArray(data) {
		let dataArr = [];
		for (let id in data) {
			const element = {
				...data[id],
				id: id
			};
			dataArr.push(element);
		}
		return dataArr;
	}

    /**
     * convert array to JSON object with id
     */
    arrayToJSON(data, id) {
        let JSONData = {}

        data.forEach(el => {
            const id = el.id;
            delete el.id;
            JSONData[id] = el;
        })

        JSONData.id = id;
        return JSONData;
    }

    /**
     * generating a random identifier 12 characters long
     */
    generateId() {
        const symbols = "0123456789qwertyuiopasdfghjklzxcvbnm".split("");
        let id = symbols.sort(() => Math.random() - 0.5);
        id.length = 12;
        return id.join("");
    }

    render() {
        return (
            <div className="books-editor">
                <Header title="Редактор книг"/>
                <button onClick={ () => this.addBook() }>Добавить книгу</button>
                <button onClick={ () => this.saveBooks() }>Сохранить изменения</button>
                {
                    this.state.books ? 
                    this.state.books.map((el, i) => (
                        <BookEdit 
                            index={ i } 
                            book={ el } 
                            key={ i } 
                            handleChange={ this.changeBook }
                            handleDelete={ this.deleteBook }/>
                    ))
                    : <Loading/>
                }
            </div>
        )
    }
}