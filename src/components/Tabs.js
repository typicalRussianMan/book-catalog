import React from "react";

export class Tabs extends React.Component {

	constructor(props) {
		super(props);

		/**
		 * tabs: array of objects (name - value to render; value - value to pass to the function)
		 * handleClick: a function that is called when one of the tabs is clicked
		 */
		this.state = {
			tabs: props.tabs,
			handleClick: props.handleClick
		}
	}

	render() {
		return (
			<div className="tabs">
				{this.state.tabs.map(({name, value}, i) => (
					<button 
                        className="tab-button"
						key={ i } 
						onClick={ () => this.state.handleClick(value) }>{ name }</button>
				))}
			</div>
		)
	}
}