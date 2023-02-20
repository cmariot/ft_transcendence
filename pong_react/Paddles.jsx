import React from 'react';

// ComponentDidMount and ComponentWillUnmount are used to add and remove event listeners
// keydown is used to detect when a key is pressed
// handleKeyPress is used to update the state of the paddle position

export class PaddleMove extends React.Component {

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress = event => {
    if (event.key === 'ArrowUp' && this.props.Paddle1 > 0) {
      if (this.props.Paddle1)
        this.props.ChangePaddleHeight(this.props.Paddle1 - 2);
    }
    if (event.key === 'ArrowDown' && this.props.Paddle1 < 90) {
      this.props.ChangePaddleHeight(this.props.Paddle1 + 2);
    }
  };

  render() {
    return(
    <div
    className="Paddle Paddle1"
    style={{
      top: `${this.props.Paddle1}%`
    }}
    />);
  }
}

export class PaddleMove2 extends React.Component {

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress = event => {
    if (event.key === 'w' && this.props.Paddle2 > 0) {
      if (this.props.Paddle2 )
        this.props.ChangePaddle2Height(this.props.Paddle2 - 2);
    }
    if (event.key === 's' && this.props.Paddle2 < 90) {
      this.props.ChangePaddle2Height(this.props.Paddle2 + 2);
    }
  };

  render() {
    return(
    <div
    className="Paddle Paddle2"
    style={{
      top: `${this.props.Paddle2}%`
    }}
    />);
  }
}
