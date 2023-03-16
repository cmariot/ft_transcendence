const CountDown = (props: { time: number }) => {
    return (
        <div id="countdown">
            <p>{props.time}</p>
        </div>
    );
};

export default CountDown;
