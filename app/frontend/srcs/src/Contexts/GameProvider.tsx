import { createContext, useState } from "react";

export type GameContextType = {
    menu: string;
};

export const GameContext = createContext({
    menu: "JoinGame",
    setMenu: (newMenu: string) => {},
});

type GameProviderProps = { children: JSX.Element | JSX.Element[] };
const GameProvider = ({ children }: GameProviderProps) => {
    const [menu, setMenu] = useState<string>("JoinGame");

    const value = {
        menu,
        setMenu,
    };

    return (
        <GameContext.Provider value={value}>{children}</GameContext.Provider>
    );
};

export default GameProvider;
