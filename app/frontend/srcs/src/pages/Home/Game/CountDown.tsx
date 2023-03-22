const CountDown = (props: { time: number }) => {
    return (
        <div id="countdown">
            <h2>The game starts in {props.time} seconds</h2>
        </div>
    );
};

export default CountDown;
