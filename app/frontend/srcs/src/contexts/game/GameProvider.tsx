import { useState } from "react";
import { GameContext } from "./GameContext";

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
    const [currentStreamGameID, setCurrentStreamGameID] = useState<string>("");

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
        currentStreamGameID,
        setCurrentStreamGameID,
    };

    return (
        <GameContext.Provider value={value}>{children}</GameContext.Provider>
    );
};

export default GameProvider;
