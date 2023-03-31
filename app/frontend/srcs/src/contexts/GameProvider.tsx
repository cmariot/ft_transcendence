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
    paddle1Heigth: 90;
    paddle2Heigth: 90;
    paddleWidth: 18;
    paddleOffset: 9;
    ballHeigth: 22.5;
    ballWidth: 40;
    p1Name: "";
    p1Score: 0;
    p2Name: "";
    p2Score: 0;
    streamResults: {
        winner: "";
        player1: "";
        player2: "";
        p1Score: 0;
        p2Score: 0;
    };
    power_ups: Array<{ type: string; position: { x: number; y: number } }>;
    p1Power: "";
    p2Power: "";
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
    paddle1Heigth: 90,
    setPaddle1Heigth: (newValue: number) => {},
    paddle2Heigth: 90,
    setPaddle2Heigth: (newValue: number) => {},
    paddleWidth: 18,
    setPaddleWidth: (newValue: number) => {},
    paddleOffset: 9,
    setPaddleOffset: (newValue: number) => {},
    ballHeigth: 9,
    setBallHeigth: (newValue: number) => {},
    ballWidth: 16,
    setBallWidth: (newValue: number) => {},
    p1Name: "",
    setP1Name: (newValue: string) => {},
    p1Score: 0,
    setP1Score: (newValue: number) => {},
    p2Name: "",
    setP2Name: (newValue: string) => {},
    p2Score: 0,
    setP2Score: (newValue: number) => {},
    currentGames: new Array<{
        game_id: string;
        player1: string;
        player2: string;
    }>(),
    setCurrentGames: (
        newValue: { game_id: string; player1: string; player2: string }[]
    ) => {},
    streamResults: {
        winner: "",
        player1: "",
        player2: "",
        p1Score: 0,
        p2Score: 0,
    },
    setStreamResults: (newValue: {
        winner: string;
        player1: string;
        player2: string;
        p1Score: number;
        p2Score: number;
    }) => {},

    powerUps: new Array<{ type: string; position: { x: number; y: number } }>(),
    setPowerUps: (
        newValue: Array<{ type: string; position: { x: number; y: number } }>
    ) => {},
    p1Power: "",
    setP1Power: (newValue: string) => {},
    p2Power: "",
    setP2Power: (newValue: string) => {},
});

type GameProviderProps = { children: JSX.Element | JSX.Element[] };
const GameProvider = ({ children }: GameProviderProps) => {
    const [menu, setMenu] = useState<string>("JoinGame");
    const [countDown, setCountDown] = useState<number>(5);
    const [gameID, setGameID] = useState<string>("");
    const [paddle1, setPaddle1] = useState<number>(50);
    const [paddle2, setPaddle2] = useState<number>(50);
    const [ball, setBall] = useState({ x: 50, y: 50 });
    const [screenHeigth, setScreenHeigth] = useState<number>(50);
    const [screenWidth, setScreenWidth] = useState<number>(50);
    const [paddle1Heigth, setPaddle1Heigth] = useState<number>(50);
    const [paddle2Heigth, setPaddle2Heigth] = useState<number>(50);
    const [paddleWidth, setPaddleWidth] = useState<number>(50);
    const [paddleOffset, setPaddleOffset] = useState<number>(50);
    const [ballWidth, setBallWidth] = useState<number>(16);
    const [ballHeigth, setBallHeigth] = useState<number>(9);
    const [p1Name, setP1Name] = useState<string>("");
    const [p1Score, setP1Score] = useState<number>(50);
    const [p2Name, setP2Name] = useState<string>("");
    const [p2Score, setP2Score] = useState<number>(50);
    const [currentGames, setCurrentGames] = useState<
        { game_id: string; player1: string; player2: string }[]
    >([]);
    const [streamResults, setStreamResults] = useState<{
        winner: string;
        player1: string;
        player2: string;
        p1Score: number;
        p2Score: number;
    }>({
        winner: "",
        player1: "",
        player2: "",
        p1Score: 0,
        p2Score: 0,
    });
    const [powerUps, setPowerUps] = useState<
        { type: string; position: { x: number; y: number } }[]
    >([]);
    const [p1Power, setP1Power] = useState<string>("");
    const [p2Power, setP2Power] = useState<string>("");

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
        paddle1Heigth,
        setPaddle1Heigth,
        paddle2Heigth,
        setPaddle2Heigth,
        paddleWidth,
        setPaddleWidth,
        paddleOffset,
        setPaddleOffset,
        ballHeigth,
        setBallHeigth,
        ballWidth,
        setBallWidth,
        p1Name,
        setP1Name,
        p1Score,
        setP1Score,
        p2Name,
        setP2Name,
        p2Score,
        setP2Score,
        currentGames,
        setCurrentGames,
        streamResults,
        setStreamResults,
        powerUps,
        setPowerUps,
        p1Power,
        setP1Power,
        p2Power,
        setP2Power,
    };

    return (
        <GameContext.Provider value={value}>{children}</GameContext.Provider>
    );
};

export default GameProvider;
