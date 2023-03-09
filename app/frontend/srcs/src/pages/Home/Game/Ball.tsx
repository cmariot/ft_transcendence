import React from "react";

/******************************************
 *        Responsive  + Bounce            *
 ******************************************/
// Pass ref component to child component
// with ref we can get the width and height of the parent component
// - current ->  property of a ref object that refers to the current mounted instance of a component or DOM node
// - offsetWidth and offsetHeight to get the width and height

/******************************************
 *             Check Bounce               *
 ******************************************/
// BOARD Check :  Position X < BoardWidth and Position Y < BoardHeight

// Paddle Check : BORDER1 = BoardHeigh / 10 * PaddleHeight / 10 - SIZEBALL /2
//				  BORDER2 = BORDER1 + SizeBall
//              we check  BORDER 1 < BallY < BORDER2 = BORDER1 + BoardHeight / 10

/**************************************** *
*				! Rappel !
	NewX et NewY ne sont pas le centre
	TO DO -> ADD MARGIN OF BALL SIZE AND CHANGE CONDITIONS
**************************************** */
export class BallMove extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            Width: 0,
            Height: 0,

            intervalId: null,
            isPaused: false,
        };
        this.UpdateDimensions = this.UpdateDimensions.bind(this);
    }

    UpdateDimensions() {
        let ParentComponent = this.props.BoardRef.current;
        const Width = ParentComponent.offsetWidth;
        const Height = ParentComponent.offsetHeight;

        this.setState({ Width, Height });
    }

    componentDidMount() {
        let ParentComponent = this.props.BoardRef.current;
        const Width = ParentComponent.offsetWidth;
        const Height = ParentComponent.offsetHeight;

        this.setState({ Width, Height });
        window.addEventListener("resize", this.UpdateDimensions);

        const intervalId = setInterval(() => {
            if (!this.state.isPaused && !this.props.End) {
                let newX =
                    this.props.BallX +
                    this.props.BallSpeed *
                        Math.cos((this.props.Angle * Math.PI) / 180);
                let newY =
                    this.props.BallY +
                    this.props.BallSpeed *
                        Math.sin((this.props.Angle * Math.PI) / 180);
                let NewAngle = this.props.Angle;
                let NewBallSpeed =
                    this.props.BallSpeed < 10
                        ? this.props.BallSpeed + 0.01
                        : this.props.BallSpeed;

                let Border1 =
                    (this.state.Height / 10) * (this.props.Paddle1Height / 10) -
                    this.props.BallSize;
                let Border2 =
                    Border1 + this.state.Height / 10 + this.props.BallSize / 2;
                let Border3 =
                    (this.state.Height / 10) * (this.props.Paddle2Height / 10) -
                    this.props.BallSize;
                let Border4 =
                    Border3 + this.state.Height / 10 + this.props.BallSize / 2;

                let Paddleheight = this.state.Height / 10;
                let BallSize = this.props.BallSize;
                //function CheckPaddle1() {
                //    if (
                //        Border1 <= newY &&
                //        newY <= Border2 &&
                //        15 < newX &&
                //        newX < 25
                //    )
                //        return true;
                //    else return false;
                //}

                // function CheckPaddle2(Width) {
                //     if (
                //         Border3 <= newY &&
                //         newY <= Border4 &&
                //         newX + 20 > Width - 20 &&
                //         newX + 20 > Width - 25
                //     )
                //         return true;
                //     else return false;
                // }

                // 20 % of the center of the paddle launches the ball straight forward
                // 10 % of each edge of the paddle sends the ball with the same angle

                // function CheckBallPosOnPad1() {
                //     console.log(
                //         "check paddle 1",
                //         Border1 + Paddleheight / 2 - 5,
                //         ":",
                //         Border3 + Paddleheight / 2 + 5
                //     );

                //     if (
                //         Border1 +
                //             BallSize +
                //             Paddleheight / 2 -
                //             Paddleheight / 20 <=
                //             newY &&
                //         newY <=
                //             Border1 +
                //                 BallSize +
                //                 Paddleheight / 2 +
                //                 Paddleheight / 20
                //     )
                //         return 1;
                //     else if (Border1 + Paddleheight * (2 / 10) >= newY)
                //         return 2;
                //     else if (newY >= Border1 + Paddleheight * (8 / 10))
                //         return 3;
                //     else return 0;
                // }

                // function CheckBallPosOnPad2() {
                //     console.log(
                //         "check paddle 2",
                //         Border3 + Paddleheight / 2 - 5,
                //         ":",
                //         Border3 + Paddleheight / 2 + 5
                //     );

                //     if (
                //         Border3 +
                //             BallSize +
                //             Paddleheight / 2 -
                //             Paddleheight / 20 <=
                //             newY &&
                //         newY <=
                //             Border3 +
                //                 BallSize +
                //                 Paddleheight / 2 +
                //                 Paddleheight / 20
                //     )
                //         return 1;
                //     else if (Border3 + Paddleheight * (2 / 10) >= newY)
                //         return 2;
                //     else if (newY >= Border3 + Paddleheight * (8 / 10))
                //         return 3;
                //     else return 0;
                // }

                // if (CheckPaddle1() || CheckPaddle2(this.state.Width)) {
                //     if (newX < 40 && CheckBallPosOnPad1()) {
                //         if (CheckBallPosOnPad1() === 1) NewAngle = 0;
                //         else if (CheckBallPosOnPad1() === 2) NewAngle = -40;
                //         else if (CheckBallPosOnPad1() === 3) NewAngle = 40;
                //     } else if (
                //         newX > this.state.Width - 50 &&
                //         CheckBallPosOnPad2()
                //     ) {
                //         if (CheckBallPosOnPad2() === 1) NewAngle = 180;
                //         else if (CheckBallPosOnPad2() === 2) NewAngle = 220;
                //         else if (CheckBallPosOnPad2() === 3) NewAngle = 130;
                //     }
                //     // Dans le cas ou la balle arrive perpendiculairement renvoye au hasard si morceau de paddle classique
                //     else {
                //         if (this.props.Angle === 180) {
                //             const nombre = Math.random() * 180;
                //             console.log(nombre);
                //             NewAngle = 180 - nombre;
                //         } else NewAngle = 180 - this.props.Angle;
                //     }
                //     newX = this.props.BallX;
                // }

                if (newX < 0 || newX + 20 > this.state.Width) {
                    if (newX > 20) this.props.Score(1);
                    else this.props.Score(2);
                    newX = Width / 2;
                    newY = Height / 2;
                    NewBallSpeed = 5;
                    if (
                        this.props.Player1Score >= 14 ||
                        this.props.Player2Score >= 14
                    )
                        this.props.GameEnd();
                }
                if (newY < 0 || newY + 20 > this.state.Height) {
                    newY = this.props.BallY;
                    NewAngle = 360 - this.props.Angle;
                }

                this.props.UpdateBall(newX, newY, NewBallSpeed, NewAngle);
            }
        }, 13);

        this.setState({ intervalId });

        window.addEventListener("keydown", this.handleKeyDown);
    }

    // when component unmount cancels the interval to avoid memory leak
    componentWillUnmount() {
        clearInterval(this.state.intervalId);
    }

    handleKeyDown = (event: any) => {
        if (event.code === "Space") {
            this.setState((prevState: any) => ({
                isPaused: !prevState.isPaused,
            }));
        }
    };

    render() {
        return (
            <div
                ref={this.props.BoardRef}
                className="Board"
                style={{
                    width: "100%",
                    height: "100%",
                }}
            >
                <div
                    className="Ball"
                    style={{
                        left: `${this.props.BallX}px`,
                        top: `${this.props.BallY}px`,
                        height: `${this.props.BallSize}px`,
                        width: `${this.props.BallSize}px`,
                    }}
                />
            </div>
        );
    }
}
