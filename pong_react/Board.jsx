import React from 'react';

import {BallMove}          from './Ball.jsx'
import {PaddleMove, PaddleMove2} from './Paddles.jsx'
import {Score, Winner}                   from './Score.jsx'


// rerender the board component when the state changes
export class   Board extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            BallX: 500,
            BallY: 80,
            BallSpeed: 5,
            Angle: 45,

            Paddle1Height: 44,
            Paddle2Height: 44,

            Player1Score: 0,
            Player2Score: 0,

            End: null,
        };
        this.Score = this.Score.bind(this);
        this.UpdatePaddle1Height = this.UpdatePaddle1Height.bind(this);
        this.UpdateBall = this.UpdateBall.bind(this);
        this.GameEnd = this.GameEnd.bind(this);

    }
    Ref = React.createRef();

    Score = (player) => {
        player === 1 ? this.setState({Player1Score: this.state.Player1Score + 1}) : this.setState({Player2Score: this.state.Player2Score + 1})
    }

    UpdatePaddle1Height = (NewHeight) => {
        if (NewHeight < 0)
                NewHeight = 0;
        else if (NewHeight > 90)
           NewHeight = 90;
        this.setState({Paddle1Height: NewHeight})
    };
    UpdatePaddle2Height = (NewHeight) => {
        if (NewHeight < 0)
            NewHeight = 0;
        else if (NewHeight > 90)
            NewHeight = 90;
        this.setState({Paddle2Height: NewHeight})
    };

    UpdateBall = (NewBallX, NewBallY, NewBallSpeed, NewAngle) => {
        this.setState(
            {
            BallX: NewBallX,
            BallY: NewBallY,
            BallSpeed : NewBallSpeed,
            Angle: NewAngle
        })
    };

    GameEnd = () => {
         this.setState({End: true})
    }
    // {...this.state} is used to pass the whole state to the child component
    // on mouse move update the state
    render() {
        return(
            <div className="FullScreen">
                <div className="Board">
                    <Score position="left" player="1" total={this.state.Player1Score} />
                    <Score position="right" player="2" total={this.state.Player2Score} />
                    {/* <Winner position= "center"/> */}

                    {/* < Ball {...this.state} BoardRef={this.Ref}/> */}

                    < BallMove {...this.state} UpdateBall={this.UpdateBall} Score={this.Score} GameEnd={this.GameEnd} BoardRef={this.Ref}/>

                    < PaddleMove Paddle1={this.state.Paddle1Height} ChangePaddleHeight={this.UpdatePaddle1Height} BoardRef={this.Ref}/>
                    < PaddleMove2 Paddle2={this.state.Paddle2Height} ChangePaddle2Height={this.UpdatePaddle2Height} BoardRef={this.Ref}/>
                </div>
                <div className="Social"></div>
            </div>

        )
    }
}
