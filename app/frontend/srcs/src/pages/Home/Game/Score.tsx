import React from "react";

export class Score extends React.Component<any> {
    render() {
        return (
            <div className={this.props.position}>
                <h2>Player {this.props.player}</h2>
                <h1>{this.props.total}</h1>
            </div>
        );
    }
}

export class Winner extends React.Component<any> {
    render() {
        return (
            <div className={this.props.position}>
                <h3>Player {this.props.player} WON THE GAME</h3>
            </div>
        );
    }
}
