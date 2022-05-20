/**
 * Import React, styles, required components for App
 */
import React from "react";
import "./App.css";

import { FirebaseDB } from "./classes/FirebaseDB.js";
import { BooksDisplay } from "./components/BooksDisplay.js";
import { BooksEditor } from "./components/BooksEditor.js";

/**
 * Initialize App
 */
class App extends React.Component {
	/**
	 * Initialize state, Firebase
	 */
	constructor() {
		super();
		/**
		 * isEditing: shows if the editing tab is currently open
		 */
		this.state = {
			isEditing: false
		}

		const config = {
			apiKey: "AIzaSyA1M6RFI7NvyRbQMpJLkNupjOf7p1z8u4g",
			authDomain: "book-catalog-aa186.firebaseapp.com",
			databaseURL: "https://book-catalog-aa186-default-rtdb.firebaseio.com",
			projectId: "book-catalog-aa186",
			storageBucket: "book-catalog-aa186.appspot.com",
			messagingSenderId: "578778606034",
			appId: "1:578778606034:web:9253857715787f1a81400b"
		};
		this.db = new FirebaseDB(config);
		
	}
	/**
	 * Switch between view and edit tabs
	 */
	toggleEdit() {
		const isEditing = this.state.isEditing;
		this.setState({
			isEditing: !isEditing
		})
	}

	render() {
		return (
			<div className="app">
				<button onClick={() => this.toggleEdit()} className="toggle-edit">
					{ this.state.isEditing ? "Закрыть редактор" : "Открыть редактор"}
				</button>
				{
					this.state.isEditing ? <BooksEditor database={ this.db }/> : <BooksDisplay database={ this.db }/>
				}
			</div>
		) 
	}

}

export default App;