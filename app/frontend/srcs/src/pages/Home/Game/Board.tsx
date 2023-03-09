import React, { createRef } from "react";
import { BallMove } from "./Ball";
import { PaddleMove, PaddleMove2 } from "./Paddles";
import { Score } from "./Score";
import "../../../styles/Game.css";

interface BoardInterface {
    BallX: number;
    BallY: number;
    BallSpeed: number;
    Angle: number;
    BallSize: number;
    Paddle1Height: number;
    Paddle2Height: number;
    Player1Score: number;
    Player2Score: number;
    End: boolean;
}

export class Board extends React.Component<{}, BoardInterface> {
    // A replacer dans le constructeur si ca fonctionne pas
    Ref = createRef<HTMLDivElement>();

    constructor(props: any) {
        super(props);

        this.state = {
            BallX: 50,
            BallY: 50,
            BallSpeed: 5,
            Angle: 0,
            BallSize: 15,
            Paddle1Height: 45,
            Paddle2Height: 45,
            Player1Score: 0,
            Player2Score: 0,
            End: false,
        };
        this.Score = this.Score.bind(this);
        this.UpdatePaddle1Height = this.UpdatePaddle1Height.bind(this);
        this.UpdateBall = this.UpdateBall.bind(this);
        this.GameEnd = this.GameEnd.bind(this);
    }

    componentDidMount = () => {
        // a verif (le if)
        if (this.Ref.current) {
            this.setState({
                BallX: this.Ref.current.offsetWidth / 2,
                BallY: this.Ref.current.offsetHeight / 2,
            });
        }
    };

    Score = (player: number) => {
        player === 1
            ? this.setState({ Player1Score: this.state.Player1Score + 1 })
            : this.setState({ Player2Score: this.state.Player2Score + 1 });
    };

    UpdatePaddle1Height = (NewHeight: number) => {
        if (NewHeight < 0) NewHeight = 0;
        else if (NewHeight > 90) NewHeight = 90;
        this.setState({ Paddle1Height: NewHeight });
    };
    UpdatePaddle2Height = (NewHeight: number) => {
        if (NewHeight < 0) NewHeight = 0;
        else if (NewHeight > 90) NewHeight = 90;
        this.setState({ Paddle2Height: NewHeight });
    };

    UpdateBall = (
        NewBallX: number,
        NewBallY: number,
        NewBallSpeed: number,
        NewAngle: number
    ) => {
        this.setState({
            BallX: NewBallX,
            BallY: NewBallY,
            BallSpeed: NewBallSpeed,
            Angle: NewAngle,
        });
    };

    GameEnd = () => {
        this.setState({ End: true });
    };
    // {...this.state} is used to pass the whole state to the child component
    // on mouse move update the state
    render() {
        return (
            <div className="FullScreen">
                <div className="Board" ref={this.Ref}>
                    <Score
                        position="left"
                        player="1"
                        total={this.state.Player1Score}
                    />
                    <Score
                        position="right"
                        player="2"
                        total={this.state.Player2Score}
                    />
                    {/* <Winner position= "center"/> */}
                    {/* < Ball {...this.state} BoardRef={this.Ref}/> */}
                    <BallMove
                        {...this.state}
                        UpdateBall={this.UpdateBall}
                        Score={this.Score}
                        GameEnd={this.GameEnd}
                        BoardRef={this.Ref}
                    />
                    <PaddleMove
                        Paddle1={this.state.Paddle1Height}
                        ChangePaddleHeight={this.UpdatePaddle1Height}
                        BoardRef={this.Ref}
                    />

                    <PaddleMove2
                        Paddle2={this.state.Paddle2Height}
                        ChangePaddle2Height={this.UpdatePaddle2Height}
                        BoardRef={this.Ref}
                    />
                </div>
            </div>
        );
    }
}
