import { createContext } from "react";

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
    currentStreamGameID: "",
    setCurrentStreamGameID: (newValue: string) => {},
});
