import React from "react";

import { BooksGroup } from "./BooksGroup.js";
import { Tabs } from "./Tabs.js";
import { Loading } from "./Loading.js";
import { Header } from "./Header.js"

/**
 * getting a random element in an array
 */
function getRandomElement(data) {
	return data[Math.floor(Math.random()*data.length)]
}

export class BooksDisplay extends React.Component {

	constructor(props) {
		super(props);
		this.db = props.database;
		/**
		 * books: all books in Firebase
		 * recommendedBook: book that system recommends to the user
		 * group: currently selected group (year, authors, rating)
		 * groupData: all possible values of the selected group
		 * groups: all groups by which books can be grouped
		 */
		this.state = {
			books: null,
			recommendedBook: null,
			group: null,
			groupData: null,
			groups: [
				{
					name: "Год",
					value: "year",
					sortFunction: (a, b) => a === undefined ? true : +a < +b,
					undefValue: "Книги без указания года"
				},
				{
					name: "Автор",
					value: "authors",
					sortFunction: (a, b) => a < b,
					undefValue: "Книги без указания автора"
				},
				{
					name: "Рейтинг",
					value: "rating",
					sortFunction: (a, b) => a === undefined ? true : +a < +b,
					undefValue: "Книги без указания рейтинга"
				}
			]
		}

		this.changeGroup = this.changeGroup.bind(this);
	}
	
	/**
	 * when rendering an element with firebase, books are taken and grouped
	 */
	async componentDidMount() {
		const bookData = await this.getBooks()
		this.changeGroup("year", bookData);
	}

	/**
	 * convert json object to array
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
	 * getting books from firebase
	 */
	async getBooks() {
		let booksData = await this.db.get("books");

		booksData = this.JSONToArray(booksData);
		
		this.setState({
			books: booksData
		})

		this.setRecommendedBook(booksData);

		return booksData;
	}

	/**
	 * finds the maximum rating from all books
	 */
	getMaxRating(books) {
		const max = Math.max(...books.map(el => el.rating || 0))
		return max;
	}

	/**
	 * selection of a book recommended to the user 
	 */
	setRecommendedBook(books) {
		const maxRating = this.getMaxRating(books);

		let possibleRecommendedBooks = books.filter(({year, rating}) => {
			return year < (new Date()).getFullYear()-3 && rating === maxRating
		});
		
		this.setState({
			recommendedBook: getRandomElement(possibleRecommendedBooks)
		})
	}

	/**
	 * grouping books by selected group
	 */
	async setGroupData(books, group) {
		await this.setState({
			groupData: []
		})
		let insert = (arr, element, sortFunc) => {
			for (let i=0; i < arr.length; i++) {
				if (sortFunc(arr[i], element)) return arr.splice(i, 0, element);
			}
			return arr.splice(arr.length, 0, element);
		}

		let groupData = [];
		const sortFunc = this.state.groups.find(({value}) => value === group).sortFunction;

		for (const book of books) {
			if (book[group] === undefined) {
				if (!groupData.includes(undefined)) {
					insert(groupData, undefined, sortFunc);
				}
				continue;
			}
			const values = this.split(book[group], ",");
			values.forEach(value => {
				if (!groupData.includes(value)) {
					insert(groupData, value, sortFunc);
				}
			})
		}

		this.setState({
			groupData: groupData
		})

	}

	/**
	 * change and update the selected group 
	 */
	changeGroup(newGroup, books=this.state.books) {
		this.setState({
			group: newGroup
		});
		this.setGroupData(books, newGroup);
	}

	/**
	 * splits the data by separator if data is a string
	 * returns an array with element "data" if data is a number
	 */
	split(data, separator) {
		if (typeof data === "string") return data.split(separator);
		if (typeof data === "number") return [data];
		return null;
	} 

	render() {
		return (
			<div>
				<Header title="Каталог книг"/>
				<div className="tabs-block">
					<div className="tabs-header">Группировать по:</div>
					<Tabs handleClick={ this.changeGroup } tabs={ this.state.groups }/>
				</div>
				{ 
				this.state.recommendedBook ?
					<BooksGroup name="Рекомендованная книга" group={[this.state.recommendedBook]}/> : null
				}
				{
					this.state.groupData ? this.state.groupData.map((el, i) => {
						const groupName = el ?? this.state.groups.find(({value}) => value == this.state.group).undefValue;
						const group = this.state.books.filter(book => {
							if (book[this.state.group] === undefined) {
								return el === undefined;
							}
							return this.split(book[this.state.group], ",").indexOf(el) !== -1
						});

						return <BooksGroup name={ groupName } group={ group } key={ i }/>
					}) : <Loading/>
				} 
			</div>
		)
	}
}