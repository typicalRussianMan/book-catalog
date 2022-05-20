import React from "react";
import { ValidateBookErrorMessage } from "../classes/ValidateBook.js";

export class BookEdit extends React.Component {
    constructor(props) {
        super(props);

        /**
         * book: book being edited
         * index: book index in the array of all books
         * bookValidMessage: message about incorrectly entered data for the current book
         */
        this.state = {
            book: props.book,
            index: props.index,
            bookValidMessage: ValidateBookErrorMessage(props.book)
        }

        /**
         * handleChange: a function called when data is entered into the input fields
         * handleDelete: a function called when the book is deleted
         */
        this.handleChange = props.handleChange;
        this.handleDelete = props.handleDelete;
    }

    /**
     * changing element state and sending data to parent element
     */
    async change(index, field, value) {
        await this.handleChange(index, field, value);
        let book = this.state.book;
        book[field] = value;

        this.setState({
            book: book,
            bookValidMessage: ValidateBookErrorMessage(book)
        })
    }

    render() {
        const { name, authors, year,  rating, ISBN } = this.state.book;
        const bookMessage = this.state.bookValidMessage;
        return (
            <div className="book-container">
                <div className="book-edit">
                    <div className="edit-field">
                        <label>Название:</label>
                        <input 
                            type="text" 
                            value={ name } 
                            onChange={ e => this.change(this.state.index, "name", e.target.value)}/>
                    </div>
                    <div className="edit-field">
                        <label>Автор(ы):</label>
                        <input 
                            type="text" 
                            value={ authors }
                            onChange={ e => this.change(this.state.index, "authors", e.target.value)}/>
                    </div>
                    <div className="edit-field">
                        <label>Год публикации:</label>
                        <input 
                            type="text" 
                            value={ year || "" }
                            onChange={ e => this.change(this.state.index, "year", +e.target.value)}/>
                    </div>
                    <div className="edit-field">
                        <label>Рейтинг:</label>
                        <input 
                            type="text" 
                            value={ rating || "" }
                            onChange={ e => this.change(this.state.index, "rating", +e.target.value)}/>
                    </div>
                    <div className="edit-field">
                        <label>ISBN:</label>
                        <input 
                            type="text" 
                            value={ ISBN }
                            onChange={ e => this.change(this.state.index, "ISBN", e.target.value)}/>
                    </div>
                    <button onClick={ () => this.handleDelete(this.state.index) }>Удалить книгу</button>
                    
                </div>
                { bookMessage ?  <span className="message-box">{ bookMessage }</span> : null}
                
            </div>
            
        )
    }
}