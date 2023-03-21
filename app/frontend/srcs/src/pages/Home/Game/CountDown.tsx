const CountDown = (props: { time: number }) => {
    return (
        <div id="countdown">
            <p>Move with arrow up / down</p>
            <p>The first at 15 wins the match</p>
            <h2>The game starts in {props.time} seconds</h2>
        </div>
    );
};

export default CountDown;
