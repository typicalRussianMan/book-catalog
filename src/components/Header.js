import React from "react";

/**
 * header component
 */
export class Header extends React.Component {
    constructor(props) {
        super(props);

        this.title = props.title;
    }

    render() {
        return (
            <header className="header">
                <h1>{ this.title }</h1>
            </header>
        )
    }
}