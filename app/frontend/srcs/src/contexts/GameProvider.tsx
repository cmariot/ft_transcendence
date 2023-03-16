import { createContext, useState } from "react";

export type GameContextType = {
    menu: string;
    countDown: 5;
    gameID: "";
    paddle1: 50;
    paddle2: 50;
    ball: { x: 50; y: 50 };
};

export const GameContext = createContext({
    menu: "JoinGame",
    setMenu: (newMenu: string) => {},
    countDown: 5,
    setCountDown: (newValue: number) => {},
    gameID: "",
    setGameID: (newMenu: string) => {},
    paddle1: 50,
    setPaddle1: (newValue: number) => {},
    paddle2: 50,
    setPaddle2: (newValue: number) => {},
    ball: { x: 50, y: 50 },
    setBall: (newValue: { x: number; y: number }) => {},
});

type GameProviderProps = { children: JSX.Element | JSX.Element[] };
const GameProvider = ({ children }: GameProviderProps) => {
    const [menu, setMenu] = useState<string>("JoinGame");
    const [countDown, setCountDown] = useState<number>(5);
    const [gameID, setGameID] = useState<string>("JoinGame");
    const [paddle1, setPaddle1] = useState<number>(50);
    const [paddle2, setPaddle2] = useState<number>(50);
    const [ball, setBall] = useState({ x: 50, y: 50 });

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
    };

    return (
        <GameContext.Provider value={value}>{children}</GameContext.Provider>
    );
};

export default GameProvider;
