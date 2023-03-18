const CountDown = (props: { time: number }) => {
    return (
        <div id="countdown">
            <h2>{props.time}</h2>
        </div>
    );
};

export default CountDown;
