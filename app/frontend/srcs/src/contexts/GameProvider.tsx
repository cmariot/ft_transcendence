import { createContext, useState } from "react";

export type GameContextType = {
    menu: string;
    countDown: 5;
    gameID: "";
    paddle1: 50;
    paddle2: 50;
    ball: { x: 50; y: 50 };
    screenHeigth: 900;
    screenWidth: 1600;
    paddleHeigth: 90;
    paddleWidth: 18;
    paddleOffset: 9;
    ballRadius: 32;
};

export const GameContext = createContext({
    menu: "JoinGame",
    setMenu: (newMenu: string) => {},
    countDown: 4,
    setCountDown: (newValue: number) => {},
    gameID: "",
    setGameID: (newMenu: string) => {},
    paddle1: 450,
    setPaddle1: (newValue: number) => {},
    paddle2: 450,
    setPaddle2: (newValue: number) => {},
    ball: { x: 450, y: 900 },
    setBall: (newValue: { x: number; y: number }) => {},
    screenHeigth: 900,
    setScreenHeigth: (newValue: number) => {},
    screenWidth: 1600,
    setScreenWidth: (newValue: number) => {},
    paddleHeigth: 90,
    setPaddleHeigth: (newValue: number) => {},
    paddleWidth: 18,
    setPaddleWidth: (newValue: number) => {},
    paddleOffset: 9,
    setPaddleOffset: (newValue: number) => {},
    ballRadius: 32,
    setBallRadius: (newValue: number) => {},
});

type GameProviderProps = { children: JSX.Element | JSX.Element[] };
const GameProvider = ({ children }: GameProviderProps) => {
    const [menu, setMenu] = useState<string>("JoinGame");
    const [countDown, setCountDown] = useState<number>(5);
    const [gameID, setGameID] = useState<string>("JoinGame");
    const [paddle1, setPaddle1] = useState<number>(50);
    const [paddle2, setPaddle2] = useState<number>(50);
    const [ball, setBall] = useState({ x: 50, y: 50 });
    const [screenHeigth, setScreenHeigth] = useState<number>(50);
    const [screenWidth, setScreenWidth] = useState<number>(50);
    const [paddleHeigth, setPaddleHeigth] = useState<number>(50);
    const [paddleWidth, setPaddleWidth] = useState<number>(50);
    const [paddleOffset, setPaddleOffset] = useState<number>(50);
    const [ballRadius, setBallRadius] = useState<number>(50);

    const value = {
        menu,
        setMenu,
        countDown,
        setCountDown,
        gameID,
        setGameID,
        paddle1,
        setPaddle1,
        paddle2,
        setPaddle2,
        ball,
        setBall,
        screenHeigth,
        setScreenHeigth,
        screenWidth,
        setScreenWidth,
        paddleHeigth,
        setPaddleHeigth,
        paddleWidth,
        setPaddleWidth,
        paddleOffset,
        setPaddleOffset,
        ballRadius,
        setBallRadius,
    };

    return (
        <GameContext.Provider value={value}>{children}</GameContext.Provider>
    );
};

export default GameProvider;
