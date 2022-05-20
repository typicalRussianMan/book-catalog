import React from "react";

import { Book } from "./Book.js";

export class BooksGroup extends React.Component {
	
	constructor(props) {
		super(props);

		/**
		 * name: name of the group
		 * group: books included in the group
		 */
		this.state = {
			name: props.name,
			group: props.group
		}
	}

	render() {
		return (
			<div className="group">
				<h2 className="group-header">{ this.state.name }</h2>
				<div className="group-books">
					{this.state.group.sort((a, b) => a.name > b.name ? -1 : 1).map((el, i) => <Book key={ i } book={ el }/>)}
				</div>
			</div>
		)
	}

}