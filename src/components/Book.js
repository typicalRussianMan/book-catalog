import React from "react";

export class Book extends React.Component {

	constructor(props) {
		super(props);

		/**
		 * book: book to be rendered 
		 */
		this.state = {
			book : props.book
		}
	}

	render() {
        const book = this.state.book
		return (
			<div className="book">
				<div className="book-data">Название: { book.name }</div>
				<div className="book-data">Aвтор(ы): { book.authors }</div>
                <div className="book-data">{book.year ? `Год: ${ book.year }`:null}</div>
                <div className="book-data">{book.rating ? `Рейтинг: ${ book.rating }`:null}</div>
                <div className="book-data">{book.ISBN ? `ISBN: ${ book.ISBN }`:null}</div>
			</div>
		)
	}

}